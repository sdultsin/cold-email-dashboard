#!/usr/bin/env python3
"""Extract dashboard data from SQLite simulation results into JSON."""

import json
import sqlite3
import sys
from pathlib import Path

DB_PATH = Path(__file__).parent.parent.parent / "Claude Code" / "Coworker.ai" / "Cold Email Feedback Loop" / "simulation" / "results" / "simulation.db"
OUTPUT_PATH = Path(__file__).parent.parent / "public" / "data" / "dashboard.json"


def extract(db_path: str, output_path: str):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    # --- Meta ---
    c.execute("SELECT SUM(n_sends) FROM feature_store WHERE segment_key='*::*::*'")
    total_sends = int(c.fetchone()[0])

    c.execute("SELECT COUNT(DISTINCT segment_key) FROM feature_store WHERE segment_key NOT LIKE '%*%'")
    segments_3dim = c.fetchone()[0]

    c.execute("SELECT COUNT(DISTINCT segment_key) FROM feature_store")
    segments_all = c.fetchone()[0]

    meta = {
        "total_sends": total_sends,
        "total_templates": 10,
        "total_segments_3dim": segments_3dim,
        "total_segments_all": segments_all,
        "simulation_months": 12,
        "industries": ["healthcare", "fintech", "trucking", "ecommerce", "saas",
                       "manufacturing", "consulting", "logistics", "education", "insurance"],
        "company_sizes": ["1-10", "11-20", "21-50", "51-100", "101-200", "201-500",
                          "501-1000", "1001-2000", "2001-5000", "5001-10000", "10001+"],
        "job_title_groups": ["finance", "technology", "operations", "sales_revenue",
                             "marketing", "executive_general", "hr_people"],
    }

    # --- Templates ---
    templates = {}
    c.execute("""SELECT DISTINCT sequence_id, cta_type, tone, hook_style
                 FROM feature_store WHERE segment_key='*::*::*' ORDER BY sequence_id""")
    label_map = {
        "seq_0": "Consultative Question",
        "seq_1": "Direct Social Proof",
        "seq_2": "Formal Connection",
        "seq_3": "Casual Compliment",
        "seq_4": "Consultative Stat Lead",
        "seq_5": "Direct Pain Point",
        "seq_6": "Direct Question",
        "seq_7": "Consultative Urgency",
        "seq_8": "Casual Urgency",
        "seq_9": "Formal Value Offer",
    }
    for row in c.fetchall():
        sid = row["sequence_id"]
        templates[sid] = {
            "cta": row["cta_type"],
            "tone": row["tone"],
            "hook": row["hook_style"],
            "label": label_map.get(sid, sid),
        }

    # --- Override log ---
    c.execute("SELECT * FROM override_log ORDER BY month, id")
    overrides = []
    for row in c.fetchall():
        overrides.append({
            "id": row["id"],
            "segment_key": row["segment_key"],
            "overridden_seq": row["overridden_seq"],
            "promoted_seq": row["promoted_seq"],
            "reason": row["reason"],
            "month": row["month"],
        })

    # --- System health ---
    override_segments = set()
    loop3_segments = set()
    loop2_only_segments = set()
    for o in overrides:
        seg = o["segment_key"]
        if "Loop3" in o["reason"]:
            loop3_segments.add(seg)
        elif "Loop2" in o["reason"]:
            loop2_only_segments.add(seg)
        override_segments.add(seg)

    industries_optimized = set()
    industries_stabilizing = set()
    for seg in loop3_segments:
        parts = seg.split("::")
        if parts[0] != "*":
            industries_optimized.add(parts[0])
    for seg in loop2_only_segments:
        parts = seg.split("::")
        if parts[0] != "*" and parts[0] not in industries_optimized:
            industries_stabilizing.add(parts[0])

    all_industries = set(meta["industries"])
    industries_learning = all_industries - industries_optimized - industries_stabilizing

    q4_overrides = len([o for o in overrides if o["month"] >= 10])

    system_health = {
        "optimized": len(industries_optimized),
        "optimized_list": sorted(industries_optimized),
        "stabilizing": len(industries_stabilizing),
        "stabilizing_list": sorted(industries_stabilizing),
        "learning": len(industries_learning),
        "learning_list": sorted(industries_learning),
        "overrides_this_quarter": q4_overrides,
        "pending_approval": 1,
    }

    # --- Segment data (for Explore tab) ---
    c.execute("""SELECT segment_key, sequence_id, n_sends, reply_rate, positive_reply_rate,
                        demo_rate, close_rate, revenue_per_send, data_completeness,
                        learning_status, ci_width_reply, ci_width_demo,
                        cta_type, tone, hook_style
                 FROM feature_store ORDER BY segment_key, revenue_per_send DESC""")

    segments = {}
    for row in c.fetchall():
        sk = row["segment_key"]
        if sk not in segments:
            segments[sk] = {"templates": []}
        segments[sk]["templates"].append({
            "sequence_id": row["sequence_id"],
            "n_sends": row["n_sends"],
            "reply_rate": row["reply_rate"],
            "positive_reply_rate": row["positive_reply_rate"],
            "demo_rate": row["demo_rate"],
            "close_rate": row["close_rate"],
            "revenue_per_send": row["revenue_per_send"],
            "data_completeness": row["data_completeness"],
            "learning_status": row["learning_status"],
            "ci_width_reply": row["ci_width_reply"],
            "ci_width_demo": row["ci_width_demo"],
        })

    # Compute segment summary stats
    for sk, data in segments.items():
        total_sends = sum(t["n_sends"] for t in data["templates"])
        total_replies = sum(t["n_sends"] * (t["reply_rate"] or 0) for t in data["templates"])
        avg_completeness = (
            sum(t["data_completeness"] or 0 for t in data["templates"] if t["data_completeness"])
            / max(1, sum(1 for t in data["templates"] if t["data_completeness"]))
        )
        data["total_sends"] = total_sends
        data["total_reply_events"] = int(total_replies)
        data["avg_data_completeness"] = round(avg_completeness, 3)
        data["template_count"] = len(data["templates"])

        # Determine data source
        parts = sk.split("::")
        wildcards = parts.count("*")
        if wildcards == 3 or sk == "*::*::*":
            data["data_source"] = "global"
        elif wildcards == 0:
            if total_replies >= 50:
                data["data_source"] = "segment_specific"
            else:
                data["data_source"] = "borrowing_from_parent"
        else:
            data["data_source"] = "partial_aggregation"

        # Parse segment dimensions
        data["industry"] = parts[0] if parts[0] != "*" else "All"
        data["company_size"] = parts[1] if parts[1] != "*" else "All"
        data["job_title_group"] = parts[2] if parts[2] != "*" else "All"

    # --- Stories (curated for Recommendations tab) ---
    stories = _build_stories(c, templates)

    # --- Alerts (curated for Alerts tab) ---
    alerts = _build_alerts()

    # --- Drift log ---
    c.execute("SELECT COUNT(*) FROM drift_log")
    drift_count = c.fetchone()[0]

    conn.close()

    dashboard = {
        "meta": meta,
        "templates": templates,
        "system_health": system_health,
        "stories": stories,
        "alerts": alerts,
        "override_log": overrides,
        "drift_events": drift_count,
        "segments": segments,
    }

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(dashboard, f, indent=2, default=str)

    print(f"Extracted dashboard data to {output_path}")
    print(f"  Segments: {len(segments)}")
    print(f"  Overrides: {len(overrides)}")
    print(f"  Total sends: {total_sends}")


def _build_stories(c, templates):
    """Build the 6 curated recommendation cards."""

    def get_row(seq_id, segment_key):
        c.execute("""SELECT * FROM feature_store
                     WHERE sequence_id=? AND segment_key=?""", (seq_id, segment_key))
        row = c.fetchone()
        if row:
            return dict(row)
        return None

    stories = []

    # Story 1: SaaS Reply vs Revenue
    seq6_saas = get_row("seq_6", "saas::*::*")
    seq1_saas = get_row("seq_1", "saas::*::*")
    stories.append({
        "id": "saas-revenue-trap",
        "status": "auto_applied",
        "headline": "SaaS reply rate leader generates half the revenue of a template with fewer replies",
        "comparison": {
            "loser": {
                "sequence_id": "seq_6",
                "label": templates["seq_6"]["label"],
                "reply_rate": seq6_saas["reply_rate"],
                "demo_rate": seq6_saas["demo_rate"],
                "revenue_per_send": seq6_saas["revenue_per_send"],
                "n_sends": seq6_saas["n_sends"],
            },
            "winner": {
                "sequence_id": "seq_1",
                "label": templates["seq_1"]["label"],
                "reply_rate": seq1_saas["reply_rate"],
                "demo_rate": seq1_saas["demo_rate"],
                "revenue_per_send": seq1_saas["revenue_per_send"],
                "n_sends": seq1_saas["n_sends"],
            },
        },
        "explanation": "Template 6 leads SaaS on reply rate at 5.04% - but Template 1, with 25% fewer replies, generates $35.53 in revenue per send vs Template 6's $18.68. The direct question hook gets attention but attracts evaluators. The direct social proof hook attracts fewer but higher-quality leads who actually close deals.",
        "counterfactual": "Without this, you'd scale the highest-reply template and leave $16.85 per send on the table.",
        "override_source": "Loop 3 revenue veto, month 12",
        "segment": "SaaS (all sizes, all titles)",
    })

    # Story 2: Manufacturing Hidden Revenue Winner
    seq0_mfg = get_row("seq_0", "manufacturing::*::*")
    seq4_mfg = get_row("seq_4", "manufacturing::*::*")
    stories.append({
        "id": "manufacturing-hidden-winner",
        "status": "auto_applied",
        "headline": "In manufacturing, the template with 7x more sends generates 3x less revenue per send",
        "comparison": {
            "loser": {
                "sequence_id": "seq_0",
                "label": templates["seq_0"]["label"],
                "reply_rate": seq0_mfg["reply_rate"],
                "close_rate": seq0_mfg["close_rate"],
                "revenue_per_send": seq0_mfg["revenue_per_send"],
                "n_sends": seq0_mfg["n_sends"],
            },
            "winner": {
                "sequence_id": "seq_4",
                "label": templates["seq_4"]["label"],
                "reply_rate": seq4_mfg["reply_rate"],
                "close_rate": seq4_mfg["close_rate"],
                "revenue_per_send": seq4_mfg["revenue_per_send"],
                "n_sends": seq4_mfg["n_sends"],
            },
        },
        "explanation": "Template 0 received 44,663 sends in manufacturing - 7x more than Template 4's 6,434. Simpson's Paradox at work: Template 0 got disproportionate volume because of high-reply-rate segments. But Template 4 generates $44.05 in revenue per send vs Template 0's $15.33. The stat lead hook converts manufacturing prospects to closed deals far more effectively than the question hook.",
        "counterfactual": "Without segment-level analysis, you'd keep scaling the template with the most sends and miss a 2.9x revenue multiplier.",
        "override_source": "Loop 3 revenue veto, month 12",
        "segment": "Manufacturing (all sizes, all titles)",
    })

    # Story 3: Fintech Reply Trap
    seq3_fin = get_row("seq_3", "fintech::*::*")
    seq7_fin = get_row("seq_7", "fintech::*::*")
    stories.append({
        "id": "fintech-hidden-winner",
        "status": "auto_applied",
        "headline": "In fintech, your reply rate leader generates 3x less revenue than a lower-ranked template",
        "comparison": {
            "loser": {
                "sequence_id": "seq_3",
                "label": templates["seq_3"]["label"],
                "reply_rate": seq3_fin["reply_rate"],
                "close_rate": seq3_fin["close_rate"],
                "revenue_per_send": seq3_fin["revenue_per_send"],
                "n_sends": seq3_fin["n_sends"],
            },
            "winner": {
                "sequence_id": "seq_7",
                "label": templates["seq_7"]["label"],
                "reply_rate": seq7_fin["reply_rate"],
                "close_rate": seq7_fin["close_rate"],
                "revenue_per_send": seq7_fin["revenue_per_send"],
                "n_sends": seq7_fin["n_sends"],
            },
        },
        "explanation": "In fintech, Template 3 leads reply rate at 3.56% but generates only $5.70 per send. Template 7 has a 2.27% reply rate - 36% fewer replies - but generates $15.97 per send. The consultative urgency approach with pain point hook gets fewer responses but the leads who respond are decision-makers feeling the problem, not researchers browsing solutions. This took 8 months to surface because fintech deal cycles average 6-8 weeks.",
        "counterfactual": "Reply rate alone would have you scaling a template that produces 2.8x less revenue.",
        "override_source": "Loop 3 revenue veto, month 12",
        "segment": "Fintech (all sizes, all titles)",
    })

    # Story 4: Manufacturing Demo Override
    seq6_mfg = get_row("seq_6", "manufacturing::*::*")
    seq4_mfg_demo = get_row("seq_4", "manufacturing::*::*")
    stories.append({
        "id": "manufacturing-demo-override",
        "status": "auto_applied",
        "headline": "Reply rate leader in manufacturing books half the demos of the revenue winner",
        "comparison": {
            "loser": {
                "sequence_id": "seq_6",
                "label": templates["seq_6"]["label"],
                "reply_rate": seq6_mfg["reply_rate"],
                "demo_rate": seq6_mfg["demo_rate"],
                "n_sends": seq6_mfg["n_sends"],
            },
            "winner": {
                "sequence_id": "seq_4",
                "label": templates["seq_4"]["label"],
                "reply_rate": seq4_mfg_demo["reply_rate"],
                "demo_rate": seq4_mfg_demo["demo_rate"],
                "n_sends": seq4_mfg_demo["n_sends"],
            },
        },
        "explanation": "In manufacturing, Template 6 leads on reply rate at 4.59%. But Template 4 books demos at 0.92% per send - 2.4x the rate of Template 6's 0.38%. Both get a reasonable number of replies but the consultative stat lead converts manufacturing prospects to meetings far more effectively than the direct question approach. Manufacturing buyers respond to data, not questions.",
        "counterfactual": "You'd optimize for the template getting more replies while another template books 2.4x more meetings and generates 6.5x more revenue.",
        "override_source": "Loop 2 demo-rate override + Loop 3 revenue veto",
        "segment": "Manufacturing (all sizes, all titles)",
    })

    # Story 5: Insufficient Data Warning
    c.execute("""SELECT SUM(n_sends) as total, SUM(n_sends * reply_rate) as replies
                 FROM feature_store WHERE segment_key='trucking::10001+::*'""")
    trucking_ent = c.fetchone()
    trucking_sends = int(trucking_ent["total"]) if trucking_ent["total"] else 0
    trucking_replies = int(trucking_ent["replies"]) if trucking_ent["replies"] else 0
    data_pct = round(trucking_replies / 50 * 100) if trucking_replies else 0
    stories.append({
        "id": "trucking-enterprise-data-gap",
        "status": "monitoring",
        "headline": "Trucking enterprise: not enough data for real conclusions",
        "evidence": {
            "segment": "Trucking, 10,001+ employees",
            "total_sends": trucking_sends,
            "reply_events": trucking_replies,
            "templates_tested": 9,
            "data_needed_pct": data_pct,
        },
        "explanation": f"With {trucking_sends} total sends and {trucking_replies} replies across 1.2 million emails, any recommendation here would be noise. The system is borrowing from the trucking industry-wide model and the global parent model. Currently at about {data_pct}% of the data needed for segment-specific confidence.",
        "counterfactual": f"Most platforms would show you a reply rate for this segment without mentioning it's based on {trucking_replies} replies out of {trucking_sends} sends.",
    })

    # Story 6: Underexplored Industries
    underexplored = []
    for ind in ["trucking", "ecommerce", "insurance"]:
        c.execute("""SELECT SUM(n_sends), AVG(reply_rate) FROM feature_store
                     WHERE segment_key=?""", (f"{ind}::*::*",))
        row = c.fetchone()
        underexplored.append({
            "industry": ind,
            "total_sends": int(row[0]) if row[0] else 0,
            "avg_reply_rate": round(row[1] * 100, 2) if row[1] else 0,
        })

    stories.append({
        "id": "underexplored-industries",
        "status": "action_needed",
        "headline": "Three industries still have wide confidence intervals despite 1.2M total sends",
        "evidence": {"industries": underexplored},
        "explanation": "Trucking received only 18K sends due to market size. Ecommerce got 239K sends but at 0.75% reply rate, downstream data (demos, deals) remains sparse. Insurance at 30K sends and 1.89% reply rate is in between. The system has enough reply data to rank templates but insufficient deal data to confirm revenue winners in these segments.",
        "counterfactual": "Without proactive rebalancing, these segments stay in guessing mode indefinitely while you over-invest in segments you've already figured out.",
    })

    return stories


def _build_alerts():
    """Build the 6 curated alert cards (static content, data-backed)."""
    return [
        {
            "id": "saas-revenue-veto",
            "type": "override_explanation",
            "title": "Why SaaS reply rate leader isn't the revenue winner",
            "body": [
                "Loop 1 (reply analysis) flagged Template 6 as the standout performer in SaaS. At 5.04% reply rate, it led all templates in the segment. Any sending platform would tell you to scale this immediately.",
                "Loop 2 (demo analysis) started raising questions at month 6. Template 6 was booking demos at 0.39% - but Template 1, with 25% fewer replies, was booking at 0.47%.",
                "Loop 3 (revenue analysis) confirmed it at month 12. Template 1 generates $35.53 in revenue per send vs Template 6's $18.68 - a 1.9x difference. The direct social proof hook attracts fewer but higher-quality leads who close bigger deals.",
                "The likely explanation: Template 6 uses a direct question hook. In SaaS, questions get responses from evaluators and researchers. Template 1 uses social proof - fewer people respond, but the ones who do are already comparing solutions and ready to buy.",
            ],
            "technical_detail": "Override source: Loop 3 revenue veto. seq_1 revenue_per_send=$35.53 vs seq_6 revenue_per_send=$18.68 across 19,958 and 19,889 sends respectively. Bayesian shrinkage lambda=300 for reply events.",
        },
        {
            "id": "simpsons-paradox",
            "type": "statistical_trap",
            "title": "Why aggregate reply rates lie - and how the system avoids it",
            "body": [
                "If you look at Template 0's overall reply rate (4.05%), it appears to be the clear winner across all campaigns. It received the most volume (282,290 sends) and has the highest reply rate globally.",
                "But this is a statistical trap called Simpson's Paradox. Template 0 was disproportionately sent to segments that naturally reply at higher rates - SaaS (4.3% base rate) and manufacturing (4.5% base rate). Meanwhile, other templates were distributed more evenly across harder segments like ecommerce (0.6% base rate).",
                "When you compare within specific segments, other templates often win. In manufacturing, Template 4 generates $44.05 per send vs Template 0's $15.33. In SaaS, Template 1 generates $35.53 vs Template 0's $25.31.",
                "The system never ranks templates by aggregate metrics. Every comparison happens within a segment, so volume distribution can't distort the picture.",
            ],
            "technical_detail": "Simpson's Paradox occurs when a trend in aggregate data reverses when split by a confounding variable. The system uses segment-level rankings exclusively, with Bayesian shrinkage toward the parent model (lambda=300 for reply events).",
        },
        {
            "id": "seasonal-non-alarm",
            "type": "drift_analysis",
            "title": "November reply rates dropped 14% - and the system correctly did nothing",
            "body": [
                "Reply rates across all segments dipped in November and December, consistent with holiday slowdown patterns in B2B outreach. A 14% drop looks alarming on a dashboard.",
                "The system uses a drift detection algorithm that monitors reply rates per segment as a continuous stream. But before feeding data to the detector, it subtracts the expected seasonal baseline.",
                "After seasonal adjustment, the residual showed no significant deviation. The system maintained all existing optimizations and did not re-enter learning mode for any segment.",
                "This matters because re-entering learning mode means testing more templates instead of exploiting known winners. If the system had panicked at the November dip, it would have thrown out months of learning and wasted volume on experiments that weren't needed.",
            ],
            "technical_detail": "ADWIN with delta=0.01 monitors seasonally-adjusted residual: actual_reply_rate - (1.0 + 0.15 * cos(2*pi*(month-1)/12)). Zero drift events fired across all segments (drift_log: 0 rows). Delta=0.01 instead of default 0.002 to reduce false positives at 2-4% base rates.",
        },
        {
            "id": "manufacturing-demo-divergence",
            "type": "override_explanation",
            "title": "In manufacturing, the best-replying template books the fewest demos",
            "body": [
                "Manufacturing is one of the clearest examples of why reply rate is a misleading proxy.",
                "Template 6 (question/direct) leads on reply rate at 4.59%. Template 4 (consultative/stat_lead) sits at 3.45%. On a standard dashboard, you'd pick Template 6.",
                "But at month 6, when enough demo-booking data had accumulated, the system found Template 4 books demos at 0.92% per send - 2.4x the rate of Template 6's 0.38%. By month 12, Template 4 generates $44.05 per send vs Template 6's $6.79.",
                "Both templates get responses from manufacturing prospects. The difference is the hook: stat leads convert to meetings and deals far more effectively than questions. Manufacturing buyers respond to data and peer benchmarks, not open-ended questions.",
            ],
            "technical_detail": "Loop 2 demo-rate override + Loop 3 revenue veto. seq_4 demo_rate=0.92% vs seq_6 demo_rate=0.38%. seq_4 revenue_per_send=$44.05 vs seq_6=$6.79. Bayesian shrinkage lambda_demo=150.",
        },
        {
            "id": "temporal-censoring",
            "type": "data_quality",
            "title": "Why recent campaigns can't be judged yet - and how the system handles it",
            "body": [
                "Sends from months 10-12 have reply data but incomplete demo and deal data. A lead emailed in November who replied positively might book a demo in January and close a deal in March.",
                "The system marks downstream outcomes as 'unresolved' for any send where insufficient time has elapsed based on the expected deal cycle for that company size. Enterprise leads have deal cycles of 8-16 weeks.",
                "At month 12, the system has full data for months 1-6 sends to SMB, partial data for months 7-9, and reply-only data for months 10-12.",
                "Data completeness for the simulation averages 85.8% for high-volume segments. The system adjusts confidence based on this score - a template that looks great on replies but has no deal data yet isn't treated as a confirmed winner.",
            ],
            "technical_detail": "Deal cycle modeled as log-normal per company_size: SMB (14-21 days), mid-market (35-56 days), enterprise (70-112 days). resolve_outcomes() nulls demo_booked/deal_closed for sends where elapsed time < expected cycle.",
        },
        {
            "id": "survivorship-bias",
            "type": "statistical_trap",
            "title": "Killed campaigns still count - here's why",
            "body": [
                "When a campaign gets stopped early, most platforms remove it from reporting. The sends it produced vanish from analytics.",
                "This creates survivorship bias. You only see data from campaigns that ran long enough, skewing your picture of what works.",
                "The system retains all data from stopped campaigns. Template 9 was capped at 2% volume in months 1-2, then stopped entirely. Across all segments it received only ~2,900 sends compared to 97,000+ for active templates. Its data still contributes to the model, weighted appropriately.",
                "The Bayesian framework handles this naturally: low-volume templates lean heavily on the parent model. No data is thrown away. In both SaaS (606 sends) and fintech (464 sends), Template 9 generated $0 in revenue - a signal that would be invisible if the campaign data were discarded.",
            ],
            "technical_detail": "Bayesian shrinkage: shrunk_rate = (n_replies * segment_rate + lambda * parent_rate) / (n_replies + lambda). For seq_9 in SaaS with ~21 reply events and lambda=300, estimate is ~93% parent, 7% segment-specific.",
        },
    ]


if __name__ == "__main__":
    db = sys.argv[1] if len(sys.argv) > 1 else str(DB_PATH)
    out = sys.argv[2] if len(sys.argv) > 2 else str(OUTPUT_PATH)
    extract(db, out)

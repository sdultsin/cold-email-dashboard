"use client";

const sections = [
  {
    title: "Statistical Formulas",
    concepts: [
      {
        name: "Logistic Regression (Logit Model)",
        desc: "Computes the probability a lead replies, books a demo, or closes - combines all factors (industry, tone, CTA, etc.) into a single probability score between 0 and 1.",
      },
      {
        name: "Sigmoid Function (expit)",
        desc: "Converts the raw logistic regression score into a clean probability between 0% and 100%.",
      },
      {
        name: "Log-Odds (Logit)",
        desc: "The internal scale where all feature effects get added together before being converted to a probability - lets us combine dozens of factors with simple addition.",
      },
      {
        name: "Beta Coefficients",
        desc: "The weight assigned to each feature (e.g., \"consultative tone adds +0.25 to the log-odds of a demo booking\") - the specific numbers that encode what works and what doesn't.",
      },
      {
        name: "Interaction Terms",
        desc: "Captures combinations that matter beyond their individual parts - e.g., \"direct_ask CTA + healthcare\" performs differently than either factor alone would predict.",
      },
      {
        name: "Wilson Score Interval",
        desc: "Our confidence interval formula for proportions - accounts for small sample sizes better than naive methods.",
      },
      {
        name: "Confidence Interval Width",
        desc: "The range of uncertainty around a metric - a 2% reply rate with CI width of 3% means we really don't know yet; 0.2% means we're confident.",
      },
      {
        name: "Bonferroni Correction",
        desc: "When testing hundreds of segments simultaneously, some will look \"significant\" by pure chance - this adjusts the significance threshold to prevent false discoveries.",
      },
      {
        name: "Power Calculation (Two-Proportion Z-Test)",
        desc: "Tells us how many sends we need per template variant to reliably detect a real difference in reply rates.",
      },
      {
        name: "Alpha (Significance Level)",
        desc: "The threshold (default 5%) for declaring a difference \"statistically significant\" - the probability we'd see this result if there were actually no difference.",
      },
      {
        name: "Statistical Power",
        desc: "The probability (default 80%) that we'll detect a real difference when one actually exists - guards against missing real winners.",
      },
      {
        name: "Z-Score (Normal Distribution)",
        desc: "The number of standard deviations from the mean - used in confidence intervals and power calculations to set certainty thresholds.",
      },
    ],
  },
  {
    title: "Bayesian Methods",
    concepts: [
      {
        name: "Bayesian Shrinkage",
        desc: "When a segment has little data, we blend its estimate toward the global average - 10 sends doesn't override what we know from 100,000 sends.",
      },
      {
        name: "Shrinkage Lambda (Prior Strength)",
        desc: "Controls how much we trust the global average vs. segment-specific data - a segment needs ~100 reply events before its own data carries equal weight.",
      },
      {
        name: "Bayesian Weight Transition",
        desc: "As demo data accumulates, scoring smoothly shifts from reply-rate-driven to demo-rate-driven - no abrupt switchover.",
      },
      {
        name: "Prior (Parent Rate)",
        desc: "The global average used as our starting belief before segment-specific data accumulates - every segment starts here and gradually moves away.",
      },
    ],
  },
  {
    title: "Architecture & Design Patterns",
    concepts: [
      {
        name: "Three-Loop Architecture",
        desc: "Three feedback loops at different speeds (monthly/quarterly/semi-annually) measuring progressively deeper signals (replies -> demos -> revenue).",
      },
      {
        name: "Temporal Censoring",
        desc: "Prevents counting in-progress deals as failures - if a demo hasn't had time to close, the outcome is \"unknown\" instead of \"didn't close.\"",
      },
      {
        name: "Data Completeness Score",
        desc: "Measures what percentage of downstream outcomes have resolved - a template with 30% completeness shouldn't be compared to one with 95%.",
      },
      {
        name: "Feature Store",
        desc: "The central knowledge base storing performance data for every template x segment combination - the single source of truth all three loops read from and write to.",
      },
      {
        name: "Segment Hierarchy / Fallback",
        desc: "When a specific segment has too little data, the system falls back to broader aggregations until it finds enough data for a reliable recommendation.",
      },
      {
        name: "Learning Status State Machine",
        desc: "Three states per segment - \"learning\" (high exploration), \"stabilizing\" (moderate), \"optimized\" (low exploration).",
      },
      {
        name: "Override / Veto Mechanism",
        desc: "Loop 2 can override Loop 1 when demo data disagrees with reply data; Loop 3 can veto both when revenue data shows the \"best\" template isn't making money.",
      },
      {
        name: "Projection Confidence",
        desc: "A composite score (data_completeness x model_accuracy x sample_size_penalty) that tells us how much to trust a predicted close rate.",
      },
    ],
  },
  {
    title: "Explore/Exploit & Optimization",
    concepts: [
      {
        name: "Epsilon-Greedy Allocation",
        desc: "Splits volume between \"exploit\" (send the best-known template) and \"explore\" (test alternatives) - simple, robust, and outperforms Thompson Sampling at low conversion rates.",
      },
      {
        name: "Adaptive Epsilon",
        desc: "The explore/exploit ratio changes based on learning maturity - new segments get 50/50, mature segments get 80/20 exploit-heavy.",
      },
      {
        name: "Three-Level Exploration",
        desc: "Within the exploration budget: 50% tests one-feature variations of the best, 30% tests untested combinations, 20% tests segment-specific angles.",
      },
    ],
  },
  {
    title: "Drift Detection",
    concepts: [
      {
        name: "ADWIN (ADaptive WINdowing)",
        desc: "Monitors reply rates as a stream and detects when performance has genuinely shifted - triggers re-exploration when a previously optimized segment degrades.",
      },
      {
        name: "Hoeffding Bound",
        desc: "The mathematical inequality ADWIN uses to determine if the difference between old and recent observations is statistically meaningful or just noise.",
      },
      {
        name: "Seasonal Baseline Subtraction",
        desc: "Subtracts expected seasonal patterns before drift detection so the normal November dip doesn't trigger a false alarm.",
      },
      {
        name: "Cosine Seasonal Model",
        desc: "Models the predictable annual rhythm in cold email response rates using a cosine wave - amplitude of 15%, calibrated from real-world data.",
      },
    ],
  },
  {
    title: "Regression & Prediction",
    concepts: [
      {
        name: "OLS (Ordinary Least Squares) Regression",
        desc: "Loop 3's prediction model - fits a line through data to predict close_rate from reply_rate and demo_rate for templates without full deal data.",
      },
      {
        name: "R-Squared",
        desc: "Measures how much variance in close rates our model explains - 0.6 means 60% captured, 40% unexplained.",
      },
      {
        name: "Revenue Per Send",
        desc: "The ultimate metric - total revenue divided by total sends. Cuts through all proxy metrics and measures what actually matters.",
      },
      {
        name: "Sample Size Penalty",
        desc: "Reduces projection confidence for templates with fewer sends - a prediction from 50 sends gets penalized vs. one from 500.",
      },
    ],
  },
  {
    title: "Multiple Comparisons & Bias Controls",
    concepts: [
      {
        name: "Multiple Comparisons Problem",
        desc: "With 7,700 possible template-segment combinations at p=0.05, about 385 will look \"significant\" by pure chance.",
      },
      {
        name: "False Discovery Rate (FDR)",
        desc: "The expected proportion of \"significant\" findings that are actually false positives - controlled alongside Bonferroni.",
      },
      {
        name: "Temporal Autocorrelation",
        desc: "Month 2's campaigns depend on Month 1's results, violating independence assumptions - handled by tracking per-cohort performance curves.",
      },
      {
        name: "Simpson's Paradox",
        desc: "A template appears best in aggregate but loses within every individual segment - caused by uneven volume distribution. We avoid this by always using segment-level rankings.",
      },
      {
        name: "Survivorship Bias Prevention",
        desc: "Stopped campaigns still contribute their data - a template killed after month 1 isn't erased, it's evaluated on whatever data it produced.",
      },
    ],
  },
];

export default function TheMathTab() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-[#ededed] mb-4">
          The Math
        </h1>
        <p className="text-base text-[#ededed]/70 leading-relaxed max-w-3xl">
          Instagram built one of the most powerful recommendation engines on earth
          by treating engagement as a math problem, not a creative one. We apply
          the same principle to cold email. Once you have enough data, finding the
          statistically best-performing template for each segment is a physics
          problem - market feedback and real-world outcomes replace guesswork,
          gut instinct, and surface-level metrics like reply rates. This is every
          formula and method running under the hood.
        </p>
      </div>

      {/* Concept count */}
      <p className="text-sm text-[#888888] mb-8">
        {sections.reduce((acc, s) => acc + s.concepts.length, 0)} concepts across{" "}
        {sections.length} domains
      </p>

      {/* Sections */}
      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4">
              {section.title}
            </h2>
            <div className="space-y-2">
              {section.concepts.map((concept) => (
                <div
                  key={concept.name}
                  className="rounded-lg border border-[#222222] bg-[#111111] px-5 py-4"
                >
                  <h3 className="text-sm font-medium text-[#ededed] mb-1">
                    {concept.name}
                  </h3>
                  <p className="text-sm text-[#888888] leading-relaxed">
                    {concept.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

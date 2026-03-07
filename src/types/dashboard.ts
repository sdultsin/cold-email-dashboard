export interface Meta {
  total_sends: number;
  total_templates: number;
  total_segments_3dim: number;
  total_segments_all: number;
  simulation_months: number;
  industries: string[];
  company_sizes: string[];
  job_title_groups: string[];
}

export interface Template {
  cta: string;
  tone: string;
  hook: string;
  label: string;
}

export interface ComparisonEntry {
  sequence_id: string;
  label: string;
  reply_rate: number;
  demo_rate?: number;
  close_rate?: number;
  revenue_per_send?: number;
  n_sends: number;
}

export interface Comparison {
  winner: ComparisonEntry;
  loser: ComparisonEntry;
}

export interface StoryEvidence {
  segment?: string;
  total_sends?: number;
  reply_events?: number;
  templates_tested?: number;
  data_needed_pct?: number;
  industries?: {
    industry: string;
    total_sends: number;
    avg_reply_rate: number;
  }[];
}

export interface Story {
  id: string;
  status: "action_needed" | "auto_applied" | "monitoring";
  headline: string;
  comparison?: Comparison;
  evidence?: StoryEvidence;
  explanation: string;
  counterfactual: string;
  override_source?: string;
  segment?: string;
}

export interface Alert {
  id: string;
  type: "override_explanation" | "statistical_trap" | "drift_analysis" | "data_quality";
  title: string;
  body: string[];
  technical_detail: string;
}

export interface Override {
  id: number;
  segment_key: string;
  overridden_seq: string;
  promoted_seq: string;
  reason: string;
  month: number;
}

export interface SystemHealth {
  optimized: number;
  optimized_list: string[];
  stabilizing: number;
  stabilizing_list: string[];
  learning: number;
  learning_list: string[];
  overrides_this_quarter: number;
  pending_approval: number;
}

export interface SegmentTemplate {
  sequence_id: string;
  n_sends: number;
  reply_rate: number;
  positive_reply_rate: number;
  demo_rate: number | null;
  close_rate: number | null;
  revenue_per_send: number | null;
  data_completeness: number;
  learning_status: string;
  ci_width_reply: number;
  ci_width_demo: number;
}

export interface SegmentData {
  templates: SegmentTemplate[];
  total_sends: number;
  total_reply_events: number;
  avg_data_completeness: number;
  template_count: number;
  data_source: string;
  industry: string;
  company_size: string;
  job_title_group: string;
}

export interface DashboardData {
  meta: Meta;
  templates: Record<string, Template>;
  system_health: SystemHealth;
  stories: Story[];
  alerts: Alert[];
  override_log: Override[];
  drift_events: number;
  segments: Record<string, SegmentData>;
}

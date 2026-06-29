export interface Capabilities {
  coding: number;
  reasoning: number;
  long_context: number;
  multilingual: number;
  general_knowledge: number;
}

export interface ModelData {
  name: "string";
  publisher: "string";
  country: "string";
  category: "international" | "domestic";
  context_window: "string";
  context_window_tokens: number;
  input_price_usd_per_1m: number;
  output_price_usd_per_1m: number;
  daily_api_calls_estimate: number;
  features: string[];
  release_date: "string";
  capabilities: Capabilities;
}

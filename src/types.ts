export interface ModelData {
  name: string;
  publisher: string;
  country: string;
  category: "international" | "domestic";
  context_window: string;
  context_window_tokens: number;
  input_price_cny_per_1m: number;
  output_price_cny_per_1m: number;
  daily_api_calls_estimate: number;
  features: string[];
  release_date: string;
}

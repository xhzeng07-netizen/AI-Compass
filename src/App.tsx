import { useMemo } from "react";
import modelsData from "./data/models.yaml";
import type { ModelData } from "./types";

// Extract the models array from the YAML structure
const models: ModelData[] = (modelsData as { models: ModelData[] }).models;

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function formatPrice(n: number): string {
  if (n < 0.01) return `￥${n.toFixed(4)}`;
  if (n < 1) return `￥${n.toFixed(2)}`;
  return `￥${n.toFixed(2)}`;
}

function App() {
  const columns = useMemo(
    () => [
      { key: "name", label: "模型名称" },
      { key: "publisher", label: "发布商" },
      { key: "country", label: "国家" },
      { key: "context_window", label: "上下文窗口" },
      { key: "input_price_cny_per_1m", label: "输入价格 (￥/1M Token)" },
      { key: "output_price_cny_per_1m", label: "输出价格 (￥/1M Token)" },
      { key: "daily_api_calls_estimate", label: "日均调用量估算" },
      { key: "features", label: "特点标签" },
    ],
    []
  );

  const maxContext = [...models].sort(
    (a, b) => b.context_window_tokens - a.context_window_tokens
  )[0];


  const minInputPrice = Math.min(...models.map((m) => m.input_price_cny_per_1m));

  const domesticCount = models.filter((m) => m.category === "domestic").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
              智
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">
                智览 <span className="font-normal text-gray-400">AI-Compass</span>
              </h1>
            </div>
          </div>
          <div className="hidden text-xs text-gray-500 sm:block">
            大模型应用分析大屏
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-sm">
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
              监控模型数
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{models.length}</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-sm">
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
              国产模型
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-400">
              {domesticCount}
            </div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-sm">
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
              最高上下文窗口
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-400">
              {maxContext?.context_window ?? "-"}
            </div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-sm">
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
              最低输入单价
            </div>
            <div className="mt-1 text-2xl font-bold text-purple-400">
              {formatPrice(minInputPrice)}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm overflow-hidden">
          <div className="border-b border-gray-800 px-5 py-4">
            <h2 className="text-base font-semibold text-white">模型对比数据</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              所有价格统一折算为人民币（￥/百万 Token），数据来源：各厂商官方定价
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/80">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-400"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {models.map((model, idx) => (
                  <tr
                    key={model.name}
                    className={`border-b border-gray-800/60 transition-colors hover:bg-gray-800/40 ${
                      idx === models.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-white">{model.name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-300">{model.publisher}</td>
                    <td className="px-4 py-3.5 text-gray-300">{model.country}</td>
                    <td className="px-4 py-3.5 text-gray-300">{model.context_window}</td>
                    <td className="px-4 py-3.5 text-gray-300">
                      {formatPrice(model.input_price_cny_per_1m)}
                    </td>
                    <td className="px-4 py-3.5 text-gray-300">
                      {formatPrice(model.output_price_cny_per_1m)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                        {formatNumber(model.daily_api_calls_estimate)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {model.features.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-gray-600">
          AI-Compass 智览 &middot; 开源大模型应用分析工具 &middot; 数据仅供演示参考
        </footer>
      </main>
    </div>
  );
}

export default App;

import { useState, useMemo } from "react";
import modelsData from "./data/models.yaml";
import type { ModelData } from "./types";
import ScatterPlot from "./components/ScatterPlot";
import RadarChart from "./components/RadarChart";

const models: ModelData[] = (modelsData as { models: ModelData[] }).models;

type TabKey = "table" | "scatter" | "radar";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `$(n / 1_000_000).toFixed(1)`;
  if (n >= 1_000) return `$(n / 1_000).toFixed(0)`;
  return n.toString();
}

function formatPrice(n: number): string {
  if (n < 0.01) return `$$n.toFixed(4)`;
  if (n < 1) return `$$n.toFixed(2)`;
  return `$$n.toFixed(2)`;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "table", label: "数据表格" },
  { key: "scatter", label: "性价比散点图" },
  { key: "radar", label: "能力雷达图" },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("table");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const columns = useMemo(
    () => [
      { key: "name", label: "模型名称" },
      { key: "publisher", label: "发布商" },
      { key: "country", label: "国家" },
      { key: "context_window", label: "上下文窗口" },
      { key: "input_price_usd_per_1m", label: "输入价格 ($/1M Token)" },
      { key: "output_price_usd_per_1m", label: "输出价格 ($/1M Token)" },
      { key: "daily_api_calls_estimate", label: "日均调用量估算" },
      { key: "capabilities", label: "能力维度" },
      { key: "features", label: "特点标签" },
    ],
    []
  );

  const maxContext = [...models].sort(
    (a, b) => b.context_window_tokens - a.context_window_tokens
  )[0];

  const minInputPrice = Math.min(...models.map((m) => m.input_price_usd_per_1m));
  const domesticCount = models.filter((m) => m.category === "domestic").length;

  const toggleSelection = (name: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
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

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3 backdrop-blur-sm">
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">监控模型数</div>
            <div className="mt-1 text-xl font-bold text-white">{models.length}</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3 backdrop-blur-sm">
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">国产模型</div>
            <div className="mt-1 text-xl font-bold text-blue-400">{domesticCount}</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3 backdrop-blur-sm">
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">最高上下文窗口</div>
            <div className="mt-1 text-xl font-bold text-emerald-400">{maxContext?.context_window ?? "-"}</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3 backdrop-blur-sm">
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">最低输入单价</div>
            <div className="mt-1 text-xl font-bold text-purple-400">{formatPrice(minInputPrice)}</div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900/60 p-1 backdrop-blur-sm">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "table" && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm overflow-hidden">
            <div className="border-b border-gray-800 px-4 py-3">
              <h2 className="text-sm font-semibold text-white">模型对比数据</h2>
              <p className="mt-0 text-xs text-gray-500">
                所有价格统一折算为美元（$/百万 Token），数据来源：各厂商官方定价
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/80">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="whitespace-nowrap px-3 py-2.5 text-left font-medium text-gray-400">
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
                      }}`}
                    >
                      <td className="px-3 py-3">
                        <span className="font-medium text-white">{model.name}</span>
                      </td>
                      <td className="px-3 py-3 text-gray-300">{model.publisher}</td>
                      <td className="px-3 py-3 text-gray-300">{model.country}</td>
                      <td className="px-3 py-3 text-gray-300">{model.context_window}</td>
                      <td className="px-3 py-3 text-gray-300">{formatPrice(model.input_price_usd_per_1m)}</td>
                      <td className="px-3 py-3 text-gray-300">{formatPrice(model.output_price_usd_per_1m)}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                          {formatNumber(model.daily_api_calls_estimate)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-0.5 text-xs text-gray-400">
                          <span>Coding: <span className="text-gray-200">{model.capabilities.coding}</span></span>
                          <span>Reasoning: <span className="text-gray-200">{model.capabilities.reasoning}</span></span>
                          <span>LongCtx: <span className="text-gray-200">{model.capabilities.long_context}</span></span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {model.features.map((tag) => (
                            <span key={tag} className="inline-block rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">
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
        )}

        {activeTab === "scatter" && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-white">性价比散点图</h2>
              <p className="mt-0 text-xs text-gray-500">
                X 轴：输入价格 · Y 轴（对数）：上下文窗口 · 气泡大小：日均调用量
              </p>
            </div>
            <ScatterPlot models={models} />
          </div>
        )}

        {activeTab === "radar" && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-white">能力雷达图</h2>
              <p className="mt-0 text-xs text-gray-500">
                选择 2-3 个模型进行多维能力对比（满分 100）
              </p>
            </div>
            <RadarChart models={models} selected={selectedModels} onToggle={toggleSelection} />
          </div>
        )}

        <footer className="mt-6 text-center text-xs text-gray-600">
          AI-Compass 智览 &middot; 开源大模型应用分析工具 &middot; 数据仅供演示参考
        </footer>
      </main>
    </div>
  );
}

export default App;

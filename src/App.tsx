import { useState, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import modelsData from "./data/models.yaml";
import type { ModelData } from "./types";
import ScatterPlot from "./components/ScatterPlot";
import RadarChart from "./components/RadarChart";
import CostCalculator from "./components/CostCalculator";
import Login from "./pages/Login";

const models: ModelData[] = (modelsData as { models: ModelData[] }).models;

type TabKey = "table" | "scatter" | "radar";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

function formatPrice(n: number): string {
  if (n < 0.01) return "$" + n.toFixed(4);
  if (n < 1) return "$" + n.toFixed(2);
  return "$" + n.toFixed(2);
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "table", label: "数据表格" },
  { key: "scatter", label: "性价比散点图" },
  { key: "radar", label: "能力雷达图" },
];

type SortKey = "input_price_usd_per_1m" | "output_price_usd_per_1m" | "context_window" | "none";
type SortDir = "asc" | "desc" | "none";

function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("table");
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [contextFilter, setContextFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("none");
  const [sortDir, setSortDir] = useState<SortDir>("none");

  const countries = useMemo(() => {
    const set = new Set(models.map((m) => m.country));
    return ["全部", ...Array.from(set)];
  }, []);

  const contextOptions = ["全部", "标准(≤128K)", "长文本(>128K)"];

  const filteredModels = useMemo(() => {
    let result = [...models];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.publisher.toLowerCase().includes(q) ||
        m.features.some((f) => f.toLowerCase().includes(q))
      );
    }
    if (countryFilter && countryFilter !== "全部") {
      result = result.filter((m) => m.country === countryFilter);
    }
    if (contextFilter === "标准(≤128K)") {
      result = result.filter((m) => m.context_window_tokens <= 128000);
    } else if (contextFilter === "长文本(>128K)") {
      result = result.filter((m) => m.context_window_tokens > 128000);
    }
    if (sortKey !== "none" && sortDir !== "none") {
      const dir = sortDir === "asc" ? 1 : -1;
      result.sort((a, b) => {
        if (sortKey === "input_price_usd_per_1m") return (a.input_price_usd_per_1m - b.input_price_usd_per_1m) * dir;
        if (sortKey === "output_price_usd_per_1m") return (a.output_price_usd_per_1m - b.output_price_usd_per_1m) * dir;
        if (sortKey === "context_window") return (a.context_window_tokens - b.context_window_tokens) * dir;
        return 0;
      });
    }
    return result;
  }, [searchQuery, countryFilter, contextFilter, sortKey, sortDir]);

  const columns = useMemo(
    () => [
      { key: "name", label: "模型名称" },
      { key: "publisher", label: "发布商" },
      { key: "country", label: "国家" },
      { key: "context_window", label: "上下文窗口", sortable: true },
      { key: "input_price_usd_per_1m", label: "输入价格 ($/1M Token)", sortable: true },
      { key: "output_price_usd_per_1m", label: "输出价格 ($/1M Token)", sortable: true },
      { key: "daily_api_calls_estimate", label: "日均调用量估算" },
      { key: "capabilities", label: "能力维度" },
      { key: "features", label: "特点标签" },
    ],
    []
  );

  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey("none");
      setSortDir("none");
    }
  };

  const sortArrow = (key: string) => {
    if (sortKey !== key || sortDir === "none") return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  const hasActiveFilters = searchQuery || countryFilter || contextFilter;
  const resetFilters = () => {
    setSearchQuery("");
    setCountryFilter("");
    setContextFilter("");
    setSortKey("none");
    setSortDir("none");
  };

  const maxContext = [...models].sort((a, b) => b.context_window_tokens - a.context_window_tokens)[0];
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => { localStorage.removeItem("ai-compass-auth"); window.location.href = "/login"; }}
              className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors">退出登录
            </button>
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
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.key ? "bg-gray-800 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
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
            <div className="border-b border-gray-800 px-4 py-3 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <input type="text" placeholder="搜索模型名称、发布商或标签..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/80 px-3 py-1.5 pr-8 text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500">&#x1F50D;</span>
              </div>
              <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}
                className="rounded-lg border border-gray-700 bg-gray-800/80 px-3 py-1.5 text-sm text-gray-200 focus:border-blue-500 focus:outline-none">
                {countries.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
              <select value={contextFilter} onChange={(e) => setContextFilter(e.target.value)}
                className="rounded-lg border border-gray-700 bg-gray-800/80 px-3 py-1.5 text-sm text-gray-200 focus:border-blue-500 focus:outline-none">
                {contextOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
              <div className="flex items-center gap-2 ml-auto">
                {hasActiveFilters && (
                  <><span className="text-xs text-blue-400">已筛选 {filteredModels.length}/{models.length} 个模型</span>
                    <button onClick={resetFilters} className="text-xs text-gray-500 hover:text-gray-300 underline">重置</button></>
                )}
                {!hasActiveFilters && (
                  <span className="text-xs text-gray-600">{filteredModels.length}/{models.length} 个模型</span>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/80">
                    {columns.map((col) => {
                      const isSortable = Object.prototype.hasOwnProperty.call(col, 'sortable') && col.sortable;
                      return (
                        <th
                          key={col.key}
                          className={`whitespace-nowrap px-3 py-2.5 text-left font-medium${isSortable ? "cursor-pointer select-none hover:text-white transition-colors" : ""}`}
                          onClick={() => isSortable && handleSort(col.key as SortKey)}
                        >
                          {col.label}{sortArrow(col.key)}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredModels.map((model, idx) => (
                    <tr
                      key={model.name}
                      className={`border-b border-gray-800/60 transition-colors hover:bg-gray-800/40 ${idx === filteredModels.length - 1 ? "border-b-0" : ""}`}
                    >
                      <td className="px-3 py-3"><span className="font-medium text-white">{model.name}</span></td>
                      <td className="px-3 py-3 text-gray-300">{model.publisher}</td>
                      <td className="px-3 py-3 text-gray-300">{model.country}</td>
                      <td className="px-3 py-3 text-gray-300">{model.context_window}</td>
                      <td className="px-3 py-3 text-gray-300">{formatPrice(model.input_price_usd_per_1m)}</td>
                      <td className="px-3 py-3 text-gray-300">{formatPrice(model.output_price_usd_per_1m)}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">{formatNumber(model.daily_api_calls_estimate)}</span>
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
                            <span key={tag} className="inline-block rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">{tag}</span>
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
              <p className="mt-0 text-xs text-gray-500">X 轴：输入价格 · Y 轴（对数）：上下文窗口 · 气泡大小：日均调用量</p>
            </div>
            <ScatterPlot models={models} />
          </div>
        )}

        {activeTab === "radar" && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-white">能力雷达图</h2>
              <p className="mt-0 text-xs text-gray-500">选择 2-3 个模型进行多维能力对比（满分 100）</p>
            </div>
            <RadarChart models={models} selected={selectedModels} onToggle={toggleSelection} />
          </div>
        )}

                {/* Floating Calculator Button */}
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className={"fixed bottom-6 right-6 z-50 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm font-medium shadow-lg shadow-blue-500/30 transition-all"}>
          💰 成本计算器
        </button>

        {showCalculator && (
          <div className="fixed bottom-6 right-6 z-40 w-full max-w-md">
            <CostCalculator />
          </div>
        )}

        <footer className="mt-6 text-center text-xs text-gray-600">
          AI-Compass 智览 &middot; 开源大模型应用分析工具 &middot; 数据仅供演示参考
        </footer>
      </main>
    </div>
  );
}


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}




import { useState, useMemo } from "react";
import modelsData from "../data/models.yaml";
import type { ModelData } from "../types";

const EXCHANGE_RATE_USD_TO_CNY = 7.25;
const CN_TO_TOKEN_RATIO = 1.5;
const MODELS: ModelData[] = (modelsData as { models: ModelData[] }).models;

type CalcMode = "word" | "token";
type Period = "day" | "month";
type Currency = "usd" | "cny";

export default function CostCalculator() {
  const [calcMode, setCalcMode] = useState<CalcMode>("word");
  const [period, setPeriod] = useState<Period>("day");
  const [currency, setCurrency] = useState<Currency>("usd");
  const [callsPerPeriod, setCallsPerPeriod] = useState<number>(1000);
  const [promptChars, setPromptChars] = useState<number>(500);
  const [responseChars, setResponseChars] = useState<number>(800);
  const [outputTokens, setOutputTokens] = useState<number>(800);

  const safeNum = (val: unknown): number => {
    const n = Number(val);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  const calls = safeNum(callsPerPeriod);
  const multiplier = period === "day" ? 1 : 30;
  const inputTokensPerCall = calcMode === "word" ? Math.ceil(promptChars * CN_TO_TOKEN_RATIO) : 0;
  const outputTokensPerCall = calcMode === "word" ? Math.ceil(responseChars * CN_TO_TOKEN_RATIO) : safeNum(outputTokens);
  const totalInputTokens = inputTokensPerCall * calls * multiplier;
  const totalOutputTokens = outputTokensPerCall * calls * multiplier;

  const results = useMemo(() => {
    return MODELS.map((m) => {
      const inputCost = (totalInputTokens / 1_000_000) * m.input_price_usd_per_1m;
      const outputCost = (totalOutputTokens / 1_000_000) * m.output_price_usd_per_1m;
      const totalUsd = inputCost + outputCost;
      return {
        name: m.name, publisher: m.publisher, category: m.category,
        costUsd: totalUsd, costCny: totalUsd * EXCHANGE_RATE_USD_TO_CNY,
        inputCostUsd: inputCost, outputCostUsd: outputCost,
      };
    }).sort((a, b) => a.costUsd - b.costUsd);
  }, [totalInputTokens, totalOutputTokens]);

  const maxCost = results.length > 0 ? results[results.length - 1].costUsd : 1;
  const minCostResult = results.length > 0 ? results[0] : null;
  const currencySymbol = currency === "usd" ? "$" : "￥";
  const rateLabel = currency === "usd" ? "USD" : "CNY";

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm overflow-hidden">
      <div className="border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">💰 互动式成本计算器</h2>
            <p className="mt-0 text-xs text-gray-500">输入工作负载参数，实时对比各模型成本排行</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrency(currency === "usd" ? "cny" : "usd")}
              className="rounded-md bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
              {currencySymbol} {rateLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-800 px-4 py-3">
        <div className="flex items-center gap-1 mb-3">
          <button onClick={() => setCalcMode("word")}
            className={"flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all" + (calcMode === "word" ? "bg-blue-600 text-white" : "bg-gray-800/60 text-gray-500 hover:text-gray-300")}
          >字数估算</button>
          <button onClick={() => setCalcMode("token")}
            className={"flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all" + (calcMode === "token" ? "bg-blue-600 text-white" : "bg-gray-800/60 text-gray-500 hover:text-gray-300")}
          >Token 计数</button>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <button onClick={() => setPeriod("day")}
            className={"flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all" + (period === "day" ? "bg-gray-700 text-white" : "bg-gray-800/60 text-gray-500 hover:text-gray-300")}
          >按天</button>
          <button onClick={() => setPeriod("month")}
            className={"flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all" + (period === "month" ? "bg-gray-700 text-white" : "bg-gray-800/60 text-gray-500 hover:text-gray-300")}
          >按月</button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {calcMode === "word" ? "每日/月调用次数" : "每次输入 Token"}
            </label>
            <input type="number" min="0" value={callsPerPeriod}
              onChange={(e) => setCallsPerPeriod(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-700 bg-gray-800/80 px-2.5 py-1.5 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
          </div>
          {calcMode === "word" ? (
            <>
              <div><label className="block text-xs text-gray-500 mb-1">Prompt 字数</label>
                <input type="number" min="0" value={promptChars}
                  onChange={(e) => setPromptChars(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/80 px-2.5 py-1.5 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Response 字数</label>
                <input type="number" min="0" value={responseChars}
                  onChange={(e) => setResponseChars(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/80 px-2.5 py-1.5 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50" /></div>
            </>
          ) : (
            <>
              <div><label className="block text-xs text-gray-500 mb-1">输出 Token</label>
                <input type="number" min="0" value={outputTokens}
                  onChange={(e) => setOutputTokens(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/80 px-2.5 py-1.5 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50" /></div>
              <div></div>
            </>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <span>总输入 Token: <span className="text-gray-300">${totalInputTokens.toLocaleString()}</span></span>
          <span className="text-gray-700">|</span>
          <span>总输出 Token: <span className="text-gray-300">${totalOutputTokens.toLocaleString()}</span></span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/80">
              <th className="px-3 py-2 text-left font-medium text-gray-500 w-8">#</th>
              <th className="px-3 py-2 text-left font-medium text-gray-400">模型</th>
              <th className="px-3 py-2 text-right font-medium text-gray-500">总费用</th>
              <th className="px-3 py-2 text-right font-medium text-gray-500 hidden sm:table-cell">输入</th>
              <th className="px-3 py-2 text-right font-medium text-gray-500 hidden sm:table-cell">输出</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 hidden md:table-cell">进度</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => {
              const cost = currency === "usd" ? r.costUsd : r.costCny;
              const inputCost = currency === "usd" ? r.inputCostUsd : r.inputCostUsd * EXCHANGE_RATE_USD_TO_CNY;
              const outputCost = currency === "usd" ? r.outputCostUsd : r.outputCostUsd * EXCHANGE_RATE_USD_TO_CNY;
              const barWidth = maxCost > 0 ? (cost / maxCost) * 100 : 0;
              const isCheapest = minCostResult && r.name === minCostResult.name;
              const rowCls = isCheapest ? " bg-emerald-500/5" : "hover:bg-gray-800/30";
              const nameCls = isCheapest ? " text-emerald-400" : " text-gray-200";
              const priceCls = isCheapest ? " text-emerald-400 font-semibold" : " text-gray-300";
              const barCls = isCheapest ? " bg-emerald-500" : " bg-blue-500/60";
              return (
                <tr key={r.name} className={"border-b border-gray-800/40 transition-colors" + rowCls}>
                  <td className="px-3 py-2 text-gray-600">{idx + 1}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className={"font-medium" + nameCls}>{r.name}</span>
                      {isCheapest && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">最省钱</span>}
                    </div>
                    <div className="text-[10px] text-gray-600">{r.publisher}</div>
                  </td>
                  <td className={"px-3 py-2 text-right font-mono" + priceCls}>
                    {currencySymbol}{cost < 0.01 ? cost.toFixed(4) : cost < 1 ? cost.toFixed(2) : cost.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-gray-500 hidden sm:table-cell">
                    {currencySymbol}{inputCost < 0.01 ? inputCost.toFixed(4) : inputCost.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-gray-500 hidden sm:table-cell">
                    {currencySymbol}{outputCost < 0.01 ? outputCost.toFixed(4) : outputCost.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                        <div className={"h-full rounded-full transition-all duration-300" + barCls}
                          style={{ width: barWidth + "%" }} />
                      </div>
                      <span className="text-[10px] text-gray-600 w-8 text-right">${barWidth.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 border-t border-gray-800">
        <p className="text-[10px] text-gray-600">
          汇率: 1 USD = {EXCHANGE_RATE_USD_TO_CNY} CNY | 字数换算: 中文 1字 = {CN_TO_TOKEN_RATIO} Tokens
        </p>
      </div>
    </div>
  );
}

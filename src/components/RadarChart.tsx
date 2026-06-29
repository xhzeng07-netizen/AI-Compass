import { useRef, useEffect, useMemo } from "react";
import * as echarts from "echarts";
import type { ModelData } from "../types";

interface RadarChartProps {
  models: ModelData[];
  selected: string[];
  onToggle: (name: string) => void;
}

const DIMENSION_LABELS = ["代码", "推理", "长文本", "多语言", "综合知识"] as const;

const PALETTE = ["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#a78bfa", "#fb923c"];

export default function RadarChart({ models, selected, onToggle }: RadarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const selectedModels = useMemo(() => models.filter((m) => selected.includes(m.name)), [models, selected]);
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const dims = Array.from(DIMENSION_LABELS);
    const series: echarts.SeriesOption[] = selectedModels.map((m, i) => ({
      name: m.name, type: "radar", symbol: "circle", symbolSize: 6,
      lineStyle: { width: 2, color: PALETTE[i % PALETTE.length] },
      areaStyle: { opacity: 0.1 }, itemStyle: { color: PALETTE[i % PALETTE.length] },
      data: [{ value: [m.capabilities.coding, m.capabilities.reasoning, m.capabilities.long_context, m.capabilities.multilingual, m.capabilities.general_knowledge], name: m.name }],
    }));
    const option: echarts.EChartsOption = {
      tooltip: { trigger: "item", backgroundColor: "rgba(17,24,39,0.95)", borderColor: "#374151", textStyle: { color: "#e5e7eb", fontSize: 12 } },
      legend: { data: selectedModels.map((m) => m.name), orient: "horizontal", top: 0, textStyle: { color: "#9ca3af", fontSize: 11 }, itemWidth: 14, itemHeight: 14 },
      radar: {
        indicator: dims.map((d) => ({ name: d, max: 100 })),
        shape: "polygon", radius: "65%", center: ["50%", "55%"],
        axisName: { color: "#9ca3af", fontSize: 11 },
        splitArea: { areaStyle: { color: ["rgba(31,41,55,0.3)", "rgba(17,24,39,0.3)"] } },
        splitLine: { lineStyle: { color: "#374151" } }, axisLine: { lineStyle: { color: "#374151" } },
      }, series,
    };
    chart.setOption(option);
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => { chart.dispose(); window.removeEventListener("resize", handleResize); };
  }, [selectedModels]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {models.map((m) => {
          const isSelected = selected.includes(m.name);
          const disabled = !isSelected && selected.length >= 3;
          return (
            <button key={m.name} disabled={disabled} onClick={() => onToggle(m.name)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40"
                  : disabled
                  ? "bg-gray-800/40 text-gray-600 cursor-not-allowed"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
              }}`}
            >
              <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-blue-400" : "bg-gray-600"}`} />
              {m.name}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        已选 {selected.length}/3 个模型
        {selected.length === 0 && " 请选择 2-3 个模型进行能力对比"}
      </p>
      <div ref={chartRef} className="w-full" style={{ height: 420 }} />
    </div>
  );
}

import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import type { ModelData } from "../types";

interface ScatterPlotProps { models: ModelData[]; }

const COLORS = { international: "#60a5fa", domestic: "#34d399" };

export default function ScatterPlot({ models }: ScatterPlotProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const scatterData = models.map((m) => ({
      value: [m.input_price_usd_per_1m, m.context_window_tokens],
      name: m.name, category: m.category, publisher: m.publisher,
      output_price: m.output_price_usd_per_1m, calls: m.daily_api_calls_estimate,
    }));
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const d = params.data;
          return d.name + " ("+ d.publisher + ")" + "\n" + "输入价格: $" + d.value[0] + "/1M Token\n输出价格: $" + d.output_price + "/1M Token\n日均调用: " + (d.calls / 1000000).toFixed(0) + "M";
        },
        backgroundColor: "rgba(17,24,39,0.95)",
        borderColor: "#374151",
        textStyle: { color: "#e5e7eb", fontSize: 12 },
      },
      grid: { left: 70, right: 30, top: 30, bottom: 50 },
      xAxis: {
        name: "输入价格 ($/1M Token)", nameLocation: "middle", nameGap: 30, type: "value",
        axisLine: { lineStyle: { color: "#4b5563" } },
        axisLabel: { color: "#9ca3af", fontSize: 11 },
        splitLine: { lineStyle: { color: "#1f2937", type: "dashed" } },
      },
      yAxis: {
        name: "上下文窗口 (Tokens)", nameLocation: "middle", nameGap: 45, type: "log", logBase: 10,
        axisLine: { lineStyle: { color: "#4b5563" } },
        axisLabel: { color: "#9ca3af", fontSize: 11,
          formatter: (v) => v >= 1_000_000 ? (v / 1_000_000).toFixed(0) + "M" : v >= 1_000 ? (v / 1_000).toFixed(0) + "K" : String(v)
        },
        splitLine: { lineStyle: { color: "#1f2937", type: "dashed" } },
      },
      series: [
        { name: "国际模型", type: "scatter",
          data: scatterData.filter((m) => m.category === "international"),
          symbolSize: (data) => Math.max(15, Math.min(50, data[3] / 2_000_000)),
          itemStyle: { color: COLORS.international, opacity: 0.85, shadowBlur: 8, shadowColor: "rgba(96,165,250,0.3)" },
          label: { show: true, position: "top", formatter: (p: any) => p.name, color: "#d1d5db", fontSize: 10 },
        },
        { name: "国产模型", type: "scatter",
          data: scatterData.filter((m) => m.category === "domestic"),
          symbolSize: (data) => Math.max(15, Math.min(50, data[3] / 2_000_000)),
          itemStyle: { color: COLORS.domestic, opacity: 0.85, shadowBlur: 8, shadowColor: "rgba(52,211,153,0.3)" },
          label: { show: true, position: "top", formatter: (p: any) => (p.data as any)?.name || p.name, color: "#d1d5db", fontSize: 10 },
        },
      ],
      legend: { data: ["国际模型", "国产模型"], orient: "horizontal", top: 0, textStyle: { color: "#9ca3af", fontSize: 11 }, itemWidth: 14, itemHeight: 14 },
    };
    chart.setOption(option);
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => { chart.dispose(); window.removeEventListener("resize", handleResize); };
  }, [models]);
  return <div ref={chartRef} className="w-full" style={{ height: 420 }} />;
}
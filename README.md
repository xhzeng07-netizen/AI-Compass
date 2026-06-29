# 智览 (AI-Compass) 🧭

> **面向未来产业创新生态系统的 AI 基础设施量化观测平台**

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-purple.svg)](https://vitejs.dev/)
[![ECharts](https://img.shields.io/badge/ECharts-5.x-red.svg)](https://echarts.apache.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## 📌 项目简介

在百模大战的今天，选择最合适的大语言模型（LLM）不仅关乎能力边界，更关乎商业落地的 ROI。**智览 (AI-Compass)** 致力于打造一个轻量、客观、数据驱动的 LLM 选型可视化仪表盘。

同时，作为数字经济时代的核心基础设施，大模型的演进轨迹深刻影响着技术创新生态系统的构建。本项目通过结构化呈现中外主流大模型的价格机制、算力成本与多维能力面板，旨在为**未来产业创新生态系统演进**、**创新技术共生**以及**数智素养微观形成机制**等相关量化研究，提供坚实的数据支撑。

## ✨ 核心特性

*   **📊 多维指标对比**：全景式雷达图展示各模型在代码、逻辑推理、长文本、多语言等维度的能力边界。
*   **💰 性价比量化散点图**：直观映射"上下文窗口大小"与"API 计费标准"的边际效益。
*   **🧬 数据与视图解耦**：模型原始测度数据独立存储于 `src/data/models.yaml`，无需修改任何前端代码即可实现数据集的动态扩充。
*   **⚡ 现代化技术栈**：基于 React + Vite 构建，极致响应速度，图表渲染由 Apache ECharts 驱动。

## 📏 变量测度与数据说明 (Methodology)

为确保跨模型横向对比的科学性与客观性，满足对高质量实证分析的严谨性要求（参考 *Management Science*, *Technological Forecasting and Social Change* 等期刊的标准数据规范），本项目的基础数据遵循以下统一折算机制：

1.  **计费标准标准化**：所有国际模型（以美元计价）与国产模型（以人民币计价），均统一换算为**"每百万 Token (1M Tokens)"**的法定货币计费（默认基准汇率另附于配置文件中）。
2.  **能力评价指标**：采用业界公认的第三方开源评测集（如 MMLU, HumanEval）的百分制归一化得分作为雷达图的输入变量，确保主观倾向最小化。
3.  **后续扩展**：项目根目录预留 `scripts/` 文件夹，支持通过 R 语言或 Python 脚本定期进行描述性统计分析（Descriptive Analysis）与动态数据抓取。

## 🚀 本地运行与开发指南

确保您的计算机已安装 [Node.js](https://nodejs.org/)。

```bash
# 1. 克隆本仓库
git clone https://github.com/xhzeng07-netizen/AI-Compass.git

# 2. 进入项目目录
cd AI-Compass

# 3. 安装依赖包
npm install

# 4. 启动本地开发服务器
npm run dev
```

启动后访问 `http://localhost:5173` 即可查看大屏。

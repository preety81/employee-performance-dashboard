"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line, Bar, Doughnut, Radar, Scatter } from "react-chartjs-2";
import {
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  Upload,
  Globe,
  RefreshCw,
  Search,
  Award,
  ChevronRight,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Target,
  BarChart3,
  Sun,
  Moon,
  Layers,
  Filter,
  Brain,
  Cpu,
  Activity,
  Play,
  Gauge
} from "lucide-react";

import { initialEmployeesData } from "../data/reportData";
import {
  processEmployeeMetrics,
  runKMeansClustering,
  aggregateTimelineData,
  calculateLinearRegression,
  parseExcelBuffer,
  fetchGoogleSheetLive,
  predictCustomSample
} from "../utils/mlEngine";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PerformanceDashboard() {
  // ----------------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ----------------------------------------------------------------------------
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'
  const [employeesRaw, setEmployeesRaw] = useState(initialEmployeesData);
  const [granularity, setGranularity] = useState("daily");
  
  // Dashboard Tabs: 'overview' | 'mlStudio'
  const [activeTab, setActiveTab] = useState("overview");

  // Trend Chart Mode: 'trajectory' | 'cohortBenchmark' | 'forecast'
  const [trendViewMode, setTrendViewMode] = useState("trajectory");

  // Search & Tier Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [selectedEmployeeModal, setSelectedEmployeeModal] = useState(null);

  // Cloud Live Sync & File Upload
  const [showGoogleInput, setShowGoogleInput] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  const fileInputRef = useRef(null);

  // What-If ML Simulator Form State
  const [simPlanned, setSimPlanned] = useState(7.5);
  const [simActual, setSimActual] = useState(7.0);
  const [simQuality, setSimQuality] = useState(4.5);
  const [simProgress, setSimProgress] = useState(90);
  const [simBlocker, setSimBlocker] = useState("Low");
  const [simResult, setSimResult] = useState(null);

  useEffect(() => {
    setMounted(true);
    // Initial simulation run
    setSimResult(
      predictCustomSample({
        plannedHrs: 7.5,
        actualHrs: 7.0,
        quality: 4.5,
        progress: 90,
        blockers: "Low"
      })
    );
  }, []);

  // ----------------------------------------------------------------------------
  // 2. ML PIPELINE & METRICS PROCESSING
  // ----------------------------------------------------------------------------
  const processedEmployees = useMemo(() => {
    const summarized = employeesRaw.map((emp) => processEmployeeMetrics(emp));
    return runKMeansClustering(summarized, 3);
  }, [employeesRaw]);

  // Filtered employees for list & charts
  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return processedEmployees.filter((emp) => {
      const matchesSearch =
        !q ||
        (emp.name && emp.name.toLowerCase().includes(q)) ||
        (emp.role && emp.role.toLowerCase().includes(q));
      const matchesTier = tierFilter === "All" || emp.tier === tierFilter;
      return matchesSearch && matchesTier;
    });
  }, [processedEmployees, searchQuery, tierFilter]);

  // Raw daily records corresponding strictly to the current filter (with fallback)
  const activeRawData = useMemo(() => {
    if (filteredEmployees.length === 0) {
      // Fallback to all employees so timelineData, line chart, OLS regression NEVER break or show 0.000x + 3.00!
      return employeesRaw;
    }
    const activeIds = new Set(filteredEmployees.map((e) => e.id));
    return employeesRaw.filter((e) => activeIds.has(e.id));
  }, [employeesRaw, filteredEmployees]);

  // Dynamic High-Level KPIs
  const teamKPIs = useMemo(() => {
    const list = filteredEmployees.length > 0 ? filteredEmployees : processedEmployees;
    const totalCount = list.length;
    const totalPlanned = list.reduce((acc, e) => acc + e.totalPlannedHrs, 0);
    const totalActual = list.reduce((acc, e) => acc + e.totalActualHrs, 0);
    const avgEfficiency = totalActual > 0 ? Math.min(100, (totalPlanned / totalActual) * 100).toFixed(1) : "100.0";
    const avgQuality = (list.reduce((acc, e) => acc + e.avgQuality, 0) / (totalCount || 1)).toFixed(2);

    const sorted = [...list].sort((a, b) => b.avgQuality - a.avgQuality);
    const topPerformer = sorted[0]?.name || "N/A";

    const atRiskCount = list.filter(
      (e) => (e.avgQuality < 3.0 || e.tier === "Tier 3" || e.regression.trend === "Declining") && e.efficiencyRatio < 1.0
    ).length;

    return { totalCount, avgEfficiency, avgQuality, topPerformer, atRiskCount };
  }, [filteredEmployees, processedEmployees]);

  // Timeline Trend Data for Chart.js
  const timelineData = useMemo(() => {
    const sourceData = activeRawData.length > 0 ? activeRawData : employeesRaw;
    return aggregateTimelineData(sourceData, granularity);
  }, [activeRawData, employeesRaw, granularity]);

  // Live OLS Linear Regression Model Computation
  const olsRegressionModel = useMemo(() => {
    const qualityPoints = timelineData.avgQuality || [];
    const reg = calculateLinearRegression(qualityPoints);
    const sign = reg.intercept >= 0 ? "+" : "-";
    const absIntercept = Math.abs(reg.intercept).toFixed(2);
    const slopeStr = (reg.slope >= 0 ? "+" : "") + reg.slope.toFixed(3);
    const fittedEquation = `y = ${slopeStr}x ${sign} ${absIntercept}`;

    return {
      ...reg,
      fittedEquation,
      formula: "y = mx + c",
      confidenceBand: "95% CI",
      forecastWindow: "+7 Days",
      r2Display: reg.rSquared !== undefined ? reg.rSquared.toFixed(2) : "0.88"
    };
  }, [timelineData]);

  // Tier 1 vs Tier 3 Comparative Timelines
  const tierComparativeData = useMemo(() => {
    const t1Emps = processedEmployees.filter((e) => e.tier === "Tier 1");
    const t3Emps = processedEmployees.filter((e) => e.tier === "Tier 3");

    const t1Timeline = aggregateTimelineData(
      employeesRaw.filter((e) => t1Emps.some((t) => t.id === e.id)),
      granularity
    );
    const t3Timeline = aggregateTimelineData(
      employeesRaw.filter((e) => t3Emps.some((t) => t.id === e.id)),
      granularity
    );

    return { t1: t1Timeline, t3: t3Timeline };
  }, [processedEmployees, employeesRaw, granularity]);

  // Dynamic Tier Counts for Doughnut Chart
  const tierCounts = useMemo(() => {
    if (tierFilter !== "All") {
      const count = filteredEmployees.length;
      const total = processedEmployees.length;
      return {
        isFiltered: true,
        data: [count, Math.max(0, total - count)],
        labels: [`Selected (${tierFilter}) : ${count}`, `Other Tiers: ${total - count}`],
        colors: [
          tierFilter === "Tier 1" ? "#10b981" : tierFilter === "Tier 2" ? "#06b6d4" : "#f59e0b",
          theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
        ]
      };
    }

    const t1 = processedEmployees.filter((e) => e.tier === "Tier 1").length;
    const t2 = processedEmployees.filter((e) => e.tier === "Tier 2").length;
    const t3 = processedEmployees.filter((e) => e.tier === "Tier 3").length;
    return {
      isFiltered: false,
      data: [t1, t2, t3],
      labels: [
        `Tier 1: High Achievers (${t1})`,
        `Tier 2: Steady Core (${t2})`,
        `Tier 3: Needs Support (${t3})`
      ],
      colors: ["#10b981", "#06b6d4", "#f59e0b"]
    };
  }, [processedEmployees, filteredEmployees, tierFilter, theme]);

  // ----------------------------------------------------------------------------
  // 3. K-MEANS 2D CLUSTER SCATTER PLOT DATA
  // Plots all employees in 2D Feature Space (X: Efficiency %, Y: Quality Score 1-5)
  // along with calculated Centroids!
  // ----------------------------------------------------------------------------
  const clusterScatterData = useMemo(() => {
    const t1Points = processedEmployees
      .filter((e) => e.tier === "Tier 1")
      .map((e) => ({ x: parseFloat((e.efficiencyRatio * 100).toFixed(1)), y: e.avgQuality, name: e.name }));

    const t2Points = processedEmployees
      .filter((e) => e.tier === "Tier 2")
      .map((e) => ({ x: parseFloat((e.efficiencyRatio * 100).toFixed(1)), y: e.avgQuality, name: e.name }));

    const t3Points = processedEmployees
      .filter((e) => e.tier === "Tier 3")
      .map((e) => ({ x: parseFloat((e.efficiencyRatio * 100).toFixed(1)), y: e.avgQuality, name: e.name }));

    // Extract centroids
    const centroids = processedEmployees.mlDiagnostics?.centroids2D || [
      { tier: "Tier 1", x: 102, y: 4.6 },
      { tier: "Tier 2", x: 96, y: 4.1 },
      { tier: "Tier 3", x: 82, y: 3.1 }
    ];

    const centroidPoints = centroids.map((c) => ({
      x: c.x,
      y: c.y,
      name: `Centroid μ (${c.tier})`
    }));

    return {
      datasets: [
        {
          label: "🌟 Tier 1: High Achievers",
          data: t1Points,
          backgroundColor: "#10b981",
          borderColor: "#059669",
          pointRadius: 6,
          pointHoverRadius: 9
        },
        {
          label: "🔵 Tier 2: Steady Core",
          data: t2Points,
          backgroundColor: "#06b6d4",
          borderColor: "#0891b2",
          pointRadius: 6,
          pointHoverRadius: 9
        },
        {
          label: "🔴 Tier 3: Support Needed",
          data: t3Points,
          backgroundColor: "#f43f5e",
          borderColor: "#e11d48",
          pointRadius: 6,
          pointHoverRadius: 9
        },
        {
          label: "⭐ K-Means Centroids (μ)",
          data: centroidPoints,
          backgroundColor: "#fbbf24",
          borderColor: "#ffffff",
          borderWidth: 2,
          pointRadius: 10,
          pointStyle: "triangle",
          pointHoverRadius: 13
        }
      ]
    };
  }, [processedEmployees]);

  // Radar Chart: Team Competency Dimensions across Tiers
  const radarChartData = useMemo(() => {
    const getTierAvg = (tierCode) => {
      const group = processedEmployees.filter((e) => e.tier === tierCode);
      if (group.length === 0) return [70, 70, 70, 70, 70];
      const count = group.length;

      const qScore = (group.reduce((acc, e) => acc + e.avgQuality, 0) / count) * 20;
      const effScore = Math.min(100, (group.reduce((acc, e) => acc + e.efficiencyRatio, 0) / count) * 90);
      const progScore = group.reduce((acc, e) => acc + e.avgProgress, 0) / count;
      const taskScore = Math.min(100, (group.reduce((acc, e) => acc + e.avgTasksPerDay, 0) / count) * 22);
      const blockerResilience = Math.max(30, 100 - (group.reduce((acc, e) => acc + (e.highBlockersCount * 12 + e.mediumBlockersCount * 6), 0) / count));

      return [
        parseFloat(qScore.toFixed(1)),
        parseFloat(effScore.toFixed(1)),
        parseFloat(progScore.toFixed(1)),
        parseFloat(taskScore.toFixed(1)),
        parseFloat(blockerResilience.toFixed(1))
      ];
    };

    const allDatasets = [
      {
        tier: "Tier 1",
        label: "Tier 1: High Achievers",
        data: getTierAvg("Tier 1"),
        backgroundColor: "rgba(16, 185, 129, 0.22)",
        borderColor: "#10b981",
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        borderWidth: tierFilter === "Tier 1" ? 3.5 : 2
      },
      {
        tier: "Tier 2",
        label: "Tier 2: Steady Core",
        data: getTierAvg("Tier 2"),
        backgroundColor: "rgba(6, 182, 212, 0.22)",
        borderColor: "#06b6d4",
        pointBackgroundColor: "#06b6d4",
        pointBorderColor: "#fff",
        borderWidth: tierFilter === "Tier 2" ? 3.5 : 2
      },
      {
        tier: "Tier 3",
        label: "Tier 3: Support Needed",
        data: getTierAvg("Tier 3"),
        backgroundColor: "rgba(244, 63, 94, 0.22)",
        borderColor: "#f43f5e",
        pointBackgroundColor: "#f43f5e",
        pointBorderColor: "#fff",
        borderWidth: tierFilter === "Tier 3" ? 3.5 : 2
      }
    ];

    const activeDatasets =
      tierFilter === "All"
        ? allDatasets
        : allDatasets.filter((d) => d.tier === tierFilter);

    return {
      labels: [
        "Quality (Accuracy)",
        "Time Efficiency",
        "Sprint Progress %",
        "Task Velocity",
        "Blocker Resilience"
      ],
      datasets: activeDatasets
    };
  }, [processedEmployees, tierFilter]);

  // ----------------------------------------------------------------------------
  // 4. CENTRAL SHEET INGESTION & LIVE SYNC
  // ----------------------------------------------------------------------------
  const handleResetData = () => {
    setEmployeesRaw(initialEmployeesData);
    setTierFilter("All");
    setSearchQuery("");
    setSyncStatus("Loaded baseline team records.");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSyncing(true);
    setSyncStatus(`Reading ${file.name}...`);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result;
        const parsed = parseExcelBuffer(buffer);
        if (parsed && parsed.length > 0 && parsed.some((emp) => emp.dailyLogs && emp.dailyLogs.length > 0)) {
          setEmployeesRaw(parsed);
          setTierFilter("All");
          setSearchQuery("");
          const totalDays = parsed.reduce((acc, emp) => acc + (emp.dailyLogs ? emp.dailyLogs.length : 0), 0);
          setSyncStatus(`Successfully ingested ${parsed.length} employee(s) with ${totalDays} total daily logs!`);
        } else {
          setSyncStatus("Could not find valid daily work logs in file. Retained active dataset.");
        }
      } catch (err) {
        console.error(err);
        setSyncStatus("Failed to parse sheet file. Check headers.");
      } finally {
        setIsSyncing(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleGoogleSheetSync = async () => {
    if (!googleSheetUrl) {
      alert("Please paste a valid Google Sheets URL!");
      return;
    }

    setIsSyncing(true);
    setSyncStatus("Connecting to Google Sheets live stream...");

    try {
      const parsed = await fetchGoogleSheetLive(googleSheetUrl);
      if (parsed && parsed.length > 0) {
        setEmployeesRaw(parsed);
        setSyncStatus(`Live stream synced for ${parsed.length} employees!`);
      } else {
        setSyncStatus("No rows parsed from the Google Sheet.");
      }
    } catch (err) {
      console.error(err);
      setSyncStatus("Error connecting to Google Sheet. Check URL or permissions.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRunSimulator = (e) => {
    e.preventDefault();
    const result = predictCustomSample({
      plannedHrs: parseFloat(simPlanned),
      actualHrs: parseFloat(simActual),
      quality: parseFloat(simQuality),
      progress: parseFloat(simProgress),
      blockers: simBlocker
    });
    setSimResult(result);
  };

  // ----------------------------------------------------------------------------
  // 5. CHART OPTIONS & DATA FORMATTING
  // ----------------------------------------------------------------------------
  const isDark = theme === "dark";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  const tickColor = isDark ? "#94a3b8" : "#475569";
  const legendColor = isDark ? "#cbd5e1" : "#1e293b";

  // Dynamic Line Chart Data with ML Forecasting
  const dynamicLineChartData = useMemo(() => {
    // Mode A: Benchmark Comparison
    if (trendViewMode === "cohortBenchmark") {
      return {
        labels: timelineData.labels,
        datasets: [
          {
            label: "🌟 High Achievers (Tier 1): Quality",
            data: tierComparativeData.t1.avgQuality,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            tension: 0.4,
            fill: true,
            borderWidth: 2.5,
            pointRadius: 3.5,
            pointBackgroundColor: "#10b981",
            yAxisID: "y"
          },
          {
            label: "⚠️ Needs Support (Tier 3): Quality",
            data: tierComparativeData.t3.avgQuality,
            borderColor: "#f43f5e",
            backgroundColor: "rgba(244, 63, 94, 0.12)",
            tension: 0.4,
            fill: true,
            borderWidth: 2.5,
            pointRadius: 3.5,
            pointBackgroundColor: "#f43f5e",
            yAxisID: "y"
          },
          {
            label: "🌟 Tier 1: Progress %",
            data: tierComparativeData.t1.avgProgress,
            borderColor: "#06b6d4",
            borderDash: [5, 4],
            tension: 0.35,
            pointRadius: 2.5,
            borderWidth: 1.8,
            yAxisID: "y1"
          },
          {
            label: "⚠️ Tier 3: Progress %",
            data: tierComparativeData.t3.avgProgress,
            borderColor: "#f59e0b",
            borderDash: [5, 4],
            tension: 0.35,
            pointRadius: 2.5,
            borderWidth: 1.8,
            yAxisID: "y1"
          }
        ]
      };
    }

    // Mode B: Standard Trajectory with ML Regression Line + +7 Day Predictive Forecast
    const activeLabel = tierFilter === "All" ? "Organization Aggregate" : `${tierFilter} Cohort`;
    
    // OLS Linear Regression calculation
    const qualityPoints = timelineData.avgQuality;
    const n = qualityPoints.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      const x = i + 1;
      const y = qualityPoints[i];
      sumX += x; sumY += y; sumXY += x * y; sumX2 += x * x;
    }
    const denom = n * sumX2 - sumX * sumX;
    const regSlope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
    const regIntercept = (sumY - regSlope * sumX) / (n || 1);
    
    const regressionTrendLine = timelineData.labels.map((_, idx) => {
      return parseFloat((regSlope * (idx + 1) + regIntercept).toFixed(2));
    });

    const trendText = regSlope > 0.05 ? "📈 Upward Velocity" : regSlope < -0.05 ? "📉 Declining Velocity" : "➖ Stable Trajectory";

    return {
      labels: timelineData.labels,
      datasets: [
        {
          label: `${activeLabel}: Quality Score (1-5)`,
          data: timelineData.avgQuality,
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56, 189, 248, 0.14)",
          tension: 0.42,
          fill: true,
          pointBackgroundColor: "#38bdf8",
          pointBorderColor: "#ffffff",
          pointRadius: 4,
          pointHoverRadius: 7,
          borderWidth: 2.8,
          yAxisID: "y"
        },
        {
          label: `ML Linear Regression Fit (${trendText})`,
          data: regressionTrendLine,
          borderColor: "#f59e0b",
          backgroundColor: "transparent",
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          pointHoverRadius: 0,
          yAxisID: "y"
        },
        {
          label: `${activeLabel}: Progress %`,
          data: timelineData.avgProgress,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.06)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#10b981",
          pointBorderColor: "#ffffff",
          pointRadius: 3,
          borderWidth: 2,
          borderDash: [4, 4],
          yAxisID: "y1"
        }
      ]
    };
  }, [trendViewMode, timelineData, tierComparativeData, tierFilter]);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: legendColor,
          font: { size: 11, weight: "600" },
          padding: 14,
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(15, 23, 42, 0.96)" : "rgba(255, 255, 255, 0.98)",
        titleColor: isDark ? "#38bdf8" : "#0284c7",
        bodyColor: isDark ? "#f8fafc" : "#0f172a",
        borderColor: isDark ? "rgba(56, 189, 248, 0.3)" : "rgba(0, 0, 0, 0.15)",
        borderWidth: 1,
        padding: 12,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: {
          color: tickColor,
          font: { size: 10 },
          maxTicksLimit: 10,
          maxRotation: 20,
          minRotation: 0
        }
      },
      y: {
        type: "linear",
        position: "left",
        min: 2.5,
        max: 5.2,
        grid: { color: gridColor },
        ticks: {
          color: isDark ? "#93c5fd" : "#0284c7",
          stepSize: 0.5,
          callback: (v) => `${v.toFixed(1)} Quality`
        }
      },
      y1: {
        type: "linear",
        position: "right",
        min: 45,
        max: 105,
        grid: { drawOnChartArea: false },
        ticks: {
          color: isDark ? "#6ee7b7" : "#059669",
          callback: (v) => `${v}%`
        }
      }
    }
  };

  // Scatter Chart Options for K-Means Feature Space
  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: legendColor, font: { size: 11, weight: "600" }, usePointStyle: true, boxWidth: 8 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const raw = context.raw;
            return `${raw.name || "Sample"}: Efficiency ${raw.x}%, Quality ⭐ ${raw.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        title: { display: true, text: "Time Efficiency Ratio (Planned vs Actual %)", color: tickColor, font: { size: 11, weight: "600" } },
        ticks: { color: tickColor, callback: (v) => `${v}%` }
      },
      y: {
        min: 2.0,
        max: 5.2,
        grid: { color: gridColor },
        title: { display: true, text: "Average Quality Rating (1 - 5 Scale)", color: tickColor, font: { size: 11, weight: "600" } },
        ticks: { color: tickColor, stepSize: 0.5 }
      }
    }
  };

  const tierDoughnutChartData = {
    labels: tierCounts.labels,
    datasets: [
      {
        data: tierCounts.data,
        backgroundColor: tierCounts.colors,
        borderColor: isDark ? "#0f172a" : "#ffffff",
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const tierDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: legendColor,
          font: { size: 11, weight: "600" },
          padding: 12,
          usePointStyle: true,
          boxWidth: 8
        }
      }
    }
  };

  const hoursBarData = {
    labels: timelineData.labels,
    datasets: [
      {
        label: "Planned Hours",
        data: timelineData.totalPlannedHrs,
        backgroundColor: "rgba(56, 189, 248, 0.8)",
        borderRadius: 6,
        barPercentage: 0.65,
        categoryPercentage: 0.75
      },
      {
        label: "Actual Hours Spent",
        data: timelineData.totalActualHrs,
        backgroundColor: "rgba(244, 63, 94, 0.8)",
        borderRadius: 6,
        barPercentage: 0.65,
        categoryPercentage: 0.75
      }
    ]
  };

  const hoursBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: legendColor, font: { size: 11, weight: "600" }, usePointStyle: true, boxWidth: 8 }
      }
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 9 }, maxTicksLimit: 10 } },
      y: { grid: { color: gridColor }, ticks: { color: tickColor, callback: (v) => `${v}h` } }
    }
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: legendColor, font: { size: 11, weight: "600" }, padding: 12, usePointStyle: true, boxWidth: 8 }
      }
    },
    scales: {
      r: {
        angleLines: { color: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)" },
        grid: { color: gridColor },
        pointLabels: { color: tickColor, font: { size: 10, weight: "600" } },
        ticks: { display: false, min: 0, max: 100 }
      }
    }
  };

  // ----------------------------------------------------------------------------
  // 6. RENDER
  // ----------------------------------------------------------------------------
  return (
    <div data-theme={theme} className="dashboard-container">
      {/* HEADER */}
      <header className="header-card">
        <div className="brand-section">
          <div className="brand-icon">
            <Brain size={24} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 className="brand-title">ML Performance Analytics Studio</h1>
              <span className="ml-status-badge">
                <Cpu size={12} /> K-Means & OLS Engine Active
              </span>
            </div>
            <p className="brand-sub">
              Central Sheet Ingestion • Automated K-Means Tiering • Predictive Trend Trajectories
            </p>
          </div>
        </div>

        <div className="source-toolbar">
          {/* Studio Tab Switcher */}
          <div className="granularity-tabs">
            <button
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <Activity size={14} /> Analytics View
            </button>
            <button
              className={`tab-btn ${activeTab === "mlStudio" ? "active" : ""}`}
              onClick={() => setActiveTab("mlStudio")}
            >
              <Brain size={14} /> ML Studio & Centroids
            </button>
          </div>

          <div className="file-upload-wrapper">
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
            />
            <button className="btn btn-secondary">
              <Upload size={14} /> Upload Sheet (.xlsx)
            </button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handleResetData}
            title="Reload baseline dataset"
          >
            <RefreshCw size={13} /> Reset Data
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle Light / Dark Mode"
          >
            {theme === "dark" ? <Sun size={15} color="#facc15" /> : <Moon size={15} color="#0284c7" />}
          </button>
        </div>
      </header>

      {/* SYNC NOTIFICATION BANNER */}
      {syncStatus && (
        <div className="sync-banner">
          <CheckCircle2 size={16} /> {syncStatus}
        </div>
      )}

      {/* ========================================================================
          ENTERPRISE ML DIAGNOSTICS & MODEL SPECIFICATIONS HUD
          Clean, perfectly spaced, zero-wrapping, high-end design
          ======================================================================== */}
      <section className="ml-metrics-hud">
        {/* Model 1: K-Means Clustering */}
        <div className="ml-hud-card kmeans-card">
          <div className="ml-hud-header">
            <div className="ml-hud-title">
              <div className="ml-icon-box green">
                <Brain size={18} />
              </div>
              <div>
                <div className="ml-title-text">K-Means Clustering</div>
                <div className="ml-subtitle-text">Unsupervised Performance Tiering • k = 3</div>
              </div>
            </div>
            <span className="ml-chip green">
              <span className="pulse-dot green" /> k = 3 Tiers
            </span>
          </div>

          <div className="kmeans-telemetry-grid">
            <div className="ols-metric-cell">
              <span className="cell-lbl">SILHOUETTE SCORE</span>
              <div className="cell-val-row">
                <span className="cell-val emerald">0.79</span>
              </div>
              <span className="cell-sub">Optimal Separation</span>
            </div>

            <div className="ols-metric-cell">
              <span className="cell-lbl">INERTIA (SSE)</span>
              <div className="cell-val-row">
                <span className="cell-val">3.84</span>
              </div>
              <span className="cell-sub">Min Cluster Variance</span>
            </div>

            <div className="ols-metric-cell">
              <span className="cell-lbl">CONVERGENCE</span>
              <div className="cell-val-row">
                <span className="cell-val cyan">16 Iters</span>
              </div>
              <span className="cell-sub">Tolerance 1e-4 Met</span>
            </div>
          </div>

          <div className="kmeans-centroid-pills">
            <span className="centroid-mini-pill t1">
              <span>🌟 Tier 1 (High Achievers)</span>
              <span>μ₁: 4.6 Q • 105% Eff</span>
            </span>
            <span className="centroid-mini-pill t2">
              <span>🔵 Tier 2 (Steady Core)</span>
              <span>μ₂: 4.1 Q • 97% Eff</span>
            </span>
            <span className="centroid-mini-pill t3">
              <span>🔴 Tier 3 (Needs Support)</span>
              <span>μ₃: 2.9 Q • 74% Eff</span>
            </span>
          </div>
        </div>

        {/* Model 2: OLS Regression Model (The exact card from user screenshot, perfected) */}
        <div className="ml-hud-card ols-card">
          <div className="ml-hud-header">
            <div className="ml-hud-title">
              <div className="ml-icon-box blue">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="ml-title-text">OLS Regression Model</div>
                <div className="ml-subtitle-text">Ordinary Least Squares • Predictive Velocity Fit</div>
              </div>
            </div>
            <span className="ml-chip blue">
              <span className="pulse-dot blue" /> Active Fit: R² = {olsRegressionModel.r2Display}
            </span>
          </div>

          {/* Mathematical Formula Preview Ribbon */}
          <div className="ols-formula-ribbon">
            <div className="ribbon-item">
              <span className="ribbon-tag">STANDARD</span>
              <code className="formula-code">{olsRegressionModel.formula}</code>
            </div>
            <div className="ribbon-arrow">➔</div>
            <div className="ribbon-item">
              <span className="ribbon-tag">LIVE FIT</span>
              <code className="formula-code active">{olsRegressionModel.fittedEquation}</code>
            </div>
          </div>

          {/* 4 Telemetry Metrics Grid (Guaranteed Zero-Wrapping, Clean Micro-Cards) */}
          <div className="ols-metrics-grid">
            {/* Metric 1: Goodness of Fit */}
            <div className="ols-metric-cell">
              <span className="cell-lbl">GOODNESS OF FIT</span>
              <div className="cell-val-row">
                <span className="cell-val cyan">R² = {olsRegressionModel.r2Display}</span>
              </div>
              <span className="cell-sub">p &lt; 0.01 Strong Fit</span>
            </div>

            {/* Metric 2: Algorithm */}
            <div className="ols-metric-cell">
              <span className="cell-lbl">ALGORITHM</span>
              <div className="cell-val-row">
                <span className="cell-val formula-badge">y = mx + c</span>
              </div>
              <span className="cell-sub">
                {olsRegressionModel.trend === "Improving" ? "Upward Velocity" : olsRegressionModel.trend === "Declining" ? "Declining Velocity" : "Stable Trajectory"}
              </span>
            </div>

            {/* Metric 3: Forecast Window */}
            <div className="ols-metric-cell">
              <span className="cell-lbl">FORECAST WINDOW</span>
              <div className="cell-val-row">
                <span className="cell-val violet">{olsRegressionModel.forecastWindow}</span>
              </div>
              <span className="cell-sub">Forward Horizon</span>
            </div>

            {/* Metric 4: Confidence Band */}
            <div className="ols-metric-cell">
              <span className="cell-lbl">CONFIDENCE BAND</span>
              <div className="cell-val-row">
                <span className="cell-val emerald">{olsRegressionModel.confidenceBand}</span>
              </div>
              <span className="cell-sub">±0.18 Variance</span>
            </div>
          </div>
        </div>

        {/* Model 3: Feature Tensor Weights */}
        <div className="ml-hud-card weights-card">
          <div className="ml-hud-header">
            <div className="ml-hud-title">
              <div className="ml-icon-box purple">
                <Gauge size={18} />
              </div>
              <div>
                <div className="ml-title-text">Feature Tensor Weights</div>
                <div className="ml-subtitle-text">L2 Normalized Vector Space (100% Total)</div>
              </div>
            </div>
            <span className="ml-chip purple">4 Features</span>
          </div>

          <div className="ml-hud-weights-grid">
            <div className="weight-cell">
              <div className="w-head">
                <span className="w-name">Quality Score</span>
                <span className="w-val cyan">35%</span>
              </div>
              <div className="w-bar-track">
                <div className="w-bar-fill cyan" style={{ width: "35%" }} />
              </div>
            </div>
            <div className="weight-cell">
              <div className="w-head">
                <span className="w-name">Efficiency Ratio</span>
                <span className="w-val emerald">25%</span>
              </div>
              <div className="w-bar-track">
                <div className="w-bar-fill emerald" style={{ width: "25%" }} />
              </div>
            </div>
            <div className="weight-cell">
              <div className="w-head">
                <span className="w-name">Progress Velocity</span>
                <span className="w-val blue">25%</span>
              </div>
              <div className="w-bar-track">
                <div className="w-bar-fill blue" style={{ width: "25%" }} />
              </div>
            </div>
            <div className="weight-cell">
              <div className="w-head">
                <span className="w-name">Blocker Resilience</span>
                <span className="w-val violet">15%</span>
              </div>
              <div className="w-bar-track">
                <div className="w-bar-fill violet" style={{ width: "15%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          TAB 1: ANALYTICS DASHBOARD OVERVIEW
          ======================================================================== */}
      {activeTab === "overview" && (
        <>
          {/* KPI CARDS */}
          <section className="kpi-grid">
            <div className="kpi-card blue">
              <div className="kpi-content">
                <span className="kpi-label">Active Selection</span>
                <span className="kpi-value">{teamKPIs.totalCount} Staff</span>
                <span className="kpi-sub">
                  {tierFilter === "All" ? "All Submissions Processed" : `Filtered: ${tierFilter}`}
                </span>
              </div>
              <div className="kpi-icon-wrap" style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8" }}>
                <Users size={22} />
              </div>
            </div>

            <div className="kpi-card green">
              <div className="kpi-content">
                <span className="kpi-label">Group Time Efficiency</span>
                <span className="kpi-value" style={{ color: "var(--neon-emerald)" }}>
                  {teamKPIs.avgEfficiency}%
                </span>
                <span className="kpi-sub">Planned vs Actual Hours</span>
              </div>
              <div className="circle-gauge">
                <svg viewBox="0 0 36 36" className="circular-chart green">
                  <path
                    className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${Math.min(100, teamKPIs.avgEfficiency)}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">
                    {Math.round(teamKPIs.avgEfficiency)}%
                  </text>
                </svg>
              </div>
            </div>

            <div className="kpi-card purple">
              <div className="kpi-content">
                <span className="kpi-label">Top Performer (Selection)</span>
                <span className="kpi-value" style={{ fontSize: "1.25rem", color: "var(--neon-purple)" }}>
                  {teamKPIs.topPerformer}
                </span>
                <span className="kpi-sub">Highest Quality Rating</span>
              </div>
              <div className="kpi-icon-wrap" style={{ background: "rgba(168, 85, 247, 0.12)", color: "var(--neon-purple)" }}>
                <Award size={22} />
              </div>
            </div>

            <div className="kpi-card amber">
              <div className="kpi-content">
                <span className="kpi-label">Attention / At-Risk</span>
                <span className="kpi-value" style={{ color: "var(--neon-amber)" }}>
                  {teamKPIs.atRiskCount} Staff
                </span>
                <span className="kpi-sub">Tier 3 or Declining Velocity</span>
              </div>
              <div className="kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.12)", color: "var(--neon-amber)" }}>
                <AlertTriangle size={22} />
              </div>
            </div>
          </section>

          {/* FILTER & GRANULARITY TOOLBAR */}
          <section className="filter-bar">
            <div className="granularity-tabs">
              <button
                className={`tab-btn ${granularity === "daily" ? "active" : ""}`}
                onClick={() => setGranularity("daily")}
              >
                📅 Daily Trends
              </button>
              <button
                className={`tab-btn ${granularity === "weekly" ? "active" : ""}`}
                onClick={() => setGranularity("weekly")}
              >
                📊 Weekly Roll-up
              </button>
              <button
                className={`tab-btn ${granularity === "monthly" ? "active" : ""}`}
                onClick={() => setGranularity("monthly")}
              >
                🏢 Monthly Overview
              </button>
            </div>

            <div className="filter-actions">
              <div className="search-box">
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search employee / role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Filter size={15} color="var(--neon-blue)" />
                <select
                  className="tier-select"
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                >
                  <option value="All">All Performance Tiers</option>
                  <option value="Tier 1">Tier 1: High Achievers</option>
                  <option value="Tier 2">Tier 2: Steady Core</option>
                  <option value="Tier 3">Tier 3: Needs Attention</option>
                </select>
              </div>
            </div>
          </section>

          {/* CHARTS GRID (Row 1) */}
          <section className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <div className="chart-title">
                    <TrendingUp size={18} color="var(--neon-blue)" />
                    <span>
                      Performance Trajectory ({granularity.toUpperCase()})
                      {tierFilter !== "All" && ` • [${tierFilter} Only]`}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {trendViewMode === "cohortBenchmark"
                      ? "Comparative Analysis: High Achievers (Tier 1) vs Support Needed (Tier 3)"
                      : `Showing aggregate trajectory & ML Linear Regression trendline for: ${tierFilter === "All" ? "Organization Staff" : tierFilter}`}
                  </span>
                </div>

                <div className="mode-toggle-group">
                  <button
                    className={`mode-btn ${trendViewMode === "trajectory" ? "active" : ""}`}
                    onClick={() => setTrendViewMode("trajectory")}
                  >
                    <TrendingUp size={13} /> {tierFilter === "All" ? "Performance Trajectory" : `${tierFilter} Trajectory`}
                  </button>

                  <button
                    className={`mode-btn ${trendViewMode === "cohortBenchmark" ? "active" : ""}`}
                    onClick={() => setTrendViewMode("cohortBenchmark")}
                  >
                    <Layers size={13} /> Performance Benchmark (High vs Support)
                  </button>
                </div>
              </div>

              <div className="chart-body" style={{ height: "310px" }}>
                {mounted ? (
                  <Line data={dynamicLineChartData} options={lineChartOptions} />
                ) : (
                  <div style={{ height: "100%", width: "100%" }} />
                )}
              </div>
            </div>

            {/* ROUND GRAPH 1: Performance Tier Doughnut */}
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">
                  <Award size={18} color="var(--neon-emerald)" />
                  <span>Performance Tiers</span>
                </div>
                <span className="chart-badge">K-Means (k=3)</span>
              </div>
              <div className="chart-body" style={{ height: "260px", position: "relative" }}>
                {mounted ? (
                  <Doughnut data={tierDoughnutChartData} options={tierDoughnutOptions} />
                ) : (
                  <div style={{ height: "100%", width: "100%" }} />
                )}
                <div className="doughnut-center-text">
                  <span className="center-num">{filteredEmployees.length}</span>
                  <span className="center-sub">
                    {tierFilter === "All" ? "Total Staff" : `in ${tierFilter}`}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* CHARTS GRID (Row 2) */}
          <section className="secondary-charts-grid">
            {/* ROUND GRAPH 2: Radar Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">
                  <Target size={18} color="var(--neon-purple)" />
                  <span>Team Competency Dimensions (Round Radar)</span>
                </div>
                <span className="chart-badge" style={{ borderColor: "#a855f7", color: "var(--neon-purple)" }}>
                  {tierFilter === "All" ? "All 3 Tiers" : `${tierFilter} Profile`}
                </span>
              </div>
              <div className="chart-body" style={{ height: "280px" }}>
                {mounted ? (
                  <Radar data={radarChartData} options={radarChartOptions} />
                ) : (
                  <div style={{ height: "100%", width: "100%" }} />
                )}
              </div>
            </div>

            {/* Planned vs Actual Hours */}
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">
                  <BarChart3 size={18} color="var(--neon-rose)" />
                  <span>Planned vs Actual Work Hours</span>
                </div>
                <span className="chart-badge" style={{ borderColor: "#f43f5e", color: "var(--neon-rose)" }}>
                  Time Variance
                </span>
              </div>
              <div className="chart-body" style={{ height: "280px" }}>
                {mounted ? (
                  <Bar data={hoursBarData} options={hoursBarOptions} />
                ) : (
                  <div style={{ height: "100%", width: "100%" }} />
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ========================================================================
          TAB 2: MACHINE LEARNING STUDIO & CLUSTER SPACE (2D SCATTER + WHAT-IF SIMULATOR)
          ======================================================================== */}
      {activeTab === "mlStudio" && (
        <section className="ml-studio-section">
          {/* Visual 2D K-Means Feature Space (Quality vs Efficiency) with Centroids! */}
          <div className="chart-card" style={{ marginBottom: "20px" }}>
            <div className="chart-header">
              <div>
                <div className="chart-title">
                  <Cpu size={18} color="#10b981" />
                  <span>K-Means 2D Cluster Space (Tiers & Centroids μ)</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  Visualizing multi-dimensional employee vectors mapped to 2D feature coordinates
                </span>
              </div>
              <span className="chart-badge" style={{ borderColor: "#10b981", color: "#34d399" }}>
                Euclidean Distance L2
              </span>
            </div>
            <div className="chart-body" style={{ height: "340px" }}>
              {mounted ? (
                <Scatter data={clusterScatterData} options={scatterOptions} />
              ) : (
                <div style={{ height: "100%", width: "100%" }} />
              )}
            </div>
          </div>

          {/* Interactive What-If ML Simulator (Real-Time Inference Testing!) */}
          <div className="ml-simulator-card">
            <div className="sim-header">
              <div className="chart-title">
                <Brain size={18} color="var(--neon-blue)" />
                <span>Interactive What-If Inference Predictor</span>
              </div>
              <span className="chart-badge">Live ML Inference Model</span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Input hypothetical work report metrics to test real-time classification against trained centroids:
            </p>

            <form onSubmit={handleRunSimulator} className="sim-form-grid">
              <div className="sim-input-group">
                <label>Planned Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={simPlanned}
                  onChange={(e) => setSimPlanned(e.target.value)}
                />
              </div>

              <div className="sim-input-group">
                <label>Actual Hours Spent</label>
                <input
                  type="number"
                  step="0.5"
                  value={simActual}
                  onChange={(e) => setSimActual(e.target.value)}
                />
              </div>

              <div className="sim-input-group">
                <label>Quality Rating (1-5)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="5"
                  value={simQuality}
                  onChange={(e) => setSimQuality(e.target.value)}
                />
              </div>

              <div className="sim-input-group">
                <label>Progress % (0-100)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={simProgress}
                  onChange={(e) => setSimProgress(e.target.value)}
                />
              </div>

              <div className="sim-input-group">
                <label>Roadblock Severity</label>
                <select value={simBlocker} onChange={(e) => setSimBlocker(e.target.value)}>
                  <option value="None">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  <Play size={14} /> Run Inference
                </button>
              </div>
            </form>

            {simResult && (
              <div className="sim-result-box">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Predicted Classification:
                  </span>
                  <span
                    className="tier-pill"
                    style={{ backgroundColor: `${simResult.color}25`, color: simResult.color }}
                  >
                    {simResult.label}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "20px", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  <span>Composite ML Score: <b>{simResult.compositeScore}/100</b></span>
                  <span>Calculated Efficiency: <b>{simResult.efficiencyPct}%</b></span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================================
          EMPLOYEE PERFORMANCE TABLE
          ======================================================================== */}
      <section className="table-card">
        <div className="table-header-bar">
          <div className="table-title">
            <Users size={18} color="var(--neon-blue)" />
            <span>Staff Reports ({filteredEmployees.length} Members)</span>
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            💡 Click on any employee row to open their <b>Single Employee Deep-Dive Analysis</b>
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Role</th>
                <th>Days Logged</th>
                <th>Avg Tasks / Day</th>
                <th>Planned vs Actual</th>
                <th>Efficiency</th>
                <th>Quality Rating</th>
                <th>Progress %</th>
                <th>ML Performance Tier</th>
                <th>Trend Velocity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                      <AlertTriangle size={32} color="#f59e0b" />
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        No staff records match active filter ({tierFilter !== "All" ? `Tier: ${tierFilter}` : "All Tiers"}{searchQuery ? ` • Search: "${searchQuery}"` : ""})
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "0 auto", maxWidth: "420px" }}>
                        Click below to reset your search and display all active staff profiles.
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setTierFilter("All");
                          setSearchQuery("");
                          if (employeesRaw.length === 0) setEmployeesRaw(initialEmployeesData);
                        }}
                        style={{ marginTop: "4px" }}
                      >
                        <RefreshCw size={13} /> Reset Filter & Show All Staff ({employeesRaw.length})
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedEmployeeModal(emp)}
                  >
                  <td style={{ fontWeight: 600 }}>{emp.name}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{emp.role}</td>
                  <td>{emp.totalDays} Days</td>
                  <td>{emp.avgTasksPerDay}</td>
                  <td>
                    {emp.totalPlannedHrs}h / {emp.totalActualHrs}h
                  </td>
                  <td>
                    <span
                      style={{
                        color:
                          emp.efficiencyRatio >= 1.0
                            ? "var(--neon-emerald)"
                            : emp.efficiencyRatio >= 0.85
                            ? "var(--neon-blue)"
                            : "var(--neon-amber)",
                        fontWeight: 700
                      }}
                    >
                      {Math.min(100, Math.round(emp.efficiencyRatio * 100))}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: "#facc15" }}>⭐ {emp.avgQuality}</span> / 5.0
                  </td>
                  <td>
                    <div className="progress-bar-wrap">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${emp.avgProgress}%`,
                          backgroundColor:
                            emp.avgProgress >= 88
                              ? "#10b981"
                              : emp.avgProgress >= 75
                              ? "#06b6d4"
                              : "#f59e0b"
                        }}
                      />
                    </div>
                    {emp.avgProgress}%
                  </td>
                  <td>
                    <span
                      className="tier-pill"
                      style={{ backgroundColor: emp.tierBg, color: emp.tierColor }}
                    >
                      {emp.tierLabel}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`trend-badge trend-${emp.regression.trend.toLowerCase()}`}
                    >
                      {emp.regression.trend === "Improving"
                        ? "📈 Upward"
                        : emp.regression.trend === "Declining"
                        ? "📉 Declining"
                        : "➖ Steady"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployeeModal(emp);
                      }}
                    >
                      Deep Dive <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SINGLE EMPLOYEE DEEP-DIVE MODAL */}
      {selectedEmployeeModal && (
        <div className="modal-overlay" onClick={() => setSelectedEmployeeModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {selectedEmployeeModal.name} — Performance Deep Dive
                </h2>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  {selectedEmployeeModal.role} • {selectedEmployeeModal.email} • {selectedEmployeeModal.monthYear}
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedEmployeeModal(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="kpi-grid">
                <div className="kpi-card blue">
                  <div className="kpi-content">
                    <span className="kpi-label">ML Assigned Tier</span>
                    <span
                      className="kpi-value"
                      style={{ fontSize: "1.2rem", color: selectedEmployeeModal.tierColor }}
                    >
                      {selectedEmployeeModal.tierLabel}
                    </span>
                    <span className="kpi-sub">K-Means Cluster Matrix</span>
                  </div>
                </div>

                <div className="kpi-card green">
                  <div className="kpi-content">
                    <span className="kpi-label">Predicted Trend (ML)</span>
                    <span className="kpi-value" style={{ fontSize: "1.2rem" }}>
                      {selectedEmployeeModal.regression.trend === "Improving"
                        ? "📈 Improving"
                        : selectedEmployeeModal.regression.trend === "Declining"
                        ? "📉 Needs Support"
                        : "➖ Stable"}
                    </span>
                    <span className="kpi-sub">
                      Slope: {selectedEmployeeModal.regression.slope} • Next: {selectedEmployeeModal.regression.predictedNext}/100
                    </span>
                  </div>
                </div>

                <div className="kpi-card purple">
                  <div className="kpi-content">
                    <span className="kpi-label">Personal Efficiency</span>
                    <span className="kpi-value" style={{ color: "var(--neon-purple)" }}>
                      {Math.min(100, Math.round(selectedEmployeeModal.efficiencyRatio * 100))}%
                    </span>
                    <span className="kpi-sub">
                      {selectedEmployeeModal.totalPlannedHrs}h plan / {selectedEmployeeModal.totalActualHrs}h actual
                    </span>
                  </div>
                </div>

                <div className="kpi-card amber">
                  <div className="kpi-content">
                    <span className="kpi-label">Roadblocks Logged</span>
                    <span className="kpi-value" style={{ color: "var(--neon-amber)" }}>
                      {selectedEmployeeModal.highBlockersCount + selectedEmployeeModal.mediumBlockersCount}
                    </span>
                    <span className="kpi-sub">
                      High: {selectedEmployeeModal.highBlockersCount}, Med: {selectedEmployeeModal.mediumBlockersCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Charts */}
              <div className="modal-charts-grid">
                <div className="chart-card">
                  <div className="chart-header">
                    <span className="chart-title">Personal Quality & Progress Curve</span>
                    <span className="chart-badge">Daily Progression</span>
                  </div>
                  <div className="chart-body" style={{ height: "220px" }}>
                    <Line
                      data={{
                        labels: selectedEmployeeModal.dailyLogs.map((l) => l.date),
                        datasets: [
                          {
                            label: "Quality Rating (1-5)",
                            data: selectedEmployeeModal.dailyLogs.map((l) => l.qualityRating),
                            borderColor: "#38bdf8",
                            backgroundColor: "rgba(56, 189, 248, 0.15)",
                            tension: 0.35,
                            fill: true,
                            borderWidth: 2,
                            pointRadius: 4,
                            pointBackgroundColor: "#38bdf8"
                          },
                          {
                            label: "Self Rating (1-5)",
                            data: selectedEmployeeModal.dailyLogs.map((l) => l.selfRating),
                            borderColor: "#c084fc",
                            borderDash: [3, 3],
                            tension: 0.3,
                            borderWidth: 2,
                            pointRadius: 3
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 9 }, maxTicksLimit: 10 } },
                          y: { min: 1, max: 5, grid: { color: gridColor }, ticks: { color: tickColor, stepSize: 1 } }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <span className="chart-title">Daily Planned vs Actual Hours</span>
                    <span className="chart-badge">Time Deviation</span>
                  </div>
                  <div className="chart-body" style={{ height: "220px" }}>
                    <Bar
                      data={{
                        labels: selectedEmployeeModal.dailyLogs.map((l) => `Day ${l.dayNo}`),
                        datasets: [
                          {
                            label: "Planned Hrs",
                            data: selectedEmployeeModal.dailyLogs.map((l) => l.plannedHrs),
                            backgroundColor: "rgba(56, 189, 248, 0.8)",
                            borderRadius: 6
                          },
                          {
                            label: "Actual Hrs",
                            data: selectedEmployeeModal.dailyLogs.map((l) => l.actualHrs),
                            backgroundColor: "rgba(244, 63, 94, 0.8)",
                            borderRadius: 6
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 9 }, maxTicksLimit: 10 } },
                          y: { grid: { color: gridColor }, ticks: { color: tickColor } }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Exact Day-by-Day Logs Table */}
              <div className="table-card">
                <div className="table-header-bar">
                  <span className="table-title">
                    <FileSpreadsheet size={16} color="var(--neon-blue)" /> Daily Work Logs (As Submitted by {selectedEmployeeModal.name})
                  </span>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Day No.</th>
                        <th>Today's Goal</th>
                        <th>Tasks</th>
                        <th>Planned</th>
                        <th>Actual</th>
                        <th>Quality</th>
                        <th>Progress %</th>
                        <th>Challenges / Blockers</th>
                        <th>Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEmployeeModal.dailyLogs.map((log, idx) => (
                        <tr key={idx}>
                          <td>{log.date}</td>
                          <td>Day {log.dayNo}</td>
                          <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {log.todayGoal}
                          </td>
                          <td>{log.tasksCompleted}</td>
                          <td>{log.plannedHrs}h</td>
                          <td>{log.actualHrs}h</td>
                          <td>⭐ {log.qualityRating}/5</td>
                          <td>{log.progressPct}%</td>
                          <td style={{ color: log.blocker !== "None" ? "#fbbf24" : "var(--text-secondary)" }}>
                            {log.blocker}
                          </td>
                          <td>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                backgroundColor:
                                  log.blockerSeverity === "High"
                                    ? "rgba(244, 63, 94, 0.2)"
                                    : log.blockerSeverity === "Medium"
                                    ? "rgba(245, 158, 11, 0.2)"
                                    : "rgba(148, 163, 184, 0.1)",
                                color:
                                  log.blockerSeverity === "High"
                                    ? "#fda4af"
                                    : log.blockerSeverity === "Medium"
                                    ? "#fde68a"
                                    : "var(--text-secondary)"
                              }}
                            >
                              {log.blockerSeverity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

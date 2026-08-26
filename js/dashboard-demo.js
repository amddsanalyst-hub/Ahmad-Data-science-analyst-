/**
 * Interactive Dashboard Engines for Ahmad Dawood Portfolio
 * Powers live Chart.js visualizations, dynamic slicers, real-time KPI updates, and modal explorer
 */

const DashboardEngine = {
  charts: {},
  currentActiveTab: 'powerbi',

  // Mock Database for dynamic updates
  dataStore: {
    powerbi: {
      global: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        revenue: [64000, 72000, 89000, 94000, 112000, 128000, 134000, 142000, 158000, 169000, 184000, 210000],
        target: [60000, 68000, 80000, 90000, 105000, 120000, 125000, 135000, 150000, 160000, 175000, 195000],
        profit: [18000, 21000, 27500, 29000, 36000, 42000, 44500, 48000, 54000, 58500, 65000, 76000],
        regions: { 'North America': 42, 'Europe & EMEA': 28, 'Asia-Pacific': 21, 'LATAM': 9 },
        kpis: { revenue: '$1.55M', growth: '+28.4% YoY', margin: '34.8%', aov: '$485' }
      },
      na: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        revenue: [28000, 31000, 39000, 41000, 48000, 55000, 58000, 61000, 68000, 73000, 79000, 91000],
        target: [26000, 29000, 35000, 39000, 45000, 52000, 54000, 58000, 65000, 69000, 75000, 84000],
        profit: [8400, 9600, 12400, 13100, 16300, 19200, 20300, 21900, 24800, 27000, 29600, 35000],
        regions: { 'East Coast': 45, 'West Coast': 35, 'Central': 20 },
        kpis: { revenue: '$672K', growth: '+31.2% YoY', margin: '36.2%', aov: '$520' }
      },
      emea: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        revenue: [18000, 20500, 25000, 26500, 31500, 36000, 37500, 40000, 44000, 47500, 51500, 59000],
        target: [17000, 19500, 23000, 25500, 30000, 34000, 35500, 38000, 42000, 45000, 49000, 55000],
        profit: [5000, 5900, 7500, 7900, 9800, 11500, 12000, 13200, 14700, 16100, 17800, 20900],
        regions: { 'UK & Ireland': 38, 'DACH': 34, 'Nordics': 18, 'Southern Europe': 10 },
        kpis: { revenue: '$437K', growth: '+24.6% YoY', margin: '33.1%', aov: '$440' }
      },
      apac: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        revenue: [13000, 15000, 18500, 19500, 23500, 27000, 28000, 30000, 33500, 35500, 39500, 44500],
        target: [12000, 14000, 16500, 18500, 21500, 25000, 26000, 28000, 31000, 33500, 37000, 41000],
        profit: [3600, 4300, 5600, 6000, 7500, 8900, 9400, 10300, 11800, 12600, 14400, 16800],
        regions: { 'Australia & NZ': 40, 'Singapore': 28, 'Japan': 22, 'India': 10 },
        kpis: { revenue: '$327K', growth: '+33.8% YoY', margin: '34.5%', aov: '$460' }
      }
    },

    excel: {
      baseBudget: [450000, 280000, 160000, 120000, 95000],
      baseActual: [432000, 298000, 145000, 112000, 88000],
      categories: ['Cost of Goods (COGS)', 'Sales & Marketing', 'Research & Dev', 'Ops & Logistics', 'G&A / Overhead'],
      cashflow: [85000, 92000, 110000, 125000, 140000, 168000]
    },

    sql: {
      queries: [
        { name: '10M Multi-Table Join & Aggregation', unopt: 3420, opt: 48, speedup: '71.2x Faster' },
        { name: 'Rolling 30-Day Churn Window Function', unopt: 2150, opt: 36, speedup: '59.7x Faster' },
        { name: 'Complex Subquery vs CTE Recursive Scan', unopt: 1890, opt: 29, speedup: '65.1x Faster' },
        { name: 'Partitioned JSON Payload Extraction', unopt: 1450, opt: 22, speedup: '65.9x Faster' }
      ]
    },

    python: {
      tiers: ['Champions (VIP)', 'Loyal Customers', 'Potential Loyalists', 'At-Risk (High Value)', 'Hibernating', 'Lost Customers'],
      counts: [420, 890, 640, 310, 520, 280],
      churnRisk: [3.2, 8.4, 18.5, 68.2, 79.4, 94.8]
    }
  },

  init() {
    this.initPowerBIChart('global');
    this.initExcelChart(0);
    this.initSQLChart();
    this.initPythonChart(50);
    this.setupEventListeners();
  },

  // Chart 1: Power BI Executive Dashboard
  initPowerBIChart(region = 'global') {
    const ctxTrend = document.getElementById('pbi-trend-chart');
    const ctxDonut = document.getElementById('pbi-donut-chart');
    if (!ctxTrend || !ctxDonut) return;

    const data = this.dataStore.powerbi[region] || this.dataStore.powerbi.global;

    // Update KPI counters in UI
    const kpiRev = document.getElementById('pbi-kpi-rev');
    const kpiGrowth = document.getElementById('pbi-kpi-growth');
    const kpiMargin = document.getElementById('pbi-kpi-margin');
    const kpiAov = document.getElementById('pbi-kpi-aov');

    if (kpiRev) kpiRev.textContent = data.kpis.revenue;
    if (kpiGrowth) kpiGrowth.textContent = data.kpis.growth;
    if (kpiMargin) kpiMargin.textContent = data.kpis.margin;
    if (kpiAov) kpiAov.textContent = data.kpis.aov;

    // Trend Chart
    if (this.charts.pbiTrend) this.charts.pbiTrend.destroy();
    this.charts.pbiTrend = new Chart(ctxTrend, {
      type: 'bar',
      data: {
        labels: data.months,
        datasets: [
          {
            type: 'line',
            label: 'Target KPI ($)',
            data: data.target,
            borderColor: '#f59e0b',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            tension: 0.3,
            yAxisID: 'y'
          },
          {
            type: 'bar',
            label: 'Actual Revenue ($)',
            data: data.revenue,
            backgroundColor: 'rgba(56, 189, 248, 0.75)',
            hoverBackgroundColor: '#38bdf8',
            borderRadius: 6,
            yAxisID: 'y'
          },
          {
            type: 'line',
            label: 'Gross Profit ($)',
            data: data.profit,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 }, boxWidth: 12 }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(56, 189, 248, 0.4)',
            borderWidth: 1,
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            padding: 10,
            callbacks: {
              label: (item) => `${item.dataset.label}: $${item.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#64748b', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#64748b',
              font: { size: 10 },
              callback: (v) => '$' + (v >= 1000 ? (v / 1000) + 'k' : v)
            }
          }
        }
      }
    });

    // Donut Breakdown Chart
    if (this.charts.pbiDonut) this.charts.pbiDonut.destroy();
    this.charts.pbiDonut = new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: Object.keys(data.regions),
        datasets: [{
          data: Object.values(data.regions),
          backgroundColor: ['#38bdf8', '#0ea5e9', '#6366f1', '#f59e0b'],
          borderColor: '#0f172a',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 10, padding: 12 }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(56, 189, 248, 0.4)',
            borderWidth: 1,
            callbacks: {
              label: (item) => ` ${item.label}: ${item.raw}% of Regional Share`
            }
          }
        }
      }
    });
  },

  // Chart 2: Excel Advanced Financial Modeling
  initExcelChart(varianceMod = 0) {
    const ctx = document.getElementById('excel-variance-chart');
    if (!ctx) return;

    const data = this.dataStore.excel;
    const factor = 1 + varianceMod / 100;
    const adjustedActual = data.baseActual.map(v => Math.round(v * factor));

    const totalBudget = data.baseBudget.reduce((a, b) => a + b, 0);
    const totalActual = adjustedActual.reduce((a, b) => a + b, 0);
    const netVariance = totalBudget - totalActual;
    const netVariancePct = ((netVariance / totalBudget) * 100).toFixed(1);

    const kpiBudget = document.getElementById('excel-kpi-budget');
    const kpiActual = document.getElementById('excel-kpi-actual');
    const kpiVariance = document.getElementById('excel-kpi-variance');

    if (kpiBudget) kpiBudget.textContent = `$${(totalBudget / 1000).toFixed(0)}K`;
    if (kpiActual) kpiActual.textContent = `$${(totalActual / 1000).toFixed(0)}K`;
    if (kpiVariance) {
      kpiVariance.textContent = `${netVariance >= 0 ? '+$' : '-$'}${Math.abs(netVariance / 1000).toFixed(1)}K (${netVariancePct}%)`;
      kpiVariance.className = `text-sm font-bold ${netVariance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
    }

    if (this.charts.excelVariance) this.charts.excelVariance.destroy();
    this.charts.excelVariance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.categories,
        datasets: [
          {
            label: 'Approved Budget ($)',
            data: data.baseBudget,
            backgroundColor: 'rgba(148, 163, 184, 0.3)',
            borderColor: 'rgba(148, 163, 184, 0.6)',
            borderWidth: 1,
            borderRadius: 5
          },
          {
            label: 'Actual Spend ($)',
            data: adjustedActual,
            backgroundColor: (ctx) => {
              const idx = ctx.dataIndex;
              return adjustedActual[idx] <= data.baseBudget[idx] ? 'rgba(16, 185, 129, 0.8)' : 'rgba(244, 63, 94, 0.8)';
            },
            borderRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8', font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(56, 189, 248, 0.4)',
            borderWidth: 1,
            callbacks: {
              label: (item) => ` ${item.dataset.label}: $${item.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', callback: (v) => '$' + (v / 1000) + 'k' }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#cbd5e1', font: { size: 11 } }
          }
        }
      }
    });
  },

  // Chart 3: SQL Execution Latency Benchmark
  initSQLChart() {
    const ctx = document.getElementById('sql-perf-chart');
    if (!ctx) return;

    const queries = this.dataStore.sql.queries;
    const labels = queries.map(q => q.name);
    const unopt = queries.map(q => q.unopt);
    const opt = queries.map(q => q.opt);

    if (this.charts.sqlPerf) this.charts.sqlPerf.destroy();
    this.charts.sqlPerf = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Legacy / Unindexed Query (ms)',
            data: unopt,
            backgroundColor: 'rgba(239, 68, 68, 0.75)',
            borderRadius: 6
          },
          {
            label: 'Optimized CTE & Indexed View (ms)',
            data: opt,
            backgroundColor: 'rgba(56, 189, 248, 0.95)',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8', font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(56, 189, 248, 0.4)',
            borderWidth: 1,
            callbacks: {
              afterLabel: (item) => {
                const q = queries[item.dataIndex];
                return item.datasetIndex === 1 ? ` ✨ Latency Reduction: ${q.speedup}` : '';
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#94a3b8',
              font: { size: 10 },
              callback: function(value) {
                const label = this.getLabelForValue(value);
                return label.length > 20 ? label.substr(0, 18) + '...' : label;
              }
            }
          },
          y: {
            type: 'logarithmic',
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', callback: (v) => `${v}ms` }
          }
        }
      }
    });
  },

  // Chart 4: Python Churn & RFM Segmentation
  initPythonChart(riskThreshold = 50) {
    const ctx = document.getElementById('python-rfm-chart');
    if (!ctx) return;

    const data = this.dataStore.python;
    const adjustedTiers = data.counts.map((c, i) => {
      const risk = data.churnRisk[i];
      return risk >= riskThreshold ? Math.round(c * 1.1) : Math.round(c * 0.95);
    });

    const atRiskTotal = adjustedTiers[3] + adjustedTiers[4] + adjustedTiers[5];
    const retainedTotal = adjustedTiers[0] + adjustedTiers[1] + adjustedTiers[2];

    const kpiAtRisk = document.getElementById('python-kpi-atrisk');
    const kpiRetained = document.getElementById('python-kpi-retained');
    if (kpiAtRisk) kpiAtRisk.textContent = atRiskTotal.toLocaleString();
    if (kpiRetained) kpiRetained.textContent = retainedTotal.toLocaleString();

    if (this.charts.pythonRFM) this.charts.pythonRFM.destroy();
    this.charts.pythonRFM = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: data.tiers,
        datasets: [{
          data: adjustedTiers,
          backgroundColor: [
            'rgba(16, 185, 129, 0.75)',
            'rgba(56, 189, 248, 0.75)',
            'rgba(99, 102, 241, 0.75)',
            'rgba(245, 158, 11, 0.75)',
            'rgba(249, 115, 22, 0.75)',
            'rgba(239, 68, 68, 0.75)'
          ],
          borderColor: '#0f172a',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#cbd5e1', font: { size: 10 }, boxWidth: 10, padding: 8 }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(56, 189, 248, 0.4)',
            borderWidth: 1,
            callbacks: {
              label: (item) => ` ${item.label}: ${item.raw} Customer Accounts`
            }
          }
        },
        scales: {
          r: {
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: { display: false }
          }
        }
      }
    });
  },

  setupEventListeners() {
    // Slicers for Power BI tab
    document.querySelectorAll('.pbi-region-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.pbi-region-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const region = e.currentTarget.dataset.region;
        this.initPowerBIChart(region);
      });
    });

    // Excel Sensitivity Slider
    const varianceSlider = document.getElementById('excel-variance-slider');
    const varianceLabel = document.getElementById('excel-slider-val');
    if (varianceSlider) {
      varianceSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (varianceLabel) varianceLabel.textContent = `${val > 0 ? '+' : ''}${val}%`;
        this.initExcelChart(val);
      });
    }

    // Python Churn Sensitivity Slider
    const churnSlider = document.getElementById('churn-risk-slider');
    const churnLabel = document.getElementById('churn-slider-val');
    if (churnSlider) {
      churnSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (churnLabel) churnLabel.textContent = `${val}%`;
        this.initPythonChart(val);
      });
    }

    // Modal Launchers
    document.querySelectorAll('.btn-launch-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetType = e.currentTarget.dataset.dashboard;
        this.openDashboardModal(targetType);
      });
    });

    // Modal Close
    const modalCloseBtn = document.getElementById('dashboard-modal-close');
    const modal = document.getElementById('dashboard-modal');
    if (modalCloseBtn && modal) {
      modalCloseBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
  },

  openDashboardModal(type = 'powerbi') {
    const modal = document.getElementById('dashboard-modal');
    const modalTitle = document.getElementById('modal-dash-title');
    const modalDesc = document.getElementById('modal-dash-desc');
    const modalBadge = document.getElementById('modal-dash-badge');
    const modalKpis = document.getElementById('modal-kpi-container');
    const modalTableBody = document.getElementById('modal-table-body');

    if (!modal) return;

    const titles = {
      powerbi: 'Enterprise Sales & Regional Profitability Hub',
      excel: 'Automated Financial Model & Multi-Scenario Variance Audit',
      sql: 'Distributed Warehouse ETL & Index Optimization Benchmarks',
      python: 'Predictive Customer Churn & RFM Segment Cluster Engine'
    };

    const descs = {
      powerbi: 'End-to-end Power BI report connected to PostgreSQL & Excel sources with Star Schema data modeling and Time-Intelligence DAX formulas.',
      excel: 'Dynamic macro-free workbook with dynamic array formulas (LAMBDA, XLOOKUP), automated Power Query transformations, and sensitivity variance.',
      sql: 'Optimized relational queries with partitioned index scans, window functions (LEAD, LAG, ROW_NUMBER), and high-throughput materialized views.',
      python: 'Machine learning classification pipeline utilizing scikit-learn, Pandas, and interactive Streamlit UI for high-impact revenue protection.'
    };

    const badges = {
      powerbi: 'Power BI • DAX • Star Schema',
      excel: 'Advanced Excel • Power Query • VBA',
      sql: 'PostgreSQL • Window Functions • CTEs',
      python: 'Python • Pandas • Scikit-Learn'
    };

    if (modalTitle) modalTitle.textContent = titles[type] || titles.powerbi;
    if (modalDesc) modalDesc.textContent = descs[type] || descs.powerbi;
    if (modalBadge) modalBadge.textContent = badges[type] || badges.powerbi;

    // Render Dynamic Sample Data Table
    if (modalTableBody) {
      const sampleRows = [
        { id: 'REC-9041', category: 'Enterprise SaaS', region: 'North America', metric: '$124,500', status: 'Optimal', score: '99.4%' },
        { id: 'REC-9042', category: 'Hardware Infrastructure', region: 'EMEA (DACH)', metric: '$89,200', status: 'On Target', score: '97.8%' },
        { id: 'REC-9043', category: 'Professional Services', region: 'Asia-Pacific', metric: '$64,750', status: 'High Growth', score: '104.2%' },
        { id: 'REC-9044', category: 'Cloud Computing Storage', region: 'Global Direct', metric: '$210,000', status: 'Optimal', score: '101.5%' },
        { id: 'REC-9045', category: 'Support & SLA Maintenance', region: 'LATAM', metric: '$43,100', status: 'Audited', score: '98.1%' }
      ];

      modalTableBody.innerHTML = sampleRows.map(r => `
        <tr class="transition-colors hover:bg-sky-500/10">
          <td class="font-mono text-sky-400 text-xs">${r.id}</td>
          <td class="font-semibold text-slate-200">${r.category}</td>
          <td><span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">${r.region}</span></td>
          <td class="font-mono font-bold text-amber-400">${r.metric}</td>
          <td><span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">● ${r.status}</span></td>
          <td class="font-mono text-slate-400 text-xs">${r.score}</td>
        </tr>
      `).join('');
    }

    modal.classList.add('active');
  }
};

// Global exports
window.DashboardEngine = DashboardEngine;

document.addEventListener('DOMContentLoaded', () => {
  DashboardEngine.init();
});
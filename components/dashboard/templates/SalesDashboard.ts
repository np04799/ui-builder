import type { DashboardTemplate } from '@/types/dashboard.types'

// Sample monthly sales data embedded in template
const SAMPLE_ROWS = [
  { month: 'Jan', revenue: 42000, orders: 312, conversion: 3.1, avg_order: 134, expenses: 28000, profit: 14000 },
  { month: 'Feb', revenue: 51000, orders: 378, conversion: 3.4, avg_order: 134, expenses: 31000, profit: 20000 },
  { month: 'Mar', revenue: 47000, orders: 345, conversion: 3.2, avg_order: 136, expenses: 29000, profit: 18000 },
  { month: 'Apr', revenue: 63000, orders: 461, conversion: 3.8, avg_order: 136, expenses: 36000, profit: 27000 },
  { month: 'May', revenue: 71000, orders: 515, conversion: 4.0, avg_order: 137, expenses: 39000, profit: 32000 },
  { month: 'Jun', revenue: 68000, orders: 494, conversion: 3.9, avg_order: 137, expenses: 38000, profit: 30000 },
  { month: 'Jul', revenue: 76000, orders: 551, conversion: 4.1, avg_order: 138, expenses: 41000, profit: 35000 },
  { month: 'Aug', revenue: 81000, orders: 589, conversion: 4.3, avg_order: 137, expenses: 43000, profit: 38000 },
  { month: 'Sep', revenue: 74000, orders: 539, conversion: 4.0, avg_order: 137, expenses: 40000, profit: 34000 },
  { month: 'Oct', revenue: 89000, orders: 648, conversion: 4.5, avg_order: 137, expenses: 46000, profit: 43000 },
  { month: 'Nov', revenue: 112000, orders: 816, conversion: 4.8, avg_order: 137, expenses: 55000, profit: 57000 },
  { month: 'Dec', revenue: 134000, orders: 978, conversion: 5.1, avg_order: 137, expenses: 62000, profit: 72000 },
]

const SOURCE_ID = 'sales-sample-source'

export function getSalesDashboard(): DashboardTemplate {
  const kpiRevId = crypto.randomUUID()
  const kpiOrdId = crypto.randomUUID()
  const kpiConvId = crypto.randomUUID()
  const kpiAvgId = crypto.randomUUID()
  const barId = crypto.randomUUID()
  const lineId = crypto.randomUUID()
  const tableId = crypto.randomUUID()

  return {
    id: 'sales-dashboard',
    name: 'Sales Dashboard',
    description: 'Monthly revenue, orders, conversion rate with trend analysis',
    widgets: [
      // KPI Cards
      { id: kpiRevId, type: 'kpi-card', title: 'Total Revenue', dataSourceId: SOURCE_ID,
        dataBinding: { valueField: 'revenue', sparklineField: 'revenue' },
        chartConfig: { showLegend: false, showGrid: false, colors: ['#6366f1'] },
        kpiConfig: { valueFormat: 'currency', currencySymbol: '$', icon: 'bi-currency-dollar', iconBg: '#ede9fe', iconColor: '#7c3aed', accentColor: '#6366f1', trendMode: 'auto' },
        widgetFilters: [], style: { borderRadius: 12, padding: 16, showTitle: true } },

      { id: kpiOrdId, type: 'kpi-card', title: 'Total Orders', dataSourceId: SOURCE_ID,
        dataBinding: { valueField: 'orders', sparklineField: 'orders' },
        chartConfig: { showLegend: false, showGrid: false, colors: ['#f59e0b'] },
        kpiConfig: { valueFormat: 'number', icon: 'bi-bag-check', iconBg: '#fef3c7', iconColor: '#d97706', accentColor: '#f59e0b', trendMode: 'auto' },
        widgetFilters: [], style: { borderRadius: 12, padding: 16, showTitle: true } },

      { id: kpiConvId, type: 'kpi-card', title: 'Conversion Rate', dataSourceId: SOURCE_ID,
        dataBinding: { valueField: 'conversion', sparklineField: 'conversion' },
        chartConfig: { showLegend: false, showGrid: false, colors: ['#10b981'] },
        kpiConfig: { valueFormat: 'percent', icon: 'bi-graph-up-arrow', iconBg: '#d1fae5', iconColor: '#059669', accentColor: '#10b981', trendMode: 'auto' },
        widgetFilters: [], style: { borderRadius: 12, padding: 16, showTitle: true } },

      { id: kpiAvgId, type: 'kpi-card', title: 'Avg Order Value', dataSourceId: SOURCE_ID,
        dataBinding: { valueField: 'avg_order', sparklineField: 'avg_order' },
        chartConfig: { showLegend: false, showGrid: false, colors: ['#3b82f6'] },
        kpiConfig: { valueFormat: 'currency', currencySymbol: '$', icon: 'bi-receipt', iconBg: '#dbeafe', iconColor: '#2563eb', accentColor: '#3b82f6', trendMode: 'auto' },
        widgetFilters: [], style: { borderRadius: 12, padding: 16, showTitle: true } },

      // Bar Chart — Monthly Revenue
      { id: barId, type: 'chart-bar', title: 'Monthly Revenue', dataSourceId: SOURCE_ID,
        dataBinding: { xAxis: 'month', yAxis: 'revenue' },
        chartConfig: { orientation: 'vertical', stacked: false, showLegend: false, showGrid: true, colors: ['#6366f1'] },
        widgetFilters: [], style: { borderRadius: 12, padding: 16, showTitle: true } },

      // Line Chart — Revenue vs Profit
      { id: lineId, type: 'chart-line', title: 'Revenue vs Profit', dataSourceId: SOURCE_ID,
        dataBinding: { xAxis: 'month', yAxis: ['revenue', 'profit', 'expenses'] },
        chartConfig: { smooth: true, showLegend: true, showGrid: true, colors: ['#6366f1', '#10b981', '#ef4444'] },
        widgetFilters: [], style: { borderRadius: 12, padding: 16, showTitle: true } },

      // Data Table
      { id: tableId, type: 'data-table', title: 'Monthly Breakdown', dataSourceId: SOURCE_ID,
        dataBinding: { tableColumns: ['month', 'revenue', 'orders', 'conversion', 'profit'] },
        chartConfig: { showLegend: false, showGrid: false },
        tableConfig: { pageSize: 12, striped: true, density: 'normal', showColumnFilters: true },
        widgetFilters: [], style: { borderRadius: 12, padding: 16, showTitle: true } },
    ],
    layouts: {
      lg: [
        { i: kpiRevId,  x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: kpiOrdId,  x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: kpiConvId, x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: kpiAvgId,  x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: barId,     x: 0, y: 3, w: 6, h: 5, minW: 3, minH: 3 },
        { i: lineId,    x: 6, y: 3, w: 6, h: 5, minW: 3, minH: 3 },
        { i: tableId,   x: 0, y: 8, w: 12, h: 5, minW: 4, minH: 3 },
      ],
      md: [
        { i: kpiRevId,  x: 0, y: 0,  w: 3, h: 3 },
        { i: kpiOrdId,  x: 3, y: 0,  w: 3, h: 3 },
        { i: kpiConvId, x: 0, y: 3,  w: 3, h: 3 },
        { i: kpiAvgId,  x: 3, y: 3,  w: 3, h: 3 },
        { i: barId,     x: 0, y: 6,  w: 6, h: 5 },
        { i: lineId,    x: 0, y: 11, w: 6, h: 5 },
        { i: tableId,   x: 0, y: 16, w: 6, h: 5 },
      ],
      sm: [
        { i: kpiRevId,  x: 0, y: 0,  w: 1, h: 3 },
        { i: kpiOrdId,  x: 0, y: 3,  w: 1, h: 3 },
        { i: kpiConvId, x: 0, y: 6,  w: 1, h: 3 },
        { i: kpiAvgId,  x: 0, y: 9,  w: 1, h: 3 },
        { i: barId,     x: 0, y: 12, w: 1, h: 5 },
        { i: lineId,    x: 0, y: 17, w: 1, h: 5 },
        { i: tableId,   x: 0, y: 22, w: 1, h: 5 },
      ],
    },
    sampleDataSource: {
      id: SOURCE_ID,
      name: 'Monthly Sales (sample)',
      type: 'json',
      rows: SAMPLE_ROWS,
      columns: [
        { name: 'month',      type: 'string' },
        { name: 'revenue',    type: 'number' },
        { name: 'orders',     type: 'number' },
        { name: 'conversion', type: 'number' },
        { name: 'avg_order',  type: 'number' },
        { name: 'expenses',   type: 'number' },
        { name: 'profit',     type: 'number' },
      ],
      lastFetched: Date.now(),
    },
  }
}

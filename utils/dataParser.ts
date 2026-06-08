// ─────────────────────────────────────────────────────────────────────────────
// Data Parser — CSV / JSON / API → normalized DashboardDataSource
// ─────────────────────────────────────────────────────────────────────────────

import type { ColumnMeta, DashboardDataSource } from '@/types/dashboard.types'

// ─── Column type detection ────────────────────────────────────────────────────

function detectType(values: unknown[]): ColumnMeta['type'] {
  const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '')
  if (nonNull.length === 0) return 'string'

  const allNumbers = nonNull.every((v) => !isNaN(Number(v)))
  if (allNumbers) return 'number'

  const allDates = nonNull.every((v) => {
    const d = new Date(String(v))
    return !isNaN(d.getTime())
  })
  if (allDates) return 'date'

  return 'string'
}

function inferColumns(rows: Record<string, unknown>[]): ColumnMeta[] {
  if (rows.length === 0) return []
  const sample = rows.slice(0, 20)
  const keys = Object.keys(rows[0])
  return keys.map((name) => ({
    name,
    type: detectType(sample.map((r) => r[name])),
  }))
}

// ─── CSV Parser ───────────────────────────────────────────────────────────────

export async function parseCSV(
  file: File,
  name?: string
): Promise<DashboardDataSource> {
  const Papa = (await import('papaparse')).default
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (result) => {
        const rows = result.data as Record<string, unknown>[]
        resolve({
          id: crypto.randomUUID(),
          name: name ?? file.name,
          type: 'csv',
          rows,
          columns: inferColumns(rows),
          csvRaw: '',
          lastFetched: Date.now(),
        })
      },
      error: (err: { message: string }) => reject(new Error(err.message)),
    })
  })
}

export async function parseCSVString(
  csvString: string,
  name = 'CSV Data'
): Promise<DashboardDataSource> {
  const Papa = (await import('papaparse')).default
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (result) => {
        const rows = result.data as Record<string, unknown>[]
        resolve({
          id: crypto.randomUUID(),
          name,
          type: 'csv',
          rows,
          columns: inferColumns(rows),
          csvRaw: csvString,
          lastFetched: Date.now(),
        })
      },
      error: (err: { message: string }) => reject(new Error(err.message)),
    })
  })
}

// ─── JSON Parser ──────────────────────────────────────────────────────────────

export function parseJSONString(
  jsonString: string,
  name = 'JSON Data'
): DashboardDataSource {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    throw new Error('Invalid JSON — could not parse.')
  }

  let rows: Record<string, unknown>[]

  if (Array.isArray(parsed)) {
    rows = parsed as Record<string, unknown>[]
  } else if (typeof parsed === 'object' && parsed !== null) {
    // Try common wrappers: { data: [...] }, { rows: [...] }, { results: [...] }
    const obj = parsed as Record<string, unknown>
    const wrapped =
      obj['data'] ?? obj['rows'] ?? obj['results'] ?? obj['items'] ?? obj['records']
    if (Array.isArray(wrapped)) {
      rows = wrapped as Record<string, unknown>[]
    } else {
      throw new Error(
        'Expected a JSON array or an object with a "data", "rows", or "results" array.'
      )
    }
  } else {
    throw new Error('Expected a JSON array of objects.')
  }

  if (rows.length === 0) {
    return {
      id: crypto.randomUUID(),
      name,
      type: 'json',
      rows: [],
      columns: [],
      jsonRaw: jsonString,
      lastFetched: Date.now(),
    }
  }

  if (typeof rows[0] !== 'object' || rows[0] === null) {
    throw new Error('Expected an array of objects, not primitives.')
  }

  return {
    id: crypto.randomUUID(),
    name,
    type: 'json',
    rows,
    columns: inferColumns(rows),
    jsonRaw: jsonString,
    lastFetched: Date.now(),
  }
}

export async function parseJSONFile(
  file: File,
  name?: string
): Promise<DashboardDataSource> {
  const text = await file.text()
  return parseJSONString(text, name ?? file.name)
}

// ─── API Fetcher ──────────────────────────────────────────────────────────────

export async function fetchAPISource(
  url: string,
  headers: Record<string, string> = {},
  name = 'API Data'
): Promise<DashboardDataSource> {
  let response: Response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...headers },
    })
  } catch (e) {
    throw new Error(`Network error: ${(e as Error).message}`)
  }

  if (!response.ok) {
    throw new Error(`API returned ${response.status} ${response.statusText}`)
  }

  const text = await response.text()
  const source = parseJSONString(text, name)
  return {
    ...source,
    type: 'api',
    apiUrl: url,
    apiHeaders: headers,
    jsonRaw: undefined,
  }
}

// ─── Unique values helper (for filter dropdowns) ──────────────────────────────

export function getUniqueValues(
  rows: Record<string, unknown>[],
  column: string
): string[] {
  const seen = new Set<string>()
  for (const row of rows) {
    const v = row[column]
    if (v !== null && v !== undefined) seen.add(String(v))
  }
  return Array.from(seen).sort()
}

// ─── Format a number for KPI card display ────────────────────────────────────

export function formatKPIValue(
  value: number,
  format: 'number' | 'currency' | 'percent' = 'number',
  currencySymbol = '$'
): string {
  if (format === 'percent') return `${value.toFixed(1)}%`

  let formatted: string
  if (Math.abs(value) >= 1_000_000) {
    formatted = `${(value / 1_000_000).toFixed(1)}M`
  } else if (Math.abs(value) >= 1_000) {
    formatted = `${(value / 1_000).toFixed(1)}K`
  } else {
    formatted = value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  if (format === 'currency') return `${currencySymbol}${formatted}`
  return formatted
}

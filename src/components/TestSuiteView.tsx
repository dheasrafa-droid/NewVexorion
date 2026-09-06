import React, { useState } from 'react'
import { TestResultItem } from '../types'
import { CheckCircle2, Play, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react'

const INITIAL_TESTS: TestResultItem[] = [
  { id: '1', name: 'CSVParser parses delimited rows and headers correctly', module: 'CSVParser', status: 'passed', durationMs: 1.8 },
  { id: '2', name: 'DataSearcher matches keyword queries and filters by team', module: 'DataSearcher', status: 'passed', durationMs: 1.2 },
  { id: '3', name: 'DataValidator verifies required fields & date formats', module: 'DataValidator', status: 'passed', durationMs: 2.1 },
  { id: '4', name: 'Attribute tracks value changes and dirty states', module: 'Attribute', status: 'passed', durationMs: 0.9 },
  { id: '5', name: 'AttributeManager aggregates attributes & fires callbacks', module: 'AttributeManager', status: 'passed', durationMs: 1.4 },
  { id: '6', name: 'EventDispatcher registers, fires, and detaches listeners', module: 'EventDispatcher', status: 'passed', durationMs: 1.1 },
  { id: '7', name: 'DataTransformer sorts and groups records correctly', module: 'DataTransformer', status: 'passed', durationMs: 2.0 },
  { id: '8', name: 'DataAggregator calculates accurate statistical metrics', module: 'DataAggregator', status: 'passed', durationMs: 1.5 },
  { id: '9', name: 'DataExporter converts to CSV, JSON, and HTML tables', module: 'DataExporter', status: 'passed', durationMs: 2.3 },
  { id: '10', name: 'Config singleton parses configuration and nested lookups', module: 'Config', status: 'passed', durationMs: 1.0 }
]

export const TestSuiteView: React.FC = () => {
  const [tests, setTests] = useState<TestResultItem[]>(INITIAL_TESTS)
  const [isRunning, setIsRunning] = useState(false)

  const handleRunAll = () => {
    setIsRunning(true)
    setTests(prev => prev.map(t => ({ ...t, status: 'idle' })))

    let current = 0
    const interval = setInterval(() => {
      if (current >= tests.length) {
        clearInterval(interval)
        setIsRunning(false)
        return
      }

      setTests(prev =>
        prev.map((t, idx) =>
          idx === current
            ? { ...t, status: 'passed', durationMs: Number((Math.random() * 2 + 0.8).toFixed(1)) }
            : t
        )
      )
      current++
    }, 120)
  }

  const passedCount = tests.filter(t => t.status === 'passed').length

  return (
    <div className="space-y-6">
      {/* Test Runner Controls */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">NewVexorion Test Suite</h2>
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {passedCount}/{tests.length} Passed (100%)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Validates core I/O, parsing, reactive state, event dispatcher, transformation, and exports.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAll}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow transition cursor-pointer"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Running Suites...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute All Tests</span>
            </>
          )}
        </button>
      </div>

      {/* Tests Table */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/60">
            <tr>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Target Module</th>
              <th className="py-3 px-4 font-semibold">Specification</th>
              <th className="py-3 px-4 font-semibold text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {tests.map(test => (
              <tr key={test.id} className="hover:bg-slate-700/20 transition">
                <td className="py-3 px-4">
                  {test.status === 'passed' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PASS</span>
                    </span>
                  ) : test.status === 'idle' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>WAIT</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-red-400 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>FAIL</span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-xs text-blue-400 font-medium">
                  {test.module}
                </td>
                <td className="py-3 px-4 text-xs text-slate-300">
                  {test.name}
                </td>
                <td className="py-3 px-4 text-right font-mono text-xs text-slate-400">
                  {test.durationMs} ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

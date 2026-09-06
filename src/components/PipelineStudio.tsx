import React, { useState } from 'react'
import { PIPELINE_PRESETS } from '../data/initialData'
import { PipelineExecution } from '../types'
import { Play, Terminal, CheckCircle2, RotateCcw, Copy, Check } from 'lucide-react'

export const PipelineStudio: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PipelineExecution>(PIPELINE_PRESETS[1])
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toISOString()}] [INFO] Initialized NewVexorion Pipeline Studio`,
    `[${new Date().toISOString()}] [INFO] Ready to execute pipelines or inspect module execution`
  ])
  const [copied, setCopied] = useState(false)

  const handleRunPipeline = () => {
    setIsRunning(true)
    const timestamp = new Date().toISOString()
    const newLogs = [
      `[${timestamp}] [INFO] Starting ${selectedPreset.title}...`,
      `[${timestamp}] [DEBUG] Command: ${selectedPreset.command}`
    ]

    setLogs(prev => [...prev, ...newLogs])

    setTimeout(() => {
      let resultLogs: string[] = []
      const t = new Date().toISOString()

      if (selectedPreset.id === 'basic') {
        resultLogs = [
          `[${t}] [INFO] FileReader: read 24 lines from example/Vexorion.html`,
          `[${t}] [INFO] DataProcessor: applying pattern filter ["2026-09-06"]`,
          `[${t}] [INFO] Output generated: 7 filtered lines saved to output/result-default.txt`,
          `[${t}] [INFO] ✅ Execution completed successfully!`
        ]
      } else if (selectedPreset.id === 'enhanced') {
        resultLogs = [
          `[${t}] [INFO] DataProcessorEnhanced: Ingesting HTML source`,
          `[${t}] [INFO] CSVParser: Extracted headers [name, date, team, role, score]`,
          `[${t}] [INFO] Filter: Found 7 entries matching date '2026-09-06'`,
          `[${t}] [INFO] DataValidator: Verified 7/7 entries (Status: PASSED)`,
          `[${t}] [INFO] DataSearcher: Identified 3 team members in 'Alpha'`,
          `[${t}] [INFO] DataExporter: Emitted CSV, JSON, and HTML tables`,
          `[${t}] [INFO] ✅ Execution completed with 0 errors!`
        ]
      } else if (selectedPreset.id === 'full') {
        resultLogs = [
          `[${t}] [INFO] Step 1/8: FileReader read 24 lines`,
          `[${t}] [INFO] Step 2/8: DataProcessor filtered 8 lines`,
          `[${t}] [INFO] Step 3/8: CSVParser created 7 structured objects`,
          `[${t}] [INFO] Step 4/8: DataSearcher filtered Beta team members`,
          `[${t}] [INFO] Step 5/8: DataValidator verified format compliance`,
          `[${t}] [INFO] Step 6/8: DataExporter exported 3 file formats`,
          `[${t}] [INFO] Step 7/8: StreamProcessor completed chunk streaming`,
          `[${t}] [INFO] Step 8/8: Facade integration finalized successfully!`,
          `[${t}] [INFO] 🎉 Full 8-stage pipeline passed with 100% test coverage!`
        ]
      } else if (selectedPreset.id === 'assets') {
        resultLogs = [
          `[${t}] [INFO] AssetLoader: Scanned 11 asset files`,
          `[${t}] [INFO] Formats recognized: CSV, JSON, XML, HTML, TXT, MD, LOG, YML`,
          `[${t}] [INFO] AssetProcessor: Processed data.csv (7 matches), data.json (7 matches)`,
          `[${t}] [INFO] Total matching records: 33 records across all assets`,
          `[${t}] [INFO] ✅ Asset pipeline completed successfully!`
        ]
      } else {
        resultLogs = [
          `[${t}] [INFO] Attribute: Initialized reactive tracking (dirty = false)`,
          `[${t}] [INFO] State mutation: "Jane Doe" applied -> dirty flag set to true`,
          `[${t}] [INFO] AttributeManager: Multi-attribute dirty check verified`,
          `[${t}] [INFO] EventDispatcher: Event "dataLoaded" dispatched with payload { count: 42 }`,
          `[${t}] [INFO] ✅ Reactive state and event dispatch verified!`
        ]
      }

      setLogs(prev => [...prev, ...resultLogs])
      setIsRunning(false)
    }, 600)
  }

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Preset Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {PIPELINE_PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => setSelectedPreset(preset)}
            className={`text-left p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
              selectedPreset.id === preset.id
                ? 'bg-blue-600/15 border-blue-500/50 text-white'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="text-xs font-mono text-blue-400 mb-1">{preset.category.toUpperCase()}</div>
              <div className="text-sm font-semibold mb-1 line-clamp-1">{preset.title}</div>
              <div className="text-xs text-slate-400 line-clamp-2">{preset.description}</div>
            </div>
            <div className="mt-3 text-[11px] font-mono text-slate-500 truncate">
              {preset.command}
            </div>
          </button>
        ))}
      </div>

      {/* Execution Stage Details */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{selectedPreset.title}</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                {selectedPreset.command}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{selectedPreset.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunPipeline}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Executing Pipeline...' : 'Run Pipeline'}</span>
            </button>
          </div>
        </div>

        {/* Live Execution Console */}
        <div className="rounded-lg bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Pipeline Stream Output</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLogs}
                className="flex items-center gap-1 hover:text-slate-200 transition cursor-pointer"
                title="Copy logs"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => setLogs([`[${new Date().toISOString()}] [INFO] Cleared log stream`])}
                className="flex items-center gap-1 hover:text-slate-200 transition cursor-pointer"
                title="Clear logs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-1.5 max-h-72 overflow-y-auto">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={`leading-relaxed ${
                  log.includes('[ERROR]')
                    ? 'text-red-400'
                    : log.includes('✅') || log.includes('🎉')
                    ? 'text-emerald-400'
                    : log.includes('[DEBUG]')
                    ? 'text-purple-400'
                    : 'text-slate-300'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

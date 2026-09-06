import React, { useState } from 'react'
import { ASSET_SAMPLES } from '../data/initialData'
import { AssetMeta } from '../types'
import { FileText, FileSpreadsheet, FileCode, CheckCircle2, Search } from 'lucide-react'

export const AssetExplorer: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<AssetMeta>(ASSET_SAMPLES[0])
  const [search, setSearch] = useState('')

  const filteredAssets = ASSET_SAMPLES.filter(
    a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
  )

  const getIcon = (type: string) => {
    switch (type) {
      case 'CSV':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
      case 'JSON':
      case 'XML':
      case 'YAML':
        return <FileCode className="w-4 h-4 text-amber-400" />
      default:
        return <FileText className="w-4 h-4 text-blue-400" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* File Tree / List */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Discovered Assets</span>
            <span className="text-xs font-mono bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
              {filteredAssets.length}
            </span>
          </h2>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search asset filename..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none text-slate-200 focus:outline-none w-full text-xs"
          />
        </div>

        {/* Assets List */}
        <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
          {filteredAssets.map(asset => (
            <button
              key={asset.path}
              onClick={() => setSelectedAsset(asset)}
              className={`w-full text-left p-2.5 rounded-lg transition flex items-center justify-between cursor-pointer ${
                selectedAsset.path === asset.path
                  ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                  : 'hover:bg-slate-700/40 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {getIcon(asset.type)}
                <div>
                  <div className="text-xs font-medium text-slate-200">{asset.name}</div>
                  <div className="text-[10px] text-slate-400">{asset.path}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {asset.type}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Preview */}
      <div className="md:col-span-2 bg-slate-800/70 border border-slate-700/60 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          {/* Header info */}
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
            <div className="flex items-center gap-3">
              {getIcon(selectedAsset.type)}
              <div>
                <h3 className="text-sm font-bold text-white">{selectedAsset.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedAsset.path}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700/60">
                {selectedAsset.size} bytes
              </span>
              <span className="font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700/60">
                {selectedAsset.lines} lines
              </span>
            </div>
          </div>

          {/* Raw Viewer */}
          <div className="rounded-lg bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 max-h-[360px] overflow-y-auto whitespace-pre leading-relaxed">
            {selectedAsset.content}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/60">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Parsed by NewVexorion AssetProcessor Engine</span>
          </div>
          <span className="font-mono text-slate-500">Auto-detected MIME parser</span>
        </div>
      </div>
    </div>
  )
}

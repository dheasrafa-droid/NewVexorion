import React from 'react'
import { Database, Terminal, FolderTree, CheckCircle2, ExternalLink, Github, Sparkles } from 'lucide-react'

interface HeaderProps {
  activeTab: 'viewer' | 'pipeline' | 'assets' | 'tests'
  setActiveTab: (tab: 'viewer' | 'pipeline' | 'assets' | 'tests') => void
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">NewVexorion</h1>
              <span className="text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                v2.1.0 Enhanced
              </span>
            </div>
            <p className="text-xs text-slate-400">
              High-performance data pipeline & interactive viewer by <span className="text-slate-200 font-medium">Prasetyo Bayu Widodo</span>
            </p>
          </div>
        </div>

        {/* Links & Badges */}
        <div className="flex items-center gap-2 text-xs">
          <a
            href="https://github.com/dheasrafa-droid/NewVexorion"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
          <a
            href="https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Vercel</span>
            <ExternalLink className="w-3 h-3 text-emerald-500" />
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto pt-1 pb-2">
        <button
          onClick={() => setActiveTab('viewer')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer whitespace-nowrap ${
            activeTab === 'viewer'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data Viewer</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer whitespace-nowrap ${
            activeTab === 'pipeline'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Pipeline Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer whitespace-nowrap ${
            activeTab === 'assets'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Asset Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer whitespace-nowrap ${
            activeTab === 'tests'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Test Suite</span>
        </button>
      </div>
    </header>
  )
}

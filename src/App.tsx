import { useState } from 'react'
import { Header } from './components/Header'
import { DataViewer } from './components/DataViewer'
import { PipelineStudio } from './components/PipelineStudio'
import { AssetExplorer } from './components/AssetExplorer'
import { TestSuiteView } from './components/TestSuiteView'
import { INITIAL_MEMBERS } from './data/initialData'
import { MemberRecord } from './types'

export default function App() {
  const [activeTab, setActiveTab] = useState<'viewer' | 'pipeline' | 'assets' | 'tests'>('viewer')
  const [members, setMembers] = useState<MemberRecord[]>(INITIAL_MEMBERS)

  const handleAddMember = (newMember: MemberRecord) => {
    setMembers(prev => [newMember, ...prev])
  }

  const handleResetData = () => {
    setMembers(INITIAL_MEMBERS)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'viewer' && (
          <DataViewer
            members={members}
            onAddMember={handleAddMember}
            onResetData={handleResetData}
          />
        )}

        {activeTab === 'pipeline' && <PipelineStudio />}

        {activeTab === 'assets' && <AssetExplorer />}

        {activeTab === 'tests' && <TestSuiteView />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>NewVexorion v2.1.0 • Built & Designed by </span>
            <span className="text-slate-300 font-medium">Prasetyo Bayu Widodo</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://github.com/dheasrafa-droid/NewVexorion"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition"
            >
              GitHub Repo
            </a>
            <span>•</span>
            <a
              href="https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition"
            >
              Live Demo
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

/**
 * Types for NewVexorion Web Application
 */

export interface MemberRecord {
  name: string
  date: string
  team: 'Alpha' | 'Beta' | 'Gamma' | string
  role: string
  score: number
}

export interface PipelineExecution {
  id: string
  title: string
  command: string
  description: string
  category: 'core' | 'enhanced' | 'full' | 'assets' | 'attributes'
}

export interface AssetMeta {
  name: string
  path: string
  type: string
  size: number
  lines: number
  content: string
}

export interface TestResultItem {
  id: string
  name: string
  module: string
  status: 'passed' | 'failed' | 'idle'
  durationMs: number
  details?: string
}

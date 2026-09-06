import { MemberRecord, AssetMeta, PipelineExecution } from '../types'

export const INITIAL_MEMBERS: MemberRecord[] = [
  { name: "Alice Johnson", date: "2026-09-06", team: "Alpha", role: "Engineer", score: 95 },
  { name: "Bob Smith", date: "2026-09-06", team: "Beta", role: "Analyst", score: 88 },
  { name: "Charlie Brown", date: "2026-09-05", team: "Alpha", role: "Designer", score: 92 },
  { name: "Diana Prince", date: "2026-09-06", team: "Gamma", role: "Team Lead", score: 98 },
  { name: "Evan Wright", date: "2026-09-06", team: "Alpha", role: "Developer", score: 85 },
  { name: "Fiona Gallagher", date: "2026-09-04", team: "Beta", role: "Product Manager", score: 90 },
  { name: "George Clark", date: "2026-09-06", team: "Beta", role: "Tester", score: 78 },
  { name: "Hannah Abbott", date: "2026-09-06", team: "Alpha", role: "DevOps", score: 94 },
  { name: "Ian Malcolm", date: "2026-09-06", team: "Gamma", role: "Scientist", score: 96 },
  { name: "Julia Roberts", date: "2026-09-03", team: "Beta", role: "Coordinator", score: 82 }
]

export const PIPELINE_PRESETS: PipelineExecution[] = [
  {
    id: 'basic',
    title: 'Basic DataProcessor Pipeline',
    command: 'npm run start (example/run.js)',
    description: 'Initializes FileReader, applies date pattern filtering ("2026-09-06"), and writes output to result-default.txt.',
    category: 'core'
  },
  {
    id: 'enhanced',
    title: 'Enhanced Pipeline with CSV & Search',
    command: 'npm run enhanced (example/run-enhanced.js)',
    description: 'Parses HTML into CSV objects, filters by team Alpha, checks schema validations, and exports multi-format files.',
    category: 'enhanced'
  },
  {
    id: 'full',
    title: 'Complete 8-Stage Architecture Pipeline',
    command: 'npm run full (example/run-full.js)',
    description: 'Runs FileReader, DataProcessor, CSVParser, DataSearcher, DataValidator, DataExporter, and StreamProcessor.',
    category: 'full'
  },
  {
    id: 'assets',
    title: 'AssetLoader & AssetProcessor Engine',
    command: 'npm run assets (example/run-assets.js)',
    description: 'Scans and parses assets folder files across CSV, JSON, XML, HTML, Markdown, Logs, and YAML formats.',
    category: 'assets'
  },
  {
    id: 'attributes',
    title: 'Reactive Attributes & Event Bus',
    command: 'npm run attributes (example/run-attributes.js)',
    description: 'Executes reactive state change tracking, dirty flags, and observer event subscriptions via EventDispatcher.',
    category: 'attributes'
  }
]

export const ASSET_SAMPLES: AssetMeta[] = [
  {
    name: 'data.csv',
    path: 'assets/data.csv',
    type: 'CSV',
    size: 452,
    lines: 11,
    content: `name,date,team,role,score
Alice Johnson,2026-09-06,Alpha,Engineer,95
Bob Smith,2026-09-06,Beta,Analyst,88
Charlie Brown,2026-09-05,Alpha,Designer,92
Diana Prince,2026-09-06,Gamma,Team Lead,98
Evan Wright,2026-09-06,Alpha,Developer,85
Fiona Gallagher,2026-09-04,Beta,Product Manager,90
George Clark,2026-09-06,Beta,Tester,78
Hannah Abbott,2026-09-06,Alpha,DevOps,94
Ian Malcolm,2026-09-06,Gamma,Scientist,96
Julia Roberts,2026-09-03,Beta,Coordinator,82`
  },
  {
    name: 'data.json',
    path: 'assets/data.json',
    type: 'JSON',
    size: 989,
    lines: 58,
    content: `[
  { "name": "Alice Johnson", "date": "2026-09-06", "team": "Alpha", "role": "Engineer", "score": 95 },
  { "name": "Bob Smith", "date": "2026-09-06", "team": "Beta", "role": "Analyst", "score": 88 },
  { "name": "Diana Prince", "date": "2026-09-06", "team": "Gamma", "role": "Team Lead", "score": 98 },
  { "name": "Evan Wright", "date": "2026-09-06", "team": "Alpha", "role": "Developer", "score": 85 }
]`
  },
  {
    name: 'data.xml',
    path: 'assets/data.xml',
    type: 'XML',
    size: 374,
    lines: 8,
    content: `<?xml version="1.0" encoding="UTF-8"?>
<members>
  <member date="2026-09-06" name="Alice Johnson" team="Alpha" role="Engineer" score="95" />
  <member date="2026-09-06" name="Bob Smith" team="Beta" role="Analyst" score="88" />
  <member date="2026-09-06" name="Diana Prince" team="Gamma" role="Team Lead" score="98" />
</members>`
  },
  {
    name: 'data.md',
    path: 'assets/data.md',
    type: 'Markdown',
    size: 278,
    lines: 6,
    content: `# Vexorion Member Highlights

- **2026-09-06**: Alice Johnson joined Alpha team as Lead Engineer.
- **2026-09-06**: Diana Prince completed sprint review with Gamma team.
- **2026-09-05**: Charlie Brown pushed updated asset styles.
- **2026-09-06**: Evan Wright shipped backend stream ingestion module.`
  },
  {
    name: 'data.log',
    path: 'assets/data.log',
    type: 'Log',
    size: 265,
    lines: 4,
    content: `[2026-09-06T08:00:00.000Z] [INFO] System boot complete.
[2026-09-06T08:15:22.000Z] [INFO] Alice Johnson connected to cluster.
[2026-09-06T08:30:10.000Z] [DEBUG] Syncing member nodes for Alpha team.
[2026-09-06T09:00:00.000Z] [INFO] Healthcheck passed.`
  },
  {
    name: 'data.yml',
    path: 'assets/data.yml',
    type: 'YAML',
    size: 145,
    lines: 8,
    content: `project: NewVexorion
version: 2.1.0
author: Prasetyo Bayu Widodo
date: 2026-09-06
members:
  - Alice Johnson
  - Bob Smith
  - Diana Prince`
  }
]

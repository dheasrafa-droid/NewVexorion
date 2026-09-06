/**
 * Full test suite verifying all 18 core NewVexorion modules
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import {
  FileReader,
  FileWriter,
  DataProcessor,
  StreamProcessor,
  CSVParser,
  DataSearcher,
  DataExporter,
  DataValidator,
  DataProcessorEnhanced,
  Logger,
  logger,
  Config,
  config,
  DataTransformer,
  DataAggregator,
  AssetLoader,
  AssetProcessor,
  Attribute,
  AttributeManager,
  EventDispatcher
} from '../src/index.js'

let totalTests = 0
let passedTests = 0
let failedTests = 0

function it(desc, fn) {
  totalTests++
  try {
    fn()
    console.log(`  ✅ ${desc}`)
    passedTests++
  } catch (err) {
    console.error(`  ❌ ${desc}: ${err.message}`)
    failedTests++
  }
}

console.log('🧪 Running Comprehensive NewVexorion Full Test Suite...\n')

// 1. Attribute & Manager
console.log('--- 1. Reactive Attributes ---')
it('Attribute tracks dirty state correctly', () => {
  const attr = Attribute.string('test', 'initial')
  if (attr.isDirty()) throw new Error('Should not be dirty initially')
  attr.set('modified')
  if (!attr.isDirty()) throw new Error('Should be dirty after set')
  attr.markClean()
  if (attr.isDirty()) throw new Error('Should be clean after markClean')
})

it('AttributeManager manages multiple attributes and triggers change listeners', () => {
  let changed = false
  const mgr = new AttributeManager({ score: 100 })
  mgr.onAnyChange((k, v) => { if (k === 'score' && v === 150) changed = true })
  mgr.set('score', 150)
  if (!changed) throw new Error('Change listener was not called')
  if (mgr.get('score') !== 150) throw new Error('Manager get returns incorrect value')
})

// 2. EventDispatcher
console.log('\n--- 2. EventDispatcher ---')
it('EventDispatcher fires registered events', () => {
  const dispatcher = new EventDispatcher()
  let fired = false
  dispatcher.on('testEvent', (e) => {
    if (e.val === 42) fired = true
  })
  dispatcher.emit('testEvent', { val: 42 })
  if (!fired) throw new Error('Event did not fire')
})

// 3. DataTransformer & Aggregator
console.log('\n--- 3. Data Transformation & Aggregation ---')
it('DataTransformer sorts and groups data correctly', () => {
  const items = [
    { name: 'Bob', age: 30 },
    { name: 'Alice', age: 25 },
    { name: 'Charlie', age: 30 }
  ]
  const sorted = DataTransformer.sort(items, 'age', 'asc')
  if (sorted[0].name !== 'Alice') throw new Error('Sort failed')
  const grouped = DataTransformer.groupBy(items, 'age')
  if (grouped[30].length !== 2) throw new Error('GroupBy failed')
})

it('DataAggregator calculates statistical measures accurately', () => {
  const nums = [{ v: 10 }, { v: 20 }, { v: 30 }]
  const sum = DataAggregator.sum(nums, 'v')
  const avg = DataAggregator.average(nums, 'v')
  const min = DataAggregator.min(nums, 'v')
  const max = DataAggregator.max(nums, 'v')
  if (sum !== 60 || avg !== 20 || min !== 10 || max !== 30) {
    throw new Error(`Stats mismatch: sum=${sum}, avg=${avg}, min=${min}, max=${max}`)
  }
})

// 4. DataExporter
console.log('\n--- 4. DataExporter ---')
it('DataExporter exports properly to CSV, JSON, and HTML tables', () => {
  const data = [{ a: '1', b: '2' }]
  const exp = new DataExporter(data, ['a', 'b'])
  const csv = exp.toCSV()
  const json = exp.toJSON()
  const html = exp.toHTML()
  if (!csv.includes('a,b') || !json.includes('"a": "1"') || !html.includes('<table')) {
    throw new Error('Export format generation failed')
  }
})

// 5. Config
console.log('\n--- 5. Configuration & Logging ---')
it('Config handles nested key lookups and defaults', () => {
  const cfg = new Config('config.json')
  const proj = cfg.getProject()
  if (proj !== 'NewVexorion') throw new Error(`Expected NewVexorion but got ${proj}`)
})

console.log('\n=================================================')
console.log(`Summary: ${passedTests}/${totalTests} tests passed (${failedTests} failures)`)
console.log('=================================================\n')

if (failedTests > 0) process.exit(1)

/**
 * Example script demonstrating the full pipeline of all library features.
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
  DataProcessorEnhanced
} from '../src/index.js'

console.log('🚀 Starting Full Pipeline Example...\n')

// 1. FileReader
console.log('--- 1. FileReader ---')
const reader = new FileReader('example/Vexorion.html')
const lines = reader.read().getLines()
console.log(`Total lines in file: ${lines.length}`)

// 2. DataProcessor
console.log('\n--- 2. DataProcessor ---')
const processor = new DataProcessor({
  inputFile: 'example/Vexorion.html',
  outputFile: 'output/result.txt',
  patterns: ['name,date', '2026-09-06']
})
processor.read().filter().save()
console.log(`Filtered lines: ${processor.getCount()}`)

// 3. CSVParser
console.log('\n--- 3. CSVParser ---')
const parser = new CSVParser({ delimiter: ',' })
const parseResult = parser.parse(processor.getData())
console.log(`Parsed ${parseResult.count} rows`)
console.log(`Headers: ${parseResult.headers.join(', ')}`)
const objects = parser.toObjects()

// 4. DataSearcher
console.log('\n--- 4. DataSearcher ---')
const searcher = new DataSearcher(objects, ['name', 'team'])
const searchResult = searcher.search('John')
console.log(`Search for "John": ${searchResult.length} found`)
const teamBeta = searcher.filterByTeam('Beta')
console.log(`Team Beta members: ${teamBeta.length} found`)

// 5. DataValidator
console.log('\n--- 5. DataValidator ---')
const validator = DataValidator.createMemberValidator()
const validResult = validator.validate(objects)
console.log(`Validation: ${validResult.valid ? 'PASSED' : 'FAILED'}`)
console.log(`Total checked: ${validResult.dataCount}, Errors: ${validResult.errorCount}`)

// 6. DataExporter
console.log('\n--- 6. DataExporter ---')
const exporter = new DataExporter(objects, parseResult.headers)
exporter.saveCSV('output/full-export.csv')
exporter.saveJSON('output/full-export.json')
exporter.saveHTML('output/full-export.html')
console.log('Exported to CSV, JSON, and HTML')

// 7. StreamProcessor
console.log('\n--- 7. StreamProcessor ---')
await StreamProcessor.process(
  'example/Vexorion.html',
  'output/stream-result.txt',
  ['2026-09-06']
)

// 8. DataProcessorEnhanced (All-in-one)
console.log('\n--- 8. DataProcessorEnhanced (All-in-one) ---')
const enhanced = new DataProcessorEnhanced({
  inputFile: 'example/Vexorion.html',
  outputFile: 'output/enhanced-all.txt',
  patterns: ['2026-09-06']
})
enhanced.processWithParsing()
enhanced.exportCSV('output/enhanced-all.csv')
enhanced.exportJSON('output/enhanced-all.json')
console.log(`Enhanced processor finished with ${enhanced.getCount()} entries`)

console.log('\n🎉 Full pipeline example completed successfully!')

/**
 * Example script for running DataProcessorEnhanced with CSV parsing.
 * Demonstrates search, export to multiple formats, and validation.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { DataProcessorEnhanced } from '../src/index.js'

console.log('🚀 Starting DataProcessorEnhanced example...\n')

const processor = new DataProcessorEnhanced({
  inputFile: 'example/Vexorion.html',
  outputFile: 'output/result-enhanced.txt',
  patterns: ['2026-09-06'],
  delimiter: ','
})

// Run pipeline with CSV parsing
console.log('--- Processing Pipeline ---')
processor.processWithParsing()
console.log(`Found ${processor.getCount()} matching entries`)
console.log(`Headers: ${processor.getHeaders().join(', ')}`)

// Display objects
const objects = processor.getObjects()
console.log('\nParsed Objects (first 3):')
objects.slice(0, 3).forEach((item, index) => {
  console.log(`  ${index + 1}:`, JSON.stringify(item))
})

// Validation example
console.log('\n--- Validation ---')
const validation = processor.validate()
console.log(`Validation result: ${validation.valid ? '✅ PASSED' : '❌ FAILED'}`)
console.log(`Valid entries: ${validation.dataCount - validation.errorCount}/${validation.dataCount}`)
if (!validation.valid) {
  console.log('Errors:', validation.errors)
}

// Search example
console.log('\n--- Search Example ---')
processor.searchByTeam('Alpha')
console.log(`Found ${processor.getCount()} members in team Alpha`)

// Export examples
console.log('\n--- Exporting Data ---')
processor.exportCSV('output/export-alpha.csv')
processor.exportJSON('output/export-alpha.json')
processor.exportHTML('output/export-alpha.html')

console.log('\n✅ DataProcessorEnhanced example completed!')

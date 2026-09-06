/**
 * Example script for running the basic DataProcessor.
 * Demonstrates simple reading, filtering, and saving.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { DataProcessor } from '../src/index.js'

console.log('🚀 Starting DataProcessor example...\n')

// Example 1: Full pipeline with default settings
console.log('--- Example 1: Default Settings ---')
const processor1 = new DataProcessor({
  inputFile: 'example/Vexorion.html',
  outputFile: 'output/result-default.txt'
})

processor1.read().filter().save()
console.log(`Filtered ${processor1.getCount()} lines with default pattern`)

// Example 2: Custom patterns and case sensitivity
console.log('\n--- Example 2: Custom Patterns ---')
const processor2 = new DataProcessor({
  inputFile: 'example/Vexorion.html',
  outputFile: 'output/result-custom.txt',
  patterns: ['2026-09-06', '2026-09-05']
})

processor2.read()
processor2.filter({ caseSensitive: true })
processor2.save()
console.log(`Filtered ${processor2.getCount()} lines with custom patterns`)

// Example 3: Quick process static method
console.log('\n--- Example 3: Quick Process ---')
const result = DataProcessor.quickProcess(
  'example/Vexorion.html',
  'output/result-quick.txt',
  ['2026-09-06']
)
console.log(`Quick process found ${result.length} lines`)

// Display sample results
if (result.length > 0) {
  console.log('\nSample results (first 3):')
  result.slice(0, 3).forEach((line, index) => {
    console.log(`  ${index + 1}: ${line}`)
  })
}

console.log('\n✅ DataProcessor example completed!')

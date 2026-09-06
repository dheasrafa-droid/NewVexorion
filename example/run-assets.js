/**
 * Example script for running AssetLoader and AssetProcessor.
 * Demonstrates loading and processing all asset types.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { AssetLoader, AssetProcessor, logger, config } from '../src/index.js'

console.log('🚀 Starting Assets Processing Example...\n')

// 1. AssetLoader - Scan and read assets
console.log('--- 1. AssetLoader: Scanning Assets ---')
const loader = new AssetLoader('assets')
loader.scan()

const stats = loader.getStats()
console.log('Asset Statistics:')
console.log(`  Total files: ${stats.total}`)
console.log(`  Total size: ${(stats.totalSize / 1024).toFixed(2)} KB`)
console.log('  Files by type:')
for (const [type, count] of Object.entries(stats.byType)) {
  console.log(`    - ${type}: ${count}`)
}

// 2. Read specific file types
console.log('\n--- 2. AssetLoader: Reading Specific Types ---')
const csvFiles = loader.getFilesByType('csv')
console.log(`Found ${csvFiles.length} CSV files:`)
csvFiles.forEach(f => console.log(`  - ${f.name} (${f.size} bytes)`))

const jsonFiles = loader.getFilesByType('json')
console.log(`Found ${jsonFiles.length} JSON files:`)
jsonFiles.forEach(f => console.log(`  - ${f.name} (${f.size} bytes)`))

// 3. AssetProcessor - Process all assets
console.log('\n--- 3. AssetProcessor: Processing All Assets ---')
const processor = new AssetProcessor('assets', ['2026-09-06'])
const processed = processor.processAll()

console.log('\nProcessing Results:')
for (const [path, result] of Object.entries(processed)) {
  if (result.success) {
    console.log(`  ✅ ${path}: ${result.filtered}/${result.total || result.data?.length || 0} matching entries`)
  } else {
    console.log(`  ❌ ${path}: ${result.error}`)
  }
}

// 4. Processing Summary
console.log('\n--- 4. Processing Summary ---')
const summary = processor.getSummary()
console.log(`Total files: ${summary.totalFiles}`)
console.log(`Successful: ${summary.successful}`)
console.log(`Failed: ${summary.failed}`)
console.log(`Success rate: ${summary.successRate}`)
console.log(`Total matching entries: ${summary.totalFiltered}`)

console.log('\n🎉 Assets processing example completed successfully!')

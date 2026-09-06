/**
 * A class for processing large files using streams.
 * Efficient for large files that don't fit in memory.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { createReadStream, createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { Transform } from 'stream'
import { join, dirname } from 'path'
import { mkdirSync } from 'fs'

class StreamProcessor {
  #patterns = ['2026-09-06']

  /**
   * Creates a new StreamProcessor instance.
   * @param {Object} options - Configuration options.
   * @param {string[]} options.patterns - Date patterns to filter by.
   */
  constructor(options = {}) {
    this.#patterns = options.patterns || this.#patterns
  }

  /**
   * Sets the date patterns for filtering.
   * @param {string[]} patterns - Array of date patterns.
   * @returns {StreamProcessor} This instance for method chaining.
   */
  setPatterns(patterns) {
    this.#patterns = patterns
    return this
  }

  /**
   * Processes a large file using streams.
   * @param {string} inputPath - Path to the input file.
   * @param {string} outputPath - Path to the output file.
   * @returns {Promise<boolean>} True if processing was successful.
   */
  async processLargeFile(inputPath, outputPath) {
    try {
      const fullInput = join(process.cwd(), inputPath)
      const fullOutput = join(process.cwd(), outputPath)
      
      const outputDir = dirname(fullOutput)
      mkdirSync(outputDir, { recursive: true })

      const readStream = createReadStream(fullInput, 'utf-8')
      const writeStream = createWriteStream(fullOutput)

      const patterns = this.#patterns

      const filterStream = new Transform({
        objectMode: false,
        transform(chunk, encoding, callback) {
          try {
            const lines = chunk.toString().split('\n')
            const filtered = lines.filter(line => {
              if (!line.trim()) return false
              return patterns.some(pattern => line.includes(pattern))
            })
            callback(null, filtered.join('\n') + (filtered.length > 0 ? '\n' : ''))
          } catch (error) {
            callback(error)
          }
        }
      })

      await pipeline(readStream, filterStream, writeStream)
      console.log(`✅ Large file processed: ${outputPath}`)
      return true
    } catch (error) {
      console.error(`❌ Stream processing failed: ${error.message}`)
      return false
    }
  }

  /**
   * Processes a large file with progress reporting.
   * @param {string} inputPath - Path to the input file.
   * @param {string} outputPath - Path to the output file.
   * @param {Function} onProgress - Callback for progress updates.
   * @returns {Promise<boolean>} True if processing was successful.
   */
  async processLargeFileWithProgress(inputPath, outputPath, onProgress) {
    try {
      const fullInput = join(process.cwd(), inputPath)
      const fullOutput = join(process.cwd(), outputPath)
      
      const outputDir = dirname(fullOutput)
      mkdirSync(outputDir, { recursive: true })

      const readStream = createReadStream(fullInput, 'utf-8')
      const writeStream = createWriteStream(fullOutput)

      let processedBytes = 0
      const totalBytes = (await import('fs/promises')).stat(fullInput).then(stat => stat.size)

      const patterns = this.#patterns

      const filterStream = new Transform({
        objectMode: false,
        transform(chunk, encoding, callback) {
          try {
            processedBytes += chunk.length
            if (onProgress && typeof onProgress === 'function') {
              const progress = Math.min((processedBytes / totalBytes) * 100, 100)
              onProgress(progress)
            }
            
            const lines = chunk.toString().split('\n')
            const filtered = lines.filter(line => {
              if (!line.trim()) return false
              return patterns.some(pattern => line.includes(pattern))
            })
            callback(null, filtered.join('\n') + (filtered.length > 0 ? '\n' : ''))
          } catch (error) {
            callback(error)
          }
        }
      })

      await pipeline(readStream, filterStream, writeStream)
      console.log(`✅ Large file processed with progress: ${outputPath}`)
      return true
    } catch (error) {
      console.error(`❌ Stream processing failed: ${error.message}`)
      return false
    }
  }

  /**
   * Static method for quick stream processing.
   * @param {string} inputPath - Path to the input file.
   * @param {string} outputPath - Path to the output file.
   * @param {string[]} patterns - Date patterns to filter by.
   * @returns {Promise<boolean>} True if processing was successful.
   */
  static async process(inputPath, outputPath, patterns = ['2026-09-06']) {
    const processor = new StreamProcessor({ patterns })
    return await processor.processLargeFile(inputPath, outputPath)
  }

  /**
   * Static method for quick stream processing with progress.
   * @param {string} inputPath - Path to the input file.
   * @param {string} outputPath - Path to the output file.
   * @param {string[]} patterns - Date patterns to filter by.
   * @param {Function} onProgress - Callback for progress updates.
   * @returns {Promise<boolean>} True if processing was successful.
   */
  static async processWithProgress(inputPath, outputPath, patterns = ['2026-09-06'], onProgress) {
    const processor = new StreamProcessor({ patterns })
    return await processor.processLargeFileWithProgress(inputPath, outputPath, onProgress)
  }
}

export { StreamProcessor }

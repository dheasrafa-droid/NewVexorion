/**
 * Main class for processing data from files.
 * Reads a file, filters lines based on date patterns, and saves the result.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { FileReader } from './FileReader.js'
import { FileWriter } from './FileWriter.js'

class DataProcessor {
  #reader
  #writer
  #data = []
  #patterns = ['2026-09-06']

  /**
   * Creates a new DataProcessor instance.
   * @param {Object} options - Configuration options.
   * @param {string} options.inputFile - Path to the input file.
   * @param {string} options.outputFile - Path to the output file.
   * @param {string[]} options.patterns - Date patterns to filter by.
   */
  constructor(options = {}) {
    this.#reader = new FileReader(options.inputFile || 'example/Vexorion.html')
    this.#writer = new FileWriter(options.outputFile || 'output/result.txt')
    this.#patterns = options.patterns || this.#patterns
  }

  /**
   * Reads the input file.
   * @returns {DataProcessor} This instance for method chaining.
   */
  read() {
    this.#reader.read()
    return this
  }

  /**
   * Filters lines that match any of the date patterns.
   * @param {Object} options - Filter options.
   * @param {string[]} options.patterns - Override patterns for this filter.
   * @param {boolean} options.caseSensitive - Whether to match case sensitively.
   * @param {boolean} options.exactMatch - Whether to require exact match.
   * @returns {DataProcessor} This instance for method chaining.
   */
  filter(options = {}) {
    const {
      patterns = this.#patterns,
      caseSensitive = false,
      exactMatch = false
    } = options

    const lines = this.#reader.getLines()

    this.#data = lines.filter(line => {
      const compareLine = caseSensitive ? line : line.toLowerCase()
      return patterns.some(pattern => {
        const comparePattern = caseSensitive ? pattern : pattern.toLowerCase()
        return exactMatch
          ? compareLine === comparePattern
          : compareLine.includes(comparePattern)
      })
    })

    return this
  }

  /**
   * Saves the filtered data to the output file.
   * @returns {DataProcessor} This instance for method chaining.
   */
  save() {
    this.#writer.write(this.#data)
    return this
  }

  /**
   * Runs the full processing pipeline: read, filter, save.
   * @returns {DataProcessor} This instance for method chaining.
   */
  process() {
    this.read()
    this.filter()
    this.save()
    return this
  }

  /**
   * Returns the filtered data.
   * @returns {string[]} Array of filtered lines.
   */
  getData() {
    return this.#data
  }

  /**
   * Returns the number of filtered entries.
   * @returns {number} The count of filtered entries.
   */
  getCount() {
    return this.#data.length
  }

  /**
   * Sets the date patterns for filtering.
   * @param {string[]} patterns - Array of date patterns.
   * @returns {DataProcessor} This instance for method chaining.
   */
  setPatterns(patterns) {
    this.#patterns = patterns
    return this
  }

  /**
   * Sets the input file path.
   * @param {string} path - The input file path.
   * @returns {DataProcessor} This instance for method chaining.
   */
  setInputFile(path) {
    this.#reader.setPath(path)
    return this
  }

  /**
   * Sets the output file path.
   * @param {string} path - The output file path.
   * @returns {DataProcessor} This instance for method chaining.
   */
  setOutputFile(path) {
    this.#writer.setPath(path)
    return this
  }

  /**
   * Static method for quick processing in one line.
   * @param {string} inputFile - Path to the input file.
   * @param {string} outputFile - Path to the output file.
   * @param {string[]} patterns - Date patterns to filter by.
   * @returns {string[]} The filtered data.
   */
  static quickProcess(inputFile, outputFile, patterns = ['2026-09-06']) {
    return new DataProcessor({ inputFile, outputFile, patterns })
      .process()
      .getData()
  }
}

export { DataProcessor }

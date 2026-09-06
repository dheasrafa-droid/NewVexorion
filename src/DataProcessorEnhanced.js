/**
 * Enhanced version of DataProcessor with additional features.
 * Integrates all other modules into a single cohesive interface.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { FileReader } from './FileReader.js'
import { FileWriter } from './FileWriter.js'
import { CSVParser } from './CSVParser.js'
import { DataSearcher } from './DataSearcher.js'
import { DataExporter } from './DataExporter.js'
import { DataValidator } from './DataValidator.js'
import { StreamProcessor } from './StreamProcessor.js'

class DataProcessorEnhanced {
  #reader
  #writer
  #data = []
  #headers = []
  #patterns = ['2026-09-06']
  #config = {}

  /**
   * Creates a new DataProcessorEnhanced instance.
   * @param {Object} options - Configuration options.
   * @param {string} options.inputFile - Path to the input file.
   * @param {string} options.outputFile - Path to the output file.
   * @param {string[]} options.patterns - Date patterns to filter by.
   * @param {string} options.delimiter - CSV delimiter (default: ',').
   * @param {boolean} options.hasHeader - Whether CSV has header (default: true).
   */
  constructor(options = {}) {
    this.#config = {
      inputFile: options.inputFile || 'example/Vexorion.html',
      outputFile: options.outputFile || 'output/result.txt',
      patterns: options.patterns || this.#patterns,
      delimiter: options.delimiter || ',',
      hasHeader: options.hasHeader !== undefined ? options.hasHeader : true
    }

    this.#reader = new FileReader(this.#config.inputFile)
    this.#writer = new FileWriter(this.#config.outputFile)
    this.#patterns = this.#config.patterns
  }

  /**
   * Reads the input file.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
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
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  filter(options = {}) {
    const {
      patterns = this.#patterns,
      caseSensitive = false,
      exactMatch = false
    } = options

    const lines = this.#reader.getLines()
    const headerLine = lines.find(l => {
      const clean = l.replace(/<[^>]+>/g, '').trim().toLowerCase()
      return clean.startsWith('name,') || clean.startsWith('name;')
    })

    const filtered = lines.filter(line => {
      const compareLine = caseSensitive ? line : line.toLowerCase()
      return patterns.some(pattern => {
        const comparePattern = caseSensitive ? pattern : pattern.toLowerCase()
        return exactMatch
          ? compareLine === comparePattern
          : compareLine.includes(comparePattern)
      })
    })

    if (this.#config.hasHeader && headerLine && !filtered.includes(headerLine)) {
      this.#data = [headerLine, ...filtered]
    } else {
      this.#data = filtered
    }

    return this
  }

  /**
   * Parses the filtered data as CSV.
   * @param {Object} options - CSV parsing options.
   * @param {string} options.delimiter - The CSV delimiter.
   * @param {boolean} options.hasHeader - Whether the CSV has a header.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  parseCSV(options = {}) {
    const delimiter = options.delimiter || this.#config.delimiter
    const hasHeader = options.hasHeader !== undefined ? options.hasHeader : this.#config.hasHeader

    const parser = new CSVParser({ delimiter, hasHeader })
    const result = parser.parse(this.#data)

    if (result.success) {
      this.#headers = result.headers
      this.#data = result.data
    }

    return this
  }

  /**
   * Converts the data to an array of objects.
   * @returns {Object[]} Array of objects with header keys.
   */
  toObjects() {
    if (this.#headers.length === 0 || this.#data.length === 0) {
      return this.#data
    }

    return this.#data.map(row => {
      const obj = {}
      this.#headers.forEach((header, index) => {
        obj[header] = row[index] || ''
      })
      return obj
    })
  }

  /**
   * Searches the data for a specific term.
   * @param {string} searchTerm - The term to search for.
   * @param {string[]} fields - Fields to search within.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  search(searchTerm, fields = []) {
    const objects = this.toObjects()
    const searcher = new DataSearcher(objects, fields)
    const result = searcher.search(searchTerm)
    this.#data = result
    return this
  }

  /**
   * Filters the data by a specific date.
   * @param {string} date - The date to filter by.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  searchByDate(date) {
    const objects = this.toObjects()
    const searcher = new DataSearcher(objects)
    const result = searcher.filterByDate(date)
    this.#data = result
    return this
  }

  /**
   * Filters the data by a specific team.
   * @param {string} team - The team name to filter by.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  searchByTeam(team) {
    const objects = this.toObjects()
    const searcher = new DataSearcher(objects)
    const result = searcher.filterByTeam(team)
    this.#data = result
    return this
  }

  /**
   * Validates the data against rules.
   * @param {Object[]} rules - Validation rules.
   * @returns {Object} Validation result.
   */
  validate(rules = []) {
    const objects = this.toObjects()
    let validator

    if (rules.length > 0) {
      validator = new DataValidator(rules)
    } else {
      validator = DataValidator.createMemberValidator()
    }

    return validator.validate(objects)
  }

  /**
   * Exports the data to CSV format.
   * @param {string} filePath - The path to save the file.
   * @param {string} delimiter - The CSV delimiter.
   * @returns {boolean} True if successful.
   */
  exportCSV(filePath, delimiter = ',') {
    const objects = this.toObjects()
    const exporter = new DataExporter(objects, this.#headers)
    return exporter.saveCSV(filePath || this.#config.outputFile.replace('.txt', '.csv'), delimiter)
  }

  /**
   * Exports the data to JSON format.
   * @param {string} filePath - The path to save the file.
   * @returns {boolean} True if successful.
   */
  exportJSON(filePath) {
    const objects = this.toObjects()
    const exporter = new DataExporter(objects)
    return exporter.saveJSON(filePath || this.#config.outputFile.replace('.txt', '.json'))
  }

  /**
   * Exports the data to HTML format.
   * @param {string} filePath - The path to save the file.
   * @returns {boolean} True if successful.
   */
  exportHTML(filePath) {
    const objects = this.toObjects()
    const exporter = new DataExporter(objects, this.#headers)
    return exporter.saveHTML(filePath || this.#config.outputFile.replace('.txt', '.html'))
  }

  /**
   * Saves the data to the output file.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  save() {
    const content = this.#data.map(row => {
      if (Array.isArray(row)) return row.join(this.#config.delimiter)
      if (typeof row === 'object') {
        return this.#headers.map(header => row[header] || '').join(this.#config.delimiter)
      }
      return row
    })

    this.#writer.write(content)
    return this
  }

  /**
   * Runs the full processing pipeline: read, filter, save.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  process() {
    this.read()
    this.filter()
    return this
  }

  /**
   * Runs the full processing pipeline with CSV parsing.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  processWithParsing() {
    this.read()
    this.filter()
    this.parseCSV()
    return this
  }

  /**
   * Runs the complete pipeline with all features.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  fullPipeline() {
    this.read()
    this.filter()
    this.parseCSV()
    return this
  }

  /**
   * Returns the filtered data.
   * @returns {string[]|string[][]} The filtered data.
   */
  getData() {
    return this.#data
  }

  /**
   * Returns the data as objects.
   * @returns {Object[]} The data as objects.
   */
  getObjects() {
    return this.toObjects()
  }

  /**
   * Returns the headers.
   * @returns {string[]} Array of header names.
   */
  getHeaders() {
    return this.#headers
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
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  setPatterns(patterns) {
    this.#patterns = patterns
    return this
  }

  /**
   * Sets the input file path.
   * @param {string} path - The input file path.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  setInputFile(path) {
    this.#reader.setPath(path)
    this.#config.inputFile = path
    return this
  }

  /**
   * Sets the output file path.
   * @param {string} path - The output file path.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  setOutputFile(path) {
    this.#writer.setPath(path)
    this.#config.outputFile = path
    return this
  }

  /**
   * Sets the CSV delimiter.
   * @param {string} delimiter - The CSV delimiter.
   * @returns {DataProcessorEnhanced} This instance for method chaining.
   */
  setDelimiter(delimiter) {
    this.#config.delimiter = delimiter
    return this
  }

  /**
   * Static method for quick processing.
   * @param {string} inputFile - Path to the input file.
   * @param {string} outputFile - Path to the output file.
   * @param {string[]} patterns - Date patterns to filter by.
   * @returns {string[]} The filtered data.
   */
  static async quickProcess(inputFile, outputFile, patterns = ['2026-09-06']) {
    const processor = new DataProcessorEnhanced({
      inputFile,
      outputFile,
      patterns
    })
    return processor.process().getData()
  }

  /**
   * Static method for quick processing with CSV parsing.
   * @param {string} inputFile - Path to the input file.
   * @param {string} outputFile - Path to the output file.
   * @param {string[]} patterns - Date patterns to filter by.
   * @returns {Object[]} The filtered data as objects.
   */
  static async quickProcessWithParsing(inputFile, outputFile, patterns = ['2026-09-06']) {
    const processor = new DataProcessorEnhanced({
      inputFile,
      outputFile,
      patterns
    })
    return processor.processWithParsing().getObjects()
  }
}

export { DataProcessorEnhanced }

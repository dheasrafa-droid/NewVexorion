/**
 * A class for parsing CSV data into structured objects or arrays.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
class CSVParser {
  #delimiter = ','
  #hasHeader = true
  #headers = []
  #data = []

  /**
   * Creates a new CSVParser instance.
   * @param {Object} options - Configuration options.
   * @param {string} options.delimiter - The delimiter used in the CSV (default: ',').
   * @param {boolean} options.hasHeader - Whether the CSV has a header row (default: true).
   */
  constructor(options = {}) {
    this.#delimiter = options.delimiter || ','
    this.#hasHeader = options.hasHeader !== undefined ? options.hasHeader : true
  }

  /**
   * Parses an array of lines into structured data.
   * @param {string[]} lines - Array of CSV lines.
   * @returns {Object} Result with success status, headers, data, and count.
   * @returns {boolean} result.success - Whether parsing was successful.
   * @returns {string} result.error - Error message if parsing failed.
   * @returns {string[]} result.headers - The header row.
   * @returns {string[][]} result.data - The parsed data rows.
   * @returns {number} result.count - The number of data rows.
   */
  parse(lines) {
    if (!lines || lines.length === 0) {
      return { success: false, error: 'No data to parse' }
    }

    const rows = lines.map(line => {
      const clean = line.replace(/<[^>]+>/g, '').trim()
      return clean.split(this.#delimiter).map(field => field.trim())
    })

    if (this.#hasHeader) {
      this.#headers = rows[0]
      this.#data = rows.slice(1)
    } else {
      this.#data = rows
      this.#headers = rows[0] ? rows[0].map((_, index) => `Column${index + 1}`) : []
    }

    return {
      success: true,
      headers: this.#headers,
      data: this.#data,
      count: this.#data.length
    }
  }

  /**
   * Converts the parsed data to an array of objects.
   * @returns {Object[]} Array of objects with header keys.
   */
  toObjects() {
    return this.#data.map(row => {
      const obj = {}
      this.#headers.forEach((header, index) => {
        obj[header] = row[index] || ''
      })
      return obj
    })
  }

  /**
   * Converts the parsed data to JSON string.
   * @returns {string} JSON representation of the data.
   */
  toJSON() {
    return JSON.stringify(this.toObjects(), null, 2)
  }

  /**
   * Returns the headers.
   * @returns {string[]} Array of header names.
   */
  getHeaders() {
    return this.#headers
  }

  /**
   * Returns the parsed data.
   * @returns {string[][]} Array of data rows.
   */
  getData() {
    return this.#data
  }

  /**
   * Returns the number of data rows.
   * @returns {number} The count of data rows.
   */
  getCount() {
    return this.#data.length
  }

  /**
   * Static method to parse CSV lines in one call.
   * @param {string[]} lines - Array of CSV lines.
   * @param {Object} options - Configuration options.
   * @returns {Object} The parsed result.
   */
  static parseLines(lines, options = {}) {
    const parser = new CSVParser(options)
    return parser.parse(lines)
  }
}

export { CSVParser }

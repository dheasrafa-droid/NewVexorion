/**
 * A class for exporting data to various formats including CSV, JSON, and HTML.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

class DataExporter {
  #data = []
  #headers = []

  /**
   * Creates a new DataExporter instance.
   * @param {Object[]|string[][]} data - The data to export.
   * @param {string[]} headers - Optional headers for the data.
   */
  constructor(data = [], headers = []) {
    this.#data = data
    this.#headers = headers
  }

  /**
   * Sets the data to export.
   * @param {Object[]|string[][]} data - The data to export.
   * @returns {DataExporter} This instance for method chaining.
   */
  setData(data) {
    this.#data = data
    return this
  }

  /**
   * Sets the headers for the data.
   * @param {string[]} headers - Array of header names.
   * @returns {DataExporter} This instance for method chaining.
   */
  setHeaders(headers) {
    this.#headers = headers
    return this
  }

  /**
   * Converts the data to CSV format.
   * @param {string} delimiter - The delimiter to use (default: ',').
   * @returns {string} The CSV string.
   */
  toCSV(delimiter = ',') {
    if (this.#data.length === 0) return ''

    let csv = ''
    if (this.#headers.length > 0) {
      csv += this.#headers.join(delimiter) + '\n'
    }

    this.#data.forEach(row => {
      if (Array.isArray(row)) {
        csv += row.join(delimiter) + '\n'
      } else if (typeof row === 'object') {
        const values = this.#headers.map(header => row[header] || '')
        csv += values.join(delimiter) + '\n'
      } else {
        csv += row + '\n'
      }
    })

    return csv
  }

  /**
   * Converts the data to JSON format.
   * @returns {string} The JSON string.
   */
  toJSON() {
    return JSON.stringify(this.#data, null, 2)
  }

  /**
   * Converts the data to HTML table format.
   * @returns {string} The HTML string.
   */
  toHTML() {
    if (this.#data.length === 0) return '<p>No data</p>'

    let html = '<table border="1" cellpadding="5" cellspacing="0">'

    if (this.#headers.length > 0) {
      html += '<thead><tr>'
      this.#headers.forEach(header => {
        html += `<th>${header}</th>`
      })
      html += '</tr></thead>'
    }

    html += '<tbody>'
    this.#data.forEach(row => {
      html += '<tr>'
      if (Array.isArray(row)) {
        row.forEach(value => {
          html += `<td>${value}</td>`
        })
      } else if (typeof row === 'object') {
        this.#headers.forEach(header => {
          html += `<td>${row[header] || ''}</td>`
        })
      } else {
        html += `<td>${row}</td>`
      }
      html += '</tr>'
    })
    html += '</tbody></table>'

    return html
  }

  /**
   * Saves the data as a CSV file.
   * @param {string} filePath - The path to save the file.
   * @param {string} delimiter - The delimiter to use (default: ',').
   * @returns {boolean} True if successful.
   */
  saveCSV(filePath, delimiter = ',') {
    try {
      const fullPath = join(process.cwd(), filePath)
      const folder = dirname(fullPath)
      mkdirSync(folder, { recursive: true })

      const content = this.toCSV(delimiter)
      writeFileSync(fullPath, content, 'utf-8')
      console.log(`CSV exported: ${filePath}`)
      return true
    } catch (error) {
      console.error(`Failed to export CSV: ${error.message}`)
      return false
    }
  }

  /**
   * Saves the data as a JSON file.
   * @param {string} filePath - The path to save the file.
   * @returns {boolean} True if successful.
   */
  saveJSON(filePath) {
    try {
      const fullPath = join(process.cwd(), filePath)
      const folder = dirname(fullPath)
      mkdirSync(folder, { recursive: true })

      const content = this.toJSON()
      writeFileSync(fullPath, content, 'utf-8')
      console.log(`JSON exported: ${filePath}`)
      return true
    } catch (error) {
      console.error(`Failed to export JSON: ${error.message}`)
      return false
    }
  }

  /**
   * Saves the data as an HTML file.
   * @param {string} filePath - The path to save the file.
   * @returns {boolean} True if successful.
   */
  saveHTML(filePath) {
    try {
      const fullPath = join(process.cwd(), filePath)
      const folder = dirname(fullPath)
      mkdirSync(folder, { recursive: true })

      const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exported Data</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #1a1a2e; color: white; }
  </style>
</head>
<body>
  <h1>Exported Data</h1>
  ${this.toHTML()}
</body>
</html>
      `
      writeFileSync(fullPath, content, 'utf-8')
      console.log(`HTML exported: ${filePath}`)
      return true
    } catch (error) {
      console.error(`Failed to export HTML: ${error.message}`)
      return false
    }
  }

  /**
   * Static method to export data to CSV.
   * @param {Object[]|string[][]} data - The data to export.
   * @param {string} filePath - The path to save the file.
   * @param {string[]} headers - Optional headers.
   * @param {string} delimiter - The delimiter to use (default: ',').
   * @returns {boolean} True if successful.
   */
  static exportToCSV(data, filePath, headers = [], delimiter = ',') {
    const exporter = new DataExporter(data, headers)
    return exporter.saveCSV(filePath, delimiter)
  }

  /**
   * Static method to export data to JSON.
   * @param {Object[]} data - The data to export.
   * @param {string} filePath - The path to save the file.
   * @returns {boolean} True if successful.
   */
  static exportToJSON(data, filePath) {
    const exporter = new DataExporter(data)
    return exporter.saveJSON(filePath)
  }
}

export { DataExporter }

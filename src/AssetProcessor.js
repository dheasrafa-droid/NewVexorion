/**
 * AssetProcessor - Process files from assets folder
 * Supports: CSV, JSON, XML, TXT, HTML, Markdown, YAML
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { AssetLoader } from './AssetLoader.js'
import { CSVParser } from './CSVParser.js'
import { DataTransformer } from './DataTransformer.js'
import { DataAggregator } from './DataAggregator.js'
import { logger } from './Logger.js'
import { config } from './Config.js'

class AssetProcessor {
  #loader
  #data = {}
  #processed = {}
  #patterns = ['2026-09-06']

  /**
   * Creates a new AssetProcessor instance.
   * @param {string} assetsPath - Path to assets folder (default: 'assets')
   * @param {string[]} patterns - Date patterns for filtering
   */
  constructor(assetsPath = 'assets', patterns = null) {
    this.#loader = new AssetLoader(assetsPath)
    this.#patterns = patterns || config.getPatterns() || ['2026-09-06']
    this.#loader.scan()
  }

  /**
   * Processes all files in assets folder.
   * @param {string|string[]} extensions - Filter by extensions (optional)
   * @returns {Object} Processed data by file.
   */
  processAll(extensions = null) {
    const files = this.#loader.readAll(extensions)
    this.#processed = {}

    for (const [path, fileData] of Object.entries(files)) {
      if (fileData.content) {
        this.#processed[path] = this.#processFile(fileData)
      } else {
        this.#processed[path] = {
          success: false,
          error: fileData.error || 'No content'
        }
      }
    }

    logger.info(`🔧 Processed ${Object.keys(this.#processed).length} files`)
    return this.#processed
  }

  /**
   * Processes a single file based on its type.
   * @param {Object} fileData - File data from AssetLoader.
   * @returns {Object} Processed result.
   */
  #processFile(fileData) {
    const { content, type, ext, name, relative } = fileData

    switch (type) {
      case 'csv':
        return this.#processCSV(content, relative)
      case 'json':
        return this.#processJSON(content, relative)
      case 'xml':
        return this.#processXML(content, relative)
      case 'html':
        return this.#processHTML(content, relative)
      case 'text':
        return this.#processText(content, relative)
      case 'markdown':
        return this.#processMarkdown(content, relative)
      case 'log':
        return this.#processLog(content, relative)
      case 'yaml':
        return this.#processYAML(content, relative)
      default:
        return {
          success: false,
          error: `Unsupported file type: ${type}`,
          type: type,
          name: name
        }
    }
  }

  /**
   * Processes CSV file.
   * @param {string} content - File content.
   * @param {string} path - File path.
   * @returns {Object} Processed CSV data.
   */
  #processCSV(content, path) {
    try {
      const lines = content.split('\n').filter(line => line.trim())
      const parser = new CSVParser({
        delimiter: config.getDelimiter() || ',',
        hasHeader: config.hasHeader() !== undefined ? config.hasHeader() : true
      })
      
      const parsed = parser.parse(lines)
      
      if (!parsed.success) {
        return { success: false, error: parsed.error }
      }

      const objects = parser.toObjects()
      const filtered = objects.filter(item => {
        const date = item.date || item.Date || item.tanggal || item.Tanggal || ''
        return this.#patterns.some(pattern => date.includes(pattern))
      })

      return {
        success: true,
        type: 'csv',
        path: path,
        total: objects.length,
        filtered: filtered.length,
        data: filtered,
        headers: parser.getHeaders(),
        raw: parsed.data
      }
    } catch (error) {
      return { success: false, error: error.message, type: 'csv', path: path }
    }
  }

  /**
   * Processes JSON file.
   * @param {string} content - File content.
   * @param {string} path - File path.
   * @returns {Object} Processed JSON data.
   */
  #processJSON(content, path) {
    try {
      const data = JSON.parse(content)
      let items = Array.isArray(data) ? data : [data]
      
      const filtered = items.filter(item => {
        const date = item.date || item.Date || item.tanggal || item.Tanggal || ''
        return this.#patterns.some(pattern => date.includes(pattern))
      })

      return {
        success: true,
        type: 'json',
        path: path,
        total: items.length,
        filtered: filtered.length,
        data: filtered,
        original: data
      }
    } catch (error) {
      return { success: false, error: error.message, type: 'json', path: path }
    }
  }

  /**
   * Processes XML file (simple parse).
   * @param {string} content - File content.
   * @param {string} path - File path.
   * @returns {Object} Processed XML data.
   */
  #processXML(content, path) {
    try {
      const lines = content.split('\n')
      const items = []
      let currentItem = {}
      let inTag = false
      let tagName = ''
      let tagContent = ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('<?')) {
          inTag = true
          tagName = trimmed.replace(/[<]/g, '').split(/[\s>]/)[0]
          tagContent = ''
        } else if (trimmed.startsWith('</')) {
          inTag = false
          if (tagName) {
            currentItem[tagName] = tagContent.trim()
          }
          tagName = ''
          tagContent = ''
        } else if (inTag && !trimmed.startsWith('<')) {
          tagContent += ' ' + trimmed
        } else if (trimmed.startsWith('<') && trimmed.includes('>') && !trimmed.startsWith('</')) {
          const parts = trimmed.replace(/[<>]/g, '').split(' ')
          const tag = parts[0]
          const attrs = {}
          for (let i = 1; i < parts.length; i++) {
            const [key, value] = parts[i].split('=')
            if (key && value) {
              attrs[key] = value.replace(/["']/g, '')
            }
          }
          items.push({ tag, ...attrs })
          currentItem = {}
        } else if (trimmed.startsWith('</') && !inTag) {
          if (Object.keys(currentItem).length > 0) {
            items.push({ ...currentItem })
            currentItem = {}
          }
        }
      }

      const filtered = items.filter(item => {
        const date = item.date || item.Date || item.tanggal || item.Tanggal || ''
        return this.#patterns.some(pattern => date.includes(pattern))
      })

      return {
        success: true,
        type: 'xml',
        path: path,
        total: items.length,
        filtered: filtered.length,
        data: filtered,
        raw: items
      }
    } catch (error) {
      return { success: false, error: error.message, type: 'xml', path: path }
    }
  }

  /**
   * Processes HTML file.
   * @param {string} content - File content.
   * @param {string} path - File path.
   * @returns {Object} Processed HTML data.
   */
  #processHTML(content, path) {
    try {
      const lines = content.split('\n').filter(line => line.trim())
      const items = lines.filter(line => {
        return this.#patterns.some(pattern => line.includes(pattern))
      })

      return {
        success: true,
        type: 'html',
        path: path,
        total: lines.length,
        filtered: items.length,
        data: items,
        raw: lines
      }
    } catch (error) {
      return { success: false, error: error.message, type: 'html', path: path }
    }
  }

  /**
   * Processes Text file.
   * @param {string} content - File content.
   * @param {string} path - File path.
   * @returns {Object} Processed text data.
   */
  #processText(content, path) {
    try {
      const lines = content.split('\n').filter(line => line.trim())
      const filtered = lines.filter(line =>
        this.#patterns.some(pattern => line.includes(pattern))
      )

      return {
        success: true,
        type: 'text',
        path: path,
        total: lines.length,
        filtered: filtered.length,
        data: filtered,
        raw: lines
      }
    } catch (error) {
      return { success: false, error: error.message, type: 'text', path: path }
    }
  }

  /**
   * Processes Markdown file.
   * @param {string} content - File content.
   * @param {string} path - File path.
   * @returns {Object} Processed markdown data.
   */
  #processMarkdown(content, path) {
    try {
      const lines = content.split('\n').filter(line => line.trim())
      const filtered = lines.filter(line =>
        this.#patterns.some(pattern => line.includes(pattern))
      )

      return {
        success: true,
        type: 'markdown',
        path: path,
        total: lines.length,
        filtered: filtered.length,
        data: filtered,
        raw: lines
      }
    } catch (error) {
      return { success: false, error: error.message, type: 'markdown', path: path }
    }
  }

  /**
   * Processes Log file.
   * @param {string} content - File content.
   * @param {string} path - File path.
   * @returns {Object} Processed log data.
   */
  #processLog(content, path) {
    try {
      const lines = content.split('\n').filter(line => line.trim())
      const filtered = lines.filter(line =>
        this.#patterns.some(pattern => line.includes(pattern))
      )

      return {
        success: true,
        type: 'log',
        path: path,
        total: lines.length,
        filtered: filtered.length,
        data: filtered,
        raw: lines
      }
    } catch (error) {
      return { success: false, error: error.message, type: 'log', path: path }
    }
  }

  /**
   * Processes YAML file (simple parse).
   * @param {string} content - File content.
   * @param {string} path - File path.
   * @returns {Object} Processed YAML data.
   */
  #processYAML(content, path) {
    try {
      const lines = content.split('\n').filter(line => line.trim())
      const items = {}
      let currentKey = ''
      
      for (const line of lines) {
        if (line.includes(':') && !line.startsWith(' ') && !line.startsWith('-')) {
          const [key, value] = line.split(':').map(s => s.trim())
          if (key && value !== undefined) {
            currentKey = key
            items[key] = value
          }
        } else if (line.startsWith(' ') && currentKey) {
          items[currentKey] += ' ' + line.trim()
        } else if (line.startsWith('-') && currentKey) {
          if (!Array.isArray(items[currentKey])) {
            items[currentKey] = []
          }
          items[currentKey].push(line.replace('-', '').trim())
        }
      }

      return {
        success: true,
        type: 'yaml',
        path: path,
        data: items,
        raw: lines
      }
    } catch (error) {
      return { success: false, error: error.message, type: 'yaml', path: path }
    }
  }

  /**
   * Gets processed data for a specific file.
   * @param {string} path - File path.
   * @returns {Object} Processed data.
   */
  getProcessed(path) {
    return this.#processed[path] || null
  }

  /**
   * Gets all processed data.
   * @returns {Object} All processed data.
   */
  getAllProcessed() {
    return this.#processed
  }

  /**
   * Gets files that were processed successfully.
   * @returns {Object} Successfully processed files.
   */
  getSuccessful() {
    const result = {}
    for (const [path, data] of Object.entries(this.#processed)) {
      if (data.success) {
        result[path] = data
      }
    }
    return result
  }

  /**
   * Gets files that failed to process.
   * @returns {Object} Failed files with errors.
   */
  getFailed() {
    const result = {}
    for (const [path, data] of Object.entries(this.#processed)) {
      if (!data.success) {
        result[path] = data
      }
    }
    return result
  }

  /**
   * Gets summary of processed files.
   * @returns {Object} Summary statistics.
   */
  getSummary() {
    const successful = this.getSuccessful()
    const failed = this.getFailed()
    let totalEntries = 0
    let totalFiltered = 0

    for (const [path, data] of Object.entries(successful)) {
      totalEntries += data.total || 0
      totalFiltered += data.filtered || 0
    }

    return {
      totalFiles: Object.keys(this.#processed).length,
      successful: Object.keys(successful).length,
      failed: Object.keys(failed).length,
      totalEntries: totalEntries,
      totalFiltered: totalFiltered,
      successRate: Object.keys(this.#processed).length > 0 
        ? (Object.keys(successful).length / Object.keys(this.#processed).length * 100).toFixed(2) + '%'
        : '0%'
    }
  }

  /**
   * Static method to quickly process all assets.
   * @param {string} assetsPath - Path to assets folder.
   * @param {string|string[]} extensions - Filter by extensions.
   * @param {string[]} patterns - Date patterns.
   * @returns {Object} Processed data.
   */
  static processAll(assetsPath = 'assets', extensions = null, patterns = null) {
    const processor = new AssetProcessor(assetsPath, patterns)
    return processor.processAll(extensions)
  }

  /**
   * Static method to quickly process a specific file.
   * @param {string} filePath - Path to file.
   * @param {string} assetsPath - Path to assets folder.
   * @param {string[]} patterns - Date patterns.
   * @returns {Object} Processed data.
   */
  static processFile(filePath, assetsPath = 'assets', patterns = null) {
    const processor = new AssetProcessor(assetsPath, patterns)
    const fileData = processor.#loader.readFile(filePath)
    if (fileData.success) {
      return processor.#processFile(fileData)
    }
    return { success: false, error: 'File not found' }
  }
}

export { AssetProcessor }

/**
 * AssetLoader - Read all files from assets folder
 * Supports: .txt, .csv, .json, .xml, .html, .md, .log, .yml, .yaml
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'
import { logger } from './Logger.js'
import { config } from './Config.js'

class AssetLoader {
  #assetsPath = 'assets'
  #files = []
  #content = {}
  #supportedExtensions = {
    '.txt': 'text',
    '.csv': 'csv',
    '.json': 'json',
    '.xml': 'xml',
    '.html': 'html',
    '.htm': 'html',
    '.md': 'markdown',
    '.log': 'log',
    '.yml': 'yaml',
    '.yaml': 'yaml',
    '.js': 'javascript',
    '.css': 'css',
    '.env': 'env',
    '.gitignore': 'gitignore'
  }

  /**
   * Creates a new AssetLoader instance.
   * @param {string} assetsPath - Path to assets folder (default: 'assets')
   */
  constructor(assetsPath = 'assets') {
    this.#assetsPath = assetsPath
  }

  /**
   * Scans the assets folder for all files.
   * @param {string} subPath - Subdirectory to scan (optional)
   * @returns {AssetLoader} This instance for method chaining.
   */
  scan(subPath = '') {
    const fullPath = join(process.cwd(), this.#assetsPath, subPath)
    this.#files = []
    this.#scanDirectory(fullPath, subPath)
    logger.info(`📁 Scanned ${this.#files.length} files in assets folder`)
    return this
  }

  /**
   * Recursively scans a directory for files.
   * @param {string} dir - Directory path.
   * @param {string} relativePath - Relative path from assets root.
   */
  #scanDirectory(dir, relativePath) {
    try {
      const items = readdirSync(dir)
      
      for (const item of items) {
        const fullPath = join(dir, item)
        const stat = statSync(fullPath)
        const relative = join(relativePath, item)
        
        if (stat.isDirectory()) {
          this.#scanDirectory(fullPath, relative)
        } else {
          const ext = extname(item).toLowerCase()
          const type = this.#supportedExtensions[ext] || 'unknown'
          this.#files.push({
            name: item,
            path: fullPath,
            relative: relative,
            ext: ext,
            type: type,
            size: stat.size,
            modified: stat.mtime
          })
        }
      }
    } catch (error) {
      logger.error(`Failed to scan directory: ${dir}`, error.message)
    }
  }

  /**
   * Reads all files in the assets folder.
   * @param {string|string[]} extensions - Filter by extensions (optional)
   * @param {string|string[]} types - Filter by types (optional)
   * @returns {Object} Object with file paths as keys and content as values.
   */
  readAll(extensions = null, types = null) {
    this.#content = {}
    
    let filteredFiles = this.#files
    
    if (extensions) {
      const extList = Array.isArray(extensions) ? extensions : [extensions]
      filteredFiles = filteredFiles.filter(f => 
        extList.some(ext => f.ext === ext || f.ext === ext.toLowerCase())
      )
    }
    
    if (types) {
      const typeList = Array.isArray(types) ? types : [types]
      filteredFiles = filteredFiles.filter(f => 
        typeList.some(type => f.type === type)
      )
    }

    for (const file of filteredFiles) {
      try {
        this.#content[file.relative] = {
          ...file,
          content: readFileSync(file.path, 'utf-8')
        }
      } catch (error) {
        logger.error(`Failed to read file: ${file.path}`, error.message)
        this.#content[file.relative] = {
          ...file,
          content: null,
          error: error.message
        }
      }
    }

    logger.info(`📖 Read ${Object.keys(this.#content).length} files`)
    return this.#content
  }

  /**
   * Reads a specific file from assets folder.
   * @param {string} filePath - Relative path to file.
   * @returns {Object} File content and metadata.
   */
  readFile(filePath) {
    const fullPath = join(process.cwd(), this.#assetsPath, filePath)
    const ext = extname(filePath).toLowerCase()
    
    try {
      const content = readFileSync(fullPath, 'utf-8')
      const stat = statSync(fullPath)
      
      return {
        name: basename(filePath),
        path: fullPath,
        relative: filePath,
        ext: ext,
        type: this.#supportedExtensions[ext] || 'unknown',
        size: stat.size,
        modified: stat.mtime,
        content: content,
        success: true
      }
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`, error.message)
      return {
        name: basename(filePath),
        path: fullPath,
        relative: filePath,
        ext: ext,
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Gets files by type.
   * @param {string} type - File type (text, csv, json, etc.)
   * @returns {Array} Array of files with matching type.
   */
  getFilesByType(type) {
    return this.#files.filter(f => f.type === type)
  }

  /**
   * Gets files by extension.
   * @param {string} ext - File extension (e.g., '.csv')
   * @returns {Array} Array of files with matching extension.
   */
  getFilesByExtension(ext) {
    const extLower = ext.toLowerCase()
    return this.#files.filter(f => f.ext === extLower)
  }

  /**
   * Gets all files.
   * @returns {Array} Array of all files.
   */
  getFiles() {
    return this.#files
  }

  /**
   * Gets file statistics.
   * @returns {Object} Statistics about files in assets folder.
   */
  getStats() {
    const stats = {
      total: this.#files.length,
      byType: {},
      byExtension: {},
      totalSize: 0
    }

    for (const file of this.#files) {
      stats.byType[file.type] = (stats.byType[file.type] || 0) + 1
      stats.byExtension[file.ext] = (stats.byExtension[file.ext] || 0) + 1
      stats.totalSize += file.size
    }

    return stats
  }

  /**
   * Filters files by name pattern.
   * @param {string|RegExp} pattern - Pattern to match.
   * @returns {Array} Array of matching files.
   */
  filterByName(pattern) {
    const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i')
    return this.#files.filter(f => regex.test(f.name))
  }

  /**
   * Static method to quickly load all assets.
   * @param {string} assetsPath - Path to assets folder.
   * @param {string|string[]} extensions - Filter by extensions.
   * @returns {Object} File contents.
   */
  static loadAll(assetsPath = 'assets', extensions = null) {
    const loader = new AssetLoader(assetsPath)
    loader.scan()
    return loader.readAll(extensions)
  }

  /**
   * Static method to quickly load a specific file.
   * @param {string} filePath - Path to file.
   * @param {string} assetsPath - Path to assets folder.
   * @returns {Object} File content and metadata.
   */
  static loadFile(filePath, assetsPath = 'assets') {
    const loader = new AssetLoader(assetsPath)
    return loader.readFile(filePath)
  }
}

export { AssetLoader }

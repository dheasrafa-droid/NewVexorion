/**
 * Configuration manager for NewVexorion
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { readFileSync } from 'fs'
import { join } from 'path'
import { logger } from './Logger.js'

class Config {
  #config = {}
  #configPath = null
  #isLoaded = false

  /**
   * Creates a new Config instance.
   * @param {string} configPath - Path to the config file.
   */
  constructor(configPath = 'config.json') {
    this.#configPath = configPath
    this.load()
  }

  /**
   * Loads the configuration from file.
   * @returns {Config} This instance for method chaining.
   */
  load() {
    try {
      const fullPath = join(process.cwd(), this.#configPath)
      const content = readFileSync(fullPath, 'utf-8')
      this.#config = JSON.parse(content)
      this.#isLoaded = true
      logger.info(`✅ Configuration loaded from ${this.#configPath}`)
    } catch (error) {
      logger.warn(`⚠️ Failed to load config from ${this.#configPath}, using defaults`)
      this.#config = this.#getDefaultConfig()
      this.#isLoaded = true
    }
    return this
  }

  /**
   * Gets default configuration.
   * @returns {Object} Default configuration.
   */
  #getDefaultConfig() {
    return {
      project: 'NewVexorion',
      repository: 'https://github.com/dheasrafa-droid/NewVexorion',
      liveDemo: 'https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/',
      author: 'Prasetyo Bayu Widodo',
      patterns: ['2026-09-06'],
      inputDir: './example',
      outputDir: './output',
      web: {
        port: 8080,
        title: 'NewVexorion Data Viewer'
      },
      csv: {
        delimiter: ',',
        hasHeader: true
      },
      validation: {
        dateFormat: 'YYYY-MM-DD',
        requiredFields: ['name', 'date', 'team']
      },
      logging: {
        level: 'info',
        file: 'logs/app.log'
      }
    }
  }

  /**
   * Gets a configuration value by key.
   * @param {string} key - Dot notation key (e.g., 'web.port').
   * @param {*} defaultValue - Default value if key not found.
   * @returns {*} Configuration value.
   */
  get(key, defaultValue = undefined) {
    if (!this.#isLoaded) {
      this.load()
    }

    const keys = key.split('.')
    let value = this.#config

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue
      }
    }

    return value !== undefined ? value : defaultValue
  }

  /**
   * Sets a configuration value.
   * @param {string} key - Dot notation key.
   * @param {*} value - Value to set.
   * @returns {Config} This instance for method chaining.
   */
  set(key, value) {
    const keys = key.split('.')
    let current = this.#config

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {}
      }
      current = current[k]
    }

    current[keys[keys.length - 1]] = value
    return this
  }

  /**
   * Gets all configuration.
   * @returns {Object} All configuration.
   */
  getAll() {
    return this.#config
  }

  /**
   * Gets environment-specific configuration.
   * @param {string} env - Environment name (development, production, test).
   * @returns {Object} Environment configuration.
   */
  getEnv(env = process.env.NODE_ENV || 'development') {
    const envConfig = this.get('environments', {})
    return envConfig[env] || {}
  }

  /**
   * Checks if a configuration key exists.
   * @param {string} key - Dot notation key.
   * @returns {boolean} True if key exists.
   */
  has(key) {
    try {
      return this.get(key) !== undefined
    } catch {
      return false
    }
  }

  /**
   * Merges configuration with another object.
   * @param {Object} config - Configuration to merge.
   * @returns {Config} This instance for method chaining.
   */
  merge(config) {
    this.#config = this.#deepMerge(this.#config, config)
    return this
  }

  /**
   * Deep merges two objects.
   * @param {Object} target - Target object.
   * @param {Object} source - Source object.
   * @returns {Object} Merged object.
   */
  #deepMerge(target, source) {
    const result = { ...target }
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.#deepMerge(target[key] || {}, source[key])
      } else {
        result[key] = source[key]
      }
    }
    return result
  }

  /**
   * Gets the project name.
   * @returns {string} Project name.
   */
  getProject() {
    return this.get('project', 'NewVexorion')
  }

  /**
   * Gets the repository URL.
   * @returns {string} Repository URL.
   */
  getRepository() {
    return this.get('repository', 'https://github.com/dheasrafa-droid/NewVexorion')
  }

  /**
   * Gets the live demo URL.
   * @returns {string} Live demo URL.
   */
  getLiveDemo() {
    return this.get('liveDemo', 'https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/')
  }

  /**
   * Gets the date patterns.
   * @returns {string[]} Date patterns.
   */
  getPatterns() {
    return this.get('patterns', ['2026-09-06'])
  }

  /**
   * Gets the CSV delimiter.
   * @returns {string} CSV delimiter.
   */
  getDelimiter() {
    return this.get('csv.delimiter', ',')
  }

  /**
   * Gets whether CSV has header.
   * @returns {boolean} True if CSV has header.
   */
  hasHeader() {
    return this.get('csv.hasHeader', true)
  }

  /**
   * Gets the output directory.
   * @returns {string} Output directory.
   */
  getOutputDir() {
    return this.get('outputDir', './output')
  }

  /**
   * Gets the input directory.
   * @returns {string} Input directory.
   */
  getInputDir() {
    return this.get('inputDir', './example')
  }

  /**
   * Gets the web port.
   * @returns {number} Web port.
   */
  getWebPort() {
    return this.get('web.port', 8080)
  }

  /**
   * Gets the log level.
   * @returns {string} Log level.
   */
  getLogLevel() {
    return this.get('logging.level', 'info')
  }

  /**
   * Gets the log file path.
   * @returns {string} Log file path.
   */
  getLogFile() {
    return this.get('logging.file', 'logs/app.log')
  }
}

export const config = new Config()
export { Config }

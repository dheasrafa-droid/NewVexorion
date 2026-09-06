/**
 * Logger utility for NewVexorion
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { writeFileSync, appendFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

class Logger {
  static #instance = null
  #logFile = null
  #level = 'info'
  #levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4
  }

  /**
   * Private constructor for singleton pattern.
   */
  constructor() {
    if (Logger.#instance) {
      return Logger.#instance
    }
    Logger.#instance = this
  }

  /**
   * Gets the singleton instance.
   * @returns {Logger} The logger instance.
   */
  static getInstance() {
    if (!Logger.#instance) {
      Logger.#instance = new Logger()
    }
    return Logger.#instance
  }

  /**
   * Sets the log file path.
   * @param {string} filePath - Path to the log file.
   * @returns {Logger} This instance for method chaining.
   */
  setLogFile(filePath) {
    try {
      const fullPath = join(process.cwd(), filePath)
      const folder = dirname(fullPath)
      mkdirSync(folder, { recursive: true })
      this.#logFile = fullPath
      
      try {
        writeFileSync(fullPath, '', 'utf-8')
      } catch (error) {
        // File might already exist
      }
    } catch (error) {
      console.error(`Failed to set log file: ${error.message}`)
    }
    return this
  }

  /**
   * Sets the log level.
   * @param {string} level - Log level (error, warn, info, debug, trace).
   * @returns {Logger} This instance for method chaining.
   */
  setLevel(level) {
    if (this.#levels[level] !== undefined) {
      this.#level = level
    }
    return this
  }

  /**
   * Formats a log message.
   * @param {string} level - Log level.
   * @param {string} message - Log message.
   * @param {Object} data - Additional data to log.
   * @returns {string} Formatted log message.
   */
  #formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString()
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`
    if (data) {
      logMessage += `\n${JSON.stringify(data, null, 2)}`
    }
    return logMessage
  }

  /**
   * Writes a log message to file and console.
   * @param {string} level - Log level.
   * @param {string} message - Log message.
   * @param {Object} data - Additional data to log.
   */
  #log(level, message, data = null) {
    const levelValue = this.#levels[level] || 0
    const currentLevelValue = this.#levels[this.#level] || 2

    if (levelValue > currentLevelValue) return

    const formattedMessage = this.#formatMessage(level, message, data)

    const consoleMethod = level === 'error' ? 'error' : 
                         level === 'warn' ? 'warn' : 'log'
    console[consoleMethod](formattedMessage)

    if (this.#logFile) {
      try {
        appendFileSync(this.#logFile, formattedMessage + '\n', 'utf-8')
      } catch (error) {
        console.error(`Failed to write to log file: ${error.message}`)
      }
    }
  }

  /**
   * Logs an error message.
   * @param {string} message - Error message.
   * @param {Object} data - Additional data.
   */
  error(message, data = null) {
    this.#log('error', message, data)
  }

  /**
   * Logs a warning message.
   * @param {string} message - Warning message.
   * @param {Object} data - Additional data.
   */
  warn(message, data = null) {
    this.#log('warn', message, data)
  }

  /**
   * Logs an info message.
   * @param {string} message - Info message.
   * @param {Object} data - Additional data.
   */
  info(message, data = null) {
    this.#log('info', message, data)
  }

  /**
   * Logs a debug message.
   * @param {string} message - Debug message.
   * @param {Object} data - Additional data.
   */
  debug(message, data = null) {
    this.#log('debug', message, data)
  }

  /**
   * Logs a trace message.
   * @param {string} message - Trace message.
   * @param {Object} data - Additional data.
   */
  trace(message, data = null) {
    this.#log('trace', message, data)
  }

  /**
   * Logs the start of a process.
   * @param {string} processName - Name of the process.
   * @param {Object} params - Parameters for the process.
   */
  logStart(processName, params = null) {
    this.info(`🚀 Starting ${processName}`, params)
  }

  /**
   * Logs the end of a process.
   * @param {string} processName - Name of the process.
   * @param {Object} result - Result of the process.
   */
  logEnd(processName, result = null) {
    this.info(`✅ Completed ${processName}`, result)
  }

  /**
   * Logs an error that occurred during a process.
   * @param {string} processName - Name of the process.
   * @param {Error} error - The error that occurred.
   */
  logError(processName, error) {
    this.error(`❌ ${processName} failed`, {
      message: error.message,
      stack: error.stack
    })
  }

  /**
   * Creates a child logger with a specific context.
   * @param {string} context - Context name.
   * @returns {Object} Child logger with context.
   */
  child(context) {
    const logger = this
    return {
      error: (message, data) => logger.error(`[${context}] ${message}`, data),
      warn: (message, data) => logger.warn(`[${context}] ${message}`, data),
      info: (message, data) => logger.info(`[${context}] ${message}`, data),
      debug: (message, data) => logger.debug(`[${context}] ${message}`, data),
      trace: (message, data) => logger.trace(`[${context}] ${message}`, data),
      logStart: (name, params) => logger.logStart(`[${context}] ${name}`, params),
      logEnd: (name, result) => logger.logEnd(`[${context}] ${name}`, result),
      logError: (name, error) => logger.logError(`[${context}] ${name}`, error)
    }
  }
}

export const logger = Logger.getInstance()
export { Logger }

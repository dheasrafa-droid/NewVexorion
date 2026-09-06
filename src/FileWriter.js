/**
 * A class for writing files to the filesystem synchronously.
 * Provides fluent interface for method chaining.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

class FileWriter {
  #path = ''

  /**
   * Creates a new FileWriter instance.
   * @param {string} path - The path where the file will be written.
   */
  constructor(path = '') {
    this.#path = path
  }

  /**
   * Writes data to the file. Creates directories if they don't exist.
   * @param {string|string[]} data - The data to write. If array, joins with newline.
   * @returns {FileWriter} This instance for method chaining.
   */
  write(data) {
    try {
      const fullPath = join(process.cwd(), this.#path)
      const folder = dirname(fullPath)
      mkdirSync(folder, { recursive: true })

      const content = Array.isArray(data) ? data.join('\n') : data
      writeFileSync(fullPath, content, 'utf-8')
      console.log(`File saved: ${this.#path}`)
    } catch (error) {
      console.error(`Failed to save file: ${this.#path}`)
    }
    return this
  }

  /**
   * Sets the file path.
   * @param {string} path - The path where the file will be written.
   * @returns {FileWriter} This instance for method chaining.
   */
  setPath(path) {
    this.#path = path
    return this
  }

  /**
   * Static method to write a file in one line.
   * @param {string} path - The path where the file will be written.
   * @param {string|string[]} data - The data to write.
   * @returns {FileWriter} The FileWriter instance.
   */
  static writeFile(path, data) {
    return new FileWriter(path).write(data)
  }
}

export { FileWriter }

/**
 * A class for reading files from the filesystem synchronously.
 * Provides fluent interface for method chaining.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { readFileSync } from 'fs'
import { join } from 'path'

class FileReader {
  #content = ''
  #path = ''

  /**
   * Creates a new FileReader instance.
   * @param {string} path - The path to the file to read.
   */
  constructor(path = '') {
    this.#path = path
  }

  /**
   * Reads the file content synchronously.
   * @param {string} encoding - The encoding to use (default: 'utf-8').
   * @returns {FileReader} This instance for method chaining.
   */
  read(encoding = 'utf-8') {
    try {
      const fullPath = join(process.cwd(), this.#path)
      this.#content = readFileSync(fullPath, encoding)
    } catch (error) {
      console.error(`Failed to read file: ${this.#path}`)
      this.#content = ''
    }
    return this
  }

  /**
   * Returns the content of the file as a string.
   * @returns {string} The file content.
   */
  getContent() {
    return this.#content
  }

  /**
   * Returns the content split into lines, filtering out empty lines.
   * @returns {string[]} Array of non-empty lines.
   */
  getLines() {
    return this.#content.split('\n').filter(line => line.trim())
  }

  /**
   * Checks if the file content is empty.
   * @returns {boolean} True if the content is empty.
   */
  isEmpty() {
    return this.#content.length === 0
  }

  /**
   * Sets the file path.
   * @param {string} path - The path to the file.
   * @returns {FileReader} This instance for method chaining.
   */
  setPath(path) {
    this.#path = path
    return this
  }

  /**
   * Static method to read a file in one line.
   * @param {string} path - The path to the file.
   * @param {string} encoding - The encoding to use (default: 'utf-8').
   * @returns {string} The file content.
   */
  static readFile(path, encoding = 'utf-8') {
    return new FileReader(path).read(encoding).getContent()
  }
}

export { FileReader }

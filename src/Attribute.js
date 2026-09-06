/**
 * Attribute - A class for managing attributes with change tracking.
 * Inspired by Three.js attribute system.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
class Attribute {
  #name = ''
  #value = null
  #defaultValue = null
  #dirty = false
  #listeners = []
  #readonly = false
  #type = 'any'

  /**
   * Creates a new Attribute instance.
   * @param {Object} options - Configuration options.
   * @param {string} options.name - Attribute name.
   * @param {*} options.value - Initial value.
   * @param {*} options.defaultValue - Default value when reset.
   * @param {boolean} options.readonly - Whether attribute is read-only.
   * @param {string} options.type - Data type (string, number, boolean, object, array, any).
   */
  constructor(options = {}) {
    this.#name = options.name || ''
    this.#defaultValue = options.defaultValue !== undefined ? options.defaultValue : null
    this.#readonly = options.readonly || false
    this.#type = options.type || 'any'
    
    const initialValue = options.value !== undefined ? options.value : this.#defaultValue
    this.#value = this.#validateType(initialValue)
    this.#dirty = false
  }

  /**
   * Validates value against the specified type.
   * @param {*} value - Value to validate.
   * @returns {*} Validated value.
   */
  #validateType(value) {
    if (value === null || value === undefined) return value
    
    switch (this.#type) {
      case 'string':
        return String(value)
      case 'number':
        return Number(value)
      case 'boolean':
        return Boolean(value)
      case 'object':
        return typeof value === 'object' && !Array.isArray(value) ? value : {}
      case 'array':
        return Array.isArray(value) ? value : []
      default:
        return value
    }
  }

  /**
   * Gets the attribute name.
   * @returns {string} Attribute name.
   */
  getName() {
    return this.#name
  }

  /**
   * Gets the attribute value.
   * @returns {*} Attribute value.
   */
  getValue() {
    return this.#value
  }

  /**
   * Gets the attribute value, returns default if not set.
   * @returns {*} Attribute value or default.
   */
  get() {
    return this.#value !== null && this.#value !== undefined ? this.#value : this.#defaultValue
  }

  /**
   * Sets the attribute value.
   * @param {*} value - New value.
   * @param {boolean} silent - Whether to suppress change events.
   * @returns {Attribute} This instance for method chaining.
   * @throws {Error} If attribute is read-only.
   */
  set(value, silent = false) {
    if (this.#readonly) {
      throw new Error(`Attribute "${this.#name}" is read-only`)
    }

    const validated = this.#validateType(value)
    const changed = validated !== this.#value

    this.#value = validated
    
    if (changed) {
      this.#dirty = true
      if (!silent) {
        this.#notifyListeners(this.#value)
      }
    }

    return this
  }

  /**
   * Sets the value and marks as clean.
   * @param {*} value - New value.
   * @returns {Attribute} This instance for method chaining.
   */
  setClean(value) {
    this.#value = this.#validateType(value)
    this.#dirty = false
    return this
  }

  /**
   * Resets the attribute to its default value.
   * @param {boolean} silent - Whether to suppress change events.
   * @returns {Attribute} This instance for method chaining.
   */
  reset(silent = false) {
    if (this.#readonly) {
      throw new Error(`Attribute "${this.#name}" is read-only`)
    }
    return this.set(this.#defaultValue, silent)
  }

  /**
   * Checks if the attribute is dirty (has unsaved changes).
   * @returns {boolean} True if dirty.
   */
  isDirty() {
    return this.#dirty
  }

  /**
   * Marks the attribute as clean.
   * @returns {Attribute} This instance for method chaining.
   */
  markClean() {
    this.#dirty = false
    return this
  }

  /**
   * Checks if the attribute is read-only.
   * @returns {boolean} True if read-only.
   */
  isReadonly() {
    return this.#readonly
  }

  /**
   * Gets the attribute type.
   * @returns {string} Attribute type.
   */
  getType() {
    return this.#type
  }

  /**
   * Gets the default value.
   * @returns {*} Default value.
   */
  getDefault() {
    return this.#defaultValue
  }

  /**
   * Checks if the attribute has a value.
   * @returns {boolean} True if value is not null or undefined.
   */
  hasValue() {
    return this.#value !== null && this.#value !== undefined
  }

  /**
   * Adds a change listener.
   * @param {Function} listener - Callback function receiving new value.
   * @returns {Attribute} This instance for method chaining.
   */
  onChange(listener) {
    if (typeof listener === 'function') {
      this.#listeners.push(listener)
    }
    return this
  }

  /**
   * Removes a change listener.
   * @param {Function} listener - Listener to remove.
   * @returns {Attribute} This instance for method chaining.
   */
  offChange(listener) {
    const index = this.#listeners.indexOf(listener)
    if (index !== -1) {
      this.#listeners.splice(index, 1)
    }
    return this
  }

  /**
   * Notifies all listeners of a change.
   * @param {*} value - New value.
   */
  #notifyListeners(value) {
    for (const listener of this.#listeners) {
      try {
        listener(value)
      } catch (error) {
        console.error(`Error in attribute listener for "${this.#name}":`, error)
      }
    }
  }

  /**
   * Creates a copy of this attribute.
   * @returns {Attribute} New attribute instance.
   */
  clone() {
    const cloned = new Attribute({
      name: this.#name,
      value: this.#value,
      defaultValue: this.#defaultValue,
      readonly: this.#readonly,
      type: this.#type
    })
    return cloned
  }

  /**
   * Converts attribute to string.
   * @returns {string} String representation.
   */
  toString() {
    return `Attribute(${this.#name}: ${JSON.stringify(this.#value)})`
  }

  /**
   * Static method to create a string attribute.
   * @param {string} name - Attribute name.
   * @param {string} value - Initial value.
   * @param {Object} options - Additional options.
   * @returns {Attribute} New attribute.
   */
  static string(name, value = '', options = {}) {
    return new Attribute({ name, value, type: 'string', ...options })
  }

  /**
   * Static method to create a number attribute.
   * @param {string} name - Attribute name.
   * @param {number} value - Initial value.
   * @param {Object} options - Additional options.
   * @returns {Attribute} New attribute.
   */
  static number(name, value = 0, options = {}) {
    return new Attribute({ name, value, type: 'number', ...options })
  }

  /**
   * Static method to create a boolean attribute.
   * @param {string} name - Attribute name.
   * @param {boolean} value - Initial value.
   * @param {Object} options - Additional options.
   * @returns {Attribute} New attribute.
   */
  static boolean(name, value = false, options = {}) {
    return new Attribute({ name, value, type: 'boolean', ...options })
  }

  /**
   * Static method to create an object attribute.
   * @param {string} name - Attribute name.
   * @param {Object} value - Initial value.
   * @param {Object} options - Additional options.
   * @returns {Attribute} New attribute.
   */
  static object(name, value = {}, options = {}) {
    return new Attribute({ name, value, type: 'object', ...options })
  }

  /**
   * Static method to create an array attribute.
   * @param {string} name - Attribute name.
   * @param {Array} value - Initial value.
   * @param {Object} options - Additional options.
   * @returns {Attribute} New attribute.
   */
  static array(name, value = [], options = {}) {
    return new Attribute({ name, value, type: 'array', ...options })
  }

  /**
   * Static method to create a read-only attribute.
   * @param {string} name - Attribute name.
   * @param {*} value - Initial value.
   * @param {string} type - Attribute type.
   * @returns {Attribute} New attribute.
   */
  static readonly(name, value, type = 'any') {
    return new Attribute({ name, value, type, readonly: true })
  }
}

export { Attribute }

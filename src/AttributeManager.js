/**
 * AttributeManager - A class for managing a collection of attributes.
 * Inspired by Three.js attribute system.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { Attribute } from './Attribute.js'

class AttributeManager {
  #attributes = new Map()
  #changeListeners = []

  /**
   * Creates a new AttributeManager instance.
   * @param {Object} attributes - Initial attributes as key-value pairs.
   */
  constructor(attributes = {}) {
    for (const [name, config] of Object.entries(attributes)) {
      this.add(name, config)
    }
  }

  /**
   * Adds an attribute.
   * @param {string|Attribute} attributeOrName - Attribute instance or name.
   * @param {Object|*} config - Configuration or initial value if name provided.
   * @returns {AttributeManager} This instance for method chaining.
   */
  add(attributeOrName, config = {}) {
    let attr

    if (attributeOrName instanceof Attribute) {
      attr = attributeOrName
    } else {
      const options = typeof config === 'object' && config !== null && !Array.isArray(config)
        ? { name: attributeOrName, ...config }
        : { name: attributeOrName, value: config }
      
      attr = new Attribute(options)
    }

    attr.onChange((value) => {
      this.#notifyChange(attr.getName(), value)
    })

    this.#attributes.set(attr.getName(), attr)
    return this
  }

  /**
   * Gets an attribute by name.
   * @param {string} name - Attribute name.
   * @returns {Attribute|undefined} Attribute instance.
   */
  getAttribute(name) {
    return this.#attributes.get(name)
  }

  /**
   * Gets an attribute value.
   * @param {string} name - Attribute name.
   * @param {*} defaultValue - Default value if not found.
   * @returns {*} Attribute value.
   */
  get(name, defaultValue = undefined) {
    const attr = this.#attributes.get(name)
    return attr ? attr.get() : defaultValue
  }

  /**
   * Sets an attribute value.
   * @param {string} name - Attribute name.
   * @param {*} value - New value.
   * @param {boolean} silent - Whether to suppress change events.
   * @returns {AttributeManager} This instance for method chaining.
   */
  set(name, value, silent = false) {
    let attr = this.#attributes.get(name)
    
    if (!attr) {
      attr = new Attribute({ name, value })
      this.add(attr)
    } else {
      attr.set(value, silent)
    }

    return this
  }

  /**
   * Checks if an attribute exists.
   * @param {string} name - Attribute name.
   * @returns {boolean} True if attribute exists.
   */
  has(name) {
    return this.#attributes.has(name)
  }

  /**
   * Removes an attribute.
   * @param {string} name - Attribute name.
   * @returns {boolean} True if removed.
   */
  remove(name) {
    return this.#attributes.delete(name)
  }

  /**
   * Clears all attributes.
   * @returns {AttributeManager} This instance for method chaining.
   */
  clear() {
    this.#attributes.clear()
    return this
  }

  /**
   * Resets all attributes to their default values.
   * @param {boolean} silent - Whether to suppress change events.
   * @returns {AttributeManager} This instance for method chaining.
   */
  resetAll(silent = false) {
    for (const attr of this.#attributes.values()) {
      if (!attr.isReadonly()) {
        attr.reset(silent)
      }
    }
    return this
  }

  /**
   * Checks if any attribute is dirty.
   * @returns {boolean} True if any attribute has unsaved changes.
   */
  isDirty() {
    for (const attr of this.#attributes.values()) {
      if (attr.isDirty()) return true
    }
    return false
  }

  /**
   * Gets list of dirty attribute names.
   * @returns {string[]} Array of dirty attribute names.
   */
  getDirtyAttributes() {
    const dirty = []
    for (const [name, attr] of this.#attributes.entries()) {
      if (attr.isDirty()) {
        dirty.push(name)
      }
    }
    return dirty
  }

  /**
   * Marks all attributes as clean.
   * @returns {AttributeManager} This instance for method chaining.
   */
  markAllClean() {
    for (const attr of this.#attributes.values()) {
      attr.markClean()
    }
    return this
  }

  /**
   * Converts all attributes to a plain object.
   * @returns {Object} Object with attribute names and values.
   */
  toObject() {
    const obj = {}
    for (const [name, attr] of this.#attributes.entries()) {
      obj[name] = attr.get()
    }
    return obj
  }

  /**
   * Converts all attributes to a JSON string.
   * @returns {string} JSON representation.
   */
  toJSON() {
    return JSON.stringify(this.toObject(), null, 2)
  }

  /**
   * Loads attributes from a plain object.
   * @param {Object} obj - Object with attribute names and values.
   * @returns {AttributeManager} This instance for method chaining.
   */
  fromObject(obj) {
    for (const [name, value] of Object.entries(obj)) {
      this.set(name, value)
    }
    return this
  }

  /**
   * Gets all attribute names.
   * @returns {string[]} Array of attribute names.
   */
  getNames() {
    return Array.from(this.#attributes.keys())
  }

  /**
   * Gets the number of attributes.
   * @returns {number} Number of attributes.
   */
  getCount() {
    return this.#attributes.size
  }

  /**
   * Adds a listener for any attribute change.
   * @param {Function} listener - Callback function (name, value).
   * @returns {AttributeManager} This instance for method chaining.
   */
  onAnyChange(listener) {
    if (typeof listener === 'function') {
      this.#changeListeners.push(listener)
    }
    return this
  }

  /**
   * Removes a change listener.
   * @param {Function} listener - Listener to remove.
   * @returns {AttributeManager} This instance for method chaining.
   */
  offAnyChange(listener) {
    const index = this.#changeListeners.indexOf(listener)
    if (index !== -1) {
      this.#changeListeners.splice(index, 1)
    }
    return this
  }

  /**
   * Notifies listeners of a change.
   * @param {string} name - Attribute name.
   * @param {*} value - New value.
   */
  #notifyChange(name, value) {
    for (const listener of this.#changeListeners) {
      try {
        listener(name, value)
      } catch (error) {
        console.error('Error in attribute manager listener:', error)
      }
    }
  }

  /**
   * Creates a copy of this attribute manager.
   * @returns {AttributeManager} Cloned instance.
   */
  clone() {
    const cloned = new AttributeManager()
    for (const [name, attr] of this.#attributes.entries()) {
      cloned.add(attr.clone())
    }
    return cloned
  }

  /**
   * Iterate over all attributes.
   * @param {Function} callback - Function called for each attribute.
   */
  forEach(callback) {
    this.#attributes.forEach(callback)
  }

  /**
   * Allows using for...of on AttributeManager.
   */
  [Symbol.iterator]() {
    return this.#attributes.entries()
  }
}

export { AttributeManager }

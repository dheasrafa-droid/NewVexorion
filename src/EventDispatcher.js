/**
 * EventDispatcher - A class for managing event listeners and dispatching events.
 * Inspired by Three.js EventDispatcher.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
class EventDispatcher {
  #listeners = new Map()

  /**
   * Adds an event listener.
   * @param {string} type - Event type.
   * @param {Function} listener - Callback function.
   * @returns {EventDispatcher} This instance for method chaining.
   */
  addEventListener(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function')
    }

    if (!this.#listeners.has(type)) {
      this.#listeners.set(type, [])
    }

    const list = this.#listeners.get(type)
    if (!list.includes(listener)) {
      list.push(listener)
    }

    return this
  }

  /**
   * Alias for addEventListener.
   * @param {string} type - Event type.
   * @param {Function} listener - Callback function.
   * @returns {EventDispatcher} This instance for method chaining.
   */
  on(type, listener) {
    return this.addEventListener(type, listener)
  }

  /**
   * Adds a one-time event listener.
   * @param {string} type - Event type.
   * @param {Function} listener - Callback function.
   * @returns {EventDispatcher} This instance for method chaining.
   */
  once(type, listener) {
    const onceWrapper = (event) => {
      this.removeEventListener(type, onceWrapper)
      listener.call(this, event)
    }
    onceWrapper.originalListener = listener
    return this.addEventListener(type, onceWrapper)
  }

  /**
   * Removes an event listener.
   * @param {string} type - Event type.
   * @param {Function} listener - Callback function to remove.
   * @returns {EventDispatcher} This instance for method chaining.
   */
  removeEventListener(type, listener) {
    if (!this.#listeners.has(type)) return this

    const list = this.#listeners.get(type)
    const index = list.findIndex(l => l === listener || l.originalListener === listener)

    if (index !== -1) {
      list.splice(index, 1)
      if (list.length === 0) {
        this.#listeners.delete(type)
      }
    }

    return this
  }

  /**
   * Alias for removeEventListener.
   * @param {string} type - Event type.
   * @param {Function} listener - Callback function to remove.
   * @returns {EventDispatcher} This instance for method chaining.
   */
  off(type, listener) {
    return this.removeEventListener(type, listener)
  }

  /**
   * Checks if an event listener exists.
   * @param {string} type - Event type.
   * @param {Function} listener - Optional specific listener to check for.
   * @returns {boolean} True if listener exists.
   */
  hasEventListener(type, listener) {
    if (!this.#listeners.has(type)) return false
    if (!listener) return true
    return this.#listeners.get(type).some(l => l === listener || l.originalListener === listener)
  }

  /**
   * Dispatches an event to all registered listeners.
   * @param {Object|string} event - Event object or event type string.
   * @returns {EventDispatcher} This instance for method chaining.
   */
  dispatchEvent(event) {
    const eventObj = typeof event === 'string' ? { type: event } : event
    
    if (!eventObj || !eventObj.type) {
      throw new Error('Event must have a type')
    }

    if (!eventObj.target) {
      eventObj.target = this
    }

    const list = this.#listeners.get(eventObj.type)
    if (list) {
      const copy = list.slice()
      for (const listener of copy) {
        try {
          listener.call(this, eventObj)
        } catch (error) {
          console.error(`Error in event listener for "${eventObj.type}":`, error)
        }
      }
    }

    return this
  }

  /**
   * Alias for dispatchEvent.
   * @param {Object|string} event - Event object or event type string.
   * @param {Object} data - Optional data to attach if event is string.
   * @returns {EventDispatcher} This instance for method chaining.
   */
  emit(event, data = {}) {
    if (typeof event === 'string') {
      return this.dispatchEvent({ type: event, ...data })
    }
    return this.dispatchEvent(event)
  }

  /**
   * Removes all event listeners.
   * @param {string} type - Optional type to clear only specific events.
   * @returns {EventDispatcher} This instance for method chaining.
   */
  removeAllListeners(type) {
    if (type) {
      this.#listeners.delete(type)
    } else {
      this.#listeners.clear()
    }
    return this
  }

  /**
   * Gets all registered event types.
   * @returns {string[]} Array of event types.
   */
  eventNames() {
    return Array.from(this.#listeners.keys())
  }

  /**
   * Gets the number of listeners for a given event type.
   * @param {string} type - Event type.
   * @returns {number} Number of listeners.
   */
  listenerCount(type) {
    const list = this.#listeners.get(type)
    return list ? list.length : 0
  }
}

export { EventDispatcher }

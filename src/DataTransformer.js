/**
 * Data transformation utilities for NewVexorion
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
class DataTransformer {
  /**
   * Transforms data by applying a mapping function.
   * @param {Array} data - The data to transform.
   * @param {Function} mapper - Mapping function.
   * @returns {Array} Transformed data.
   */
  static map(data, mapper) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }
    return data.map(mapper)
  }

  /**
   * Filters data based on a predicate.
   * @param {Array} data - The data to filter.
   * @param {Function} predicate - Filtering function.
   * @returns {Array} Filtered data.
   */
  static filter(data, predicate) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }
    return data.filter(predicate)
  }

  /**
   * Reduces data to a single value.
   * @param {Array} data - The data to reduce.
   * @param {Function} reducer - Reducing function.
   * @param {*} initialValue - Initial value.
   * @returns {*} Reduced value.
   */
  static reduce(data, reducer, initialValue) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }
    return data.reduce(reducer, initialValue)
  }

  /**
   * Groups data by a key.
   * @param {Array} data - The data to group.
   * @param {string|Function} key - Key to group by.
   * @returns {Object} Grouped data.
   */
  static groupBy(data, key) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    const getKey = typeof key === 'function' ? key : (item) => item[key]
    
    return data.reduce((grouped, item) => {
      const groupKey = getKey(item)
      if (!grouped[groupKey]) {
        grouped[groupKey] = []
      }
      grouped[groupKey].push(item)
      return grouped
    }, {})
  }

  /**
   * Sorts data by a key or comparator.
   * @param {Array} data - The data to sort.
   * @param {string|Function} key - Key to sort by or comparator function.
   * @param {string} order - Sort order ('asc' or 'desc').
   * @returns {Array} Sorted data.
   */
  static sort(data, key, order = 'asc') {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    const sorted = [...data]
    
    if (typeof key === 'function') {
      return sorted.sort(key)
    }

    const getValue = (item) => {
      const value = item[key]
      return typeof value === 'string' ? value.toLowerCase() : value
    }

    return sorted.sort((a, b) => {
      const aVal = getValue(a)
      const bVal = getValue(b)
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
      return 0
    })
  }

  /**
   * Selects specific fields from objects.
   * @param {Array} data - The data to select from.
   * @param {string[]} fields - Fields to select.
   * @returns {Array} Data with selected fields.
   */
  static select(data, fields) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    return data.map(item => {
      const selected = {}
      fields.forEach(field => {
        if (field in item) {
          selected[field] = item[field]
        }
      })
      return selected
    })
  }

  /**
   * Excludes specific fields from objects.
   * @param {Array} data - The data to exclude from.
   * @param {string[]} fields - Fields to exclude.
   * @returns {Array} Data without excluded fields.
   */
  static exclude(data, fields) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    const excludeSet = new Set(fields)
    return data.map(item => {
      const result = {}
      for (const key in item) {
        if (!excludeSet.has(key)) {
          result[key] = item[key]
        }
      }
      return result
    })
  }

  /**
   * Renames fields in objects.
   * @param {Array} data - The data to rename fields in.
   * @param {Object} mapping - Field mapping (oldName: newName).
   * @returns {Array} Data with renamed fields.
   */
  static renameFields(data, mapping) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    return data.map(item => {
      const result = {}
      for (const key in item) {
        const newKey = mapping[key] || key
        result[newKey] = item[key]
      }
      return result
    })
  }

  /**
   * Flattens nested arrays.
   * @param {Array} data - The data to flatten.
   * @param {number} depth - Depth to flatten.
   * @returns {Array} Flattened data.
   */
  static flatten(data, depth = Infinity) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }
    return data.flat(depth)
  }

  /**
   * Uniques data by a key.
   * @param {Array} data - The data to make unique.
   * @param {string} key - Key to determine uniqueness.
   * @returns {Array} Unique data.
   */
  static unique(data, key) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    const seen = new Set()
    return data.filter(item => {
      const value = key ? item[key] : item
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  }

  /**
   * Pivots data (rows to columns).
   * @param {Array} data - The data to pivot.
   * @param {string} index - Index column.
   * @param {string} columns - Columns to pivot.
   * @param {string} values - Values to aggregate.
   * @param {Function} aggFn - Aggregation function.
   * @returns {Object} Pivoted data.
   */
  static pivot(data, index, columns, values, aggFn = (arr) => arr) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    const result = {}
    
    data.forEach(item => {
      const indexValue = item[index]
      const columnValue = item[columns]
      const value = item[values]
      
      if (!result[indexValue]) {
        result[indexValue] = {}
      }
      
      if (!result[indexValue][columnValue]) {
        result[indexValue][columnValue] = []
      }
      
      result[indexValue][columnValue].push(value)
    })

    for (const row in result) {
      for (const col in result[row]) {
        result[row][col] = aggFn(result[row][col])
      }
    }

    return result
  }

  /**
   * Creates a pipeline of transformations.
   * @param {Array} transformations - Array of transformation functions.
   * @returns {Function} Pipeline function.
   */
  static pipeline(...transformations) {
    return (data) => {
      return transformations.reduce((current, fn) => fn(current), data)
    }
  }

  /**
   * Chunks data into smaller arrays.
   * @param {Array} data - The data to chunk.
   * @param {number} size - Chunk size.
   * @returns {Array[]} Chunked data.
   */
  static chunk(data, size) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }
    
    const chunks = []
    for (let i = 0; i < data.length; i += size) {
      chunks.push(data.slice(i, i + size))
    }
    return chunks
  }

  /**
   * Samples data randomly.
   * @param {Array} data - The data to sample.
   * @param {number} size - Sample size.
   * @returns {Array} Sampled data.
   */
  static sample(data, size) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }
    
    const shuffled = [...data]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, size)
  }
}

export { DataTransformer }

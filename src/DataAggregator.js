/**
 * Data aggregation utilities for NewVexorion
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
class DataAggregator {
  /**
   * Calculates the sum of values.
   * @param {Array} data - The data to sum.
   * @param {string} key - Key to sum (optional).
   * @returns {number} Sum of values.
   */
  static sum(data, key = null) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    return data.reduce((total, item) => {
      const value = key ? item[key] : item
      return total + (typeof value === 'number' ? value : 0)
    }, 0)
  }

  /**
   * Calculates the average of values.
   * @param {Array} data - The data to average.
   * @param {string} key - Key to average (optional).
   * @returns {number} Average of values.
   */
  static average(data, key = null) {
    if (!Array.isArray(data) || data.length === 0) {
      return 0
    }

    const sum = this.sum(data, key)
    return sum / data.length
  }

  /**
   * Finds the minimum value.
   * @param {Array} data - The data to find min.
   * @param {string} key - Key to find min (optional).
   * @returns {*} Minimum value.
   */
  static min(data, key = null) {
    if (!Array.isArray(data) || data.length === 0) {
      return null
    }

    return data.reduce((min, item) => {
      const value = key ? item[key] : item
      return value < min ? value : min
    }, key ? data[0][key] : data[0])
  }

  /**
   * Finds the maximum value.
   * @param {Array} data - The data to find max.
   * @param {string} key - Key to find max (optional).
   * @returns {*} Maximum value.
   */
  static max(data, key = null) {
    if (!Array.isArray(data) || data.length === 0) {
      return null
    }

    return data.reduce((max, item) => {
      const value = key ? item[key] : item
      return value > max ? value : max
    }, key ? data[0][key] : data[0])
  }

  /**
   * Counts the frequency of values.
   * @param {Array} data - The data to count.
   * @param {string} key - Key to count (optional).
   * @returns {Object} Frequency map.
   */
  static frequency(data, key = null) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    const freq = {}
    data.forEach(item => {
      const value = key ? item[key] : item
      const keyStr = String(value)
      freq[keyStr] = (freq[keyStr] || 0) + 1
    })
    return freq
  }

  /**
   * Calculates the median of values.
   * @param {Array} data - The data to calculate median.
   * @param {string} key - Key to calculate median (optional).
   * @returns {number} Median value.
   */
  static median(data, key = null) {
    if (!Array.isArray(data) || data.length === 0) {
      return 0
    }

    const values = data.map(item => key ? item[key] : item)
      .filter(val => typeof val === 'number')
      .sort((a, b) => a - b)

    if (values.length === 0) return 0

    const mid = Math.floor(values.length / 2)
    return values.length % 2 === 0
      ? (values[mid - 1] + values[mid]) / 2
      : values[mid]
  }

  /**
   * Calculates the mode of values.
   * @param {Array} data - The data to calculate mode.
   * @param {string} key - Key to calculate mode (optional).
   * @returns {*} Mode value.
   */
  static mode(data, key = null) {
    if (!Array.isArray(data) || data.length === 0) {
      return null
    }

    const freq = this.frequency(data, key)
    let maxCount = 0
    let mode = null

    for (const [value, count] of Object.entries(freq)) {
      if (count > maxCount) {
        maxCount = count
        mode = value
      }
    }

    return mode
  }

  /**
   * Calculates the standard deviation of values.
   * @param {Array} data - The data to calculate std dev.
   * @param {string} key - Key to calculate std dev (optional).
   * @returns {number} Standard deviation.
   */
  static stdDev(data, key = null) {
    if (!Array.isArray(data) || data.length < 2) {
      return 0
    }

    const values = data.map(item => key ? item[key] : item)
      .filter(val => typeof val === 'number')

    if (values.length < 2) return 0

    const mean = this.average(values)
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
    const variance = this.average(squaredDiffs)
    return Math.sqrt(variance)
  }

  /**
   * Groups data and applies aggregation functions.
   * @param {Array} data - The data to aggregate.
   * @param {string} groupKey - Key to group by.
   * @param {Object} aggregations - Aggregation functions.
   * @returns {Object} Aggregated data.
   */
  static groupAndAggregate(data, groupKey, aggregations) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    const groups = {}
    
    data.forEach(item => {
      const key = item[groupKey]
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
    })

    const result = {}
    for (const [group, items] of Object.entries(groups)) {
      result[group] = {}
      for (const [aggKey, aggFn] of Object.entries(aggregations)) {
        result[group][aggKey] = aggFn(items)
      }
    }

    return result
  }

  /**
   * Calculates running totals.
   * @param {Array} data - The data to calculate running totals.
   * @param {string} key - Key to sum.
   * @returns {Array} Data with running total.
   */
  static runningTotal(data, key) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    let total = 0
    return data.map(item => {
      total += (item[key] || 0)
      return { ...item, runningTotal: total }
    })
  }

  /**
   * Calculates percentage of total.
   * @param {Array} data - The data to calculate percentages.
   * @param {string} key - Key to calculate percentage.
   * @returns {Array} Data with percentage.
   */
  static percentageOfTotal(data, key) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    const total = this.sum(data, key)
    if (total === 0) return data

    return data.map(item => ({
      ...item,
      percentage: ((item[key] || 0) / total) * 100
    }))
  }

  /**
   * Calculates cumulative percentage.
   * @param {Array} data - The data to calculate cumulative percentage.
   * @param {string} key - Key to calculate cumulative percentage.
   * @returns {Array} Data with cumulative percentage.
   */
  static cumulativePercentage(data, key) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    const total = this.sum(data, key)
    if (total === 0) return data

    let cumulative = 0
    return data.map(item => {
      cumulative += (item[key] || 0)
      return {
        ...item,
        cumulativePercentage: (cumulative / total) * 100
      }
    })
  }

  /**
   * Calculates percent change between items.
   * @param {Array} data - The data to calculate percent change.
   * @param {string} key - Key to calculate percent change.
   * @returns {Array} Data with percent change.
   */
  static percentChange(data, key) {
    if (!Array.isArray(data) || data.length < 2) {
      return data
    }

    return data.map((item, index) => {
      if (index === 0) {
        return { ...item, percentChange: 0 }
      }
      const previous = data[index - 1][key] || 0
      const current = item[key] || 0
      const change = previous === 0 ? 0 : ((current - previous) / previous) * 100
      return { ...item, percentChange: change }
    })
  }
}

export { DataAggregator }

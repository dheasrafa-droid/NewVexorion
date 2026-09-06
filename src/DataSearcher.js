/**
 * A class for searching data with flexible filtering options.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
class DataSearcher {
  #data = []
  #fields = []

  /**
   * Creates a new DataSearcher instance.
   * @param {Object[]} data - Array of objects to search.
   * @param {string[]} fields - Fields to search within.
   */
  constructor(data = [], fields = []) {
    this.#data = data
    this.#fields = fields
  }

  /**
   * Sets the data to search.
   * @param {Object[]} data - Array of objects.
   * @returns {DataSearcher} This instance for method chaining.
   */
  setData(data) {
    this.#data = data
    return this
  }

  /**
   * Sets the fields to search within.
   * @param {string[]} fields - Array of field names.
   * @returns {DataSearcher} This instance for method chaining.
   */
  setFields(fields) {
    this.#fields = fields
    return this
  }

  /**
   * Searches for a term in the data.
   * @param {string} searchTerm - The term to search for.
   * @returns {Object[]} Array of matching objects.
   */
  search(searchTerm) {
    if (!searchTerm) return this.#data
    if (this.#fields.length === 0) {
      return this.#data.filter(item =>
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return this.#data.filter(item =>
      this.#fields.some(field => {
        const value = item[field] || ''
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    )
  }

  /**
   * Searches for an exact match.
   * @param {string} searchTerm - The term to search for.
   * @param {string} field - Optional field to search within.
   * @returns {Object[]} Array of matching objects.
   */
  searchExact(searchTerm, field) {
    if (!searchTerm) return this.#data
    if (field) {
      return this.#data.filter(item =>
        (item[field] || '').toString() === searchTerm
      )
    }
    return this.#data.filter(item =>
      JSON.stringify(item) === searchTerm
    )
  }

  /**
   * Filters data by a specific date.
   * @param {string} date - The date to filter by.
   * @returns {Object[]} Array of objects with matching date.
   */
  filterByDate(date) {
    return this.#data.filter(item =>
      item.date && item.date.includes(date)
    )
  }

  /**
   * Filters data by a specific team.
   * @param {string} team - The team name to filter by.
   * @returns {Object[]} Array of objects with matching team.
   */
  filterByTeam(team) {
    return this.#data.filter(item =>
      item.team && item.team.toLowerCase() === team.toLowerCase()
    )
  }

  /**
   * Static method for quick search.
   * @param {Object[]} data - Array of objects to search.
   * @param {string} searchTerm - The term to search for.
   * @param {string[]} fields - Fields to search within.
   * @returns {Object[]} Array of matching objects.
   */
  static search(data, searchTerm, fields = []) {
    const searcher = new DataSearcher(data, fields)
    return searcher.search(searchTerm)
  }
}

export { DataSearcher }

/**
 * A class for validating data against configurable rules.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
class DataValidator {
  #rules = []

  /**
   * Creates a new DataValidator instance.
   * @param {Object[]} rules - Array of validation rules.
   * @param {string} rules[].field - The field name to validate.
   * @param {Function} rules[].validator - The validation function.
   * @param {string} rules[].message - The error message if validation fails.
   */
  constructor(rules = []) {
    this.#rules = rules
  }

  /**
   * Adds a validation rule.
   * @param {string} field - The field name to validate.
   * @param {Function} validator - The validation function that returns boolean.
   * @param {string} message - The error message if validation fails.
   * @returns {DataValidator} This instance for method chaining.
   */
  addRule(field, validator, message) {
    this.#rules.push({ field, validator, message })
    return this
  }

  /**
   * Validates the given data against all rules.
   * @param {Object[]} data - Array of objects to validate.
   * @returns {Object} Validation result.
   * @returns {boolean} result.valid - True if all data is valid.
   * @returns {Object[]} result.errors - Array of validation errors.
   * @returns {number} result.errorCount - Number of errors.
   * @returns {number} result.dataCount - Number of data items validated.
   */
  validate(data) {
    const errors = []

    if (!data || data.length === 0) {
      return { valid: false, errors: ['No data to validate'], errorCount: 1, dataCount: 0 }
    }

    data.forEach((item, index) => {
      this.#rules.forEach(rule => {
        const value = item[rule.field]
        if (!rule.validator(value)) {
          errors.push({
            row: index + 1,
            field: rule.field,
            message: rule.message || `Invalid value: ${value}`
          })
        }
      })
    })

    return {
      valid: errors.length === 0,
      errors: errors,
      errorCount: errors.length,
      dataCount: data.length
    }
  }

  /**
   * Validates a date string in YYYY-MM-DD format.
   * @param {string} value - The date string to validate.
   * @returns {boolean} True if the date is valid.
   */
  static validateDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value)
  }

  /**
   * Validates a name string.
   * @param {string} value - The name to validate.
   * @returns {boolean} True if the name is valid.
   */
  static validateName(value) {
    return value && value.length > 0 && value.length < 100
  }

  /**
   * Validates a team string.
   * @param {string} value - The team name to validate.
   * @returns {boolean} True if the team is valid.
   */
  static validateTeam(value) {
    return value && value.length > 0
  }

  /**
   * Validates an email address.
   * @param {string} value - The email to validate.
   * @returns {boolean} True if the email is valid.
   */
  static validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  /**
   * Validates a phone number.
   * @param {string} value - The phone number to validate.
   * @returns {boolean} True if the phone number is valid.
   */
  static validatePhone(value) {
    return /^[0-9+\-\s()]{8,20}$/.test(value)
  }

  /**
   * Creates a validator with common rules for member data.
   * @returns {DataValidator} A configured DataValidator instance.
   */
  static createMemberValidator() {
    return new DataValidator()
      .addRule('name', DataValidator.validateName, 'Name is required and must be less than 100 characters')
      .addRule('date', DataValidator.validateDate, 'Date must be in format YYYY-MM-DD')
      .addRule('team', DataValidator.validateTeam, 'Team is required')
  }
}

export { DataValidator }

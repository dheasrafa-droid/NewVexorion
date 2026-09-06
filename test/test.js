/**
 * Basic unit test runner for NewVexorion core modules
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import {
  FileReader,
  FileWriter,
  DataProcessor,
  CSVParser,
  DataSearcher,
  DataValidator
} from '../src/index.js'

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`)
    passed++
  } else {
    console.error(`  ❌ FAIL: ${message}`)
    failed++
  }
}

console.log('🧪 Starting NewVexorion basic test suite...\n')

// 1. CSVParser Test
console.log('--- Testing CSVParser ---')
const parser = new CSVParser({ delimiter: ',' })
const parseRes = parser.parse(['name,team', 'Alice,Alpha', 'Bob,Beta'])
assert(parseRes.success === true, 'CSV parsed successfully')
assert(parseRes.headers.length === 2, 'Headers parsed correctly')
assert(parseRes.count === 2, 'Rows counted correctly')

// 2. DataSearcher Test
console.log('\n--- Testing DataSearcher ---')
const searcher = new DataSearcher(
  [
    { name: 'Alice', team: 'Alpha' },
    { name: 'Bob', team: 'Beta' }
  ],
  ['name', 'team']
)
const searchRes = searcher.search('Alice')
assert(searchRes.length === 1, 'Search finds 1 matching record')
assert(searchRes[0].name === 'Alice', 'Search record matches query')

// 3. DataValidator Test
console.log('\n--- Testing DataValidator ---')
const validator = DataValidator.createMemberValidator()
const validData = [{ name: 'Alice', date: '2026-09-06', team: 'Alpha' }]
const invalidData = [{ name: '', date: 'invalid-date', team: '' }]

assert(validator.validate(validData).valid === true, 'Valid member passes validation')
assert(validator.validate(invalidData).valid === false, 'Invalid member fails validation')

console.log(`\n==================================`)
console.log(`Test Results: ${passed} passed, ${failed} failed`)
console.log(`==================================`)

if (failed > 0) process.exit(1)

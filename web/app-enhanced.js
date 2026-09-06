/**
 * Client-side script for enhanced web viewer.
 * Directly imports NewVexorion core classes: CSVParser, DataSearcher, DataAggregator, DataTransformer!
 */
import { CSVParser, DataSearcher, DataAggregator, DataTransformer, DataValidator } from '../src/browser.js'

// Raw member dataset
const rawCSV = `name,date,team,role,score
Alice Johnson,2026-09-06,Alpha,Engineer,95
Bob Smith,2026-09-06,Beta,Analyst,88
Charlie Brown,2026-09-05,Alpha,Designer,92
Diana Prince,2026-09-06,Gamma,Team Lead,98
Evan Wright,2026-09-06,Alpha,Developer,85
Fiona Gallagher,2026-09-04,Beta,Product Manager,90
George Clark,2026-09-06,Beta,Tester,78
Hannah Abbott,2026-09-06,Alpha,DevOps,94
Ian Malcolm,2026-09-06,Gamma,Scientist,96
Julia Roberts,2026-09-03,Beta,Coordinator,82`

// 1. Parse raw data with NewVexorion CSVParser
const parser = new CSVParser({ delimiter: ',', hasHeader: true })
const parseResult = parser.parse(rawCSV)
const fullDataset = parseResult.data.map(item => ({
  ...item,
  score: Number(item.score)
}))

// 2. Validate data with NewVexorion DataValidator
const validator = DataValidator.createMemberValidator()
const validationReport = validator.validate(fullDataset)
if (!validationReport.valid) {
  console.warn('Validation warnings:', validationReport.errors)
}

function getFilteredData() {
  const dateVal = document.getElementById('dateFilter').value.trim()
  const teamVal = document.getElementById('teamFilter').value.trim()
  const searchVal = document.getElementById('searchInput').value.trim()

  // Use NewVexorion DataSearcher
  const searcher = new DataSearcher(fullDataset, ['name', 'date', 'team', 'role', 'score'])
  let result = fullDataset

  if (dateVal) {
    result = searcher.filterByDate(dateVal)
  }
  if (teamVal) {
    const teamSearcher = new DataSearcher(result)
    result = teamSearcher.filterByTeam(teamVal)
  }
  if (searchVal) {
    const termSearcher = new DataSearcher(result, ['name', 'role', 'team', 'score'])
    result = termSearcher.search(searchVal)
  }

  // Sort descending by score using NewVexorion DataTransformer
  return DataTransformer.sort(result, 'score', 'desc')
}

function renderEnhanced() {
  const filtered = getFilteredData()

  // Headers
  const thead = document.getElementById('dataHeader')
  thead.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Date</th>
      <th>Team</th>
      <th>Role</th>
      <th>Score</th>
    </tr>
  `

  // Body
  const tbody = document.getElementById('dataBody')
  tbody.innerHTML = ''
  filtered.forEach(item => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td>${item.date}</td>
      <td><span class="badge" style="background:#475569">${item.team}</span></td>
      <td>${item.role}</td>
      <td>${item.score}</td>
    `
    tbody.appendChild(tr)
  })

  // Metrics calculated via NewVexorion DataAggregator
  document.getElementById('metricTotal').textContent = filtered.length
  if (filtered.length > 0) {
    // NewVexorion DataAggregator.average
    const avg = DataAggregator.average(filtered, 'score')
    document.getElementById('metricAvgScore').textContent = avg.toFixed(1)

    // NewVexorion DataAggregator.frequency
    const teamFrequency = DataAggregator.frequency(filtered, 'team')
    let topT = '-'
    let maxCount = 0
    for (const [team, count] of Object.entries(teamFrequency)) {
      if (count > maxCount) {
        maxCount = count
        topT = team
      }
    }
    document.getElementById('metricTopTeam').textContent = `${topT} (${maxCount})`
  } else {
    document.getElementById('metricAvgScore').textContent = '0'
    document.getElementById('metricTopTeam').textContent = '-'
  }
}

function exportCSV() {
  const filtered = getFilteredData()
  const headers = ['name', 'date', 'team', 'role', 'score']
  
  let csv = headers.join(',') + '\n'
  filtered.forEach(row => {
    csv += headers.map(h => row[h] || '').join(',') + '\n'
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'vexorion_export.csv'
  link.click()
}

function exportJSON() {
  const filtered = getFilteredData()
  const jsonStr = JSON.stringify(filtered, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'vexorion_export.json'
  link.click()
}

document.getElementById('dateFilter').addEventListener('input', renderEnhanced)
document.getElementById('teamFilter').addEventListener('change', renderEnhanced)
document.getElementById('searchInput').addEventListener('input', renderEnhanced)
document.getElementById('btnExportCSV').addEventListener('click', exportCSV)
document.getElementById('btnExportJSON').addEventListener('click', exportJSON)

renderEnhanced()

/**
 * Client-side script for standard web viewer
 */
const rawData = [
  "name,date,team,role,score",
  "Alice Johnson,2026-09-06,Alpha,Engineer,95",
  "Bob Smith,2026-09-06,Beta,Analyst,88",
  "Charlie Brown,2026-09-05,Alpha,Designer,92",
  "Diana Prince,2026-09-06,Gamma,Team Lead,98",
  "Evan Wright,2026-09-06,Alpha,Developer,85",
  "Fiona Gallagher,2026-09-04,Beta,Product Manager,90",
  "George Clark,2026-09-06,Beta,Tester,78",
  "Hannah Abbott,2026-09-06,Alpha,DevOps,94",
  "Ian Malcolm,2026-09-06,Gamma,Scientist,96",
  "Julia Roberts,2026-09-03,Beta,Coordinator,82"
]

function renderTable(lines) {
  const tbody = document.getElementById('dataBody')
  tbody.innerHTML = ''

  lines.forEach(line => {
    const parts = line.split(',')
    const tr = document.createElement('tr')
    parts.forEach(part => {
      const td = document.createElement('td')
      td.textContent = part.trim()
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })

  document.getElementById('counterText').textContent = `${lines.length} records found`
}

function filterData() {
  const filterVal = document.getElementById('filterInput').value.trim()
  const dataRows = rawData.slice(1)
  
  const filtered = dataRows.filter(row => {
    if (!filterVal) return true
    return row.includes(filterVal)
  })

  renderTable(filtered)
  document.getElementById('statusText').textContent = `Filtered with "${filterVal || 'all'}"`
}

document.getElementById('loadBtn').addEventListener('click', filterData)
document.getElementById('filterInput').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') filterData()
})

// Initial load
document.getElementById('filterInput').value = '2026-09-06'
filterData()

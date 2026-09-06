/**
 * Client-side script for enhanced web viewer
 */
const dataset = [
  { name: "Alice Johnson", date: "2026-09-06", team: "Alpha", role: "Engineer", score: 95 },
  { name: "Bob Smith", date: "2026-09-06", team: "Beta", role: "Analyst", score: 88 },
  { name: "Charlie Brown", date: "2026-09-05", team: "Alpha", role: "Designer", score: 92 },
  { name: "Diana Prince", date: "2026-09-06", team: "Gamma", role: "Team Lead", score: 98 },
  { name: "Evan Wright", date: "2026-09-06", team: "Alpha", role: "Developer", score: 85 },
  { name: "Fiona Gallagher", date: "2026-09-04", team: "Beta", role: "Product Manager", score: 90 },
  { name: "George Clark", date: "2026-09-06", team: "Beta", role: "Tester", score: 78 },
  { name: "Hannah Abbott", date: "2026-09-06", team: "Alpha", role: "DevOps", score: 94 },
  { name: "Ian Malcolm", date: "2026-09-06", team: "Gamma", role: "Scientist", score: 96 },
  { name: "Julia Roberts", date: "2026-09-03", team: "Beta", role: "Coordinator", score: 82 }
]

function renderEnhanced() {
  const dateVal = document.getElementById('dateFilter').value.trim().toLowerCase()
  const teamVal = document.getElementById('teamFilter').value.trim()
  const searchVal = document.getElementById('searchInput').value.trim().toLowerCase()

  const filtered = dataset.filter(item => {
    const matchesDate = !dateVal || item.date.toLowerCase().includes(dateVal)
    const matchesTeam = !teamVal || item.team === teamVal
    const matchesSearch = !searchVal || Object.values(item).some(v => String(v).toLowerCase().includes(searchVal))
    return matchesDate && matchesTeam && matchesSearch
  })

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

  // Metrics
  document.getElementById('metricTotal').textContent = filtered.length
  if (filtered.length > 0) {
    const avg = filtered.reduce((acc, c) => acc + c.score, 0) / filtered.length
    document.getElementById('metricAvgScore').textContent = avg.toFixed(1)

    const teamCounts = {}
    filtered.forEach(f => teamCounts[f.team] = (teamCounts[f.team] || 0) + 1)
    let topT = '-'
    let maxC = 0
    for (const [t, c] of Object.entries(teamCounts)) {
      if (c > maxC) {
        maxC = c
        topT = t
      }
    }
    document.getElementById('metricTopTeam').textContent = topT
  } else {
    document.getElementById('metricAvgScore').textContent = '0'
    document.getElementById('metricTopTeam').textContent = '-'
  }
}

function exportCSV() {
  const dateVal = document.getElementById('dateFilter').value.trim().toLowerCase()
  const teamVal = document.getElementById('teamFilter').value.trim()
  const searchVal = document.getElementById('searchInput').value.trim().toLowerCase()

  const filtered = dataset.filter(item => {
    const matchesDate = !dateVal || item.date.toLowerCase().includes(dateVal)
    const matchesTeam = !teamVal || item.team === teamVal
    const matchesSearch = !searchVal || Object.values(item).some(v => String(v).toLowerCase().includes(searchVal))
    return matchesDate && matchesTeam && matchesSearch
  })

  const headers = ['name', 'date', 'team', 'role', 'score']
  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...filtered.map(r => headers.map(h => r[h]).join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "vexorion_export.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function exportJSON() {
  const dateVal = document.getElementById('dateFilter').value.trim().toLowerCase()
  const teamVal = document.getElementById('teamFilter').value.trim()
  const searchVal = document.getElementById('searchInput').value.trim().toLowerCase()

  const filtered = dataset.filter(item => {
    const matchesDate = !dateVal || item.date.toLowerCase().includes(dateVal)
    const matchesTeam = !teamVal || item.team === teamVal
    const matchesSearch = !searchVal || Object.values(item).some(v => String(v).toLowerCase().includes(searchVal))
    return matchesDate && matchesTeam && matchesSearch
  })

  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered, null, 2))
  const link = document.createElement("a")
  link.setAttribute("href", jsonStr)
  link.setAttribute("download", "vexorion_export.json")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

document.getElementById('dateFilter').addEventListener('input', renderEnhanced)
document.getElementById('teamFilter').addEventListener('change', renderEnhanced)
document.getElementById('searchInput').addEventListener('input', renderEnhanced)
document.getElementById('btnExportCSV').addEventListener('click', exportCSV)
document.getElementById('btnExportJSON').addEventListener('click', exportJSON)

renderEnhanced()

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #e2e8f0;
  background: #020817;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  height: 100%;
}

body {
  min-width: 320px;
  background: radial-gradient(circle at top, #0f172a 0%, #020817 48%, #020617 100%);
}

a {
  color: #60a5fa;
  text-decoration: none;
}

button, input, textarea, select {
  font: inherit;
}

.MuiTablePagination-selectLabel,
.MuiTablePagination-displayedRows,
.MuiTablePagination-actions {
  color: #cbd5e1 !important;
}

.MuiMenuItem-root {
  color: #0f172a;
}

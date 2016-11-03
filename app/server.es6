"use strict"

let express = require('express')
let app = express()
const PORT = 3030

app.get('/', (req, res) => {
  res.sendFile('views/users/index.html', { root: __dirname });
});

app.get('/api/v1/users', (req, res) => {
  res.send('all users')
})

app.post('api/v1/users/new', (req, res) => {
});

app.get('api/v1/users/:id/edit', (req, res) => {
});

app.get('api/v1/users/:id/update', (req, res) => {
});

app.get('api/v1/users/:id/delete', (req, res) => {
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`)
})

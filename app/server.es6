"use strict"

let express = require('express')
let app = express()
const PORT = 3030
const pg = require('pg')
const path = require('path')
var bodyParser = require('body-parser')
app.use(bodyParser.json())
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/users'

app.get('/', (req, res) => {
  res.sendFile('views/users/index.html', { root: __dirname })
});

app.get('/api/v1/users', (req, res) => {
  res.send('all users')
})

app.post('/api/v1/users', (req, res, next) => {
  // Fetch data
  const data = {
    username: req.body.username,
    email: req.body.email,
    about: req.body.about
  }

  // Open postgresql connection
  pg.connect(connectionString, (err, client, done) => {
		const results = []
    if(err) { // Handle errors
      done()
      console.log(err)
      return res.status(500).json({ success: false, data: err })
    }
    client.query('INSERT INTO users(username, email, about) values($1, $2, $3)',
    [data.username, data.email, data.about]) // Saved!

		const query = client.query('SELECT * FROM users ORDER BY id ASC') // Selet users
    query.on('row', (row) => {
      results.push(row)
    })
    query.on('end', () => { // Close connection and return results
      done()
      return res.json(results)
    })
  })
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

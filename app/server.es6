"use strict"

let express = require('express')
let app = express()
const PORT = process.env.PORT || 3030
const pg = require('pg')
const path = require('path')
var bodyParser = require('body-parser')
app.use(bodyParser.json())
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/users'

// Return the little app
app.get('/', (req, res) => {
  res.sendFile('views/users/index.html', { root: __dirname })
});

// REST API
// List all users ~> GET /api/v1/users
// Create new user ~> POST /api/v1/users + params
// Update a existent user ~> UPDATE /api/v1/users/:id
// Delete a existent user ~> DELETE /api/v1/users/:id

// List all users
app.get('/api/v1/users', (req, res) => {
  pg.connect(connectionString, (err, client, done) => {
		const results = []
    if(err) { // Handle connection errors
      done()
      console.log(err)
      return res.status(500).json({ success: false, data: err })
    }

		const query = client.query('SELECT * FROM users ORDER BY id ASC') // Selet users
    query.on('row', (row) => { results.push(row) })
    query.on('end', () => { // Close connection and return results
      done()
      return res.json(results)
    })
  })
})

// Create new user
app.post('/api/v1/users', (req, res, next) => {
  // Fetch and build data
  console.log('Creating new user...  ')
  const data = {
    username: req.body.username,
    email:    req.body.email,
    about:    req.body.about,
  }

  // Open postgresql connection
  pg.connect(connectionString, (err, client, done) => {
		let result = ""
    if(err) { // Handle connection errors
      done()
      console.log(err)
      return res.status(500).json({ success: false, data: err })
    }
    var query = client.query('INSERT INTO users(username, email, about) ' +
      'values($1, $2, $3) RETURNING id, username, email, about',
      [data.username, data.email, data.about], (err, res) => {
        console.log('RESULT')
        console.log(res)
        result = res.rows[0]
        return
    }) // Saved!
    query.on('end', () => {
      done()
      return res.json(result)
    })
  })
})

app.post('api/v1/users/new', (req, res) => {
})

app.get('api/v1/users/:id/update', (req, res) => {
})

app.delete('/api/v1/users/:id', (req, res) => {
  console.log('Deleting one user...')
  const results = [];
  const id = req.params.id;

  pg.connect(connectionString, (err, client, done) => {
    if(err) { // Handle errors
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    client.query('DELETE FROM users WHERE id=($1)', [id]); // Delete user by id
    var query = client.query('SELECT * FROM users ORDER BY id ASC');
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`)
})

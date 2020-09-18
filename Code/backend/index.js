const app = require('express')()
const consign = require('consign')

const db = require('./config/db.js')
app.db = db

consign()
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)


app.get('/teste', (req, res) => {
    res.send('Funfando!')
})

app.listen(2020, () => console.log('Running on port 2020...'))
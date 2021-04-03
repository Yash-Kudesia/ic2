const mongoose = require('mongoose')
const dbIP = "127.0.0.1"
const dbPORT = "27017"
const dbNAME = "containers"
const url = `mongodb://${dbIP}:${dbPORT}/${dbNAME}`
mongoose.connect(url, { useNewUrlParser: true })
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

module.exports = db
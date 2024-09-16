const express = require('express')
const cors = require('cors')
const path = require('path');
const Database = require('./config/Database')
const route = require('./routes/routes')


const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'uploads'))); // Serve static files
app.use('/api', route)

Database()



app.listen(port, console.log('server connected on port,', port))
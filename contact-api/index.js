const express = require ("express");
const bodyParser = require("body-parser");
const  getRouter  = require('./routes/index')
const PORT=3000

const app = express();

app.use(bodyParser.json());

app.use('/production' , getRouter)




app.listen(PORT, ()=>{console.log(`connected to http://localhost:${PORT}`)})
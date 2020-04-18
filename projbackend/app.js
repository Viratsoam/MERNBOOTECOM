// dotenv require for the config with the DB which is inside the .env
require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");

const app = express();

// requrired MIDDLEWARES
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const corsParser = require("cors");


// connect to the db
mongoose.connect(process.env.DATABASE,
{ useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true
}).then(()=>{
    console.log("DB CONEECTED!!");
});

// useing the Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(corsParser());


// set the PORT
const port = process.env.PORT || 8000;
// listen to the PORT
app.listen(port, ()=>{
    console.log(`App is listen at port: ${port}`);
});
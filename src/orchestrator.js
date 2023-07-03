const express = require("express");
const app = express();
//const axios = require('axios');
const fs = require("fs");
//const cron = require('node-cron');
//const path = require('path');
require("dotenv").config();

var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
// Habilitar Cors
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const databaseToken = process.env.DATABASETOKEN;

const utils = require("./utils");
const db = require("./db");

app.listen(process.env.PORT || 5000, async function () {
  await init();
  console.log("Server is live on port 5000");
});

const init = async () => {
  console.log("HAL is waking up...");
};

app.post("/register", (req, res) => {
  if (req.body.headers.Authorization != "Bearer " + databaseToken) {
    utils.logWrite("Error en la autenticación para el POST", "databasePost")
    return res.status(403).json({ error: "Credentials Error" });
  } else {
    utils.logWrite("Acceso en la BBDD para la escritura de registros...", "databasePost")
    db.databaseOrchestrator(req.body.data)
    res.status(200).send("OK");
  }
});

app.post("/meteoStationRegister", (req, res) => {
  console.log(req)
  if (req.body.headers.Authorization != "Bearer " + databaseToken) {
    utils.logWrite("Error en la autenticación para el POST", "databasePost")
    return res.status(403).json({ error: "Credentials Error" });
  } else {
    utils.logWrite("Acceso en la BBDD para la escritura de registros...", "databasePost")
    db.meteoStationOrchestrator(req.body.data)
    res.status(200).send("OK");
  }
});
app.get("/", (req, res) => {
  res.send("OK Gemini")
})



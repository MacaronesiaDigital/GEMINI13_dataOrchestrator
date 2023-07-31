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

// ********************  ENDPOINTS  ********************
app.post("/register", (req, res) => {
  if (req.body.headers.Authorization != "Bearer " + databaseToken) {
    utils.logWrite("Error en la autenticación para el POST", "databasePost");
    return res.status(403).json({ error: "Credentials Error" });
  } else {
    utils.logWrite(
      "Acceso en la BBDD para la escritura de registros...",
      "databasePost"
    );
    databaseOrchestrator(req.body.message);
    res.status(200).send("OK");
  }
});

app.post("/meteoStationRegister", (req, res) => {
  if (req.body.headers.Authorization != "Bearer " + databaseToken) {
    utils.logWrite("Error en la autenticación para el POST", "databasePost");
    return res.status(403).json({ error: "Credentials Error" });
  } else {
    utils.logWrite(
      "Acceso en la BBDD para la escritura de registros...",
      "databasePost"
    );
    db.meteoStationOrchestrator(req.body.message);
    res.status(200).send("OK");
  }
});

app.get("/", (req, res) => {
  res.send("OK Gemini");
});

// Funcion para convertir el json en String y procesar los datos
function databaseOrchestrator(data) {
  const jsonString = JSON.stringify(data);
  if (true) {
    let arr = getSensorData(jsonString);
  }
}

// Función que procesa los datos del string y los convierte en un array para su posterior inserción en la BBDD
async function getSensorData(dataString) {
  // Sacamos el id de la estacion
  const regex =
    /station\s*=\s*'([^']+)'\s\|\sdate=(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/;
  const match = dataString.match(regex);
  let stationId;
  let dateTime;
  if (match && match[1] && match[2]) {
    stationId = match[1];
    dateTime = match[2];
  } else {
    console.log("No se encontró la fecha y hora o el parámetro 'station'.");
  }
  const regex2 = /\((.*?)\)/; // Expresión regular para buscar el texto entre paréntesis
  const coincidencia = dataString.match(regex2); // Buscar la coincidencia
  if (coincidencia && coincidencia.length > 1) {
    const rawText = coincidencia[1];
    const sensors = rawText.split("|");
    for (let i = 0; i < sensors.length; i++) {
      const sensorData = sensors[i].split("|");
      for (let j = 0; j < sensorData.length; j++) {
        let res = [];
        res.push(stationId);
        res.push(dateTime);
        const sensorValues = sensorData[j].split(";");
        for (let x = 0; x < sensorValues.length - 1; x++) {
          const value = sensorValues[x].split("=");
          const regex = /'/g;
          res.push(value[1].replace(regex, ""));
        }
        let sensorType = res[2];
        sendSensorDataToDB(sensorType, res);
      }
    }
  }
}

// Función que se encarga de organizar a qué función enviar los datos en ls BBDD según el sensor
async function sendSensorDataToDB(sensorType, sensorData) {
  switch (sensorType) {
    case "Solar Panel":
      db.addRegSensor1(sensorData, 1);
      break;
    case "Battery":
      db.addRegSensor1(sensorData, 2);
      break;
    case "Soil temperature 1":
      db.addRegSensor3(sensorData, 3);
      break;
    case "Soil temperature 2":
      db.addRegSensor3(sensorData, 4);
      break;
    case "Soil temperature 3":
      db.addRegSensor3(sensorData, 5);
      break;
    case "Soil temperature 4":
      db.addRegSensor3(sensorData, 6);
      break;
    case "Soil temperature 5":
      db.addRegSensor3(sensorData, 7);
      break;
    case "Soil temperature 6":
      db.addRegSensor3(sensorData, 8);
      break;
    case "EAG Soil moisture 1":
      db.addRegSensor3(sensorData, 9);
      break;
    case "EAG Soil moisture 2":
      db.addRegSensor3(sensorData, 10);
      break;
    case "EAG Soil moisture 3":
      db.addRegSensor3(sensorData, 11);
      break;
    case "EAG Soil moisture 4":
      db.addRegSensor3(sensorData, 12);
      break;
    case "EAG Soil moisture 5":
      db.addRegSensor3(sensorData, 13);
      break;
    case "EAG Soil moisture 6":
      db.addRegSensor3(sensorData, 14);
      break;
    case "Volumetric Ionic Content 1":
      db.addRegSensor3(sensorData, 15);
      break;
    case "Volumetric Ionic Content 2":
      db.addRegSensor3(sensorData, 16);
      break;
    case "Volumetric Ionic Content 3":
      db.addRegSensor3(sensorData, 17);
      break;
    case "Volumetric Ionic Content 4":
      db.addRegSensor3(sensorData, 18);
      break;
    case "Volumetric Ionic Content 5":
      db.addRegSensor3(sensorData, 19);
      break;
    case "Volumetric Ionic Content 6":
      db.addRegSensor3(sensorData, 20);
      break;
    case "Diameter":
      db.addRegSensor3(sensorData, 21);
      break;
    case "Diameter Ekomatic":
      db.addRegSensor1(sensorData, 22);
      break;
    case "Radiation SiAR":
      db.addRegSensor1(sensorData, 23);
      break;
    case "Precipitation SiAR":
      db.addRegSensor1(sensorData, 24);
      break;
    case "Wind speed SiAR":
      db.addRegSensor1(sensorData, 25);
      break;
    case "Wind direction SiAR":
      db.addRegSensor1(sensorData, 26);
      break;
    case "Temperature SiAR":
      db.addRegSensor3(sensorData, 27);
      break;
    case "Humidity SiAR":
      db.addRegSensor3(sensorData, 28);
      break;
    case "Et0 SiAR":
      db.addRegSensor1(sensorData, 29);
      break;
    case "Pep SiAR":
      db.addRegSensor1(sensorData, 30);
      break;
  }
  
}


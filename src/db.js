const utils = require("./utils");
const Pool = require("pg").Pool;
require("dotenv").config();
console.log();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DATABASETOKEN,
  database: process.env.DATABASETOKEN,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const { Client } = require("pg");

// Configuración de la conexión
const connectionConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

// Crea un nuevo cliente
const client = new Client(connectionConfig);

// Conecta al servidor PostgreSQL
async function connectDBClient() {
  client.connect((err) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err);
      utils.logWrite(
        "Error al conectar a la base de datos",
        "databaseAccess"
      );
    } else {
      console.log("Conexión exitosa a la base de datos");
      utils.logWrite(
        "Conexión exitosa a la base de datos",
        "databaseAccess"
      );
    }
  });
}

function databaseOrchestrator(data) {
  const jsonString = JSON.stringify(data);
  if (true) {
    let arr = getSensorData(jsonString);
  }
}

async function getSensorData(dataString) {
  await connectDBClient()
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

async function sendSensorDataToDB(sensorType, sensorData) {
  if (sensorType.includes("Solar Panel")) {
    addSolarPanelMeasurement(sensorData)
  }
  if (sensorType.includes("Battery")) {
    addBatteryMeasurement(sensorData)
  }
  if (sensorType.includes("EAG Soil moisture")) {
    addSoilMoistureMeasurement(sensorData)
  }
  if (sensorType.includes("Volumetric Ionic Content")) {
    addVolumetricIonicContentMeasurement(sensorData)
  }
  if (sensorType.includes("Soil temperature")) {
    addTemperatureMoistureMeasurement(sensorData)
  }
}

async function getFarms() {
  await connectDBClient();
  let res;
  const query = "SELECT * FROM farm";
  // Ejecuta la consulta
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
    } else {
      res = result.rows;
      console.log(res);
      client.end();
      return res;
      //console.log(res)
      // Aquí puedes realizar cualquier otra operación con los resultados obtenidos
    }
    // Cierra la conexión con la base de datos
  });
}

async function getSensors() {
  await connectDBClient();
  let res;
  const query = "SELECT * FROM sensor";
  // Ejecuta la consulta
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
    } else {
      res = result.rows;
      console.log(res);
      client.end();
      return res;
      //console.log(res)
      // Aquí puedes realizar cualquier otra operación con los resultados obtenidos
    }
    // Cierra la conexión con la base de datos
  });
  //client.end();
}

async function getMeasurements() {
  await connectDBClient();
  let res;
  const query = "SELECT * FROM  sensor_register";
  // Ejecuta la consulta
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
    } else {
      res = result.rows;
      console.log(res);
      client.end();
      return res;
      //console.log(res)
      // Aquí puedes realizar cualquier otra operación con los resultados obtenidos
    }
    // Cierra la conexión con la base de datos
  });
}

async function addSolarPanelMeasurement(arr) {
  //await connectDBClient();
  let res;
  const query =
    "Insert into sensor_measurement(serial, registered, name, unit, chanel, value) values ($1, $2, $3,$4, $5, $6);";
  const values = [arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]];
  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      utils.logWrite(
        "Error al insertar en la base de datos el registro del sensor '" + arr[2] + "' de la estación " + arr[0] + ". Más información en databaseErrors.log. " ,
        "databaseLogs"
      );
      utils.logWrite("[ " + arr[0] + " ] " + err ,
      "databaseErrors")
    } else {
      res = result.rows;
      console.log("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito");
      utils.logWrite(
        "Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito",
        "databaseLogs"
      );
    }
  });
}

async function addBatteryMeasurement(arr) {
  //await connectDBClient();
  let res;
  const query =
    "Insert into sensor_measurement(serial, registered, name, unit, chanel, value) values ($1, $2, $3,$4, $5, $6);";
  const values = [arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]];
  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      utils.logWrite(
        "Error al insertar en la base de datos el registro del sensor '" + arr[2] + "' de la estación " + arr[0] + ". Más información en databaseErrors.log. " ,
        "databaseLogs"
      );
      utils.logWrite("[ " + arr[0] + " ] " + err ,
      "databaseErrors")
    } else {
      res = result.rows;
      console.log("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito");
      utils.logWrite(
        "Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito",
        "databaseLogs"
      );
    }
  });
}

async function addSoilMoistureMeasurement(arr) {
  //await connectDBClient();
  let res;
  const query =
    "Insert into sensor_measurement(serial, registered, name, unit, chanel, average) values ($1, $2, $3,$4, $5, $6);";
  const values = [arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]];
  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      utils.logWrite(
        "Error al insertar en la base de datos el registro del sensor '" + arr[2] + "' de la estación " + arr[0] + ". Más información en databaseErrors.log. " ,
        "databaseLogs"
      );
      utils.logWrite("[ " + arr[0] + " ] " + err ,
      "databaseErrors")
    } else {
      res = result.rows;
      console.log("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito");
      utils.logWrite(
        "Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito",
        "databaseLogs"
      );
    }
  });
}

async function addTemperatureMoistureMeasurement(arr) {
  //await connectDBClient();
  let res;
  const query =
    "Insert into sensor_measurement(serial, registered, name, unit, chanel, average, maximum, minimum) values ($1, $2, $3,$4, $5, $6, $7, $8);";
  const values = [
    arr[0],
    arr[1],
    arr[2],
    arr[3],
    arr[4],
    arr[5],
    arr[6],
    arr[7],
  ];
  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      utils.logWrite(
        "Error al insertar en la base de datos el registro del sensor '" + arr[2] + "' de la estación " + arr[0] + ". Más información en databaseErrors.log. " ,
        "databaseLogs"
      );
      utils.logWrite("[ " + arr[0] + " ] " + err ,
      "databaseErrors")
    } else {
      res = result.rows;
      console.log("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito");
      utils.logWrite(
        "Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito",
        "databaseLogs"
      );
    }
  });
}

async function addVolumetricIonicContentMeasurement(arr) {
  //await connectDBClient();
  let res;
  const query =
    "Insert into sensor_measurement(serial, registered, name, unit, chanel, average) values ($1, $2, $3,$4, $5, $6);";
  const values = [arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]];
  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      utils.logWrite(
        "Error al insertar en la base de datos el registro del sensor '" + arr[2] + "' de la estación " + arr[0] + ". Más información en databaseErrors.log. " ,
        "databaseLogs"
      );
      utils.logWrite("[ " + arr[0] + " ] " + err ,
      "databaseErrors")
    } else {
      res = result.rows;
      console.log("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito");
      utils.logWrite(
        "Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito",
        "databaseLogs"
      );
    }
  });
}

async function addDiameterMeasurement(station, arr) {
  //await connectDBClient();
  let res;
  const query =
    "Insert into sensor_register(name, registered, serial, code, chanel, unit) values ($1, $2, $3,$4, $5, $6);";
  const values = [arr[0], arr[10], arr[8], arr[6], arr[5], arr[4]];
  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      utils.logWrite(
        "Error al insertar en la base de datos el registro del sensor '" + arr[2] + "' de la estación " + arr[0] + ". Más información en databaseErrors.log. " ,
        "databaseLogs"
      );
      utils.logWrite("[ " + arr[0] + " ] " + err ,
      "databaseErrors")
    } else {
      res = result.rows;
      console.log("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito");
      utils.logWrite(
        "Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito",
        "databaseLogs"
      );
    }
  });
}

module.exports = {
  databaseOrchestrator,
  getFarms,
  getSensors,
  getMeasurements,
};

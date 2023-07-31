const utils = require("./utils");
const Pool = require("pg").Pool;
require("dotenv").config();

// Creamos el pool, con datos almacenados en el fichero .env
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

// Creación de un nuevo cliente y conexión al servidor de PostgreSQL
const client = new Client(connectionConfig);
async function connectDBClient() {
  try {
    await client.connect();
    console.log("Conexión exitosa a la base de datos");
    utils.logWrite("Conexión exitosa a la base de datos", "databaseAccess");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    utils.logWrite("Error al conectar a la base de datos", "databaseAccess");
  }
}

connectDBClient();

// Método que obtiene todos los sensores de la BBDD
async function getSensors() {
  try {
    await connectDBClient();
    let res;
    const query = "SELECT * FROM sensor";
    const result = await client.query(query);
    res = result.rows;
    client.end();
    return res;
  } catch (error) {
    console.error("Error al ejecutar la consulta de los sensores:", error);
    utils.logWrite("Error al ejecutar la consulta de los sensores.", "databaseAccess");
  }
}

// Método que registra todos los sensores de tipo 1 en la BBDD
async function addRegSensor1(arr, sensor_type) {
  console.log(arr)
  const serial = arr[0];
  const name = arr[2];
  const registered_date = arr[1];
  const value = arr[5];
  const unit = arr[3];
  const insertQuery = `
  WITH sensor_data AS (
    SELECT s.id AS sensor_id
    FROM sensor s
    INNER JOIN station st ON s.station = st.id
    WHERE st.serial = $1 AND s.name = $2
    LIMIT 1
  )
  INSERT INTO reg_sensor_${sensor_type} (registered_date, sensor, value, unit)
  SELECT $3, sensor_id, $4, $5
  FROM sensor_data;
`;
  try {
    const res = await client.query(insertQuery, [serial,name,registered_date,value,unit]);
    //console.log(res)
    if(res.rowCount > 0){
      console.log("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito.");
      utils.logWrite("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito", "databaseLogs");
    }else{
      console.log("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " no se ha podido insertar.");
      utils.logWrite("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + "no se ha podido insertar.", "databaseLogs");
    }
    
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    utils.logWrite("Error al insertar en la base de datos el registro del sensor '" + arr[2] + "' de la estación " + arr[0] + ". Más información en databaseErrors.log.", "databaseLogs");
    utils.logWrite("[ " + arr[0] + " ] " + error, "databaseErrors");
  }
}

// Método que registra todos los sensores de tipo 2 en la BBDD
async function addRegSensor3(arr, sensor_type) {
  const serial = arr[0];
  const name = arr[2];
  const registered_date = arr[1];
  const average = arr[5];
  const maximum = arr[6];
  const minimum = arr[7];
  const unit = arr[3];
  const insertQuery = `
  WITH sensor_data AS (
    SELECT s.id AS sensor_id
    FROM sensor s
    INNER JOIN station st ON s.station = st.id
    WHERE st.serial = $1 AND s.name = $2
    LIMIT 1
  )
  INSERT INTO reg_sensor_${sensor_type} (registered_date, sensor, average, minimum, maximum, unit)
  SELECT $3, sensor_id, $4, $5, $6, $7
  FROM sensor_data;
`;
  try {
    const res = await client.query(insertQuery, [serial,name,registered_date,average,minimum,maximum,unit]);
    if (res.rowCount > 0) {
      console.log("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito.");
      utils.logWrite("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " insertado con éxito", "databaseLogs");
    } else {
      console.log("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " no se ha insertado. Revise la llamada.");
      utils.logWrite("Registro del sensor '" + arr[2] + "' de la estación " + arr[0] + " no se ha insertado", "databaseLogs");
    }
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    utils.logWrite("Error al insertar en la base de datos el registro del sensor '" + arr[2] + "' de la estación " + arr[0] + ". Más información en databaseErrors.log.", "databaseLogs");
    utils.logWrite("[ " + arr[0] + " ] " + error, "databaseErrors");
  }
}

module.exports = {
  getSensors,
  addRegSensor1,
  addRegSensor3,
};
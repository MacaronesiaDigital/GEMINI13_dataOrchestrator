const fs = require("fs");

function logWrite(message, file) {
    var log ="- " + new Date() + " | MESSAGE: " + message +"\n";
    fs.appendFile(`./logs/${file}.log`, log, function (err) {
      if (err) throw err;
    });
  }

  function getStationData(dataString){
    const array = dataString.split(';');
    let res = []
    for (let i = 0; i < array.length; i++){
      let aux = array[i].split(':')
      res.push(aux[1])

    }
    return res;

  }

module.exports = {
    logWrite,
    getStationData
}
function decodeUplink(input) {
  var data = {};
  data.ADC0_Vin = (((input.bytes[0] << 8) | input.bytes[1]) & 0x7fff) / 1000;
  data.ADC1_Vin = (((input.bytes[2] << 8) | input.bytes[3]) & 0x7fff) / 1000;
  data.ADC2_Vbatt = (((input.bytes[4] << 8) | input.bytes[5]) & 0x7fff) / 1000;
  data.Tair = (((input.bytes[7] << 8) | input.bytes[8]) & 0x7fff) / 10; // not used yet in your case
  data.RHair = (((input.bytes[9] << 8) | input.bytes[10]) & 0x7fff) / 10; // not used yet in your case

  var ratio_A0 = data.ADC0_Vin / data.ADC2_Vbatt;
  data.ratio_A0 = Math.round((ratio_A0 + Number.EPSILON) * 100000) / 100000;
  var DD_L2_1_um = ratio_A0 * 25400;
  data.DD_L2_1_um = Math.round(DD_L2_1_um * 10000) / 10000;

  // no DD-L2#2 yet connected in your case
  var ratio_A1 = data.ADC1_Vin / data.ADC2_Vbatt;
  data.ratio_A1 = Math.round((ratio_A1 + Number.EPSILON) * 100000) / 100000;
  var DD_L2_2_um = ratio_A1 * 25400;
  data.DD_L2_2_um = Math.round(DD_L2_2_um * 10000) / 10000;
  return {
    data: data,
  };
}

function hexToBytes(hex) {
    var bytes = [];
    for (var i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
  }
  
  var payloadHex = "0971020C0E6E08010B02A524";
  var payloadBytes = hexToBytes(payloadHex);
  
  var input = {
    bytes: payloadBytes
  };
  
  var result = decodeUplink(input);
  console.log(result);


const fs = require('fs');
const util = require('util');
const parser = require('xml2json');
const js2xmlparser = require('js2xmlparser');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const OFFSET = parseInt(process.argv[2]) || -60;
const READPATH = process.argv[3];
const WRITEPATH = process.argv[4];

// adjust time by offset, keep results within 0-1440
const adjustTime = (time) => {
  const adjustedTime = time + OFFSET;

  if (adjustedTime < 0) return 0;
  if (adjustedTime > 1440) return 1440;
  return adjustedTime;
};

// original function copied from http://thereefuge.com/threads/reverse-engineering-a-hydra-26-hd.15524/
// calculates the checksum based on the 'colors' xml element
const getChecksum = (json) => {
  // convert json to xml and get only the colors element
  const colorsXml = js2xmlparser.parse('ramp', json.ramp)
    .match(/(<colors>.+?<\/colors>)/gms)[0]
    .replace(/(\r\n|\n|\r|\s+)/gm,"");

  let checksum = 0;

  if (colorsXml.length === 0) return k;

  for (var i = 0; i < colorsXml.length; i += 1) {
      const charCode = colorsXml.charCodeAt(i);
      checksum = ((checksum << 5) - checksum) + charCode;
      checksum = checksum & 4294967295;
  }
  if (checksum < 0) checksum = ~checksum;
  return checksum;
};

const timeOffset = async () => {
  const xml = await readFile(READPATH, {encoding: 'utf8'});
  const json = JSON.parse(parser.toJson(xml, { coerce: true }));

  const { colors } = json.ramp;

  // iterate over all points in all colors, offsetting the time in each
  Object.keys(colors).forEach((color) => {
    const { point } = json.ramp.colors[color];
    point.forEach(({time}, i) => {
      json.ramp.colors[color].point[i].time = adjustTime(time);
    });
  });

  // update the checksum so the file will be accepted by the light UI
  json.ramp.header.checksum = getChecksum(json);

  // convert json to xml and write to file
  await writeFile(WRITEPATH, js2xmlparser.parse('ramp', json.ramp));
}

timeOffset();

const { nextISSTimesForMyLocation } = require('./iss_promised');

const printPassTimes = function (passTimes) {
  for (const row of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(row.risetime);
    const duration = row.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })

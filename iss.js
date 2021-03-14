const request = require('request');
const url = 'https://api.ipify.org?format=json';
const url2 = 'https://freegeoip.app/json/';

const fetchMyIP = function (callback) {
  request(url, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const data = JSON.parse(body);
    callback(null, data.ip)
  })

};

const fetchCoordsByIP = function (ip2, callback) {
  request(url2 + ip2, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body);
    callback(null, { latitude, longitude });
  })
}
const fetchISSFlyOverTimes = function (coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const data = JSON.parse(body).response;
    callback(null, data);
  })
}


// const nextISSTimesForMyLocation = function (callback) {

//   // fetch ip
//   request(url, (error, response, body) => {
//     if (error) return callback(error, null);

//     if (response.statusCode !== 200) {
//       callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
//       return;
//     }

//     const ip = JSON.parse(body).ip;

//     // fetch Lat Long
//     request(url2 + ip, (error, response, body) => {
//       if (error) return callback(error, null);

//       if (response.statusCode !== 200) {
//         callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
//         return;
//       }

//       const { latitude, longitude } = JSON.parse(body);

//       // fetch fly over times
//       request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`, (error, response, body) => {
//         if (error) return callback(error, null);

//         if (response.statusCode !== 200) {
//           callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
//           return;
//         }

//         const data = JSON.parse(body).response;
//         callback(null, data);
//       })
//     })

//   })
// }


const nextISSTimesForMyLocation = function (callback) {

  // fetch ip
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    // fetch Lat Long
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      // fetch fly over times
      fetchISSFlyOverTimes(loc, (error, data) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, data);
      })
    })
  })
}

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
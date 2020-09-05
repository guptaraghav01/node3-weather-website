const request = require("postman-request");

const weather = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=f9410511d5d5371aa2bb6744d92b1b01&query=" +
    latitude +
    "," +
    longitude +
    "&units=f";

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service.", undefined);
    } else if (body.error) {
      callback("Unable to find location.", undefined);
    } else {
      callback(
        undefined,
        body.current.weather_descriptions[0] +
          ". It is currently " +
          body.current.temperature +
          " degrees outside, but it feels like " +
          body.current.feelslike +
          " degrees. \n " +
          "Date and time: " +
          body.location.localtime
      );
    }
  });
};

module.exports = weather;

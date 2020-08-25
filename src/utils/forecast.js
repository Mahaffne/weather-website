const request = require('postman-request')

const forecast = (latitude, longitude, callback) => {
  const url = 'http://api.weatherstack.com/current?access_key=5722d478d3c3e5a60a174719627a59dc&query=' + latitude + ',' + longitude
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service!', null)
    } else if (body.error) {
      callback('Unable to find location!', null)
    } else {
      callback(null, body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + '°C out. It feels like ' + body.current.feelslike + '°C.')
    }
  })
}

module.exports = forecast

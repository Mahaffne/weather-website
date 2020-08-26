const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000
// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// App.use expects a middleware callback. This setup static directory to serve,
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Margaux Haffner'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Margaux Haffner'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    helpMsge: 'To get your weather, navigate through the \'Weather\' section in the menu here above. Enter your location in the form and click into the \'Search\' button, like in the example here below:',
    title: 'Help',
    name: 'Margaux Haffner'
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({ error: 'You must provide an address' })
  }
  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }
      res.send({
        forecast: forecastData,
        location: location,
        address: req.query.address
      })
    })
  })
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    })
  }

  console.log(req.query.search)
  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('404-error', {
    errMsge: 'Help article not found',
    title: '404',
    name: 'Margaux Haffner'
  })
})

// error page arrives here after having looked for a match through all route paths 
app.get('*', (req, res) => {
  res.render('404-error', {
    errMsge: 'page not found',
    title: '404',
    name: 'Margaux Haffner'
  })
})

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})

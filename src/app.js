const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const weather = require("./utils/weather");

const app = express();
const port = process.env.PORT || 3000;

// Define Paths for Express Config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup HandleBars Engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Raghav Gupta",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About the app",
    name: "Raghav Gupta",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message:
      "This app will tell you the current weather and temperature of the location that you enter!\nTo get started go back to the Weather tab :)",
    title: "Help",
    name: "Raghav Gupta",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide an address.",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      weather(latitude, longitude, (error, weatherData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          weather: weatherData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term!",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Help article not found.",
    name: "Raghav Gupta",
  });
  // res.send("Help Article not found");
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Page not found",
    name: "Raghav Gupta",
  });
  // res.send("My 404 Page");
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

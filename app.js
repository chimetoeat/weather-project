const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { log } = require("console");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  const query = req.body.cityName;
  const units = "metric";
  const apiKey = "b2ed02b92ede405b2c28b34b77c25daa";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    units;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDesc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;

      res.write("<p>The weather is currently " + weatherDesc + "</p>");
      res.write(
        "<h1>The temperature in " +
          query +
          " is " +
          temp +
          " degrees Celsius.</h1>"
      );
      res.write(
        "<img src='https://openweathermap.org/img/wn/" + icon + "@2x.png'/>"
      );
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port: 3000");
});

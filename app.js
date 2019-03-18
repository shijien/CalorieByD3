const express = require("express");
const app = express();
const path = require("path");
const fetch = require("node-fetch");
const bodyParser = require('body-parser');


const PORT = process.env.PORT || 3000; // process.env accesses heroku's environment variables

app.use(express.static("dist"));

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "./index.html"));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/getcalories/", (req, res) => {

  fetch(
    `https://api.edamam.com/api/nutrition-data?app_id=d3dfd896&app_key=1d6f328c3be62bc447b01e2801aeb60e&ingr=${req.body.ingredients}`
  ).then(res => {
    return res.text();
  }).then(body => {
      let results = JSON.parse(body);
      res.send(results);
  });
});

app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`);
});

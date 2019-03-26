import "./stylesheets/style.scss";
const lodash = require("lodash");
const axios = require("axios");
const D3Bubbles = require("./d3_bubbles");
const D3Columns = require("./d3_columns");
const StorageAPI = require("./utils/storage");

function getCalories(ingredients) {
  const data = {
    ingredients: ingredients
  };
  return axios.post(`/getcalories`, data);
}

function handleSubmitFood(ingredients) {
  return getCalories(ingredients);
}

document.addEventListener("DOMContentLoaded", () => {
  // debugger
  if (StorageAPI.getStorageItem("calorieData") === null) {
    StorageAPI.setStorageItem("calorieData", [
      { name: "ice cream", calories: 0, quantity: " 1" },
      { name: "latte", calories: 0, quantity: "2 cups" },
      { name: "coffee latte", calories: 0, quantity: "240" },
      { name: "pho", calories: 0, quantity: "1 bowl" },
      { name: "thai pad", calories: 0, quantity: "1 bowl" },
      { name: "pho", calories: 0, quantity: "1" },
      { name: "watermelon", calories: 272, quantity: "2 pound", level: 500 },
      { name: "banana", calories: 403, quantity: "1 pounds", level: 500 },
      { name: "pizza", calories: 1211, quantity: "1 slice", level: 1000 },
      { name: "cheeseburger", calories: 312, quantity: "1", level: 500 },
      { name: "champagne", calories: 185, quantity: "1 glass", level: 200 },
      { name: "apple", calories: 189, quantity: "2", level: 200 }
    ]);
  }
  D3Bubbles(StorageAPI.getStorageItem("calorieData"));
  D3Columns(StorageAPI.getStorageItem("calorieData"));

  document
    .getElementById("search-form-container")
    .addEventListener("submit", e => {
      e.preventDefault();
      let result = Array.from(document.getElementsByClassName("inputFood")).map(
        el => el.value
      );
      let resultString = `${result[1]} ${result[2]} ${result[0]}`;
      // debugger
      handleSubmitFood(resultString).then(res => {
        let calories = res.data.calories;
        let quantity =
          result[2] === "" ? `${result[1]}` : `${result[1]} ${result[2]}`;
        let foodName = `${result[0]}`;
        let bubbleData = {
          name: foodName,
          calories: calories,
          quantity: quantity
        };
        // debugger
        let items = StorageAPI.getStorageItem("calorieData");
        items.push(bubbleData);
        location.reload();
        D3Bubbles(StorageAPI.setStorageItem("calorieData", items));
        D3Columns(StorageAPI.setStorageItem("calorieData", items));
      });
    });
});

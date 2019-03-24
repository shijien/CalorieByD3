const lodash = require('lodash');
import "./stylesheets/style.scss";
//import Icon from './images/icon.png';
// const D3Compoent = require('')
const axios = require('axios');
const D3Bubbles = require('./d3_bubbles');
const D3Columns = require('./d3_columns');
const StorageAPI = require('./utils/storage');


function getCalories(ingredients) {
    const data = {
        ingredients: ingredients
    }
    return axios.post(`/getcalories`, data);
}

function handleSubmitFood(ingredients) {
    return getCalories(ingredients);
    
}

document.addEventListener('DOMContentLoaded', () => {
    // debugger
    if (StorageAPI.getStorageItem("calorieData") === null) {
        StorageAPI.setStorageItem("calorieData", [
            {
                name: "apple",
                calories: 45,
                quantity: "1"
            },
            {
                name: "pineApple",
                calories: 150,
                quantity: "1"
            },
            {
                name: "burger",
                calories: 2000,
                quantity: "2"
            }
        ]);
    }
    D3Bubbles(StorageAPI.getStorageItem("calorieData"));
    D3Columns(StorageAPI.getStorageItem("calorieData"));

    document.getElementById('search-form-container').addEventListener('submit', e => {
        e.preventDefault();
        let result = Array.from(document.getElementsByClassName('inputFood')).map(el => el.value);
        let resultString = `${result[1]} ${result[2]} ${result[0]}`;
        // debugger
        handleSubmitFood(resultString).then(res=> {
            let calories = res.data.calories;
            let quantity = result[2] === '' ? `${result[1]}` : `${result[1]} ${result[2]}`;
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




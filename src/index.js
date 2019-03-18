const lodash = require('lodash');
import "./stylesheets/style.scss";
//import Icon from './images/icon.png';
// const D3Compoent = require('')
const axios = require('axios');
const D3Bubbles = require('./d3_bubbles');
const D3Columns = require('./d3_columns');



// function titleComponent() {
//     let title = document.getElementsByClassName('app-title')[0];
//     title.innerHTML = lodash.join(["Food Calorie Calculator"]);
// }

function getCalories(ingredients) {
    const data = {
        ingredients: ingredients
    }
    return axios.post(`/getcalories`, data);
}

function handleSubmitFood(ingredients) {
    return getCalories(ingredients);
    
}

function getStorageItem(itemName) {
    let myStorage = window.localStorage;
    return JSON.parse(myStorage.getItem(itemName));
}

function setStorageItem(itemName, items) {
    let myStorage = window.localStorage;
    myStorage.setItem(itemName, JSON.stringify(items));
    return items;
}

document.addEventListener('DOMContentLoaded', () => {
    // debugger
    if (getStorageItem("calorieData") === null) {
        setStorageItem("calorieData", [
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
    D3Bubbles(getStorageItem("calorieData"));
    D3Columns(getStorageItem("calorieData"));

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
            let items = getStorageItem("calorieData");
            items.push(bubbleData);
            location.reload();
            D3Bubbles(setStorageItem("calorieData", items));
            D3Columns(setStorageItem("calorieData", items));
        });
    });

   

    // window.getCalories = getCalories;
    // getCalories("1 cup of apples").then(res => console.log(res)).catch(err => console.log(err));
});




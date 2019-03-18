const lodash = require('lodash');
import "./stylesheets/style.scss";
//import Icon from './images/icon.png';
// const D3Compoent = require('')
const axios = require('axios');
const D3Bubbles = require('./d3_bubbles');



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

document.addEventListener('DOMContentLoaded', () => {
    D3Bubbles();
    document.getElementById('search-form-container').addEventListener('submit', e => {
        e.preventDefault();
        let result = Array.from(document.getElementsByClassName('inputFood')).map(el => el.value);
        result = `${result[1]} ${result[2]} ${result[0]}`;
        handleSubmitFood(result).then(res=> console.log(res));
    })
    // window.getCalories = getCalories;
    // getCalories("1 cup of apples").then(res => console.log(res)).catch(err => console.log(err));
});




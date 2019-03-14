## Project Title
### CaloriedBy
## Background and Overview
  ### Motivation for project
`CalorigyByD3` is the data visualization project using the powerful D3.js. The goal is  can help people see and check the calories from daily food so that can easily improve their health level with the fast pace of life.    
    
  ### High level overview
Users can input the foods with the planned quantities. Through the node.js backend, it will get the total calories with this food and return back to browser. This calorie will be drawn like a bubble which size and color depends on the level of quantities and calories, ranged from deep green, light green, yellow, orange, red.
    
Through the other charts built with D3.js,Each food calries will be displayed to be a coloum sorted in the chart.  
## Functionality and MVP Features
In CalorieByD3, users will be able to:
- [] input the food and the specific quantities using search bar.
- [] D3 will display the bubble chart accoring the user's input 
- [] check the total calories displayed as big bubble in the center of the screen and the level of calories with different colors.
- [] check each food calorie level with sorted column size charts.
## Architecture and Technologies
This project can be implemented with the following technologies:
- Vanilla JavaScript and SCSS for overall structure and search bar for searching foods.
- `D3.js` for generating the bubble charts and interative column charts.
- Webpack to bundle and serve up the various scripts.
- Using the Nutritionix api to get the food info in Node.js backend server.  
## Implementation Timeline
**Day 1:** Setup `webpack` and `webpack.config.js`. create basic entry file and skeleton of classes need to implements. Learn the basics of D3.js. Goals of the day: 
- [] Get `webpack` up and ruuning
- [] Determine the structure, pattern and basics of D3.js.

**Day 1:** Setup `webpack` and `webpack.config.js`. create basic entry file and skeleton of classes need to implements. Learn the basics of D3.js. Goals of the day: 
- [] Get `webpack` up and ruuning
- [] Determine the structure, pattern and basics of D3.js

**Day 2:** Create the backend server to call nutrix api for getting food information. Using vanilla Javascript and CSS to generate the searchbar. Goals of the day:
- [] Implement the external api to generate the food information.
- [] Design the frontend and backend component for food searching.
- [] Know some basics to draw the interative column charts.   

**Day 3:** 
    Intergrate the search bar and column charts. Goals of the day
- [] When user get the food information, which also show in the column charts.
- [] The column bart should be implemented as sorted. 
- [] In the center of screen, there have fixed bubble show the total calories together with food user selected.
- [] Learn how to generate the bubble charts using D3.js.

**Day 4:** 
    Using D3.js to generate the bubble with food and quantities user selected.
- [] Generate each bubble charts.
- [] Show different colors according to the calories levels. 

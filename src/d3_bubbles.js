const d3 = require("d3");
const StorageAPI = require("./utils/storage");

function d3Bubbles(rawData) {
  // debugger
  function bubbleChart() {
    const width = 1150;
    const height = 1000;

    // location to centre the bubbles
    const centre = { x: width / 2, y: height / 2 };

    // strength to apply to the position forces
    const forceStrength = 0.03;

    // these will be set in createNodes and chart functions
    let svg = null;
    let bubbles = null;
    let labels = null;
    let nodes = [];

    var tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "white")
      .style("padding", "8px")
      .style("background-color", "rgba(0, 0, 0, 0.75)")
      .style("border-radius", "6px")
      .style("font", "12px sans-serif")
      .text("tooltip");

    var format = d3.format(",d");

    // charge is dependent on size of the bubble, so bigger towards the middle
    function charge(d) {
      return Math.pow(d.radius, 2.0) * 0.01;
    }

    // create a force simulation and add forces to it
    const simulation = d3
      .forceSimulation()
      .force("charge", d3.forceManyBody().strength(charge))
      .force("center", d3.forceCenter(centre.x, centre.y))
      .force(
        "x",
        d3
          .forceX()
          .strength(forceStrength)
          .x(centre.x)
      )
      .force(
        "y",
        d3
          .forceY()
          .strength(forceStrength)
          .y(centre.y)
      )
      .force("collision", d3.forceCollide().radius(d => d.radius + 1));

    // force simulation starts up automatically, which we don't want as there aren't any nodes yet
    simulation.stop();

    // set up colour scale
    const fillColourForTotal = d3
      .scaleOrdinal()
      .domain(["1500", "2500", "3000"])
      .range(["#00CC00", "#B266FF", "#FF0000"]);
    const fillColour = d3
      .scaleOrdinal()
      .domain(["50", "200", "500", "1000"])
      .range(["#00CC00", "#B2FF66", "#66B2FF", "#B266FF"]);

    const legendRectSize = 30;
    const legendSpacing = 10;

    // data manipulation function takes raw data from csv and converts it into an array of node objects
    // each node will store data and visualisation values to draw a bubble
    // rawData is expected to be an array of data objects, read in d3.csv
    // function returns the new node array, with a node for each element in the rawData input

    function createNodes(rawData) {
      // debugger
      // use max size in the data as the max in the scale's domain
      // note we have to ensure that size is a number

      rawData = rawData.filter(el => el.calories !== 0);
      let totalCalories = 0;

      for (let i = 0; i < rawData.length; i++) {
        totalCalories += parseInt(rawData[i].calories);
      }

      let maxSize = d3.max(rawData, d => +d.calories);
      if (rawData.length === 0) {
        maxSize = 10;
      }

      // size bubbles based on area
      const radiusScale = d3
        .scaleSqrt()
        .domain([0, maxSize])
        .range([50, 150]);

      let foods = rawData.map(d => {
        // debugger
        d.level = getRawDataLevel(d.calories);
        return d;
      });

      // use map() to convert raw data into node data
      const myNodes = foods.map(d => ({
        ...d,
        radius: radiusScale(+d.calories),
        size: +d.calories,
        x: Math.random() * 1000,
        y: Math.random() * 1000
      }));
      const centerData = {
        name: "TOTAL CALORIE",
        totalLevel: getCenterLevel(totalCalories),
        calories: totalCalories
      };

      let centDataRadius =
        centerData.calories === 0 ? +10 : +centerData.calories;

      myNodes.push({
        ...centerData,
        radius: radiusScale(centDataRadius),
        size: centDataRadius,
        x: 500,
        y: 500
      });

      return myNodes;
    }

    // main entry point to bubble chart, returned by parent closure
    // prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process
    let chart = function chart(selector, rawData) {
      // debugger
      // convert raw data into nodes data
      nodes = createNodes(rawData);

      // create svg element inside provided selector
      svg = d3
        .select(selector)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      // bind nodes data to circle elements
      const elements = svg
        .selectAll(".bubble")
        .data(nodes, d => d.name)
        .enter()
        .append("g");

      d3.select("svg")
        .append("text")
        .attr("font-size", "15px")
        .attr("class", "label")
        .attr("x", -60)
        .attr("y", 6 * legendRectSize)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("food calorie level");

      d3.select("svg")
        .append("text")
        .attr("font-size", "15px")
        .attr("class", "label")
        .attr("x", -50)
        .attr("y", 13 * legendRectSize)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("daily alert");

      const legendTotal = d3
        .select("svg")
        .append("g")
        .selectAll("g")
        .data(fillColourForTotal.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
          var height = legendRectSize;
          var x = 400;
          var y = i * height;
          return "translate(" + x + "," + y + ")";
        });

      const legend = d3
        .select("svg")
        .append("g")
        .selectAll("g")
        .data(fillColour.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
          var height = legendRectSize;
          var x = 200;
          var y = i * height;
          return "translate(" + x + "," + y + ")";
        });

      legendTotal
        .append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", fillColourForTotal)
        .style("stroke", fillColourForTotal);

      legendTotal
        .append("text")
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing)
        .attr("font-size", "15px")
        .text(function(d) {
          switch (d) {
            case "1500":
              return "healthy";
            case "2500":
              return "normal";
            case "3500":
              return "dangerous";
            default:
              return "healthy";
          }
        });
      legend
        .append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", fillColour)
        .style("stroke", fillColour);

      legend
        .append("text")
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing)
        .attr("font-size", "15px")
        .text(function(d) {
          switch (d) {
            case "50":
              return "low";
            case "200":
              return "medium";
            case "500":
              return "high";
            case "1000":
              return "very high";
            default:
              return "low";
          }
        });

      bubbles = elements
        .append("circle")
        .classed("bubble", true)
        .attr("r", d => d.radius)
        .attr("fill", d => {
          if (d.level !== undefined) {
            return fillColour(d.level);
          } else {
            return fillColourForTotal(d.totalLevel);
          }
        })
        .on("mouseover", function(d) {
          tooltip.text(d.name + ": " + format(d.calories) + " kCal");
          tooltip.style("visibility", "visible");
        })
        .on("mousemove", function() {
          return tooltip
            .style("top", d3.event.pageY - 10 + "px")
            .style("left", d3.event.pageX + 10 + "px");
        })
        .on("mouseout", function() {
          return tooltip.style("visibility", "hidden");
        })
        .on("click", function(d) {
          let arr = StorageAPI.getStorageItem("calorieData");
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === d.name && arr[i].calories === d.calories) {
              arr.splice(i, 1);
              break;
            }
          }

          StorageAPI.setStorageItem("calorieData", arr);
          location.reload();
        });
        
      labels = elements
        .append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(d => d.name);

      // set simulation's nodes to our newly created nodes array
      // simulation starts running automatically once nodes are set
      simulation
        .nodes(nodes)
        .on("tick", ticked)
        .restart();
    };

    // callback function called after every tick of the force simulation
    // here we do the actual repositioning of the circles based on current x and y value of their bound node data
    // x and y values are modified by the force simulation
    function ticked() {
      bubbles.attr("cx", d => d.x).attr("cy", d => d.y);

      labels.attr("x", d => d.x).attr("y", d => d.y);
    }

    function getCenterLevel(calories) {
      if (calories <= 1500) {
        return 1500;
      } else if (calories <= 2500) {
        return 2500;
      } else {
        return 3000;
      }
    }

    function getRawDataLevel(calories) {
      // debugger
      if (calories <= 50) {
        return 50;
      } else if (calories <= 200) {
        return 200;
      } else if (calories <= 500) {
        return 500;
      } else {
        return 1000;
      }
    }
    // return chart function from closure
    return chart;
  }

  // new bubble chart instance
  let myBubbleChart = bubbleChart();

  // function called once promise is resolved and data is loaded from csv
  // calls bubble chart function to display inside #vis div
  function display(data) {
    myBubbleChart("#vis", data);
  }

  // load data
  display(rawData);
}

module.exports = d3Bubbles;

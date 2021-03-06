// https://insights.stackoverflow.com/survey/2018/#technology-most-loved-dreaded-and-wanted-languages
const d3 = require("d3");

function d3Columns(rawData) {
    rawData = rawData.filter(el => el.calories !== 0);
    let updateData = {};
    for (let i = 0; i < rawData.length; i ++) {
        if (!updateData[rawData[i].name]) {
            updateData[rawData[i].name] = rawData[i];
        } else {
            updateData[rawData[i].name].calories += rawData[i].calories;
        }
    }
    rawData = Object.values(updateData).sort((e1, e2)=> {
        if (e1.calories === e2.calories) {
            return 0;
        } else {
            return e1.calories < e2.calories ? -1 : 1;
        }
    }); 
    const svg = d3.select('#column-chart');
    const svgContainer = d3.select('#column-chart-container');

    const margin = 80;
    const width = 850 - 2 * margin;
    const height = 1000 - 2 * margin;

    const fillColour = d3
        .scaleOrdinal()
        .domain(["50", "200", "500", "1000"])
        .range(["#00CC00", "#B2FF66", "#66B2FF", "#B266FF"]);

    const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(rawData.map((s) => s.name))
        .padding(0.4)

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 3000]);

    // vertical grid lines
    // const makeXLines = () => d3.axisBottom()
    //   .scale(xScale)

    const makeYLines = () => d3.axisLeft()
        .scale(yScale)

    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    chart.append('g')
        .call(d3.axisLeft(yScale));

    chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
            .tickSize(-width, 0, 0)
            .tickFormat('')
        )

    const barGroups = chart.selectAll()
        .data(rawData)
        .enter()
        .append('g')

    barGroups
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (g) => xScale(g.name))
        .attr('y', (g) => yScale(g.calories))
        .attr('height', (g) => height - yScale(g.calories))
        .attr('width', xScale.bandwidth())
        .attr("fill", g => {
            if (g.level !== undefined) {
                return fillColour(g.level);
            } 
        })
        .on('mouseenter', function (actual, i) {
            d3.selectAll('.value')
                .attr('opacity', 0)

            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 0.6)
                .attr('x', (a) => xScale(a.name) - 5)
                .attr('width', xScale.bandwidth() + 10)

            const y = yScale(actual.calories)

            line = chart.append('line')
                .attr('id', 'limit')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', width)
                .attr('y2', y)

            barGroups.append('text')
                .attr('class', 'divergence')
                .attr('x', (a) => xScale(a.name) + xScale.bandwidth() / 2)
                .attr('y', (a) => yScale(a.calories) - 2)
                .attr('fill', 'white')
                .attr('text-anchor', 'middle')
                .text((a, idx) => {
                    const divergence = (a.calories - actual.calories).toFixed(1)

                    let text = ''
                    if (divergence > 0) text += '+'
                    text += `${divergence}`

                    return idx !== i ? text : '';
                })

        })
        .on('mouseleave', function () {
            d3.selectAll('.value')
                .attr('opacity', 1)

            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 1)
                .attr('x', (a) => xScale(a.name))
                .attr('width', xScale.bandwidth())

            chart.selectAll('#limit').remove()
            chart.selectAll('.divergence').remove()
        })

    barGroups
        .append('text')
        .attr('class', 'value')
        .attr('x', (a) => xScale(a.name) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.calories) - 2)
        .attr('text-anchor', 'middle')
        .text((a) => `${a.calories}`)

    svg
        .append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 6)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Calories(kCal)')

    svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text('Food')

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 18)
        .attr('text-anchor', 'middle')
        .text('Your daily calories from food')
}

module.exports = d3Columns;


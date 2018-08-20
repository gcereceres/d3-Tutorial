import * as d3 from 'd3';
import { redditObject } from './redditFormat';

d3.select('body');

const width = 960;
const height = 480;

let svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let plotMargins = {
    top: 30,
    bottom: 30,
    left: 150,
    right: 30
};

let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeigt = height - plotMargins.top - plotMargins.bottom;

// x-axis
let xScale = d3.scaleTime()
    .range([0, plotWidth]);

let xAxis = d3.axisBottom(xScale);

let xAxisGroup = plotGroup.append('g')
    .classed('x', true)
    .classed('axis', true)
    .attr('transform', `translate(${0}, ${plotHeigt})`)
    .call(xAxis);

// y-axis
let yScale = d3.scaleLinear()
    .range([plotHeigt, 0]);

let yAxis = d3.axisLeft(yScale);
let yAxisGroup = plotGroup.append('g')
    .classed('y', true)
    .classed('axis', true)
    .call(yAxis);

// Points Group
let pointsGroup = plotGroup.append('g')
    .classed('points', true);

// Data

d3.json<redditObject>('http://api.reddit.com')
    .then((data) => {
        let prepared = data.data.children.map(d => {
            return{
                date: new Date(d.data.created * 1000),
                score: d.data.score
            }
        });

        console.log(prepared);
        xScale.domain(d3.extent(prepared, d => d.date))
            .nice();
        xAxisGroup.call(xAxis);

        yScale.domain(d3.extent(prepared, d => d.score))
            .nice();
        yAxisGroup.call(yAxis);

        let dataBound = pointsGroup.selectAll('.post')
            .data(prepared);

        // delete extra points
        dataBound
            .exit()
            .remove();

        // add new points
        let enterSelection = dataBound
            .enter()
            .append('g')
            .classed('post', true);

        // update all existing points
        enterSelection.merge(dataBound)
            .attr('transform', (d, i) => `translate(${xScale(d.date)},${yScale(d.score)})`);

        enterSelection.append('circle')
            .attr('r', 2)
            .style('fill', 'red');
    })
    .catch((error) => {
        console.log(error);
    })

// d3.json<redditObject>('http://api.reddit.com', (error, data) => {
//     if (error) {
//         console.error(error);
//     } else {
//         let prepared = data.data.children.map(d => {
//             return{
//                 date: new Date(d.data.created * 1000),
//                 score: d.data.score
//             }
//         });

//         console.log(prepared);
//         xScale.domain(d3.extent(prepared, d => d.date))
//             .nice();
//         xAxisGroup.call(xAxis);

//         yScale.domain(d3.extent(prepared, d => d.score))
//             .nice();
//         yAxisGroup.call(yAxis);

//         let dataBound = pointsGroup.selectAll('.post')
//             .data(prepared);

//         // delete extra points
//         dataBound
//             .exit()
//             .remove();

//         // add new points
//         let enterSelection = dataBound
//             .enter()
//             .append('g')
//             .classed('post', true);

//         // update all existing points
//         enterSelection.merge(dataBound)
//             .attr('transform', (d, i) => `translate(${xScale(d.date)},${yScale(d.score)})`);

//         enterSelection.append('circle')
//             .attr('r', 2)
//             .style('fill', 'red');
//     }
// });






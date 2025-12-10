// let plants = [
//   { name:"Carolina Ponyfoot", type:"herb", waterRank:1, sizeRank:1, peaks:["urban landscape","feeds wildlife"] },
//   { name:"African Iris", type:"herb", waterRank:3, sizeRank:2, peaks:["signify soil health"] },
//   { name:"White Panicle Aster", type:"herb", waterRank:5, sizeRank:3, peaks:["urban landscape","supports pollinators"] },
//   { name:"Sprenger’s Asparagus Fern", type:"herb", waterRank:10, sizeRank:4, peaks:["homes wildlife","urban landscape","feeds wildlife","prevents erosion"] },
//   { name:"Common Boxwood", type:"shrub", waterRank:8, sizeRank:5, peaks:["homes wildlife","urban landscape"] },
//   { name:"Common Fig", type:"shrub", waterRank:4, sizeRank:6, peaks:["urban landscape","supports pollinators"] },
//   { name:"Orchid Tree", type:"tree", waterRank:1, sizeRank:7, peaks:["prevents erosion","supports pollinators"] },
//   { name:"Bradford Pear", type:"tree", waterRank:4, sizeRank:8, peaks:["urban landscape","prevents erosion"] },
//   { name:"Pecan Tree", type:"tree", waterRank:7, sizeRank:9, peaks:["feeds wildlife","prevents erosion"] },
//   { name:"Bald Cypress", type:"tree", waterRank:10, sizeRank:10, peaks:["homes wildlife","prevents erosion","filters water"] }
// ];

// let benefits = [
//   "signify soil health","homes wildlife","urban landscape","feeds wildlife",
//   "prevents erosion","supports pollinators","filters water"
// ];

// let colorMap = { herb:"blue", shrub:"orange", tree:"red" };


// function drawLines() {

//   let width = Math.min(900, window.innerWidth * 0.75);
//   let height = 600;
//   let spacing = 50;

//   let svg = d3.select("#svgRoot")
   
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);

//   plants.forEach((plant, idx) => {
//     let baseY = height - plant.sizeRank * spacing;
//     let opacity = plant.waterRank / 10;

//  let points = benefits.map((benefit, i) => {
//   let x = 80 + i * (width - 160) / (benefits.length - 1);

//   let y = baseY;

//   if (plant.peaks.includes(benefit)) {
//     y = baseY - 30;
//   }

//   return [x, y];
// });


//     svg.append("polyline")
//       .attr("points", points.map(p => p.join(",")).join(" "))
//       .attr("fill", "none")
//       .attr("stroke", colorMap[plant.type])
//       .attr("stroke-width", 2.8)
//       .attr("opacity", opacity);
//   });
// }

// drawLines();
// window.addEventListener("resize", drawLines);
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv", function(data) {

  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.name;})
    .entries(data);

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.n; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  var res = sumstat.map(function(d){ return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  svg.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(+d.n); })
            (d.values)
        })

})

let canEl;
let heartEl;

function setup() {

  createCanvas(1, 1);


  canEl = select('#waterImg');
  heartEl = select('#heartImg');


  canEl.mousePressed(() => {
    console.log("watering can clicked at:", mouseX, mouseY);
    animateCan();
    animateHeart();
  });


}


function animateCan() {
  canEl.style('transition', 'transform 0.3s ease');
  canEl.style('transform', 'rotate(45deg)');

  setTimeout(() => {
    canEl.style('transform', 'rotate(0deg)');
  }, 900);
}



function animateHeart() {
  let pulses = 0;

  const pulseOnce = () => {
    heartEl.style('transition', 'transform 0.25s ease');
    heartEl.style('transform', 'scale(1.2)');

    setTimeout(() => {
      heartEl.style('transform', 'scale(1)');
      pulses++;
      if (pulses < 2) setTimeout(pulseOnce, 250);
    }, 250);
  };

  pulseOnce();
}


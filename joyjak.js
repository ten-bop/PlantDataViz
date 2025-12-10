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
let plants = [ 
  { name:"Carolina Ponyfoot", type:"herb", waterRank:1, sizeRank:1, peaks:["urban landscape","feeds wildlife"] },
  { name:"African Iris", type:"herb", waterRank:3, sizeRank:2, peaks:["signify soil health"] },
  { name:"White Panicle Aster", type:"herb", waterRank:5, sizeRank:3, peaks:["urban landscape","supports pollinators"] },
  { name:"Sprenger’s Asparagus Fern", type:"herb", waterRank:10, sizeRank:4, peaks:["homes wildlife","urban landscape","feeds wildlife","prevents erosion"] },
  { name:"Common Boxwood", type:"shrub", waterRank:8, sizeRank:5, peaks:["homes wildlife","urban landscape"] },
  { name:"Common Fig", type:"shrub", waterRank:4, sizeRank:6, peaks:["urban landscape","supports pollinators"] },
  { name:"Orchid Tree", type:"tree", waterRank:1, sizeRank:7, peaks:["prevents erosion","supports pollinators"] },
  { name:"Bradford Pear", type:"tree", waterRank:4, sizeRank:8, peaks:["urban landscape","prevents erosion"] },
  { name:"Pecan Tree", type:"tree", waterRank:7, sizeRank:9, peaks:["feeds wildlife","prevents erosion"] },
  { name:"Bald Cypress", type:"tree", waterRank:10, sizeRank:10, peaks:["homes wildlife","prevents erosion","filters water"] }
];

let benefits = [
  "signify soil health","homes wildlife","urban landscape","feeds wildlife",
  "prevents erosion","supports pollinators","filters water"
];

let colorMap = { herb:"blue", shrub:"orange", tree:"red" };

// -------------------- SETUP --------------------

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const margin = { top: 40, right: 40, bottom: 120, left: 220 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// -------------------- SCALES --------------------

// X = Benefits
const xScale = d3.scalePoint()
  .domain(benefits)
  .range([0, innerWidth]);

// Y = Tree size (smallest bottom, largest top)
const yScale = d3.scaleLinear()
  .domain([1, 10])
  .range([innerHeight, 0]);

// Opacity = Water Rank (1 = faint, 10 = solid)
const opacityScale = d3.scaleLinear()
  .domain([1, 10])
  .range([0.2, 1]);

// -------------------- AXES --------------------

g.append("g")
  .attr("transform", `translate(0,${innerHeight})`)
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("transform", "rotate(-40)")
  .style("text-anchor", "end");

g.append("g")
  .call(d3.axisLeft(yScale).ticks(10))
  .append("text")
  .attr("y", -20)
  .attr("fill", "black")
  .text("Tree Size Rank");

const line = d3.line()
  .x(d => xScale(d.benefit))
  .y(d => yScale(d.value))
  .curve(d3.curveMonotoneX);


plants.forEach(plant => {

  let plantData = benefits.map(benefit => {
    return {
      benefit: benefit,
      value: plant.peaks.includes(benefit) ? plant.sizeRank : 0
    };
  });

  g.append("path")
    .datum(plantData)
    .attr("class", "line")
    .attr("stroke", colorMap[plant.type])
    .attr("stroke-opacity", opacityScale(plant.waterRank))
    .attr("d", line);
});

// -------------------- TREE NAMES ON Y AXIS --------------------

const treesOnly = plants.filter(p => p.type === "tree");

g.selectAll(".tree-label")
  .data(treesOnly)
  .enter()
  .append("text")
  .attr("x", -15)
  .attr("y", d => yScale(d.sizeRank))
  .attr("dy", "0.35em")
  .attr("text-anchor", "end")
  .attr("fill", "black")
  .text(d => d.name);

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


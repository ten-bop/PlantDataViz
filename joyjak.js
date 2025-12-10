// -------------------- DATA --------------------
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
  "signify soil health","homes wildlife","urban landscape",
  "feeds wildlife","prevents erosion","supports pollinators","filters water"
];

let colorMap = { herb:"#2f86d0", shrub:"#ff9a3c", tree:"#e34a4a" };

const containerWidth = document.getElementById("chart-container").clientWidth;

const margin = { top: 40, right: 40, bottom: 80, left: 170};
const width = containerWidth - margin.left - margin.right;
const height = 550 - margin.top - margin.bottom;

d3.select("#chart-container").selectAll("*").remove();

const x = d3.scalePoint()
  .domain(benefits)
  .range([0, width])
  .padding(0.5);

const y = d3.scaleLinear()
  .domain([1, 10])
  .range([height, 0]);

const opacityScale = d3.scaleLinear()
  .domain([1, 10])
  .range([0.2, 1]);

const svg = d3.select("#chart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x));

const sizeToName = {};
plants.forEach(p => sizeToName[p.sizeRank] = p.name);

const yAxis = d3.axisLeft(y)
  .ticks(plants.length)
  .tickFormat(d => sizeToName[d] || "");

svg.append("g")
  .call(yAxis);

plants.forEach(plant => {

  const baseY = y(plant.sizeRank);
  const peakHeight = 40;  
  const xWiggle = 12;      

  let pathData = [];

  benefits.forEach(b => {
    const cx = x(b);

    if (plant.peaks.includes(b)) {
      pathData.push({ x: cx - xWiggle, y: baseY });
      pathData.push({ x: cx, y: baseY - peakHeight });
      pathData.push({ x: cx + xWiggle, y: baseY });
    } else {
      pathData.push({ x: cx, y: baseY });
    }
  });

  const line = d3.line()
    .x(d => d.x)
    .y(d => d.y);

  svg.append("path")
    .datum(pathData)
    .attr("fill", "none")
    .attr("stroke", colorMap[plant.type])
    .attr("stroke-width", 2.6)
    .attr("opacity", opacityScale(plant.waterRank))
    .attr("d", line);
    
});



window.addEventListener("load", () => {

  const canEl = document.getElementById("waterImg");
  const heartEl = document.getElementById("heartImg");

  if (!canEl || !heartEl) {
    console.error("Images not found – check IDs.");
    return;
  }

  canEl.addEventListener("click", () => {
    animateCan(canEl);
    animateHeart(heartEl);
  });
});

function animateCan(el) {
  el.style.transition = "transform 0.3s ease";
  el.style.transform = "rotate(45deg)";

  setTimeout(() => {
    el.style.transform = "rotate(0deg)";
  }, 900);
}

function animateHeart(el) {
  let pulses = 0;

  const pulseOnce = () => {
    el.style.transition = "transform 0.25s ease";
    el.style.transform = "scale(1.2)";

    setTimeout(() => {
      el.style.transform = "scale(1)";
      pulses++;
      if (pulses < 2) setTimeout(pulseOnce, 250);
    }, 250);
  };

  pulseOnce();
}

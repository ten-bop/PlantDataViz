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


function drawLines() {

  let width = Math.min(900, window.innerWidth * 0.75);
  let height = 600;
  let spacing = 50;

  let svg = d3.select("#svgRoot")
   
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  plants.forEach((plant, idx) => {
    let baseY = height - plant.sizeRank * spacing;
    let opacity = plant.waterRank / 10;

 let points = benefits.map((benefit, i) => {
  let x = 80 + i * (width - 160) / (benefits.length - 1);

  let y = baseY;

  if (plant.peaks.includes(benefit)) {
    y = baseY - 30;
  }

  return [x, y];
});


    svg.append("polyline")
      .attr("points", points.map(p => p.join(",")).join(" "))
      .attr("fill", "none")
      .attr("stroke", colorMap[plant.type])
      .attr("stroke-width", 2.8)
      .attr("opacity", opacity);
  });
}

drawLines();
window.addEventListener("resize", drawLines);

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


/*function overCan() {
  let r = canEl.elt.getBoundingClientRect();
  return (mouseX + window.scrollX >= r.left &&
          mouseX + window.scrollX <= r.right &&
          mouseY + window.scrollY >= r.top &&
          mouseY + window.scrollY <= r.bottom);
}*/


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


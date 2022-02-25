// The Prime Spiral (aka Ulam Spiral)
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/167-prime-spiral.html
// https://youtu.be/a35KWEjRvc0
// Adding A* path finding visualization

// State of spiral
let x, y;
let step = 1;
let state = 0;
let numSteps = 1;
let turnCounter = 1;
let ulam = [];
let spots = [];
let prime = [];
let w = 410; // width of canvas
let stepSize = 10;
let totalSteps;
let rows = w / stepSize;

// Open and closed set-- A* 
var openSet = [];
var closedSet = [];

// Start and end
var start;
var end;
var grid = new Array(rows);

// Function to test if number is prime
function isPrime(value) {
  if (value == 1) return false;
  for (let i = 2; i <= sqrt(value); i++) {
    if (value % i == 0) {
      return false;
    }
  }
  return true;
}

// Function to delete element from the array
function removeFromArray(arr, elt) {
  // Could use indexOf here instead to be more efficient
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

// An educated guess of how far it is between two points
function heuristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  // var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

function setup() {
  createCanvas(410, 410);  // even size breaks code?
  rectMode(CENTER);
  // set up spiral
  const cols = width / stepSize;
  const rows = height / stepSize;
  totalSteps = cols * rows;
 
  x = width/2;
  y = height/2;
  
  while (step <= totalSteps) {
  if (isPrime(step)) {
    fill(255);
    stroke(255);
    prime.push(true);
    ulam.push([x,y]);
    // console.log(step);
    // console.log(x,y);
  } else {
     prime.push(false);
    ulam.push([x,y]);
    // console.log(step);
  }
  // Move according to state
  switch (state) {
    case 0:
      x += stepSize;
      break;
    case 1:
      y -= stepSize;
      break;
    case 2:
      x -= stepSize;
      break;
    case 3:
      y += stepSize;
      break;
  }

  // Change state
  if (step % numSteps == 0) {
    state = (state + 1) % 4;
    turnCounter++;
    if (turnCounter % 2 == 0) {
      numSteps++;
    }
  }
  step++;
  //console.log(x,y);
  }
 
  // Are we done?
  // if (step > totalSteps) {
  //   noLoop();
  // }
  
   // Making a 2D array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  
   for (let u = 0; u < ulam.length; u++) {
      let  ul = ulam[u];
      let a = ul[0];  // retrieve the x coordinate of the ulam
      let b = ul[1];  // retrieve the y coordinate of the ulam
      let pr = prime[u];
      let i = floor(a / stepSize);
      let j = floor(b / stepSize);
      grid[i][j] = new Spot(i, j, a, b, pr, stepSize);  
   }

  //All the neighbors
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
 }

 // Start and end
  start = grid[1][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
 end.wall = false;

  //openSet starts with beginning only
 openSet.push(start);
 
}

function draw() {
   background(255);
  const cols = width / stepSize;
  const rows = height / stepSize;

  // Am I still searching?
  if (openSet.length > 0) {
    // Best next option
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var current = openSet[winner];

    // Did I finish?
    if (current === end) {
      noLoop();
      console.log('DONE!');
    }

    // Best option moves from openSet to closedSet
    removeFromArray(openSet, current);
    closedSet.push(current);
 
    // Check all the neighbors
    var neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      // Valid next spot?
      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + heuristic(neighbor, current);

        // Is this a better path than before?
        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        // Yes, it's a better path
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }
    console.log(openSet);
    // Uh oh, no solution
  } else {
    console.log('no solution');
    noLoop();
    return;
  }
  
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(255);
   }
 }
  
   for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0, 50));
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0, 50));
  }
  
  // // Find the path by working backwards
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (let i = 0; i < path.length; i++) {
  path[i].show(color(0, 0, 255));
  }

  // Drawing path as continuous line
  noFill();
  stroke(255, 0, 200);
  strokeWeight(stepSize / 2);
  beginShape();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].i * stepSize + stepSize / 2, path[i].j * stepSize + stepSize / 2);
  }
  endShape();
  
  // record time
  let timer = millis();
  console.log(timer);
   //saveCanvas("A*_with_ulam_demo");
 }

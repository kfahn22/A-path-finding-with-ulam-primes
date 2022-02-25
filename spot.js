// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Part 1: https://youtu.be/aKYlikFAV4k
// Part 2: https://youtu.be/EaZxUCWAjb0
// Part 3: https://youtu.be/jwRT4PCT6RU

// An object to describe a spot in the grid
class Spot {
  
  constructor(i, j, a, b, prime, stepSize) {

  // index on rows and columns
  this.i = i;
  this.j = j;

  // location of spot on grid 
  this.a = a;
  this.b = b;
  
  // boolean indicating whether spot is a ulam prime 
  this.prime = prime;
 
  // size of grid
  this.stepSize = stepSize;
  
  // f, g, and h values for A*
  this.f = 0;
  this.g = 0;
  this.h = 0;

  // Neighbors
  this.neighbors = [];

  // Where did I come from?
  this.previous = undefined;

  this.rows = width / stepSize
  this.cols = height / stepSize;
  
  // Am I a wall--set true if  location of a ulam prime
  this.wall = false; 
    if (this.prime === true) {
      this.wall = true;
    }

  // Display me
  this.show = function(col) {
       
      if (this.wall) {
      fill(0);
      noStroke();
      square(this.a, this.b, this.stepSize);
     } else if (col) {
      fill(col);
       rect(this.a, this.b, this.stepSize);
     }
  }
 

  // Figure out who my neighbors are
  this.addNeighbors = function(grid) {
    var i = this.i;
    var j = this.j;
    if (i < this.cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < this.rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < this.cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < this.rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < this.cols - 1 && j < this.rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  }
}
  
}

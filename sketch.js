// FUNCTION: zEquals
zEquals = function( x , y ) {
  
}

// CLASS DEFINITION: Region
class Region {
  constructor( xMin , yMin , xMax , yMax , M , N ) {
    // bounds on region
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
    
    // dimensions of region
    this.xDim = xMax - xMin;
    this.yDim = yMax - yMin;
    
    // center of region
    this.center = createVector( 0.5*(xMin+xMax) , 0.5*(yMin+yMax) , 0 );
    
    // number of columns (M) and rows (N) (of cells)
    this.M = M;
    this.N = N;
    
    // dimensions of cells
    this.cellWidth = this.xDim / this.M;
    this.cellHeight = this.yDim / this.N;
    
    // initialize 2-dimentional array of cell objects
    // this.cell[m][n] is the cell in the mth column and nth row
    this.cells = new Array( this.M );
    for( var m = 0 ; m < this.M ; m++ ) {
      this.cells[m] = new Array( this.N );
    }
    
    // set values for each cell in the array
    for( var m = 0 ; m < this.M ; m++ ) {
      for( var n = 0 ; n < this.N ; n++ ) {
        this.cell[m][n] = new Cell( m*this.cellWidth , n*this.cellHeight , this.cellWidth , this.cellHeight );
      }
    }
    
  }
}



// CLASS DEFINITION: Cell
class Cell {
  constructor( x , y , w , h ) {
    this.p0 = createVector( x , y , 0 );
    this.p1 = createVector( x+w , y , 0 );
    this.p2 = createVector( x+w , y+h , 0 );
    this.p3 = createVector( x , y+h , 0 );
    this.p4 = createVector( x+0.5*w , y+0.5*h , 0 );
  }
}

// CLASS METHODS: Cell
Cell.prototype.calculateZ = function() {
  this.p0.z = 
}

function setup() {

}

function draw() {

}

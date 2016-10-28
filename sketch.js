// FUNCTION: zEquals
function zEquals( x , y ) {
  x = x - 2;
  y = y - 2;
  var a = -0.2*(1-0.7/6*sqrt((x*x + y*y) ))*cos( 9 *sqrt( (x*x + y*y) ) ) ;
  x = x + 1;
  y = y + 1;
  var b = -0.1*(1-0.5/3*sqrt((x*x + y*y) ))*cos( 18*sqrt( (x*x + y*y) ) ) ;
  x = x + 1;
  y = y + 2;
  var c = -0.1*(1-0.5/3*sqrt((x*x + y*y) ))*cos( 18*sqrt( (x*x + y*y) ) ) ;
  return a;
}



setupGlobalVariables = function() {
  // pixel resolution for screen
  xRes = windowWidth;
  yRes = windowHeight;
  minRes = min( xRes , yRes );
  maxRes = max( xRes , yRes );
  
  // region dimensions
  xMin = -3 ;
  yMin = -3 ;
  xMax = 3 ;
  yMax = 3 ;
  xDim = xMax - xMin;
  yDim = yMax - yMin;
  minDim = min( xDim , yDim );
  maxDim = max( xDim , yDim );
  
  // number of cell rows and columns
  M = 50;
  N = 50;
  
  // screen factor ( regionPosition*sFactor = screenPosition )
  sFactor = minRes / maxDim * 0.8;
  
  // initialize Region
  R = new Region( xMin , yMin , xMax , yMax , M , N );
}

function setup() {
  // set up global variables
  setupGlobalVariables();
  
  // set canvas dimensions and 3D mode
  createCanvas( xRes , yRes , WEBGL );
  console.log( 'all set u');
  

}

function draw() {
  rotateX( -PI*0.5 );
  rotateX( mouseY*0.001);
  rotateZ( mouseX*0.001);
  
  drawMesh( R );

}

// CLASS DEFINITION: Cell
class Cell {
  constructor( x , y , w , h ) {
    // position vectors for p0-04
    this.p0 = createVector( x , y , 0 );
    this.p1 = createVector( x+w , y , 0 );
    this.p2 = createVector( x+w , y+h , 0 );
    this.p3 = createVector( x , y+h , 0 );
    this.p4 = createVector( x+0.5*w , y+0.5*h , 0 );
    
    // initialize min and max z values for Cell
    this.zMin = 0;
    this.zMax = 0;
    
    // set z values for all points
    this.p0.z = zEquals( this.p0.x , this.p0.y );
    this.p1.z = zEquals( this.p1.x , this.p1.y );
    this.p2.z = zEquals( this.p2.x , this.p2.y );
    this.p3.z = zEquals( this.p3.x , this.p3.y );
    this.p4.z = zEquals( this.p4.x , this.p4.y );
    
    // find min and max z values for Cell
    if( this.p0.z < this.zMin ) { this.zMin = this.p0.z; }
    if( this.p0.z > this.zMax ) { this.zMax = this.p0.z; }
    if( this.p1.z < this.zMin ) { this.zMin = this.p1.z; }
    if( this.p1.z > this.zMax ) { this.zMax = this.p1.z; }
    if( this.p2.z < this.zMin ) { this.zMin = this.p2.z; }
    if( this.p2.z > this.zMax ) { this.zMax = this.p2.z; }
    if( this.p3.z < this.zMin ) { this.zMin = this.p3.z; }
    if( this.p3.z > this.zMax ) { this.zMax = this.p3.z; }
    if( this.p4.z < this.zMin ) { this.zMin = this.p4.z; }
    if( this.p4.z > this.zMax ) { this.zMax = this.p4.z; }
  }
}

// CLASS DEFINITION: Region
class Region {
  constructor( xMin , yMin , xMax , yMax , M , N ) {
    // bounds on region
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
    
    // dimensions of Region
    this.xDim = xMax - xMin;
    this.yDim = yMax - yMin;
    this.minDim = min( xDim , yDim );
    this.maxDim = max( xDim , yDim );
    
    // center of Region
    this.center = createVector( 0.5*(xMin+xMax) , 0.5*(yMin+yMax) , 0 );
    
    // number of columns (M) and rows (N) (of cells)
    this.M = M;
    this.N = N;
    
    // dimensions of cells
    this.cellWidth = this.xDim / this.M;
    this.cellHeight = this.yDim / this.N;
    
    // initialize min and max z values for Region
    this.zMin = 0;
    this.zMax = 0;
    
    // initialize 2-dimentional array of cell objects
    // this.cell[m][n] is the cell in the mth column and nth row
    this.cells = new Array( this.M );
    for( var m = 0 ; m < this.M ; m++ ) {
      this.cells[m] = new Array( this.N );
    }
    
    // set values for each cell in the array
    for( var m = 0 ; m < this.M ; m++ ) {
      for( var n = 0 ; n < this.N ; n++ ) {
        this.cells[m][n] = new Cell( this.xMin + m*this.cellWidth ,
                                     this.yMin + n*this.cellHeight ,
                                     this.cellWidth ,
                                     this.cellHeight );
      }
    }
    
    // find the min and max z values for the Region
    for( var m = 0 ; m < this.M ; m++ ) {
      for( var n = 0 ; n < this.N ; n++ ) {
        if( this.cells[m][n].zMin < this.zMin ) { this.zMin = this.cells[m][n].zMin ; }
        if( this.cells[m][n].zMax > this.zMax ) { this.zMax = this.cells[m][n].zMax ; }
      }
    }
    
  }
  
}


// FUNCTION: draw Region mesh to screen
function drawMesh( R ) {
  // draw left and top sides for all Cells
  for( var m = 0 ; m < M ; m++ ) {
    for( var n = 0 ; n < N ; n++ ) {
      var x1 = R.cells[m][n].p0.x * sFactor;
      var y1 = R.cells[m][n].p0.y * sFactor;
      var z1 = R.cells[m][n].p0.z * sFactor;
      var x2 = R.cells[m][n].p1.x * sFactor;
      var y2 = R.cells[m][n].p1.y * sFactor;
      var z2 = R.cells[m][n].p1.z * sFactor;
      beginShape();
      vertex( x1 , y1 , z1 );
      vertex( x2 , y2 , z2 );
      endShape();
      //line( x1 , y1 , z1 , x2 , y2 , z2 );
      x1 = R.cells[m][n].p0.x * sFactor;
      y1 = R.cells[m][n].p0.y * sFactor;
      z1 = R.cells[m][n].p0.z * sFactor;
      x2 = R.cells[m][n].p3.x * sFactor;
      y2 = R.cells[m][n].p3.y * sFactor;
      z2 = R.cells[m][n].p3.z * sFactor;
      beginShape();
      vertex( x1 , y1 , z1 );
      vertex( x2 , y2 , z2 );
      endShape();
      //line( x1 , y1 , z1 , x2 , y2 , z2 );
    }
  }
  // draw bottom side for cells (0,N-1) to (M-1,N-1)
  for( var m = 0 ; m < M ; m++ ) {
    n = N-1;
    var x1 = R.cells[m][n].p2.x * sFactor;
    var y1 = R.cells[m][n].p2.y * sFactor;
    var z1 = R.cells[m][n].p2.z * sFactor;
    var x2 = R.cells[m][n].p3.x * sFactor;
    var y2 = R.cells[m][n].p3.y * sFactor;
    var z2 = R.cells[m][n].p3.z * sFactor;
    beginShape();
    vertex( x1 , y1 , z1 );
    vertex( x2 , y2 , z2 );
    endShape();
    //line( x1 , y1 , z1 , x2 , y2 , z2 );
  }
  // draw right side for cells (M-1,0) to (M-1,N-1)
  for( var n = 0 ; n < N ; n++ ) {
    m = M-1;
    var x1 = R.cells[m][n].p2.x * sFactor;
    var y1 = R.cells[m][n].p2.y * sFactor;
    var z1 = R.cells[m][n].p2.z * sFactor;
    var x2 = R.cells[m][n].p1.x * sFactor;
    var y2 = R.cells[m][n].p1.y * sFactor;
    var z2 = R.cells[m][n].p1.z * sFactor;
    beginShape();
    vertex( x1 , y1 , z1 );
    vertex( x2 , y2 , z2 );
    endShape();
    //line( x1 , y1 , z1 , x2 , y2 , z2 );
  }
}

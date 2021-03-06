// FUNCTION: zEquals
function zEquals( x , y ) {
  x = x - 1.5;
  y = y - 1.5;
  var a = 0.5*pow(0.6 , sqrt(x*x + y*y))*cos( 9 *sqrt( (x*x + y*y) ) ) ;
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
  M = 200;
  N = 200;
  
  // screen factor ( regionPosition*sFactor = screenPosition )
  sFactor = minRes / maxDim * 0.8;
  
  // thickness of base (for 3D printing)
  baseThickness = 0.1;
  
  // initialize Region
  R = new Region( xMin , yMin , xMax , yMax , M , N );
}

function setup() {
  // set up global variables
  setupGlobalVariables();
  
  // set canvas dimensions and 3D mode
  createCanvas( xRes , yRes , WEBGL );
  
  
}

function draw() {
  rotateX( -PI*0.5 );
  rotateX( mouseY*0.001);
  rotateZ( mouseX*0.001);
  
  drawMesh( R );
  //drawTriangleMesh( R );
  //drawEdges( R );

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
    
    // display min and max values in console
    console.log( 'zMin = ' + this.zMin );
    console.log( 'zMax = ' + this.zMax );
    
    // find vertical offset amount
    var vertOffset = createVector( 0 , 0 , baseThickness - this.zMin );
    
    // apply vertical offset to all cells
    for( var m = 0 ; m < this.M ; m++ ) {
      for( var n = 0 ; n < this.N ; n++ ) {
        this.cells[m][n].p0.add( vertOffset );
        this.cells[m][n].p1.add( vertOffset );
        this.cells[m][n].p2.add( vertOffset );
        this.cells[m][n].p3.add( vertOffset );
        this.cells[m][n].p4.add( vertOffset );
      }
    }
    
    
  }
  
}


// FUNCTION: draw Region mesh to screen
function drawMesh( R ) {
  // draw left and top sides for all Cells
  for( var m = 0 ; m < R.M ; m++ ) {
    for( var n = 0 ; n < R.N ; n++ ) {
      var v1 = p5.Vector.mult( R.cells[m][n].p1 , sFactor );
      var v2 = p5.Vector.mult( R.cells[m][n].p0 , sFactor );
      var v3 = p5.Vector.mult( R.cells[m][n].p3 , sFactor );
      beginShape();
      vertex( v1.x , v1.y , v1.z );
      vertex( v2.x , v2.y , v2.z );
      vertex( v3.x , v3.y , v3.z );
      endShape();
    }
  }
  // draw bottom side for cells (0,N-1) to (M-1,N-1)
  for( var m = 0 ; m < R.M ; m++ ) {
    n = R.N-1;
    var v1 = p5.Vector.mult( R.cells[m][n].p2 , sFactor );
    var v2 = p5.Vector.mult( R.cells[m][n].p3 , sFactor );
    beginShape();
    vertex( v1.x , v1.y , v1.z );
    vertex( v2.x , v2.y , v2.z );
    endShape();
  }
  // draw right side for cells (M-1,0) to (M-1,N-1)
  for( var n = 0 ; n < R.N ; n++ ) {
    m = R.M-1;
    var v1 = p5.Vector.mult( R.cells[m][n].p2 , sFactor );
    var v2 = p5.Vector.mult( R.cells[m][n].p1 , sFactor );
    beginShape();
    vertex( v1.x , v1.y , v1.z );
    vertex( v2.x , v2.y , v2.z );
    endShape();
  }
}

// FUNCTION: draw Region triangle mesh to screen
function drawTriangleMesh( R ) {
  // draw 4 triangles for each cell
  for( var m = 0 ; m < R.M ; m++ ) {
    for( var n = 0 ; n < R.N ; n++ ) {
      var v0 = p5.Vector.mult( R.cells[m][n].p0 , sFactor );
      var v1 = p5.Vector.mult( R.cells[m][n].p1 , sFactor );
      var v2 = p5.Vector.mult( R.cells[m][n].p2 , sFactor );
      var v3 = p5.Vector.mult( R.cells[m][n].p3 , sFactor );
      var v4 = p5.Vector.mult( R.cells[m][n].p4 , sFactor );
      
      // top triangle
      beginShape();
      vertex( v4.x , v4.y , v4.z );
      vertex( v1.x , v1.y , v1.z );
      vertex( v0.x , v0.y , v0.z );
      endShape( CLOSE );
      
      // right triangle
      beginShape();
      vertex( v4.x , v4.y , v4.z );
      vertex( v2.x , v2.y , v2.z );
      vertex( v1.x , v1.y , v1.z );
      endShape( CLOSE );
      
      // bottom triangle
      beginShape();
      vertex( v4.x , v4.y , v4.z );
      vertex( v3.x , v3.y , v3.z );
      vertex( v2.x , v2.y , v2.z );
      endShape( CLOSE );
      
      // right triangle
      beginShape();
      vertex( v4.x , v4.y , v4.z );
      vertex( v0.x , v0.y , v0.z );
      vertex( v3.x , v3.y , v3.z );
      endShape( CLOSE );
      
    }
  }
}


// FUNCTION: draw region edges to screen
function drawEdges( R ) {
  
  // left edge:
  for( var n = 0 ; n < R.N ; n++ ) {
    var m = 0;
    // find vertices
    var v0 = p5.Vector.mult( R.cells[m][n].p0 , sFactor );
    var v1 = p5.Vector.mult( R.cells[m][n].p3 , sFactor );
    var v2 = p5.Vector.mult( R.cells[m][n].p3 , sFactor );
    v2.z = 0;
    var v3 = p5.Vector.mult( R.cells[m][n].p0 , sFactor );
    v3.z = 0;
    var v4 = createVector(
      0.25*( v0.x + v1.x + v2.x + v3.x) ,
      0.25*( v0.y + v1.y + v2.y + v3.y) ,
      0.25*( v0.z + v1.z + v2.z + v3.z)
      );
    // top triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v1.x , v1.y , v1.z );
    vertex( v0.x , v0.y , v0.z );
    endShape( CLOSE );
    // right triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v2.x , v2.y , v2.z );
    vertex( v1.x , v1.y , v1.z );
    endShape( CLOSE );
    // bottom triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v3.x , v3.y , v3.z );
    vertex( v2.x , v2.y , v2.z );
    endShape( CLOSE );
    // right triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v0.x , v0.y , v0.z );
    vertex( v3.x , v3.y , v3.z );
    endShape( CLOSE );
  }
  
  // right edge:
  for( var n = 0 ; n < R.N ; n++ ) {
    var m = R.M - 1 ;
    // find vertices
    var v0 = p5.Vector.mult( R.cells[m][n].p2 , sFactor );
    var v1 = p5.Vector.mult( R.cells[m][n].p1 , sFactor );
    var v2 = p5.Vector.mult( R.cells[m][n].p1 , sFactor );
    v2.z = 0;
    var v3 = p5.Vector.mult( R.cells[m][n].p2 , sFactor );
    v3.z = 0;
    var v4 = createVector(
      0.25*( v0.x + v1.x + v2.x + v3.x) ,
      0.25*( v0.y + v1.y + v2.y + v3.y) ,
      0.25*( v0.z + v1.z + v2.z + v3.z)
      );
    // top triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v1.x , v1.y , v1.z );
    vertex( v0.x , v0.y , v0.z );
    endShape( CLOSE );
    // right triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v2.x , v2.y , v2.z );
    vertex( v1.x , v1.y , v1.z );
    endShape( CLOSE );
    // bottom triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v3.x , v3.y , v3.z );
    vertex( v2.x , v2.y , v2.z );
    endShape( CLOSE );
    // right triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v0.x , v0.y , v0.z );
    vertex( v3.x , v3.y , v3.z );
    endShape( CLOSE );
  }
  
  // top edge:
  for( var m = 0 ; m < R.M ; m++ ) {
    var n = 0 ;
    // find vertices
    var v0 = p5.Vector.mult( R.cells[m][n].p1 , sFactor );
    var v1 = p5.Vector.mult( R.cells[m][n].p0 , sFactor );
    var v2 = p5.Vector.mult( R.cells[m][n].p0 , sFactor );
    v2.z = 0;
    var v3 = p5.Vector.mult( R.cells[m][n].p1 , sFactor );
    v3.z = 0;
    var v4 = createVector(
      0.25*( v0.x + v1.x + v2.x + v3.x) ,
      0.25*( v0.y + v1.y + v2.y + v3.y) ,
      0.25*( v0.z + v1.z + v2.z + v3.z)
      );
    // top triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v1.x , v1.y , v1.z );
    vertex( v0.x , v0.y , v0.z );
    endShape( CLOSE );
    // right triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v2.x , v2.y , v2.z );
    vertex( v1.x , v1.y , v1.z );
    endShape( CLOSE );
    // bottom triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v3.x , v3.y , v3.z );
    vertex( v2.x , v2.y , v2.z );
    endShape( CLOSE );
    // right triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v0.x , v0.y , v0.z );
    vertex( v3.x , v3.y , v3.z );
    endShape( CLOSE );
  }
  
  // bottom edge:
  for( var m = 0 ; m < R.M ; m++ ) {
    var n = N -1 ;
    // find vertices
    var v0 = p5.Vector.mult( R.cells[m][n].p3 , sFactor );
    var v1 = p5.Vector.mult( R.cells[m][n].p2 , sFactor );
    var v2 = p5.Vector.mult( R.cells[m][n].p2 , sFactor );
    v2.z = 0;
    var v3 = p5.Vector.mult( R.cells[m][n].p3 , sFactor );
    v3.z = 0;
    var v4 = createVector(
      0.25*( v0.x + v1.x + v2.x + v3.x) ,
      0.25*( v0.y + v1.y + v2.y + v3.y) ,
      0.25*( v0.z + v1.z + v2.z + v3.z)
      );
    // top triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v1.x , v1.y , v1.z );
    vertex( v0.x , v0.y , v0.z );
    endShape( CLOSE );
    // right triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v2.x , v2.y , v2.z );
    vertex( v1.x , v1.y , v1.z );
    endShape( CLOSE );
    // bottom triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v3.x , v3.y , v3.z );
    vertex( v2.x , v2.y , v2.z );
    endShape( CLOSE );
    // right triangle
    beginShape();
    vertex( v4.x , v4.y , v4.z );
    vertex( v0.x , v0.y , v0.z );
    vertex( v3.x , v3.y , v3.z );
    endShape( CLOSE );
    
    
  }
  
  // base bottom
  var v3 = createVector( R.xMin , R.yMin , 0 );
  var v2 = createVector( R.xMax , R.yMin , 0 );
  var v1 = createVector( R.xMax , R.yMax , 0 );
  var v0 = createVector( R.xMin , R.yMax , 0 );
  v0.mult( sFactor );
  v1.mult( sFactor );
  v2.mult( sFactor );
  v3.mult( sFactor );
  var v4 = createVector(
    0.25*( v0.x + v1.x + v2.x + v3.x) ,
    0.25*( v0.y + v1.y + v2.y + v3.y) ,
    0.25*( v0.z + v1.z + v2.z + v3.z)
    );
  // top triangle
  beginShape();
  vertex( v4.x , v4.y , v4.z );
  vertex( v1.x , v1.y , v1.z );
  vertex( v0.x , v0.y , v0.z );
  endShape( CLOSE );
  // right triangle
  beginShape();
  vertex( v4.x , v4.y , v4.z );
  vertex( v2.x , v2.y , v2.z );
  vertex( v1.x , v1.y , v1.z );
  endShape( CLOSE );
  // bottom triangle
  beginShape();
  vertex( v4.x , v4.y , v4.z );
  vertex( v3.x , v3.y , v3.z );
  vertex( v2.x , v2.y , v2.z );
  endShape( CLOSE );
  // right triangle
  beginShape();
  vertex( v4.x , v4.y , v4.z );
  vertex( v0.x , v0.y , v0.z );
  vertex( v3.x , v3.y , v3.z );
  endShape( CLOSE );
}

// FUNCTION: output an ASCII .stl file for 3D printing
function outputSTL( R ) {
  // output file header
  var fileText = new Array( "solid surfaceGrapher\n" );
  
  // include surface triangles
  for( var m = 0 ; m < R.M ; m++ ) {
    for( var n = 0 ; n < R.N ; n++ ) {
      var v0 = R.cells[m][n].p0 ;
      var v1 = R.cells[m][n].p1 ;
      var v2 = R.cells[m][n].p2 ;
      var v3 = R.cells[m][n].p3 ;
      var v4 = R.cells[m][n].p4 ;
      
      // top triangle
      var e1 = p5.Vector.sub( v4 , v1 );
      var e2 = p5.Vector.sub( v4 , v0 );
      var n0 = p5.Vector.cross( e2 , e1 );
      n0.normalize();
      append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
      append( fileText , "\touter loop" );
      append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
      append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
      append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
      append( fileText , "\tendloop" );
      append( fileText , "endfacet" );
      
      // right triangle
      var e1 = p5.Vector.sub( v4 , v2 );
      var e2 = p5.Vector.sub( v4 , v1 );
      var n0 = p5.Vector.cross( e2 , e1 );
      n0.normalize();
      append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
      append( fileText , "\touter loop" );
      append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
      append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
      append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
      append( fileText , "\tendloop" );
      append( fileText , "endfacet" );
      
      // bottom triangle
      var e1 = p5.Vector.sub( v4 , v3 );
      var e2 = p5.Vector.sub( v4 , v2 );
      var n0 = p5.Vector.cross( e2 , e1 );
      n0.normalize();
      append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
      append( fileText , "\touter loop" );
      append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
      append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
      append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
      append( fileText , "\tendloop" );
      append( fileText , "endfacet" );
      
      // top triangle
      var e1 = p5.Vector.sub( v4 , v0 );
      var e2 = p5.Vector.sub( v4 , v3 );
      var n0 = p5.Vector.cross( e2 , e1 );
      n0.normalize();
      append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
      append( fileText , "\touter loop" );
      append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
      append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
      append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
      append( fileText , "\tendloop" );
      append( fileText , "endfacet" );
      

    
      
      
      
    }
    
  }
  
  // left edge:
  for( var n = 0 ; n < R.N ; n++ ) {
    var m = 0;
    // find vertices
    var v0 = p5.Vector.mult( R.cells[m][n].p0 , 1 );
    var v1 = p5.Vector.mult( R.cells[m][n].p3 , 1 );
    var v2 = p5.Vector.mult( R.cells[m][n].p3 , 1 );
    v2.z = 0;
    var v3 = p5.Vector.mult( R.cells[m][n].p0 , 1 );
    v3.z = 0;
    var v4 = createVector(
      0.25*( v0.x + v1.x + v2.x + v3.x) ,
      0.25*( v0.y + v1.y + v2.y + v3.y) ,
      0.25*( v0.z + v1.z + v2.z + v3.z)
      );
    // top triangle
    var e1 = p5.Vector.sub( v4 , v1 );
    var e2 = p5.Vector.sub( v4 , v0 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
    append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // right triangle
    var e1 = p5.Vector.sub( v4 , v2 );
    var e2 = p5.Vector.sub( v4 , v1 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
    append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // bottom triangle
    var e1 = p5.Vector.sub( v4 , v3 );
    var e2 = p5.Vector.sub( v4 , v2 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
    append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // top triangle
    var e1 = p5.Vector.sub( v4 , v0 );
    var e2 = p5.Vector.sub( v4 , v3 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
    append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
  }
  
  // right edge
  for( var n = 0 ; n < R.N ; n++ ) {
    var m = R.M - 1 ;
    // find vertices
    var v0 = p5.Vector.mult( R.cells[m][n].p2 , 1 );
    var v1 = p5.Vector.mult( R.cells[m][n].p1 , 1 );
    var v2 = p5.Vector.mult( R.cells[m][n].p1 , 1 );
    v2.z = 0;
    var v3 = p5.Vector.mult( R.cells[m][n].p2 , 1 );
    v3.z = 0;
    var v4 = createVector(
      0.25*( v0.x + v1.x + v2.x + v3.x) ,
      0.25*( v0.y + v1.y + v2.y + v3.y) ,
      0.25*( v0.z + v1.z + v2.z + v3.z)
      );
    // top triangle
    var e1 = p5.Vector.sub( v4 , v1 );
    var e2 = p5.Vector.sub( v4 , v0 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
    append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // right triangle
    var e1 = p5.Vector.sub( v4 , v2 );
    var e2 = p5.Vector.sub( v4 , v1 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
    append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // bottom triangle
    var e1 = p5.Vector.sub( v4 , v3 );
    var e2 = p5.Vector.sub( v4 , v2 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
    append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // top triangle
    var e1 = p5.Vector.sub( v4 , v0 );
    var e2 = p5.Vector.sub( v4 , v3 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
    append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
  }
  
  // top edge
  for( var m = 0 ; m < R.M ; m++ ) {
    var n = 0 ;
    // find vertices
    var v0 = p5.Vector.mult( R.cells[m][n].p1 , 1 );
    var v1 = p5.Vector.mult( R.cells[m][n].p0 , 1 );
    var v2 = p5.Vector.mult( R.cells[m][n].p0 , 1 );
    v2.z = 0;
    var v3 = p5.Vector.mult( R.cells[m][n].p1 , 1 );
    v3.z = 0;
    var v4 = createVector(
      0.25*( v0.x + v1.x + v2.x + v3.x) ,
      0.25*( v0.y + v1.y + v2.y + v3.y) ,
      0.25*( v0.z + v1.z + v2.z + v3.z)
      );
    // top triangle
    var e1 = p5.Vector.sub( v4 , v1 );
    var e2 = p5.Vector.sub( v4 , v0 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
    append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // right triangle
    var e1 = p5.Vector.sub( v4 , v2 );
    var e2 = p5.Vector.sub( v4 , v1 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
    append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // bottom triangle
    var e1 = p5.Vector.sub( v4 , v3 );
    var e2 = p5.Vector.sub( v4 , v2 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
    append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // top triangle
    var e1 = p5.Vector.sub( v4 , v0 );
    var e2 = p5.Vector.sub( v4 , v3 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
    append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacen" );
  }
  
  // bottom edge
  for( var m = 0 ; m < R.M ; m++ ) {
    var n = R.N - 1 ;
    // find vertices
    var v0 = p5.Vector.mult( R.cells[m][n].p3 , 1 );
    var v1 = p5.Vector.mult( R.cells[m][n].p2 , 1 );
    var v2 = p5.Vector.mult( R.cells[m][n].p2 , 1 );
    v2.z = 0;
    var v3 = p5.Vector.mult( R.cells[m][n].p3 , 1 );
    v3.z = 0;
    var v4 = createVector(
      0.25*( v0.x + v1.x + v2.x + v3.x) ,
      0.25*( v0.y + v1.y + v2.y + v3.y) ,
      0.25*( v0.z + v1.z + v2.z + v3.z)
      );
    // top triangle
    var e1 = p5.Vector.sub( v4 , v1 );
    var e2 = p5.Vector.sub( v4 , v0 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
    append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // right triangle
    var e1 = p5.Vector.sub( v4 , v2 );
    var e2 = p5.Vector.sub( v4 , v1 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
    append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // bottom triangle
    var e1 = p5.Vector.sub( v4 , v3 );
    var e2 = p5.Vector.sub( v4 , v2 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
    append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
    // top triangle
    var e1 = p5.Vector.sub( v4 , v0 );
    var e2 = p5.Vector.sub( v4 , v3 );
    var n0 = p5.Vector.cross( e2 , e1 );
    n0.normalize();
    append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
    append( fileText , "\touter loop" );
    append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
    append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
    append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
    append( fileText , "\tendloop" );
    append( fileText , "endfacet" );
  }
  
  // base bottom
  var v3 = createVector( R.xMin , R.yMin , 0 );
  var v2 = createVector( R.xMax , R.yMin , 0 );
  var v1 = createVector( R.xMax , R.yMax , 0 );
  var v0 = createVector( R.xMin , R.yMax , 0 );
  var v4 = createVector(
    0.25*( v0.x + v1.x + v2.x + v3.x) ,
    0.25*( v0.y + v1.y + v2.y + v3.y) ,
    0.25*( v0.z + v1.z + v2.z + v3.z)
    );
  // top triangle
  var e1 = p5.Vector.sub( v4 , v1 );
  var e2 = p5.Vector.sub( v4 , v0 );
  var n0 = p5.Vector.cross( e2 , e1 );
  n0.normalize();
  append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
  append( fileText , "\touter loop" );
  append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
  append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
  append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
  append( fileText , "\tendloop" );
  append( fileText , "endfacet" );
  // right triangle
  var e1 = p5.Vector.sub( v4 , v2 );
  var e2 = p5.Vector.sub( v4 , v1 );
  var n0 = p5.Vector.cross( e2 , e1 );
  n0.normalize();
  append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
  append( fileText , "\touter loop" );
  append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
  append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
  append( fileText , "\t\tvertex " + v1.x + " " + v1.y + " " + v1.z );
  append( fileText , "\tendloop" );
  append( fileText , "endfacet" );
  // bottom triangle
  var e1 = p5.Vector.sub( v4 , v3 );
  var e2 = p5.Vector.sub( v4 , v2 );
  var n0 = p5.Vector.cross( e2 , e1 );
  n0.normalize();
  append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
  append( fileText , "\touter loop" );
  append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
  append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
  append( fileText , "\t\tvertex " + v2.x + " " + v2.y + " " + v2.z );
  append( fileText , "\tendloop" );
  append( fileText , "endfacet" );
  // top triangle
  var e1 = p5.Vector.sub( v4 , v0 );
  var e2 = p5.Vector.sub( v4 , v3 );
  var n0 = p5.Vector.cross( e2 , e1 );
  n0.normalize();
  append( fileText , "facet normal " + n0.x + " " + n0.y + " " + n0.z );
  append( fileText , "\touter loop" );
  append( fileText , "\t\tvertex " + v4.x + " " + v4.y + " " + v4.z );
  append( fileText , "\t\tvertex " + v0.x + " " + v0.y + " " + v0.z );
  append( fileText , "\t\tvertex " + v3.x + " " + v3.y + " " + v3.z );
  append( fileText , "\tendloop" );
  append( fileText , "endfacet" );
  
  
  // wrap up file text
  append( fileText , "endsolid surfaceGrapher\n" );
  save( fileText , 'test' , 'stl' );
}


function keyTyped() {
  if (key === 's') {
    outputSTL( R );
  }
}


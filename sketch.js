// CLASS DEFINITION: Region
class Region {
  constructor( xMin , yMin , xMax , yMax , M , N ) {
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
    this.xDim = xMax - xMin;
    this.yDim = yMax - yMin;
    this.center = createVector( 0.5*(xMin+xMax) , 0.5*(yMin+yMax) , 0 );
    this.M = M;
    this.N = N;
    this.cellWidth = this.xDim / this.M;
    this.cellHeight = this.yDim / this.N;
  }
}


function setup() {

}

function draw() {

}

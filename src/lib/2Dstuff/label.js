export default class Label {
  // TODO remove rendercam or something
  constructor(text, position, rendercam) {
    this.position = position;
    this.camera = rendercam.camera;
    this.canvas = rendercam.renderer.domElement;
    
    // create dom element
    this.domElement = document.createElement('div');
    this.domElement.className = 'label';
    this.domElement.innerHTML = text; // this.text = text;
  }

  get text() {
    return this.domElement.innerHTML
  }

  set text(text) {
    this.domElement.innerHTML = text;
  }

  update() {
    // todo: perf clientHeight/width
    let position = getScreenCoordinates(this.position, this.camera, this.canvas.clientWidth, this.canvas.clientHeight);

    if (position) {
      showElement(this.domElement);
      
      // TODO: perf: should we cache width height
      // center text
      position.x -= this.domElement.clientWidth / 2;
      position.y -= this.domElement.clientHeight / 2;

      this.domElement.style.left = position.x + 'px';
      this.domElement.style.top = position.y + 'px';
    } else {
      hideElement(this.domElement);
    }
  }

}

function getScreenCoordinates(positon, camera, width, height) {
  let vector = positon.clone();

  // map to normalized device coordinate (NDC) space
  vector.project(camera);

  // TODO: rounding makes labels wiggle :p, but maybe crazy precision is fine.
  // check if this is still an issue when the render limiter has been removed
  
  // map to 2D screen space
  vector.x = /*Math.round*/((vector.x + 1) * width / 2),
  vector.y = /*Math.round*/((- vector.y + 1) * height / 2);
  //vector.z = 0;

  // TODO: remove z hack, detect if camera is facing away from object
  if (vector.z < 1 && vector.x >= 0 && vector.y >= 0 && vector.x <= width && vector.y <= height) {
    vector.z = 0;
    return vector;
  }
}

function showElement(element) {
  if (element.style.display === 'none') element.style.display = '';
}

function hideElement(element) {
  if (element.style.display !== 'none') element.style.display = 'none';
}

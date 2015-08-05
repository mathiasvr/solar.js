function getScreenCoordinates(pos, camera, width, height) {
  var vector = pos.clone();

  // map to normalized device coordinate (NDC) space
  vector.project(camera);

  // map to 2D screen space
  vector.x = Math.round((vector.x + 1) * width / 2),
  vector.y = Math.round((- vector.y + 1) * height / 2);
  //vector.z = 0;

  // TODO: the z axis may tell if were are looking in the right direction
  // remove z hack
  if (vector.z < 1 && vector.x >= 0 && vector.y >= 0 && vector.x <= width && vector.y <= height) {
    vector.z = 0;
    return vector;
  }

  //console.log(vector, window.innerHeight, window.innerWidth, canvas.clientHeight, canvas.width);
}

// todo
export default class Label {
  constructor(text, position, rendercam) { // todo remove rendercam or something
    // create dom element
    this.domElement = document.createElement('div');
    this.domElement.className = 'label';
    this.domElement.innerHTML = text;

    this.position = position;
    this.rendercam = rendercam;

    //todo stuff
    document.body.appendChild(this.domElement);

    this.halfHeight = this.domElement.clientHeight / 2;
    this.halfWidth = this.domElement.clientWidth / 2;
  }

  update() {
    var canvas = this.rendercam.renderer.domElement;
    var pos = getScreenCoordinates(this.position, this.rendercam.camera, canvas.clientWidth, canvas.clientHeight);
    if (pos) {
      this.domElement.style.top = (pos.y - this.halfHeight) + 'px';
      this.domElement.style.left = (pos.x - this.halfWidth) + 'px';
    } else {
      // TODO: hide dom element instead
      this.domElement.style.top = -100 + 'px';
      this.domElement.style.left = -100 + 'px';
    }

  }

}

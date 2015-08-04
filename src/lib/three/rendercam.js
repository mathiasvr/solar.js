import THREE from 'three.js';

// TODO: i hate consts
let DEBUG_ROTATION = false;

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

export default class RenderCam { //todo rename
  
  constructor() {
    this.debugCamera = new THREE.PerspectiveCamera(70, 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
    this.debugCamera.position.z = 50;

    this.camera = new THREE.PerspectiveCamera(50, 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT, 0.01, 200);
    this.camera.up.set(0, 0, 1);// TODO what is the rite way here
    this.camera.position.y = 2; 
    this.camera.position.z = 1; 

    this.cameraHelper = new THREE.CameraHelper(this.camera);

    // setup renderer
    this.renderer = new THREE.WebGLRenderer(/*{ antialias: true }*/);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.autoClear = false;
    
    // TODO: investigate gamma correction
		// this.renderer.gammaInput = true;
		// this.renderer.gammaOutput = true;

    // resize events
    window.addEventListener('resize', () => {
      SCREEN_WIDTH = window.innerWidth;
      SCREEN_HEIGHT = window.innerHeight;

      this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

      this.camera.aspect = this.debugCamera.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;

      this.camera.updateProjectionMatrix();
      this.debugCamera.updateProjectionMatrix();
    }, false);

  }

  render(scene) {
    // rotate debug camera
    if (DEBUG_ROTATION) {
      let r = Date.now() * 0.0005;
      this.debugCamera.position.x = 2500 * Math.cos(r * 0.1);
      this.debugCamera.position.z = 2500 * Math.sin(r * 0.1);
      //this.debugCamera.position.y = 700 * Math.sin(r);
      this.debugCamera.lookAt(this.camera.position);
    }

    this.renderer.clear(); // TODO: we disabled auto clear

    // render perspective camera to the left
    this.cameraHelper.visible = false;
    this.renderer.setViewport(0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
    this.renderer.render(scene, this.camera);
    this.cameraHelper.visible = true;

    // render debugging camera to the right
    this.renderer.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
    this.renderer.render(scene, this.debugCamera);
  }
}


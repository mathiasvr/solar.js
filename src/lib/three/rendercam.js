import THREE from 'three.js';

// TODO: remove
const DEBUG_CAM = false; // TODO: FIX

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

let badDebugThing = 1; // TODO: MAKE BETTER OR REMOVE
export default class RenderCam { // TODO: rename, this is some sort of combined camera and renderer, manager thing
  
  constructor() {
    if (DEBUG_CAM) {
      badDebugThing = 0.5;
      this.debugCamera = new THREE.PerspectiveCamera(70, badDebugThing * SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
      this.debugCamera.position.z = 50;
    }

    // TODO: the scaling is insane though
    this.camera = new THREE.PerspectiveCamera(50, badDebugThing * SCREEN_WIDTH / SCREEN_HEIGHT, 0.00001, 200);
    this.camera.up.set(0, 0, 1);// TODO what is the rite way here
    this.camera.position.y = 2;
    this.camera.position.z = 1;

    this.cameraHelper = new THREE.CameraHelper(this.camera);

    // setup renderer
    
    //todo learn about alpha
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.autoClear = false;
    this.renderer.setClearColor(0x000000/*, alpha*/);
    
    // TODO: investigate gamma correction
    // this.renderer.gammaInput = true;
    // this.renderer.gammaOutput = true;

    // resize events
    window.addEventListener('resize', () => {
      SCREEN_WIDTH = window.innerWidth;
      SCREEN_HEIGHT = window.innerHeight;

      this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

      this.camera.aspect = badDebugThing * SCREEN_WIDTH / SCREEN_HEIGHT;
      this.camera.updateProjectionMatrix();

      if (DEBUG_CAM) {
        this.debugCamera.aspect = badDebugThing * SCREEN_WIDTH / SCREEN_HEIGHT;
        this.debugCamera.updateProjectionMatrix();
      }
    }, false);

  }

  render(scene) {
    this.renderer.clear(); // TODO: we disabled auto clear

    // render perspective camera to the left
    this.cameraHelper.visible = false;
    this.renderer.setViewport(0, 0, SCREEN_WIDTH * badDebugThing, SCREEN_HEIGHT);
    this.renderer.render(scene, this.camera);
    this.cameraHelper.visible = true;

    if (DEBUG_CAM) {
      // render debugging camera to the right
      this.renderer.setViewport(SCREEN_WIDTH * badDebugThing, 0, SCREEN_WIDTH * badDebugThing, SCREEN_HEIGHT);
      this.renderer.render(scene, this.debugCamera);
    }
  }
}


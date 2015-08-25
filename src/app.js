import THREE from 'three.js';
import OrbitControls from 'three-orbit-controls';
THREE.OrbitControls = OrbitControls(THREE); // todo is this the way?

import {planetsInfo} from './lib/position/orbital-elements-data';
import * as space from './lib/three/space';

import RenderCam from './lib/three/rendercam';
import Label from './lib/2Dstuff/label';

// TODO: fix this poison, maybe by class
//let scene, rendercam, planets, controls;
//let labels = [];

// TODO: MOVE
let debugCount = 0, dc2 = 0;
let lastStamp = Date.now();

// TODO: try using closure instead of class, would eliminate excessive use of 'this', and wierd binding
class App {
  constructor() {
    //function init() {
    // create the scene
    this.scene = new THREE.Scene();

    // setup renderer
    this.rendercam = new RenderCam();

    this.scene.add(this.rendercam.cameraHelper); // TODO: this might be a bit transparent
    
    document.body.appendChild(this.rendercam.renderer.domElement);
  
    // todo
    this.planets = getPlanets();

    // set up camera control	
    this.controls = new THREE.OrbitControls(this.rendercam.camera);
    this.controls.noPan = true;
    this.controls.zoomSpeed = 0.5;
    this.controls.minDistance = 0.05; // todo: set according to target planet size
    this.controls.maxDistance = 200;
    this.controls.target = this.planets[3].position;
  //  this.controls.target = new THREE.Vector3(0,0,0);
    //controls.addEventListener('change', function(){});
  
    this.labels = [];
  
    // add planets and orbit path
    // todo: and label
    //for (let planet of planets) {
    this.planets.forEach(planet => {
      this.scene.add(planet);
      this.scene.add(planet.getOrbitLine());
      this.labels.push(new Label(planet.planetData.name, planet.position, this.rendercam));
    });
  
    // TODO: make object that combine planets and labels i guess
    // append labels to dom
    this.labels.forEach(label => document.body.appendChild(label.domElement));
  
    // add the sun
    let sun = new space.Sun();
    this.scene.add(sun);

    // add some hemisphere light, so planets are not completely black on the dark side
    let backgroundLight = new THREE.HemisphereLight(0x404040, 0x404040);
    backgroundLight.position.set(0, 0, 100);
    this.scene.add(backgroundLight);

    // add a bunch of star particles
    //todo bad and overkill put them all on inner surface rite
    let particles = new space.Stars(3000, 1000, 0x888888/*0xcccccc*/);
    this.scene.add(particles);
    
    // TODO: where does this fit in
    this.timeScaleFactor = 15 /* days per second */ * 24 * 60 * 60;
    this.currentEpoch = new Date('2015-08-05T19:00:00+0100');

  }

  render() {
    // TODO: is binding this stupid
    requestAnimationFrame(this.render.bind(this));
  
    // TODO: remove crazy limiter; how often is computation nececarry
    if (debugCount % 3 === 0) {
    
      // TODO: this should be after render call (independent of 3D)
      this.labels.forEach(label => label.update());

      // realtime scaling (independent of tab pausing and framerate)
      let now = Date.now();
      let timePassed = now - lastStamp;
      lastStamp = now;

      this.currentEpoch.setTime(this.currentEpoch.getTime() + (timePassed * this.timeScaleFactor));

      this.planets.forEach(planet => planet.epoch = this.currentEpoch);

      this.controls.update();
    
      // from earth to mars test dont use with orbitcontrols
      // planets[2].visible = false;
      // rendercam.camera.position.copy(planets[4].position);
      // rendercam.camera.lookAt(planets[8].position);
    }

    // TODO: log epoch
    if (debugCount % 120 === 0) { console.log('epoch', this.currentEpoch); }

    // TODO: planet switcher
    if (debugCount % 600 === 0) { this.controls.target = this.planets[dc2++ % 9].position; }

    this.rendercam.render(this.scene);
    //labels.forEach(label => label.update());
   
    debugCount++;
  }
}

// TODO where does this really belong
function getPlanets() {
  // for (let planetData in planetsInfo) {
  // 	let planetData = planetsInfo[property];
  // 	planets.push(new CelestialBody(planetData));
  // }
	
  return Object.keys(planetsInfo).map(key => new space.CelestialBody(planetsInfo[key]));
  // TODO: consider cleaner with array of planetdata (values instead of keys):
  // planetsData.map(planetData => new CelestialBody(planetData));
  // also look into es6 generators
}


// TODO: bootstrap this elsewhere
//init(); render();
let app = new App();
app.render();
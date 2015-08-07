/// <reference path="../typings/tsd.d.ts" />
//TODO remove typings if they refuse to work with modules/jspm

// todo: this should probably be a class hmm?

import THREE from 'three.js';
import OrbitControls from 'three-orbit-controls';
// todo is this the way?
THREE.OrbitControls = OrbitControls(THREE);

import {planetsInfo} from './lib/position/orbital-elements-data';

import * as space from './lib/three/space';
import RenderCam from './lib/three/rendercam';

import Label from './lib/2Dstuff/label';

// TODO: fix this poison, maybe by class
let scene, rendercam, planets, controls;
let labels = [];

function init() {
  // create the scene
  scene = new THREE.Scene();

  // setup renderer
  rendercam = new RenderCam();

  scene.add(rendercam.cameraHelper); // TODO: this might be a bit transparent
    
  document.body.appendChild(rendercam.renderer.domElement);
  
  // todo
  planets = getPlanets();

  // set up camera control	
  controls = new THREE.OrbitControls(rendercam.camera);
  controls.noPan = true;
  controls.zoomSpeed = 0.5;
  controls.minDistance = 0.05; // todo: set according to target planet size
  controls.maxDistance = 200;
  controls.target = planets[3].position;
  //controls.addEventListener('change', function(){});
  
  // add planets and orbit path
  // todo: and label
  //for (let planet of planets) {
  planets.forEach(planet => {
    scene.add(planet);
    scene.add(planet.getOrbitLine());
    labels.push(new Label(planet.planetData.name, planet.position, rendercam));
  });
  
  // TODO: make object that combine planets and labels i guess
  // append labels to dom
  labels.forEach(label => {
    document.body.appendChild(label.domElement);
  });
  
  // add the good ol'sun
  let sun = new space.Sun();
  scene.add(sun);
  
  // TODO: this flare is not good boy
  //let sunflare = new space.SunFlare();
  //scene.add(sunflare);

  // add some hemisphere light, so planets are not completely black on the dark side
  let backgroundLight = new THREE.HemisphereLight(0x404040, 0x404040);
  backgroundLight.position.set(0, 0, 100);
  scene.add(backgroundLight);

  // add a bunch of star particles
  //todo bad and overkill put them all on inner surface rite
  let particles = new space.Stars(3000, 1000, 0x888888/*0xcccccc*/);
  scene.add(particles);

}

// TODO: MOVE
let currentEpoch = new Date('2015-08-05T19:00:00+0100');

let debugCount = 0, dc2 = 0;
let lastStamp = Date.now();

let timeScaleFactor = 15 /* days per second */ * 24 * 60 * 60;

function render() {
  requestAnimationFrame(render);
  
  // TODO: remove crazy limiter; how often is computation nececarry
  if (debugCount % 3 === 0) {
    
    // TODO: this should be after render call (independent of 3D)
    labels.forEach(label => label.update());

    // realtime scaling (independent of tab pausing and framerate)
    let now = Date.now();
    let timePassed = now - lastStamp;
    lastStamp = now;
    
    currentEpoch.setTime(currentEpoch.getTime() + (timePassed * timeScaleFactor));
    
    planets.forEach(planet => planet.epoch = currentEpoch);
    
    controls.update();
    
    // from earth to mars test dont use with orbitcontrols
    // planets[2].visible = false;
    // rendercam.camera.position.copy(planets[4].position);
    // rendercam.camera.lookAt(planets[8].position);
  }

  // TODO: log epoch
  if (debugCount % 120 === 0) { console.log('epoch', currentEpoch); }

  // TODO: planet switcher
  if (debugCount % 600 === 0) { controls.target = planets[dc2++ % 9].position; }

  rendercam.render(scene);
  //labels.forEach(label => label.update());
   
  debugCount++;
}

// TODO remove
function setPlanetPositionsFromEpoch(epoch) {
  /*for (let planet of planets) {
      planet.setPositionFromEpoch(epoch);
    }*/
  // planets.forEach(planet => planet.setPositionFromEpoch(epoch));
  planets.forEach(planet => planet.epoch = epoch);
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


// TODO: bootstrap this elsewhere, maybe
init();

// TODO: remove
setPlanetPositionsFromEpoch(currentEpoch);

render();

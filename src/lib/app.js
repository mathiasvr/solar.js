/// <reference path="../../../DefinitelyTyped/threejs/three.d.ts" />
//TODO TYPINGS??

// todo: this should probably be a class hmm?

import THREE from 'three.js';
import OrbitControls from 'three-orbit-controls';
// todo is this the way?
THREE.OrbitControls = OrbitControls(THREE);

import * as space from './three/space';
import RenderCam from './three/rendercam';

import * as planetThing from './three/makePlanets';


//todo fix this poison, maybe by class
let scene, rendercam, planets, controls;

function init() {
  // create the scene
  scene = new THREE.Scene();

  // setup renderer
  rendercam = new RenderCam();

  scene.add(rendercam.cameraHelper); // TODO: this might be a bit transparent
    
  document.body.appendChild(rendercam.renderer.domElement);


  // set up camera control	
  controls = new THREE.OrbitControls(rendercam.camera);
  //controls.noZoom = true;
  controls.noPan = true;
  //controls.addEventListener( 'change', function(){console.log('con-ch')} );
  controls.minDistance = 0.05; // todo: set according to target planet size
  controls.maxDistance = 200;

  // todo
  planets = planetThing.getPlanets();

  controls.target = planets[3].position;

  //planets.pop(); planets.pop(); // todo hack pop outer planets

  // add planets and orbit path
  for (let planet of planets) {
    scene.add(planet);
    scene.add(planet.getOrbitLine());
  }
  
  // add the good ol'sun
  let sun = new space.Sun();
  scene.add(sun);

  // add some hemisphere light, so planets are not completely dark
  // TODO: i have no idea how this works so...
  let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
  // hemiLight.color.setHSL( 0.6, 1, 0.6 );
  // hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set(0, 0, 500);
  scene.add(hemiLight);


  // add a bunch of star particles
  //todo bad and overkill put them all on inner surface rite
  let particles = new space.Stars(3000, 1000, 0x888888/*0xcccccc*/);
  scene.add(particles);
}

// TODO: MOVE
let currentEpoch = new Date('1991-06-21T00:00:00');

let debugCount = 0, dc2 = 0;
let lastStamp = Date.now();

let timeFactor = 15 /* days per second */ * 24 * 60 * 60;

function render() {
  requestAnimationFrame(render);
  
  // TODO: remove crazy limiter; how often is computation nececarry
  if (debugCount % 3 === 0) {
    let now = Date.now();
    let timePassed = now - lastStamp;
    let addTime = timePassed * timeFactor;

    currentEpoch.setTime(currentEpoch.getTime() + addTime);
    updatePlanetPositions(currentEpoch);

    lastStamp = now;

    controls.update();
    
    // from earth to mars test dont use with orbitcontrols
    // planets[2].visible = false;
    //rendercam.camera.position.copy(planets[4].position);
    // rendercam.camera.lookAt(planets[8].position);
  }

  // camera follows the cube
  //rendercam.camera.lookAt(planets[2].position);
  

  // todo log epoch
  if (debugCount % 120 === 0) {
    console.log('epoch', currentEpoch);
  }

  // planet switcher
  if (debugCount % 300 === 0) { controls.target = planets[dc2++ % 9].position; }

  debugCount++;
  rendercam.render(scene);
}

// todo convinence
function updatePlanetPositions(epoch) {
  for (let i = 0; i < planets.length; i++) {
    planets[i].setPositionFromEpoch(epoch);
  }
}



init();
updatePlanetPositions(currentEpoch);
render();


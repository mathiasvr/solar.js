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

import Label from './things/2d-css-label';


//todo fix this poison, maybe by class
let scene, rendercam, planets, controls;
let labels = [];

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
  controls.zoomSpeed = 0.5;

  //controls.addEventListener( 'change', function(){console.log('con-ch')} );
  controls.minDistance = 0.05; // todo: set according to target planet size
  controls.maxDistance = 200;

  // todo
  planets = planetThing.getPlanets();

  controls.target = planets[3].position;

  // add planets and orbit path
  for (let planet of planets) {
    scene.add(planet);
    scene.add(planet.getOrbitLine());
    labels.push(new Label(planet.planetData.name, planet.position, rendercam));
  }
  
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
  
  // label test
  //label1 = new Label(planets[2].planetData.name, planets[2].position, rendercam);
  //label2 = new Label(planets[3].planetData.name, planets[3].position, rendercam);
  
  // canvas text test
  
  /*  // create a canvas element
    var canvas1 = document.createElement('canvas');
    canvas1.height = 36;
    canvas1.width = 200;
  
    var context1 = canvas1.getContext('2d');
    context1.font = "Bold 24px Arial";
    context1.fillStyle = "rgba(255,255,255,0.95)";
    context1.fillText('Hello, world!', 0, 24);
    
    document.body.appendChild(canvas1);
  
    // canvas contents will be used for a texture
    var texture1 = new THREE.Texture(canvas1)
    texture1.needsUpdate = true;
    texture1.minFilter = THREE.NearestFilter;
  
    var material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
    material1.transparent = true;
  
    var mesh1 = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(canvas1.width/1000, canvas1.height/1000),
      material1
      );
    mesh1.position.set(0, 0, 0);
  
    scene.add(mesh1);
  */

}

// TODO: MOVE
let currentEpoch = new Date('2015-08-05T19:00:00+0100');

let debugCount = 0, dc2 = 0;
let lastStamp = Date.now();

let timeFactor = 15 /* days per second */ * 24 * 60 * 60;

function render() {
  requestAnimationFrame(render);
  
  // TODO: remove crazy limiter; how often is computation nececarry
  if (debugCount % 3 === 0) {
    
    // TODO: has to position label before moving planets
    // i think this is becase the camera does not update it's matrix/matrixworld/projectionmatrix/something
    // until render is called
    // either keep it this way, manually update the matrix things, or render the scene before moving css labels
    // last option makes good sense so it's clear that the labels are not really part of the scene
    labels.forEach(label => label.update());


    // realtime scaling (independent of tab pausing and framerate)
    let now = Date.now();
    let timePassed = now - lastStamp;
    let addTime = timePassed * timeFactor;
    
    currentEpoch.setTime(currentEpoch.getTime() + addTime);
    setPlanetPositionsFromEpoch(currentEpoch);
    
    //console.log(planets[3].position, toXYCoords(planets[3].position));


    lastStamp = now;

    controls.update();
    
    // from earth to mars test dont use with orbitcontrols
    // planets[2].visible = false;
    //rendercam.camera.position.copy(planets[4].position);
    // rendercam.camera.lookAt(planets[8].position);
  }

  // camera follows the cube
  //rendercam.camera.lookAt(planets[2].position);
  
  // log epoch
  if (debugCount % 120 === 0) { console.log('epoch', currentEpoch); }

  // planet switcher
  if (debugCount % 600 === 0) { controls.target = planets[dc2++ % 9].position; }

  debugCount++;
  rendercam.render(scene);
}

// TODO convinence
function setPlanetPositionsFromEpoch(epoch) {
  /*for (let planet of planets) {
      planet.setPositionFromEpoch(epoch);
    }*/
  // planets.forEach(planet => planet.setPositionFromEpoch(epoch));
  planets.forEach(planet => planet.epoch = epoch);
}


init();
setPlanetPositionsFromEpoch(currentEpoch);
render();

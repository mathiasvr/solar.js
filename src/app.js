import THREE from 'three.js';
import OrbitControls from 'three-orbit-controls';
THREE.OrbitControls = OrbitControls(THREE); // todo is this the way?

import planetsInfo from './lib/position/planetary-data'; // todo: fix

import RenderCam from './lib/three/rendercam';
import * as Space from './lib/three/space/';

import Label from './lib/2D/label';

// TODO: remove
let debugCount = 0, dc2 = 0;

function initialize() {
  // create the scene
  let scene = new THREE.Scene();

  // TODO: better structure for camera and renders
  // setup renderer
  let rendercam = new RenderCam();

  scene.add(rendercam.cameraHelper); // TODO: this is very
    
  document.body.appendChild(rendercam.renderer.domElement);
  
  // todo
  let planetScale = 1000;
  //let planets = planetsInfo.map(planetData => new Space.CelestialBody(planetData, planetScale));
  let planets = planetsInfo.map(p => new Space.CelestialBody(p.name, p.physical, p.orbit, p.color, planetScale));

  let orbitLines = planetsInfo.map(planetData => new Space.OrbitLine(planetData));

  let labels = planets.map(planet => new Label(planet.name, planet.position, rendercam));
  
  // set up camera control	
  let controls = new THREE.OrbitControls(rendercam.camera);
  controls.noPan = true;
  controls.zoomSpeed = 0.5;
  controls.minDistance = 0.05; // todo: set according to target planet size
  controls.maxDistance = 200;
  controls.target = planets[0].position;
  //controls.target = new THREE.Vector3(0, 0, 0);
  //controls.addEventListener('change', function(){});
 
  // add planets and orbits to scene
  scene.add(...planets, ...orbitLines);

  // TODO: make object that combine planets and labels i guess
  // append labels to dom
  labels.forEach(label => document.body.appendChild(label.domElement));

  // add the sun
  let sun = new Space.Sun(300);
  scene.add(sun);
    
  // TODO: decisions
  //let sunBody = new Space.CelestialBody('Sun', 3000, null, 0xffff00, planetScale);
  //scene.add(sunBody);

  // add some hemisphere light, so planets are not completely black on the dark side
  let backgroundLight = new THREE.HemisphereLight(0x404040, 0x404040);
  backgroundLight.position.set(0, 0, 100);
  scene.add(backgroundLight);

  // add a bunch of star particles
  //todo bad and overkill put them all on inner surface rite
  let particles = new Space.Stars(3000, 1000, 0x888888/*0xcccccc*/);
  scene.add(particles);
    
  // TODO: where does this fit in
  let timeScaleFactor = 30 /* days per second */ * 24 * 60 * 60;
  let startEpoch = new Date(); //new Date('2015-08-05T19:00:00+0100');
  let startStamp = Date.now();
  let currentEpoch = new Date();

  let infoDiv = document.getElementById('info');

  let last = 0;
  
  let msSiderealFactor = 40 / planets[0].physical.siderealOrbit;

  let render = function () {
    requestAnimationFrame(render);
  
    // TODO: remove crazy limiter; how often is computation nececarry?
    // if (debugCount % 3 === 0) {
    // time scaling (independent of tab pausing and framerate)
    let timePassed = Date.now() - startStamp;


    // only update if planets have moved substansiously
    // TODO: optimize (sidereal) how much time must pass before movement is necessary for the individual planet
    if (timePassed - last > 50) {
      currentEpoch.setTime(startEpoch.getTime() + (timePassed * timeScaleFactor));

      planets.forEach(planet => planet.epoch = currentEpoch);
      
      // TODO needs individiual delta
      // planets.forEach(planet => {
      //   if (timePassed - last > planet.physical.siderealOrbit * msSiderealFactor) {
      //     planet.epoch = currentEpoch;
      //   }
      // });

      infoDiv.textContent = 'Date: ' + currentEpoch.toLocaleString();

      last = timePassed;
    }
    // from earth to mars test dont use with orbitcontrols
    // planets[2].visible = false; 
    // labels[2].text = '';
    // rendercam.camera.position.copy(planets[2].position);
    // rendercam.camera.lookAt(planets[3].position);
    //   }

    controls.update();

    rendercam.render(scene);
    
    // TODO: merge labels with planet object?
    labels.forEach(label => label.update());
      
    // TODO: remove debug stuff
    // log epoch
    //if (debugCount % 120 === 0) { console.log('epoch', currentEpoch); }
    // planet switcher
    //if (debugCount % 600 === 0) { controls.target = planets[dc2 % 9].position; controls.minDistance = planets[dc2 % 9].radius * 1.2; dc2++; }
    
    debugCount++;
  }

  return render;
}

// TODO: bootstrap this elsewhere
initialize()();
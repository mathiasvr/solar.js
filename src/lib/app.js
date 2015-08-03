/// <reference path="../../../DefinitelyTyped/threejs/three.d.ts" />
//TODO TYPINGS??

import THREE from 'three.js';
import OrbitControls from 'three-orbit-controls';
// todo is this the way?
THREE.OrbitControls = OrbitControls(THREE);

import * as space from './three/space';
import RenderCam from './three/rendercam';

import * as testpos from './three/position';


let scene, rendercam, planets;

function init() {
  // create the scene
  scene = new THREE.Scene();

  // setup renderer
  rendercam = new RenderCam();

  scene.add(rendercam.cameraHelper); // TODO: this might be a bit transparent
    
  document.body.appendChild(rendercam.renderer.domElement);


  // set up camera control	
  let controls = new THREE.OrbitControls(rendercam.camera);
  //controls.noZoom = true;
  controls.noPan = true;
  //controls.addEventListener( 'change', function(){console.log('con-ch')} );

  // todo
  planets = testpos.getPlanets();
  
  planets.pop(); planets.pop(); // todo hack pop outer planets

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
  let particles = new space.Stars(10000, 2000, 0x888888/*0xcccccc*/);
  scene.add(particles);
}


// TODO: remove (we need general solution anyway)
Date.prototype.addDays = function (days) {
  let dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}


// TODO: MOVE
let currentEpoch = new Date('1991-06-21T00:00:00');
let halfFPShack = 0;

function render() {
  requestAnimationFrame(render);

  if (halfFPShack++ % 3 !== 0) return;
  
  // TODO: WHY???
  //controls.update();

  // test planet stuff
  
  currentEpoch = currentEpoch.addDays(2);

  // testMercury.setPositionFromEpoch(currentEpoch);
  // testVenus.setPositionFromEpoch(currentEpoch);
  // testMars.setPositionFromEpoch(currentEpoch);
  // testEarth.setPositionFromEpoch(currentEpoch);
  
  for (let i = 0; i < planets.length; i++) {
    planets[i].setPositionFromEpoch(currentEpoch);
  }


  // todo log epoch
  if (currentEpoch.getDate() === 1)
    console.log('epoch', currentEpoch);
   
  // camera follows the cube
  //rendercam.camera.lookAt(planets[2].position);
  
  // from earth to mars test
  // planets[2].visible = false;
  // rendercam.camera.position.copy(planets[2].position);
  // rendercam.camera.lookAt(planets[1].position);

  rendercam.render(scene);
}


init();
render();

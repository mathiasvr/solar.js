
// TODO: should we realy import three as a global?
//  could create our own simplified orbit controls or just use mouse controls ?
// we need zoom to act reverse anyway...
//import THREE from 'three.js';
/* global THREE */
import 'three.js';
import "github:mrdoob/three.js@master/examples/js/controls/OrbitControls";

import {CelestialBody, Stars} from './three/planet';

// TODO: i hate consts
var DEBUG_ROTATION = false;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

// TODO: window global is slow, but i think screen is probably okay, more readable to me, but I want a even better solution
//var screen = { width: window.innerWidth, height: window.innerHeight };

// create scene and cameras
var scene = new THREE.Scene();

var debugCamera = new THREE.PerspectiveCamera(70, 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
debugCamera.position.z = 2500;

var camera = new THREE.PerspectiveCamera(50, 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT, 150, 1000);
camera.position.z = 1; //TODO: for OrbitControls to work ??

var cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

// set up camera control	
var controls = new THREE.OrbitControls(camera);
//controls.noZoom = true;
controls.noPan = true;
//controls.addEventListener( 'change', function(){console.log('con-ch')} );

// setup renderer
var renderer = new THREE.WebGLRenderer(/*{ antialias: true }*/);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
renderer.autoClear = false;
//renderer.domElement.style.position = "relative";

document.body.appendChild(renderer.domElement);

function onWindowResize(event) {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  camera.aspect = debugCamera.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;
  
  camera.updateProjectionMatrix();
  debugCamera.updateProjectionMatrix();
}
window.addEventListener('resize', onWindowResize, false);

// create cube
var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
var cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);
  
// create spheres
var sphere = new CelestialBody(100, 0x0000ff); 
var sphere2 = new CelestialBody(50, 0xff0000); 
scene.add(sphere, sphere2);

// add a bunch of star particles
var particles = new Stars(10000, 2000, 0x888888/*0xcccccc*/);
scene.add(particles);
  
// static orbit thing
var lineGeometry = new THREE.Geometry();

// TODO: better (exact) wrap-around + how to know how many turns is enough
for (var i = 0; i <= Math.PI * 4 + 0.1; i += 0.1) {
  let vertex = new THREE.Vector3();
  vertex.x = 500 * Math.cos(i);
  vertex.y = 500 * Math.sin(i);
  vertex.z = 500 * Math.sin(i * 0.5);
  lineGeometry.vertices.push(vertex);
}

var line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
scene.add(line);

// split
  
//var fuck2 = 0; // todo remove stupid lines
function render() {
  
  //fuck2 += 0.1;
  requestAnimationFrame(render);
  
  // TODO: WHY???
  controls.update();

  cube.rotation.x += 0.05;
  cube.rotation.y += 0.05;

  var r = Date.now() * 0.0005;
  //console.log(Math.cos(r) + ' ' + Math.sin(r))

  cube.position.x = 700 * Math.cos(r);
  cube.position.y = 700 * Math.sin(r);
  cube.position.z = 700 * Math.sin(r);

  sphere.position.x = 500 * Math.cos(r * 0.5);
  sphere.position.y = 500 * Math.sin(r);
  sphere.position.z = 500 * Math.sin(r);

  sphere2.position.x = 500 * Math.cos(r);
  sphere2.position.y = 500 * Math.sin(r);
  sphere2.position.z = 500 * Math.sin(r * 0.5);
    
  // bad dynamic line draw
  // var fuck = fuck2 % 1000 | 0;
  // line.geometry.vertices[fuck].x = sphere.position.x;
  // line.geometry.vertices[fuck].y = sphere.position.y;
  // line.geometry.vertices[fuck].z = sphere.position.z;
  // line.geometry.verticesNeedUpdate = true;

  // camera follows the cube
  //camera.lookAt(cube.position);

  // rotate debug camera
  if (DEBUG_ROTATION) {
    debugCamera.position.x = 2500 * Math.cos(r * 0.1);
    debugCamera.position.z = 2500 * Math.sin(r * 0.1);
    //debugCamera.position.y = 700 * Math.sin(r);
    debugCamera.lookAt(camera.position);
  }

  renderer.clear(); // TODO: we disabled auto clear

  // render perspective camera to the left
  cameraHelper.visible = false;
  renderer.setViewport(0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
  renderer.render(scene, camera);
  cameraHelper.visible = true;

  // render debugging camera to the right
  renderer.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
  renderer.render(scene, debugCamera);
}

render();

/*console.time('render test2');
for (var i = 0; i < 10000; i++) {
  renderer.clear(); // TODO: we disabled auto clear

  // render perspective camera to the left
  cameraHelper.visible = false;
  renderer.setViewport(0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
  renderer.render(scene, camera);
  cameraHelper.visible = true;

  // render debugging camera to the right
  renderer.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
  renderer.render(scene, debugCamera);
}
console.timeEnd('render test2');
*/
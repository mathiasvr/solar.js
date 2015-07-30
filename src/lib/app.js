// TODO: should we realy import three as a global?
//  could create our own simplified orbit controls or just use mouse controls ?
// we need zoom to act reverse anyway...
//import THREE from 'three.js';
/* global THREE */
import 'three.js';
import "github:mrdoob/three.js@master/examples/js/controls/OrbitControls";

import {Planet, Stars} from './three/planet';
import RenderCam from './three/rendercam';

// create the scene
var scene = new THREE.Scene();


// setup renderer
var rendercam = new RenderCam();

scene.add(rendercam.cameraHelper); // TODO: this might be a bit transparent
    
document.body.appendChild(rendercam.renderer.domElement);

rendercam.camera.position.z = 1; //TODO: for OrbitControls to work ??

// set up camera control	
var controls = new THREE.OrbitControls(rendercam.camera);
//controls.noZoom = true;
controls.noPan = true;
//controls.addEventListener( 'change', function(){console.log('con-ch')} );


// create cube
var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
var cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);
  
// create spheres
var sphere = new Planet(100, 0x0000ff); 
var sphere2 = new Planet(50, 0xff0000); 
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
  //controls.update();

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
    
  // camera follows the cube
  //rendercam.camera.lookAt(cube.position);
  
  rendercam.render(scene);
}

render();

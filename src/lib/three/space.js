import THREE from 'three.js';
// TODO: maybe separate this from the mesh class (but then maybe not)
import OrbitalElements from '../position/orbitalClass';

// TODO: remove (we need general solution anyway)
Date.prototype.addDays = function (days) {
	let dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}

const KM_PER_AU = 149597870.7;
const SCALE = 1; // TODO: getting ready to remove scaling, but check if it is precise enough to use AU
		
export class CelestialBody extends THREE.Mesh {
	constructor(planetData, scale) {
		let radius = (planetData.physical.meanRadius * SCALE /* * sizeScale */) / KM_PER_AU; // TODO: less hacky
		console.log(planetData.name + ' radius: ' + radius); // TODO: remove
		
		super(new THREE.SphereGeometry(radius, 32, 24), new THREE.MeshPhongMaterial({ color: planetData.color, wireframe: false }));

		this.planetData = planetData;
		
		this.setScale(scale);
	}

	setScale(value) {
		this.scale.set(value, value, value);
	}

	get epoch() {
		// TODO: maybe set default value?
		return this._epoch;
	}
	
	// set position from epoch
	set epoch(epoch) {
		this._epoch = epoch;
		let elements = OrbitalElements.compute(this.planetData.orbit, epoch);

		// TODO this is pretty hacky since helposition is NOT Vector3
		this.position.copy(elements.helposition);
		
		// TODO: dont multiply (make scene adapt if that works)
		this.position.multiplyScalar(SCALE);
	}
	
	get name() {
		return this.planetData.name;
	}

}

export class OrbitLine extends THREE.Line {
		// orbit a sidereal year from J2000
	constructor(planetData) {
		// TODO: use some sort of spline ellipsis thing, instead off many lines
		// then refactor addDays if still nec.

		let precision = 100; // lines per orbit
		let orbitDays = planetData.physical.siderealOrbit * 365.25;
		let unit = orbitDays / precision;

		let geometry = new THREE.Geometry();

		for (let i = 0, j = 0; i < precision; i += 1, j += unit) {
			let elements = OrbitalElements.compute(planetData.orbit, OrbitalElements.J2000.addDays(j));
			let vertex = new THREE.Vector3();
			vertex.copy(elements.helposition); // TODO: not vector3 hack (maybe make own (safe) copy/convert)
			vertex.multiplyScalar(SCALE);
			geometry.vertices.push(vertex);
		}
		
		// TODO: is there an api way of doing this	
		// close path
		geometry.vertices.push(geometry.vertices[0]);
		
		//TODO: fix all dis
		let material = new THREE.LineBasicMaterial({ color: planetData.color, linewidth: 0.1 });
		//let material = new THREE.LineDashedMaterial({ color: this.color, dashSize: 3, gapSize: 0.5, linewidth: 2 }, THREE.LinePieces);
		// todo make dashed lines work

		// TODO DONT DO IT HERE
		// darken color
		material.color.multiplyScalar(0.7);

		super(geometry, material);
	}

}

// randomized star field (particles)
export class Stars extends THREE.PointCloud {
	constructor(amount, size, color) {
		let geometry = new THREE.Geometry();

		for (let i = 0; i < amount; i++) {
			let vertex = new THREE.Vector3();
			vertex.x = THREE.Math.randFloatSpread(size);
			vertex.y = THREE.Math.randFloatSpread(size);
			vertex.z = THREE.Math.randFloatSpread(size);
			geometry.vertices.push(vertex);
		}

		super(geometry, new THREE.PointCloudMaterial({ color: color }));
	}
}

// TODO: move 
let textureFlare0 = THREE.ImageUtils.loadTexture("jspm_packages/github/mrdoob/three.js@master/examples/textures/lensflare/lensflare0.png");

//TODO: maybe add actual sun mesh object
export class Sun extends THREE.Object3D {
	constructor() {
		super();

		// light source of the sun
		let light = new THREE.PointLight(0xffffff);
		
		// lens flare effect to represent the sun
		let flareColor = new THREE.Color(0xffffff);
		flareColor.setHSL(0.55, 0.9, 0.95);
		let flare = new THREE.LensFlare(textureFlare0, 300, 0, THREE.AdditiveBlending, flareColor);

		// TODO: adjust flare size based on camera distance, how does positionScreen work is it based on camera?
		/*flare.customUpdateCallback = function () {
			var f, fl = this.lensFlares.length;
			var flare;
			//var vecX = - this.positionScreen.x * 2;
			//var vecY = - this.positionScreen.y * 2;
			
			//console.log(this.positionScreen, this.lensFlares[0].size);
			//console.log(1-this.positionScreen.z);

			for (f = 0; f < fl; f++) {
				flare = this.lensFlares[f];
				
				//flare.size += 1;
				
				flare.x = this.positionScreen.x; //+ vecX * flare.distance;
				flare.y = this.positionScreen.y; //+ vecY * flare.distance;

				flare.wantedRotation = flare.x * Math.PI * 0.25;
				flare.rotation += (flare.wantedRotation - flare.rotation) * 0.25;
			}
			
		};*/

		this.add(light, flare);
	}
}

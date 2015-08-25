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
const SCALE = 1; // TODO: getting ready to remove scaling, but test if it is precise enough to use AU
		
export class CelestialBody extends THREE.Mesh {
	constructor(planetData) {
		let sizeScale = 1000;
		let radius = (planetData.physical.eqradius * SCALE /* * sizeScale */) / KM_PER_AU; // TODO: less hacky
		console.log(planetData.name + ' radius: ' + radius); // TODO: DON'T DEBUG LOG AND sheet though
		
		super(new THREE.SphereGeometry(radius, 32, 24), new THREE.MeshPhongMaterial({ color: planetData.color, wireframe: false }));

		this.planetData = planetData;
		
		//this.scale.multiplyScalar(sizeScale);
		this.setSize(sizeScale);
	}

	setSize(s) {
		this.scale.set(s, s, s);
	}

	get epoch() {
		// TODO: maybe set default value?
		return this._epoch;
	}
	
	// set position from epoch
	set epoch(value) {
		this._epoch = value;
		let elements = OrbitalElements.compute(this.planetData.orbit, value);

		// TODO this is pretty hacky since helposition is NOT Vector3
		this.position.copy(elements.helposition);
		
		// TODO: dont multiply (make scene adapt if that works)
		this.position.multiplyScalar(SCALE);
	}
	
	// TODO remove this
	getOrbitLine() {
		return new OrbitLine(this.planetData);
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

//TODO: maybe add actual sun object
export class Sun extends THREE.Object3D {
	constructor() {
		super();
		
		// TODO decribe this

		let light = new THREE.PointLight(0xffffff, 1, 0);

		let flareColor = new THREE.Color(0xffffff);
		flareColor.setHSL(0.55, 0.9, 0.95);
		let flare = new THREE.LensFlare(textureFlare0, 300, 0.0, THREE.AdditiveBlending, flareColor);

		this.add(light, flare);
	}
}

// TODO: remove
/*
//TODO: lens flare, and maybe actual sun object
// SunLight really
class SunLight extends THREE.PointLight {
	constructor() {
		//  let light = new THREE.PointLight(0xffffff, 1, 0);
		super(0xffffff, 1, 0);
	}
}


// TODO combine objects
class SunFlare extends THREE.LensFlare {
	constructor() {
		// TODO: experiment/ describe values
		let flareColor = new THREE.Color(0xffffff);
		flareColor.setHSL(0.55, 0.9, 0.95);

		super(textureFlare0, 300, 0.0, THREE.AdditiveBlending, flareColor);
		
		//this.customUpdateCallback = () =>{};
		
	}
}
*/
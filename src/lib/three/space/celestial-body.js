import THREE from 'three.js';
// TODO: maybe separate this from the mesh class (but then maybe not)
import * as OrbitalElements from '../../position/orbital-elements';
import Positions from '../../position/position';

const KM_PER_AU = 149597870.7;
const SCALE = 1; // TODO: getting ready to remove scaling, but check if it is precise enough to use AU
		
export default class CelestialBody extends THREE.Mesh {
	// TODO: find a way to convinietly conncet all planetData and this body, redesign class i guess
	//constructor(planetData, scale) {
	constructor(name, physical, orbit, color, scale) {
			
		let radius = (physical.meanRadius * SCALE /* * sizeScale */) / KM_PER_AU; // TODO: less hacky
		
		super(new THREE.SphereGeometry(radius, 32, 24), new THREE.MeshPhongMaterial({ color: color, wireframe: false }));

		console.log(name + ' radius:', this.geometry.parameters.radius); // TODO: remove
	
		this.name = name;
		this.orbit = orbit;
		this.physical = physical;
		
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
		let elements = OrbitalElements.compute(this.orbit, epoch);
		let positions = Positions(elements);

		// TODO this is pretty hacky since helposition is NOT Vector3
		this.position.copy(positions.eclipticPosition);
		
		// TODO: dont multiply (make scene adapt if that works)
		this.position.multiplyScalar(SCALE);
	}
	
	// TODO: you gotta love this
	get radius() {
		return this.geometry.parameters.radius * this.scale.x;
	}

}


// TODO: i don't really like this
export default function calculatePositions(elements) {
	/*	return {
			orbitalPosition: calculateOrbitalPosition(elements.a, elements.e, elements.E),
			eclipticPosition: calculateEclipticPosition(elements.Ω, elements.i, elements.w, this.orbitalPosition)
		}*/

	let positions = {};
	positions.orbitalPosition = calculateOrbitalPosition(elements.a, elements.e, elements.E);
	positions.eclipticPosition = calculateEclipticPosition(elements.Ω, elements.i, elements.w, positions.orbitalPosition);
	
	return positions;

	//todo remove this
	//let eclipticPosition2 = Position.calculateEclipticPosition2(elements.Ω, elements.i, elements.w, elements.position);
	//let eclipticPosition2Alt = Position.calculateEclipticPosition2Alt(elements.Ω, elements.i, elements.w, elements.position);

	 // console.log(elements.eclipticPosition.x === eclipticPosition2.x &&
	//  elements.eclipticPosition.y === eclipticPosition2.y &&
	//   elements.eclipticPosition.z === eclipticPosition2.z );
}

// TODO: rename params / explain (euler)

// heliocentric coordinates in the orbital plane
export function calculateOrbitalPosition(a, e, E) {
	return {
		x: a * (Math.cos(E) - e),
		y: a * Math.sqrt(1 - e * e) * Math.sin(E),
		z: 0
	}
}

// position it the helicentric eccliptic plane
//TODO: this can be done in many ways... choose 
export function calculateEclipticPosition(Ω, i, w, position) {
	return {
		x: position.x * (Math.cos(w) * Math.cos(Ω) - Math.sin(w) * Math.sin(Ω) * Math.cos(i))
		+ position.y * (- Math.sin(w) * Math.cos(Ω) - Math.cos(w) * Math.sin(Ω) * Math.cos(i)),
		y: position.x * (Math.cos(w) * Math.sin(Ω) + Math.sin(w) * Math.cos(Ω) * Math.cos(i))
		+ position.y * (- Math.sin(w) * Math.sin(Ω) + Math.cos(w) * Math.cos(Ω) * Math.cos(i)),
		z: position.x * (Math.sin(w) * Math.sin(i))
		+ position.y * (Math.cos(w) * Math.sin(i))
	}

}

// TODO: benchmark to compare performance (even though this was more about readability)
export function calculateEclipticPositionAlt(Ω, i, w, position) {
	let cosΩ = Math.cos(Ω), sinΩ = Math.sin(Ω);
	let cosi = Math.cos(i), sini = Math.sin(i);
	let cosw = Math.cos(w), sinw = Math.sin(w);

	return {
		x: position.x * (cosw * cosΩ - sinw * sinΩ * cosi) + position.y * (-sinw * cosΩ - cosw * sinΩ * cosi),
		y: position.x * (cosw * sinΩ + sinw * cosΩ * cosi) + position.y * (-sinw * sinΩ + cosw * cosΩ * cosi),
		z: position.x * (sinw * sini) + position.y * (cosw * sini)
	}
}

// TODO: if using this, calculate v and r as elements and pass those as params instead
// export function calculateEclipticPosition2(v, r, position) {
export function calculateEclipticPosition2(Ω, i, w, position) {	
	// true anomaly
	let v = Math.atan2(position.y, position.x);
	// radial distance
	let r = Math.sqrt(position.x * position.x + position.y * position.y); // TODO: vector length

	return {
		x: r * (Math.cos(Ω) * Math.cos(v + w) - Math.sin(Ω) * Math.sin(v + w) * Math.cos(i)),
		y: r * (Math.sin(Ω) * Math.cos(v + w) + Math.cos(Ω) * Math.sin(v + w) * Math.cos(i)),
		z: r * (Math.sin(v + w) * Math.sin(i))
	}
}

export function calculateEclipticPosition2Alt(Ω, i, w, position) {
	// true anomaly
	let v = Math.atan2(position.y, position.x);
	// radial distance
	let r = Math.sqrt(position.x * position.x + position.y * position.y); // TODO: vector length
	
	let cosΩ = Math.cos(Ω), sinΩ = Math.sin(Ω);
	let cosi = Math.cos(i), sini = Math.sin(i);
	let cosvw = Math.cos(v + w), sinvw = Math.sin(v + w);

	return {
		x: r * (cosΩ * cosvw - sinΩ * sinvw * cosi),
		y: r * (sinΩ * cosvw + cosΩ * sinvw * cosi),
		z: r * (sinvw * sini)
	}
}

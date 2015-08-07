
// 
//dat.opos = calculateOrbitalPosition(dat.a, dat.e, dat.E);
	
//dat.eclpos = calculateEcclipticPosition(dat.N, dat.i, dat.w, dat.opos);

// todo rename params / explain (euler)

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
// TEST IN AFTER EDITS
export function calculateEcclipticPosition(N, i, w, position) {
	return {
		x: position.x * (Math.cos(w) * Math.cos(N) - Math.sin(w) * Math.sin(N) * Math.cos(i))
		+ position.y * (- Math.sin(w) * Math.cos(N) - Math.cos(w) * Math.sin(N) * Math.cos(i)),
		y: position.x * (Math.cos(w) * Math.sin(N) + Math.sin(w) * Math.cos(N) * Math.cos(i))
		+ position.y * (- Math.sin(w) * Math.sin(N) + Math.cos(w) * Math.cos(N) * Math.cos(i)),
		z: position.x * (Math.sin(w) * Math.sin(i))
		+ position.y * (Math.cos(w) * Math.sin(i))
	}
	
	/*let cN = Math.cos(N); let sN = Math.sin(N);
	let ci = Math.cos(i); let si = Math.sin(i);
	let cw = Math.cos(w); let sw = Math.sin(w);
	
	return {
		x: opos.x * (cw * cN - sw * sN * ci) + opos.y * (- sw * cN - cw * sN * ci),
		y: opos.x * (cw * sN + sw * cN * ci) + opos.y * (- sw * sN + cw * cN * ci),
		z: opos.x * (sw * si) + opos.y * (cw * si)
	}*/
}


export default {calculateOrbitalPosition, calculateEcclipticPosition};
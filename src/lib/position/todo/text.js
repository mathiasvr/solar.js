 // TODO text testing: we should probably just use simple 2d labels instead, from css or canvas
 
/*  let textGeometry = new THREE.TextGeometry('Hello World!', {

					// size: size,
					// height: height,
					// curveSegments: curveSegments,

					// font: font,
					// weight: weight,
					// style: style,

					// bevelThickness: bevelThickness,
					// bevelSize: bevelSize,
					// bevelEnabled: bevelEnabled,

					// material: 0,
					// extrudeMaterial: 1

				});

  let textMaterial = new THREE.MeshBasicMaterial();

  let text = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(text);*/
  
 console.log( THREE.FontUtils);
  
 var textShapes = THREE.FontUtils.generateShapes( 'text test', options );
  var text = new THREE.ShapeGeometry( textShapes );
  var textMesh = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) ;
  scene.add(textMesh);
  // Example text options : {'font' : 'helvetiker','weight' : 'normal', 'style' : 'normal','size' : 100,'curveSegments' : 300};


/// -----------------------------------------

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
export function createFeiXian(points, layer) {
  var points = points; // [new AMap.LngLat(116.400433, 39.908084), new AMap.LngLat(116.400433, 39.908084), new AMap.LngLat(113.307035, 23.147209), new AMap.LngLat(113.307035, 23.147209)]
  var numberOfPoints = 180;
  var minHeight = 20;

  var meshLine = new AMap.Object3D.MeshLine({
    path: computeBezier(points, numberOfPoints, minHeight),
    height: getEllipseHeight(numberOfPoints, 2000000, minHeight),
    color: 'rgba(55,129,240, 0.9)',
    width: 5,
  });
  meshLine.transparent = true;
  layer.add(meshLine);
  meshLine['backOrFront'] = 'both';

  return meshLine;
}

function pointOnCubicBezier(cp, t) {
  var ax, bx, cx;
  var ay, by, cy;
  var tSquared, tCubed;

  cx = 3.0 * (cp[1].lng - cp[0].lng);
  bx = 3.0 * (cp[2].lng - cp[1].lng) - cx;
  ax = cp[3].lng - cp[0].lng - cx - bx;

  cy = 3.0 * (cp[1].lat - cp[0].lat);
  by = 3.0 * (cp[2].lat - cp[1].lat) - cy;
  ay = cp[3].lat - cp[0].lat - cy - by;

  tSquared = t * t;
  tCubed = tSquared * t;

  var lng = ax * tCubed + bx * tSquared + cx * t + cp[0].lng;
  var lat = ay * tCubed + by * tSquared + cy * t + cp[0].lat;

  return new AMap.LngLat(lng, lat);
}

function computeBezier(points, numberOfPoints) {
  var dt;
  var i;
  var curve = [];

  dt = 1.0 / (numberOfPoints - 1);

  for (i = 0; i < numberOfPoints; i++) {
    curve[i] = pointOnCubicBezier(points, i * dt);
  }

  return curve;
}

function getEllipseHeight(count, maxHeight, minHeight) {
  var height = [];
  var radionUnit = Math.PI / 180;

  for (var i = 0; i < count; i++) {
    var radion = i * radionUnit;

    height.push(minHeight + Math.sin(radion) * maxHeight);
  }

  return height;
}

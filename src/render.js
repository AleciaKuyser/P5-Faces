
// draws face with nth offsets, aligned with the centre
// returns false if those offsets aren't loaded yet, otherwise draws the face and returns true
let drawNFace = (n, centre) => (!tx_loaded[n] || !sh_loaded[n]) ? false : drawFace(sh_n[n], sh_ev[n-1], tx_n[n], tx_ev[n-1], centre)

let drawFace = (offs, weight, coloffs, colweight, centre) => {
    noStroke() // drawing lines for the tris is pointless

    // erase the previous face by drawing an ellipse filled with the background colour over it
    fill(facebgcol)
    ellipse(centre.x, centre.y + 17, 430, 470)

    // the calculated vertices for this face
    let verts = offsetVerts(offs, weight)

    // the calculated colours for this face
    let cols = offsetCols(coloffs, colweight)
    
    // calculate the tris for this face from the mesh - does not mutate the mesh
    let tris = mesh.map(tri => calcTri(...tri, verts, cols, centre, selectRenderer()))

    // inplace zsort
    zsort(tris)

    // draw each tri
    tris.forEach(drawTri)

    // required for drawNFace
    return true
}

// use the static function to create a new vector, then mutate that vector
// multiplying by the created vector mirrors the mesh to be correct for the canvas coordinate space
let offsetVerts = (offs, weight) => offs.map((e, i) => p5.Vector.mult(e, weight).add(sh_av[i]).mult(createVector(1, -1, 1)))

// multiply each colour offset by the weight and add the average colour
let offsetCols = (coloffs, colweight) => coloffs.map((col, i) => col.map((e, j) => e * colweight + tx_av[i][j]))

// use the phong toggle to select between the two renderer functions
let selectRenderer = () => phongToggle.checked() ? phong : lambert

// use the builtin sort function to zsort the tris
let zsort = (tris) => tris.sort((a, b) => a.z - b.z)

// returns the tri object, with shaded colour and aligned with the centre provided
let calcTri = (i1, i2, i3, verts, cols, centre, renderer) => ({ 
    // average of z values, used for zsort
    z: (verts[i1].z + verts[i2].z + verts[i3].z) / 3,
    // use the static vector add to not mutate the vectors
    a: p5.Vector.add(verts[i1], centre), b: p5.Vector.add(verts[i2], centre), c: p5.Vector.add(verts[i3], centre),
    // use the zero-aligned coordinates to calculate the shading & colour
    col: renderer(avColour(cols[i1], cols[i2], cols[i3]), cosTheta(verts[i1], verts[i2], verts[i3]))
})

// average of arbitrary number of colours
let avColour = (...cols) => cols.reduce((e, sum) => (e.map((e, i) => e + sum[i])), [0, 0, 0]).map(e => e / cols.length)

// light colour as R G B
var lightColour = [255, 255, 255]
// convert light colour to 0-1 scale
let lCol = (i) => lightColour[i] / 255

// lambertian shader
let lambert = (col, cosTheta) => col.map((e, i) => e * cosTheta * lCol(i))

// phong shader values
var specAmb
var specCol
var specPow

// phong shader
let phong = (col, cosTheta) => specAmb.map((e, i) => e + col[i] * cosTheta * lCol(i) + Math.pow(cosTheta, specPow) * specCol[i] * lCol(i))

// unit vector for light direction
var light

// the dot product (or cosTheta) of the plane normal and the light vector
// use max to ensure we get a value bounded 0-1 (negative light doesn't make sense)
let cosTheta = (p1, p2, p3) => Math.max(planeNormal(p1, p2, p3).dot(light), 0)

// return the normalised normal vector to the plane formed by the three points
let planeNormal = (p1, p2, p3) => p5.Vector.cross((p5.Vector.sub(p1, p2)), p5.Vector.sub(p1, p3)).normalize()

let drawTri = (tri) => {
    fill(tri.col)
    triangle(tri.a.x, tri.a.y, tri.b.x, tri.b.y, tri.c.x, tri.c.y)
}

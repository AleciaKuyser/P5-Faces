
// the synthetic face's offset values, to use for rendering
var sh_synth
var sh_eSynth
var tx_synth
var tx_eSynth

// position to centre the synth face on
var synthcentre

// map of reference indexes to contributions
var refCons = []

// the synthetic face defaults to the average face - i.e. all offsets are 0
let initSynth = () => {
    synthcentre = createVector(w / 2 - offsx, h / 4 + 10)
    sh_synth = new Array(sh_av.length).fill(createVector(0, 0, 0))
    sh_eSynth = 0
    tx_synth = new Array(tx_av.length).fill([0, 0, 0])
    tx_eSynth = 0
}

function mouseClicked() {
    // get the mouse position and check that it's inside the triangle
    let pos = WebGLPos(mouseX, mouseY)
    if (!insideTriangle(pos)) return

    // the contributions
    let cons = calcCons(pos)
    print(cons)

    // get the offset data for the reference faces, and update the refCons
    let sh_refs = [], tx_refs = [], sh_w, tx_w
    refFaces.forEach((ref, i) => { sh_refs[i] = sh_n[ref]; tx_refs[i] = tx_n[ref]; sh_w = sh_ev[ref]; tx_w = tx_ev[ref]; refCons[ref] = cons[i] })
    print({cons:cons, refCons:refCons})
    // recalculate the synthesized face's offsets with the update values
    updateSynthOffs()
}

// translates point on screen to point in webGL coordinates
let WebGLPos = (x, y) => createVector(x - w / 2, y - h / 2)

// check the point is on the same side of every half-plane of the triangle
// the point is on the same side if it equals the running side, or the running side is 0
// the running side is the first non-zero side
let insideTriangle = (pt) => !isNaN(sides(pt, ...corners, corners[0]).reduce((r, s) => (s == r || r == 0) ? s : NaN, 0))

// returns the sides (as 1, 0, or -1) that the point is of each half-plane
let sides = (pt, c, ...cs) => cs.length > 0 ? [side(pt, c, cs[0]), ...sides(pt, ...cs)] : []

// returns the side the points is of the half-plane
let side = (p1, p2, p3) => Math.sign(((p1.x - p3.x) * (p2.y - p3.y)) - ((p2.x - p3.x) * (p1.y - p3.y)))

// calculate contributions
let calcCons = (pos) => normalise(corners.map(e => 1 / pos.dist(e)))

// normalise contributions to sum to 1
let normalise = (dists) => dists.map(e => e / dists.reduce((s, e) => e + s, 0))

let updateSynthOffs = () => {

    // update texture and shape using the appropriate function for weighting and addition
    sh_synth = offSum(sh_n, shWeightAdd, createVector(0, 0, 0))
    tx_synth = offSum(tx_n, txWeightAdd, [0, 0, 0])
                                
    // update weights by summing the components multiplied by the contributions
    sh_eSynth = weightSum(sh_ev)
    tx_eSynth = weightSum(tx_ev)

    updated.synth = true
}

// function for the weighted offset sum
let offSum = (n, fn, init) => refCons.reduce((prev, con, i) => (n[i].map((e, j) => fn(e, con, prev[j]))), (new Array(sh_av.length)).fill(init))

// function to weight and add points
let shWeightAdd = (sh, con, prev) => p5.Vector.mult(sh, con).add(prev)

// function to weight and add colours
let txWeightAdd = (tx, con, prev) => tx.map((c, k) => c * con + prev[k])

// function for the weighted weight sum
let weightSum = (ev) => refCons.reduce((sum, e, i) => (e * ev[i-1]) + sum, 0)

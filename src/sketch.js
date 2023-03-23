
// the face mesh
var mesh
// the average shape and colour
var sh_av
var tx_av
// shape and colour weights - indexed from 0
var sh_ev
var tx_ev
// maps of loaded offsets to their data - indexed from 1
var sh_n
var tx_n
// map of indexes to whether they're loaded yet
// used to control when new loaded data can be used
var sh_loaded = []
var tx_loaded = []

const w = innerWidth
const h = (innerWidth / innerHeight < 1.5) ? w / 1.5 : innerHeight

// indexes of the 3 current reference faces
var refFaces = [1, 2, 3]

function preload() {
    mesh = loadFile('mesh')
    sh_av = loadFile('sh_000')
    tx_av = loadFile('tx_000')
    sh_n = iterLoadFile('sh')
    tx_n = iterLoadFile('tx')
    sh_ev = loadFile('sh_ev')
    tx_ev = loadFile('tx_ev')
}

function setup() {
    convertTables()
    initUI()
    initPhong()
    initSelector()
    initTriangle()
    initSynth()
    // use WebGL to speed up rendering
    createCanvas(w, h, WEBGL)
    // default light value - pointing from the screen normal to ifinity
    light = createVector(0, 0, 1).normalize()
    // centre for the preview face
    prevCentre = createVector(w / 2 - offw, h / -4)
    drawbg()
}

const corners = new Array(3)

// set the 3 corners of the interpolation triangle. Also defines centerpoints for reference faces
let initTriangle = () => {
    corners[0] = createVector(offw * -1 - offsx, offh * -1)
    corners[1] = createVector(offw - offsx, offh * -1)
    corners[2] = createVector(offsx * -1, offh)
}

// some helpful contents for positioning relative to screensize
const offsx = 0.2 * w
const offw = 0.15 * w
const offh = 0.2 * h
const diam = (h < w) ? 0.5 * h : 0.4 * w
const baseStroke = (w * h) / 384000

// object to communicate when components are updated and should be redrawn
var updated = { lighting: true, synth: true, preview: false, refs: [true, true, true] }

// the draw loop, called every frame
// will attempt to draw an updated face on every frame until successful
function draw() {
    
    // the reference faces
    for (let i = 0; i < 3; i++) {
        if (updated.lighting || updated.refs[i]) {
            updated.refs[i] = !drawNFace(refFaces[i], corners[i])
        }
    }

    // the synthesised face
    if (updated.lighting || updated.synth) {
        drawFace(sh_synth, sh_eSynth, tx_synth, tx_eSynth, synthcentre)
        updated.synth = false
    }

    // the preview face
    if (prev && (updated.lighting || updated.preview)) {
        updated.preview = !drawNFace(prev, prevCentre)
    }

    // safe to always set this to false after drawing
    // if a face isn't loaded, it's own updated attribute will still be true
    updated.lighting = false
    
    // the triangle gets redrawn every frame so it stays on top
    stroke(0)
    noFill()
    triangle(corners[0].x, corners[0].y, corners[1].x, corners[1].y, corners[2].x, corners[2].y)
}


const bgcol = 250
const facebgcol = 180

let drawbg = () => {
    background(bgcol);

    // backgrounds for faces
    strokeWeight(baseStroke / 2)
    stroke(100)
    fill(facebgcol)
    // ref faces
    rect(w / -2, h / -2 + 55, w - offsx * 2, h - 105)
    // synth face
    rect(w / 2 - offsx * 2, 40, offsx * 2, h)
    // prev face
    rect(offw * 1.3, 30 - h / 2, w / 2 - offw * 1.3, h / 2 - 30)

    // separator lines
    line(w / 2 - offsx * 2, h, w / 2 - offsx * 2, -h)
    line(w / 2 - offsx * 2, 0, w, 0)
    line(offw * 1.3, h / -2, offw * 1.3, 0)
    line(w / 2 - offsx * 2, offh / 10 - h / 2 + 180, offw * 1.3, offh / 10 - h / 2 + 180)
}

var lightControl = { container:null, xinp:null, yinp:null, zinp:null, rinp:null, ginp:null, binp:null, button:null }

// UI text and light controls
let initUI = () => {
    // UI text
    createDiv("Reference Faces").size(w - offsx * 2, 20).position(0, h - 35).id("title")
    createDiv("Synthesised Face").size(offsx * 2, 20).position(w - offsx * 2, h / 2 + 10).id("title")
    createDiv("Preview Face").size(w / 2 - offw * 1.3, 20).position(w / 2 + offw * 1.3, 5).id("title")

    // light controls container - everything positioned relatively inside this
    lightControl.container = createDiv().position(w / 2 + offsx / 2, 200).size(offw * 0.55, 200).id("selContainer")

    createDiv("Lighting").parent(lightControl.container)
    createDiv("Light Direction").parent(lightControl.container).id("smaller")
    lightControl.xinp = createInput(0).parent(createDiv("x: ").parent(lightControl.container))
    lightControl.yinp = createInput(0).parent(createDiv("y: ").parent(lightControl.container))
    lightControl.zinp = createInput(1).parent(createDiv("z: ").parent(lightControl.container))

    createDiv("Light Colour (0-255)").parent(lightControl.container).id("smaller")
    lightControl.rinp = createInput(lightColour[0]).parent(createDiv("R: ").parent(lightControl.container))
    lightControl.ginp = createInput(lightColour[1]).parent(createDiv("G: ").parent(lightControl.container))
    lightControl.binp = createInput(lightColour[2]).parent(createDiv("B: ").parent(lightControl.container))

    lightControl.button = createButton("Update Light").parent(lightControl.container).mouseClicked(updateLight)
}

// update the light vector and colour with the user input, defaulting to current values if invalid
let updateLight = () => {
    light = createVector(cleanInp(light.x, lightControl.xinp.value()),
                         cleanInp(light.y, lightControl.yinp.value()),
                         cleanInp(light.z, lightControl.zinp.value())).normalize()
    lightColour = [cleanInp(lightColour[0], lightControl.rinp.value()),
                   cleanInp(lightColour[1], lightControl.ginp.value()),
                   cleanInp(lightColour[2], lightControl.binp.value())]
    updated.lighting = true
}

// default to current value if input invalid, or return the input as a number if it is
let cleanInp = (current, input) => (isNaN(input) || input == "") ? current : Number(input)

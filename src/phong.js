
// the UI elements
var phongToggle
var ambinps
var specinps
var specPowInp
var updatePhongButton
var resetPhongButton
var phongControls

let initPhong = () => {
    // set phong shader to initial values
    resetPhong()

    // the chcekbox to toggle phong shading
    phongToggle = createCheckbox('Phong Shading', false)
    phongToggle.position(0, 10)
    phongToggle.changed(togglePhong)

    // container div so all the controls can be shown or hidden at the same time easily
    phongControls = createDiv()

    let offx = 140

    createDiv("Specular Ambience (0-255)").size(200, 20).position(offx, 5).parent(phongControls)
    ambinps = genInps(specAmb, offx)

    createDiv("Specular Colour (0-255)").size(200, 20).position(offx + 250, 5).parent(phongControls)
    specinps = genInps(specCol, offx + 250)

    createDiv('Pow').size(30, 20).position(630, 5).parent(phongControls)
    specPowInp = createInput(specPow).parent(phongControls)
    specPowInp.position(630, 25)

    resetPhongButton = createButton("Reset to Default").parent(phongControls)
    resetPhongButton.position(specPowInp.width + 640, 5)
    resetPhongButton.mousePressed(resetPhong)

    updatePhongButton = createButton("Update Lighting").parent(phongControls)
    updatePhongButton.position(specPowInp.width + 640, 25)
    updatePhongButton.mousePressed(updatePhong)
    
    togglePhong() // make sure display is set correctly for initial value
}

// shows or hides the phong controls as appropriate, tells the draw function to redraw everything
let togglePhong = () => {
    phongControls.style("display", phongToggle.checked() ? "block" : "none")
    updated.lighting = true
}

// generate text input with labels for R, B and G
let genInps = (vals, offx) => {
    let labels = ["R", "G", "B"], lw = 15
    let inps = vals.map(e => createInput(e).parent(phongControls))
    inps.forEach((e, i) => { e.position(lw + offx + i * 80, 25); 
        createDiv(labels[i]).size(lw, 25).position(offx + i * 80, 25).parent(phongControls); })
    return inps
}

// set phong values to the input values - defaults to current values if input missing or invalid
let updatePhong = () => {
    specAmb = specAmb.map((e, i) => cleanInp(e, ambinps[i].value()))
    specCol = specCol.map((e, i) => cleanInp(e, specinps[i].value()))
    specPow = cleanInp(specPow, specPowInp.value())
    updated.lighting = true
}

// set phong to default values
let resetPhong = () => {
    specAmb = [40, 30, 20]
    specCol = [25, 20, 15]
    specPow = 100
    updated.lighting = true
}

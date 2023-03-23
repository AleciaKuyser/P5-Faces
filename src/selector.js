
// UI elements
var refSelector
var prevButton
var posSelector
var changeRefButton
var selContainer

// index of preview face
var prev

// create the UI elements for selecting other faces, and set the centrepoint for the preview
let initSelector = () => {

    // the container for the selector UI elements - everything else is positioned relative to this
    selContainer = createDiv().position(w / 2 + offsx / 2, offh / 16).size(offw * 0.55, 150).id("selContainer")

    // dropdown menu to select from 1 to 199
    createDiv("Load New Face").parent(selContainer)
    refSelector = createSelect().parent(selContainer)
    for (let i = 1; i <= 199; i++)  refSelector.option(i)

    // button to see preview of face (since it will take a while to load and render)
    prevButton = createButton("Show Preview").parent(selContainer)
    prevButton.mouseClicked(createPreview)

    // dropdown to select face left, right or bottom
    createDiv("Replace Reference Face").parent(selContainer).id("smaller")
    posSelector = createSelect().parent(selContainer)
    posSelector.option("left")
    posSelector.option("right")
    posSelector.option("bottom")

    // button to update reference faces
    changeRefButton = createButton("Replace").parent(selContainer)
    changeRefButton.mouseClicked(updateRef)
}

// load the face and tell the draw function to draw the loaded face
let createPreview = () => {
    prev = refSelector.value()
    postLoad(prev)
    updated.preview = true
}

// load the face and set the appropriate reference face to the new face
let updateRef = () => {
    let ref = refSelector.value()
    let i = posToI(posSelector.value())
    refFaces[i] = ref
    postLoad(ref)
    updated.refs[i] = true
}

// convert the label to an index
let posToI = (pos) => {
    switch(pos) {
        case "left"  : return 0
        case "right" : return 1
        case "bottom": return 2
    }
}

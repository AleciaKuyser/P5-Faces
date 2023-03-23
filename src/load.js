
// wrapper function for loadTable that fills in the path and format
let loadFile = (name, callback) => loadTable(`data/${name}.csv`, 'csv', callback)

// load nth file with given 
let loadNFile = (prefix, n, callback) => loadFile(`${prefix}_${zerofill(n)}`, callback)

// load files with the given prefix up to n
let iterLoadFile = (prefix) => {
    let arr = []
    for (let i = 1; i <= 3; i++)    arr[i] = loadNFile(prefix, i)
    return arr
}

// prepen the number with the correct number of 0s
let zerofill = (num) => str(num).length < 3 ? zerofill(`0${str(num)}`) : num

var scaleFactor = (500000) / (h < w ? h : w)

// converts the tables within the data structures to vector arrays
let convertTables = () => {
    // make a vector list from the table and assign it to the letiable
    mesh = tableToArrays(mesh)
    mesh = mesh.map(e => e.map(e => e - 1)) // fix it to index from 0
    sh_ev = tableToNums(sh_ev)
    tx_ev = tableToNums(tx_ev)

    sh_av = tableToVectors(sh_av)
    tx_av = tableToArrays(tx_av)

    for (let i = 1; i <= 3; i++) {
        // mutates tables into vector arrays
        sh_n[i] = tableToVectors(sh_n[i])
        sh_loaded[i] = true
        // mutates tables into colour arrays
        tx_n[i] = tableToArrays(tx_n[i])
        tx_loaded[i] = true
    }
}

// converts a table into a list of vector arrays, normalized to diam
// returns the new list, as this cannot be done through mutation
let tableToVectors = (table) => table.getRows().map(e => createVector(e.get(0), e.get(1), e.get(2)).div(scaleFactor))

// converts a table into a 2D array
// arrays are an effective representation of color, as they can be unrolled to act as the arguments to the color function
let tableToArrays = (table) => table.getRows().map(e => [Number(e.get(0)), Number(e.get(1)), Number(e.get(2))])

// for the weights, we just want the first number in each row
let tableToNums = (table) => table.getRows().map(e => Number(e.get(0)))

// the index of the data curretly being loaded
var loading

// load the data for "n" during runtime
let postLoad = (n) => {
    // if we're currently loading, or already have, don't start loading again
    if (loading == n || (sh_loaded[n] && tx_loaded[n])) return
    sh_loaded[n] = tx_loaded[n] = false
    loading = n
    loadNFile('sh', n, postSh)
    loadNFile('tx', n, postTx)
}

let postSh = (table) => {
    sh_n[loading] = tableToVectors(table)
    sh_loaded[loading] = true 
}

let postTx = (table) => {
    tx_n[loading] = tableToArrays(table)
    tx_loaded[loading] = true
}

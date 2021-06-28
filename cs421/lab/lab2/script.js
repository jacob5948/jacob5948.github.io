window.onload = init
var firstNumber = 0
var secondNumber = 0
var operation = ""
var isFirst = true 
var isRepeating = false
var operationActive = false

function init() {
    var display = document.getElementById("display")
}

function calc(x) {
    if (typeof(x) === "number") {
        if (["0", "NaN", "", "Infinity"].includes(display.value)) {
            show(x)
        } else {
            if(isFirst && operation != "") {
                show(x)
                isFirst = false
                clearHighlight()
            } else {
                append(x)
            }
        }
    } else {
        switch (x) {
            case "ac":
                isRepeating = false
                show(0)
                firstNumber = 0
                secondNumber = 0
                isFirst = true
                isRepeating = false
                operation = ""
                clearHighlight()
                break
            case ".":
                if(!display.value.includes(".")) {
                    append(".")
                }
                break
            case "sign":
                if(display.value.includes("-")) {
                    show(display.value.replace("\-",""))
                } else {
                    if (!(["0", "NaN", "", "Infinity"].includes(display.value))) {
                        show("-" + display.value)
                    }
                }
                break
            case "square":
                show(getValue() ** 2)
                isFirst = true
                firstNumber = getValue()
                break
            case "sqrt":
                show(Math.sqrt(getValue()))
                isFirst = true
                firstNumber = getValue()
                break
            case "divide":
            case "multiply":
            case "subtract":
            case "add":
                operationSetup(x)
                break
            case "equals":
                if (!isRepeating) {
                    secondNumber = getValue()
                    isRepeating = true
                }
                isFirst = true
                switch (operation) {
                    case "divide":
                        show(firstNumber / secondNumber)
                        break
                    case "multiply":
                        show(firstNumber * secondNumber)
                        break
                    case "subtract":
                        show(firstNumber - secondNumber)
                        break
                    case "add":
                        show(firstNumber + secondNumber)
                        break
                    default:
                        break
                }
                firstNumber = getValue()
                break
            default:
                break
        }
    }
}

function clearHighlight() {
    operationActive = false
    var active = document.getElementsByClassName("operatorActive")
    for (let i = 0; i < active.length; i++) {
        const element = active[i];
        element.className = "operator"
    }
}

function highlight(op) {
    clearHighlight()
    var element = document.getElementById(op)
    element.className = "operatorActive"
    operationActive = true
}

function operationSetup(op) {
    if (operation && !isRepeating & !operationActive) {
        calc("equals")
    }
    isRepeating = false
    operation = op
    highlight(op)
    if (isFirst) {
        firstNumber = getValue()
        secondNumber = 0
        //isFirst = false
        //show(0)
    }
}

function getValue() {
    return Math.round((parseFloat(display.value) * 100)) / 100
}

function show(x){
    display.value = x.toString()
}

function append(x) {
    if (display.value == "NaN") {
        show("0" + x.toString())
    } else {
        show(display.value + x.toString())
    }
}

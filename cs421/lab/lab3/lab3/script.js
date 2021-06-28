window.onload = () => {
    $('#weight_kg').on('input', KgToLbs);
    $('#distance_km').on('input', KmToMiles);
    $('#temp_f').on('input', FToC)
}

function KgToLbs() {
    let input = parseFloat(document.getElementById("weight_kg").value);

    let msg = document.getElementById("weight_msg");
    let result = document.getElementById("weight_lb");

    result.value = "";
    msg.innerHTML = "";

    if (input === "" || isNaN(input)) {
        msg.innerHTML = "Provide a valid weight!";
    } else if (input < 1) {
        msg.innerHTML = "Provide a weight greater than 0!";
    } else { 
        let lbs = (input * 2.205);
        result.value = lbs.toFixed(2);
    }
}

function KmToMiles() {
    let input = parseFloat(document.getElementById("distance_km").value);

    let msg = document.getElementById("distance_msg");
    let result = document.getElementById("distance_mi");

    result.value = "";
    msg.innerHTML = "";

    if (input === "" || isNaN(input)) {
        msg.innerHTML = "Provide a valid distance!";
    } else if (input < 1) {
        msg.innerHTML = "Provide a distance greater than 0!";
    } else { 
        let mi = (input / 1.609);
        result.value = mi.toFixed(2);
    }
}

function FToC() {
    let input = parseFloat(document.getElementById("temp_f").value);

    let msg = document.getElementById("temp_msg");
    let result = document.getElementById("temp_c");

    result.value = "";
    msg.innerHTML = "";

    if (input === "" || isNaN(input)) {
        msg.innerHTML = "Provide a valid temperature!";
    } else { 
        let c = (input - 32) * (5/9);
        result.value = c.toFixed(2);
    }
}
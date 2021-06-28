window.onload = () => {
    $('#weight_kg').on('input', KgToLbs);
    $('#weight_lb').on('input', LbsToKg)
    $('#distance_km').on('input', KmToMiles);
    $('#distance_mi').on('input', MilesToKm);
    $('#temp_f').on('input', FToC)
    $('#temp_c').on('input', CToF)
}

function KgToLbs() {
    let input = parseFloat($("#weight_kg").val());

    let msg = $("#weight_msg");
    let result = $("#weight_lb");

    result.val("");
    msg.text("");

    if (input === "" || isNaN(input)) {
        msg.text("Provide a valid weight!");
    } else if (input < 1) {
        msg.text("Provide a weight greater than 0!");
    } else { 
        let lbs = (input * 2.205);
        result.val(lbs.toFixed(2));
    }
}

function LbsToKg() {
    let input = parseFloat($("#weight_lb").val());

    let msg = $("#weight_msg");
    let result = $("#weight_kg");

    result.val("");
    msg.text("");

    if (input === "" || isNaN(input)) {
        msg.text("Provide a valid weight!");
    } else if (input < 1) {
        msg.text("Provide a weight greater than 0!");
    } else { 
        let lbs = (input / 2.205);
        result.val(lbs.toFixed(2));
    }
}

function KmToMiles() {
    let input = parseFloat($("#distance_km").val());

    let msg = $("#distance_msg");
    let result = $("#distance_mi");

    result.val("");
    msg.text("");

    if (input === "" || isNaN(input)) {
        msg.text("Provide a valid distance!");
    } else if (input < 1) {
        msg.text("Provide a distance greater than 0!");
    } else { 
        let mi = (input / 1.609);
        result.val(mi.toFixed(2));
    }
}

function MilesToKm() {
    let input = parseFloat($("#distance_mi").val());

    let msg = $("#distance_msg");
    let result = $("#distance_km");

    result.val("");
    msg.text("");

    if (input === "" || isNaN(input)) {
        msg.text("Provide a valid distance!");
    } else if (input < 1) {
        msg.text("Provide a distance greater than 0!");
    } else { 
        let mi = (input * 1.609);
        result.val(mi.toFixed(2));
    }
}

function FToC() {
    let input = parseFloat($("#temp_f").val());

    let msg = $("#temp_msg");
    let result = $("#temp_c");

    result.val("");
    msg.text("");

    if (input === "" || isNaN(input)) {
        msg.text("Provide a valid temperature!");
    } else { 
        let c = (input - 32) * (5/9);
        result.val(c.toFixed(2));
    }
}

function CToF() {
    let input = parseFloat($("#temp_c").val());

    let msg = $("#temp_msg");
    let result = $("#temp_f");

    result.val("");
    msg.text("");

    if (input === "" || isNaN(input)) {
        msg.text("Provide a valid temperature!");
    } else { 
        let c = (input * 9/5) + 32;
        result.val(c.toFixed(2));
    }
}
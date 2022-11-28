let isLoading = false;
var warning;

window.onload = () => {
    $('#run_btn').on('click', getInfo)
    $('#serviceTagEntry').submit(function () {
        if (!isLoading) getInfo();
        return false;
    });
    warning = document.getElementById('warning')
}

function getInfo() {
    let st = document.getElementById('servicetag').value
    
    warning.style.display = "none"
    warning.innerHTML = "Error"
    hideText()
    
    //TODO: check warning design
    if (!/[A-Z\d]{7}/.test(st)) {
        warning.style.display = "initial"
        warning.innerHTML = "Invalid Service Tag format"
    } else {
        console.log("running")
        let request = new XMLHttpRequest();
        request.open('GET', `https://api.iamnotstin.me/get/${st}`)
        request.send();
        loading()
        request.on
        request.onload = () => {
            stopLoading()
            if (request.status == 200) {
                let info = JSON.parse(request.response)
                let output = `System Manufacturer: Dell<br>
System Model: ${info.model}<br>
Processor: ${info.cpu}<br>
RAM: ${info.ram}<br>
Drive Space and Type: ${info.storage}<br>
System Service Tag/Serial Number: ${info.st}<br>
Year Manufactured: ${info.mfg_date}<br>
Screen size: ${info.screen}<br>
<br>
User's Blazer ID: < ENTER USER'S BLAZER ID ><br>
If non standard system, enter notes here:`
                showText(output)
                //document.getElementById('result').value = request.response
            } else if (request.status == 403) {
                showText("Access denied, make sure you are on VPN or on UAB network")
            } else {
                showText("An error occurred :(")
            }
            $("#result_card").css('display', 'flex')
        }
        request.onerror = () => {
            stopLoading()
            showText("An error occurred :(")
        }
    }
}

function loading() {
    isLoading = true;
    $('#run_btn').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>  Loading...').addClass('disabled');
}

function stopLoading() {
    isLoading = false;
    $('#run_btn').html('Run').removeClass('disabled')
}

function showText(text) {
    $("#result").html(text)
    $("#result_card").css('display', 'flex')
}

function hideText() {
    $("#result").html("")
    $("#result_card").css('display', 'none')
}
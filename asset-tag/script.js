window.onload = () => {
    $('#run_btn').on('click', getInfo)
    let warning = document.getElementById('warning')
}

function getInfo() {
    let st = document.getElementById('servicetag').value
    
    warning.style.display = "none"
    warning.innerHTML = "Error"
    $("#result_card").css('display', 'none')
    //TODO: check warning design

    if (!/(?=([a-zA-Z]+\d[a-zA-Z\d]+|\d+[a-zA-Z][a-zA-Z0-9]+))[a-zA-Z0-9]{7}/.test(st)) {
        warning.style.display = "initial"
        warning.innerHTML = "Invalid Service Tag format"
    } else {
        console.log("running")
        let request = new XMLHttpRequest();
        request.open('GET', `https://50.116.33.115:5000/get/${st}`)
        request.send();
        loading()
        request.on
        request.onload = () => {
            stopLoading()
            if (request.status == 200) {
                $("#result").text(request.response)
                //document.getElementById('result').value = request.response
            } else if (request.status == 403) {
                $("#result").text("Access denied, make sure you are on VPN or on UAB network")
            } else {
                $("#result").text(`An error occurred :(`)
            }
            $("#result_card").css('display', 'flex')
        }
    }
}

function loading() {
    $('#run_btn').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>  Loading...').addClass('disabled');
}

function stopLoading() {
    $('#run_btn').html('Run').removeClass('disabled')
}
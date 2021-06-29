window.onload = () => {
    $('#run_btn').on('click', getInfo)
    let warning = document.getElementById('warning')
}

function getInfo() {
    let st = document.getElementById('servicetag').value
    
    warning.style.display = "none"
    warning.innerHTML = "Error"

    if (!/(?=([a-zA-Z]+\d[a-zA-Z\d]+|\d+[a-zA-Z][a-zA-Z0-9]+))[a-zA-Z0-9]{7}/.test(st)) {
        warning.style.display = "initial"
        warning.innerHTML = "Invalid Service Tag format"
    } else {
        console.log("running")
        let request = new XMLHttpRequest();
        request.open('GET', `http://127.0.0.1:3000/get/${st}`)
        request.send();
        loading()
        request.onload = () => {
            stopLoading()
            document.getElementById('result').value = request.response
        }
    }
}

function loading() {
    $('#run_btn').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...').addClass('disabled');
}

function stopLoading() {
    $('#run_btn').html('Run').removeClass('disabled')
}
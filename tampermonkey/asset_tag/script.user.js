// ==UserScript==
// @name         Dell UAB IT Asset Tag
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Add a button to the dell pc view page to copy information in asset tag format
// @author       Jacob Ellis
// @match        https://www.dell.com/support/home/en-us/product-support/servicetag/*
// @icon         https://www.google.com/s2/favicons?domain=dell.com
// @grant        none
// ==/UserScript==

function waitForJquery() {
    return new Promise(resolve => {
        var i = setInterval(() => {
            if (window.jQuery) {
                clearInterval(i)
                resolve(window.jQuery)
            }
        }, 200)
    })
}

(async function() {
    'use strict';
    const $ = await waitForJquery()

    // https://stackoverflow.com/a/61511955
    function waitForElem(sel) {
        return new Promise(resolve => {
            if ($(sel).length) {
                return resolve($(sel));
            }
            const observer = new MutationObserver(mutations => {
                if ($(sel).length) {
                    resolve($(sel));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // https://stackoverflow.com/a/30810322
    function copyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        $(textArea).css('position: fixed; top: 0; left: 0; width: 2em; height: 2em; padding: 0; border: none; outline: none; boxShadow: none; background: transparent;')
        $(textArea).val(text)
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert("Asset tag request body has been copied to the clipboard")
        } catch (err) {
            alert(`Unable to copy to the clipboard. Please copy this manually:

${text}`)}

        document.body.removeChild(textArea);
    }

    async function getTagFormat() {
        var info = {
            cpu: "N/A",
            ram: "N/A",
            screen: "N/A",
            storage: "N/A",
            model: "N/A",
            mfg_date: "N/A",
            blazerid: "N/A"
        };
        info.blazerid = prompt("Please enter the user's BlazerID");
        info.model = $('#model_number').text();
        info.st = $('.service-tag')[0].innerText.slice(13)

        let e_viewWarranty = await waitForElem('#quicklink-sysconfig')
        e_viewWarranty.click()

        let conf_elems = await waitForElem('.card div  span.font-weight-medium.text-jet.pr-4')
        $.each(conf_elems, (i, el) => {
            let text = el.innerText
            console.log(`Processing row: ${text}`)

            //CPU
            if (/i[357]/i.test(text)) {
                info.cpu = /i[357]/i.exec(text)[0].toLowerCase()
                console.log(`Detected CPU: ${info.cpu}`)
            // storage / ram (test for a GB or TB number, could be described a G or T)
            } else if (/\d+(\.\d+)?[MGT]B?/i.test(text)) {
                //get GB or TB number
                let raw_value_arr = /(\d+)(\.\d+)?([MGT]B?)/i.exec(text)
                let value = raw_value_arr[1] + raw_value_arr[3].toUpperCase()
                console.log(`Detected Storage/RAM: ${value}`)
                // as "B" if last letter of storage value is M, G, or T (360G -> 360GB, 1T -> 1TB etc)
                if (value[value.length - 1] != "B") {
                    value += "B"
                }
                //RAM (if DDR\d or DIMM found in item)
                if (/DDR\d|DIMM/i.test(text)) {
                    info.ram = value
                    console.log(`Detected RAM: ${info.ram}`)
                    //SSD (if M.2 or NVMe found)
                    //TODO: Make sure SATA ssds are found
                } else if (/M\.2|NVMe|SSD/i.test(text)) {
                    info.storage = value + " SSD"
                    console.log(`Detected SSD: ${info.storage}`)
                    //HDD (if 2.5/3.5, \d{4}RPM, Hard Drive, or HDD found)
                } else if (/2\.5|3\.5|\d{4}RPM|Hard Drive|HDD/i.test(text)) {
                    info.storage = value + " HDD"
                    console.log(`Detected HDD: ${info.storage}`)
                }
            //Screen (if \d\d\.?\d?" or \d\d\.?\d?'' found)
            } else if (/\d\d\.?\d?(?="|'')/.test(text)) {
                info.screen = /\d\d\.?\d?(?="|'')/.exec(text)[0] + "\""
            }
        })

        // close sys config card
        $('#configurationDetailsPopup .close').click()

        // open warranty card
        let e_warranty_link = await waitForElem('#warranty-card .viewdetails')
        e_warranty_link.click()

        //get mfg date
        let e_mfg_date = await waitForElem('#shippingDateLabel')
        info.mfg_date = /20\d\d/.exec(e_mfg_date.text())

        //close warranty card
        $('#warranty-cancel').click()

        return info
    }

    var i = setInterval(() => {
        if (!$('#script_run').get(0)) {
            // add button
            let e_productTitle = $('.product-info').first().children().first();
            let hs_table = 
`<table>
    <tr>
        <td id="model_number">${e_productTitle.text()}</td>
        <td><button class="ml-4 my-auto btn btn-primary" id="script_run">Get Asset Tag Info</button></td>
    </tr>
</table>`;
            e_productTitle.html(hs_table);
            $('#script_run').click(async () => {
                let info = await getTagFormat();
                let output = 
`System Manufacturer: Dell
System Model: ${info.model}
Processor: ${info.cpu}
RAM: ${info.ram}
Drive Space and Type: ${info.storage}
System Service Tag/Serial Number: ${info.st}
Year Manufactured: ${info.mfg_date}
Screen size: ${info.screen}

User's Blazer ID: ${info.blazerid ? info.blazerid : "< ENTER BLAZERID HERE >"}
If non standard system, enter notes here:`;
                copyTextToClipboard(output);
            })
        } else {
            clearInterval(i)
        }
    }, 200);
})();
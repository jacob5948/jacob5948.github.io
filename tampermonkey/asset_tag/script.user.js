// ==UserScript==
// @name         Dell UAB IT Asset Tag
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button to the dell pc view page to copy information in asset tag format
// @author       Jacob Ellis
// @match        https://www.dell.com/support/home/en-us/product-support/servicetag/*
// @icon         https://www.google.com/s2/favicons?domain=dell.com
// @grant        none
// ==/UserScript==
function copyToClipboard(s) {
    //TODO
}

(async function($) {
    'use strict';

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
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
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
            cpu: "n/a",
            ram: "n/a",
            screen: "n/a",
            storage: "n/a",
            model: "n/a",
            mfg_date: "n/a"
        };
        info.model = $('#model_number').text();
        info.st = $('.service-tag')[0].innerText.slice(13)
        //waitForElem($, '#quicklink-sysconfig', () => {
        //    $('#quicklink-sysconfig').click()
        //    console.log('get got')
        //})
        let e_viewWarranty = await waitForElem('#quicklink-sysconfig')
        e_viewWarranty.click()

        let conf_elems = await waitForElem('.card div  span.font-weight-medium.text-jet.pr-4')
        $.each(conf_elems, (i, el) => {
            let text = el.innerText

            //CPU
            if (/i[357]/i.test(text)) {
                info.cpu = /i[357]/i.exec(text)[0].toLowerCase()
            }

            // storage / ram (test for a GB or TB number, could be described a G or T)
            if (/\d+[MGT]B?/i.test(text)) {
                //get GB or TB number
                let value = /\d+[MGT]B?/i.exec(text)[0].toUpperCase()
                // as "B" if last letter of storage value is M, G, or T (360G -> 360GB, 1T -> 1TB etc)
                if (value[value.length - 1] != "B") {
                    value += "B"
                }
                //RAM (if DDR\d or DIMM found in item)
                if (/DDR\d|DIMM/i.test(text)) {
                    info.ram = value
                    //SSD (if M.2 or NVMe found)
                    //TODO: Make sure SATA ssds are found
                } else if (/M\.2|NVMe|SSD/i.test(text)) {
                    info.storage = value + " SSD"
                    //HDD (if 2.5/3.5, \d{4}RPM, Hard Drive, or HDD found)
                } else if (/2\.5|3\.5|\d{4}RPM|Hard Drive|HDD/i.test(text)) {
                    info.storage = value + " HDD"
                }
            }

            //Screen (if \d\d\.?\d?" or \d\d\.?\d?'' found)
            if (/\d\d\.?\d?(?="|'')/.test(text)) {
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

    // add button
    let e_productTitle = $('.product-info').first().children().first();
    let hs_table = `<table>
    <tr>
        <td id="model_number">${e_productTitle.text()}</td>
        <td><button class="ml-4 my-auto btn btn-primary" id="script_run"><i class="bi bi-check"></i>Get Asset Tag Info</button></td>
    </tr>
</table>`
    e_productTitle.html(hs_table);
    $('#script_run').click(async () => {
       let info = await getTagFormat()
       let output = `System Manufacturer: Dell
System Model: ${info.model}
Processor (ex. i7, i5, etc.): ${info.cpu}
RAM (ex. 16GB): ${info.ram}
Drive Space and Type (ex. 512GB Hybrid): ${info.storage}
System Service Tag/Serial Number: ${info.st}
Year Manufactured: ${info.mfg_date}
Screen size: ${info.screen}
User's Blazer ID: <BLAZERID>
If non standard system, enter notes here:`
       copyTextToClipboard(output);
    })
})(window.$);
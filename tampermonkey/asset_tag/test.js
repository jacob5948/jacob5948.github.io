if (/i[3579]/i.test(text)) {
    info.cpu = /i[3579]/i.exec(text)[0].toLowerCase()
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

var os = require('os');
var fs = require('fs');
var jimp = require('jimp');
var QRCode = require('qrcode');
var ifaces = os.networkInterfaces();

function getIp() {
    let addr = [];
    Object.keys(ifaces).reduce(function(addr, cur) {
        let items = ifaces[cur];
        for (const item of items) {
            if (item.family == 'IPv4' && item.internal == false) {
                addr.push(item.address);
            } 
        }
    }, addr);
    return addr;
}

function getURLString(addr, id, title, text) {
    return `https://${addr}/display/0?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}`;
}

async function main(args) {
    if (args[0] == "-h" || args[0] == "--help") {
        console.log("Usage: generate <Title> <Text> <id> <path_to_file>");
    }
    let [title, text, id, path] = args;
    let addr = "ec2-35-156-172-68.eu-central-1.compute.amazonaws.com:3000";//getIp()[0];
    await QRCode.toFile(
        path+".tmp", 
        getURLString(addr, id, title, text),
        {scale: 16, errorCorrectionLevel: 'H'}
        );
    
    const code = await jimp.read(path+".tmp");
    let patt = await jimp.read('src/html/img/pattern.png');
    let [cw, ch] = [code.getWidth(), code.getHeight()];
    patt = patt.scaleToFit(cw * 0.3, ch * 0.3);
    let [bw, bh] = [patt.getWidth(), patt.getHeight()];
    code.blit(patt, cw / 2 - bw / 2, ch / 2 - bh / 2).write(path);
    fs.unlinkSync(path+".tmp");
}

main(process.argv.slice(2));
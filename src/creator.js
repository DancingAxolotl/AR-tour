const fs = require('fs');
const page = fs.readFileSync('./src/html/creator.html', 'utf8');

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function getNextId() {
    let id = 0;
    while(id < 1000 && fs.existsSync(`./src/html/img/${id}`)) {
        id++;
    }
    if(!fs.existsSync(`./src/html/img/${id}`)) {
        fs.mkdirSync(`./src/html/img/${id}`);
    }
    return id;
}

function creator(query) {
    let {id} = query;
    if (id === undefined) {
        id = getNextId();
    }
    let tmp = replaceAll(page, '<!-- {image1} -->', `img/${id}/1.png`);
    tmp = replaceAll(tmp, '<!-- {image2} -->', `img/${id}/2.png`);
    tmp = replaceAll(tmp, '<!-- {image3} -->', `img/${id}/3.png`);
    tmp = replaceAll(tmp, '<!-- {id} -->', `${id}`);
    return tmp;
}

module.exports = { 
    creator
};
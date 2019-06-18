const fs = require('fs');
const page = fs.readFileSync('src/html/ar.html', 'utf8');

let displayFactory = [];

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

const BasicDisplay = {
    init(query) {
        let {title, text, id} = query;
        title = title.slice(0,8);
        let text1 = text.slice(0, 14);
        let text2 = text.slice(14, 28);
        let tmp = replaceAll(page, '<!-- {id} -->', id);
        return tmp.replace("<!-- {titleValue} -->", title).replace("<!-- {textValue1} -->",text1).replace("<!-- {textValue2} -->",text2);
    }
}

function init() {
    displayFactory.push(BasicDisplay);
}

function getDisplay(displayId) {
    console.log("Getting display " + displayId);
    return displayFactory[displayId];
}

init();

module.exports = {
    getDisplay
};

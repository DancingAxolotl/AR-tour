const express = require('express');
const fs = require('fs');
const https = require('https');
const markers = require('./markers');
const {creator} = require('./creator');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.body.id) {
            cb(null, `./src/html/img/${req.body.id}`);
        }
    },
    filename: function (req, file, cb) {
        let id = 1;
        while(id < 4 && fs.existsSync(`./src/html/img/${req.body.id}/${id}.png`)) {
            id++;
        }
        cb(null, `${id}.png`)
    }
});
const upload = multer({storage: storage});

const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const app = express();

function welcome(req, res) {
    res.send("Welcome");
}

app.get('/', welcome);
app.get('/welcome', welcome);
app.use(express.static('src/html'))

// localhost/display/0?id=0&title=hello&arrow=left&text=sample+text
app.get('/display/:markerId', function(req, res) {
    try {
        let display = markers.getDisplay(req.params.markerId).init(req.query);
        res.send(display);
    } catch (ex) {
        console.error(ex);
        res.status(404).send("Display not found: " + req.params.markerId);
    }
});

app.get('/create', function(req, res) {
    try {
        res.send(creator(req.query));
    } catch (ex) {
        console.error(ex);
        res.status(400).send("There was an error: " + ex);
    }
});

app.post('/create/upload', upload.array('images', 3), function (req, res, next) {
    try {
        res.redirect(`/create?id=${req.body.id}`);
    } catch (ex) {
        console.error(ex);
        res.status(400).send("There was an error: " + ex);
    }
});

console.log("Server starting...");
https.createServer(credentials, app).listen(443);

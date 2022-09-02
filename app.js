var express = require('express');
var path = require('path');
//var cookieParser = require("cookie-parser");
var logger = require('morgan');

//var indexRouter = require("./routes/index");
//var usersRouter = require("./routes/users");

var app = express();

app.use(logger('dev'));
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));

//app.use(express.json({limit: "1000MB"}));
//app.use(express.urlencoded({ extended: false, limit: "1000MB" }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));

//app.use("/", indexRouter);
//app.use("/users", usersRouter);
app.get('/', function (req, res) {
    return res.status(200).send('you made it!');
});
// Testing without body parser!
app.put('/upload', function (req, res) {
    var size = 0;

    var gotData = function (d) {
        size += d.length; // add this chunk's size to the total number of bytes received thus far
        console.log('upload chunk', size);
        // if (size > 1000000) {
        //     console.log('aborting request');
        //     req.removeListener('data', gotData); // we need to remove the event listeners so that we don't end up here more than once
        //     req.removeListener('end', reqEnd);
        //     res.header('Connection', 'close'); // with the Connection: close header set, node will automatically close the socket...
        //     res.send(413, 'Upload too large'); // ... after sending a response
        //     // return res.redirect(307, 'https://polar-horse-responsibility.glitch.me/');
        // }
    };

    var reqEnd = function () {
        res.send('ok, got ' + size + ' bytes');
    };

    req.on('data', gotData);

    req.on('end', reqEnd);
});

app.put('/api/files', express.raw({limit: '1mb', type: '*/*'}), (req, res) => {
    const receivedSize = Buffer.byteLength(req.body);
    console.log('in PUT `api/files/`', receivedSize);
    return res.status(200).send(`PUT ok! - ${receivedSize} Bytes received`);
});

app.put('/api/filesx', (req, res) => {
    express.raw({limit: '1mb', type: '*/*'})(req, res, (err) => {
        console.log('we got error from raw body parser!', err);
        // return res.status(500).send('ERR!');
        return res.redirect(307, 'https://polar-horse-responsibility.glitch.me/');
    });

    // const receivedSize = Buffer.byteLength(req.body);
    // console.log('in PUT `api/files/`', receivedSize);
    // return res.status(200).send(`PUT ok! - ${receivedSize} Bytes received`);
    // return res.status(200).send('PUT file ok less them 1mb!');
    console.log('are we here yet?');
});

app.put(
    '/api/filesy',
    (req, res, next) => {
        express.raw({limit: '1kb', type: '*/*'})(req, res, (err) => {
            if (err) {
                console.log('we got error from raw body parser!', err);
                // return res.status(500).send('ERR!');
                res.header('Connection', 'close');
                return res.redirect(307, 'https://polar-horse-responsibility.glitch.me/');
            }

            console.log('express.raw no error passed');
            next();
        });

        // const receivedSize = Buffer.byteLength(req.body);
        // console.log('in PUT `api/files/`', receivedSize);
        // return res.status(200).send(`PUT ok! - ${receivedSize} Bytes received`);
        // return res.status(200).send('PUT file ok less them 1mb!');
    },
    (req, res) => {
        console.log('are we here yet?');
        return res.status(200).send('filesy PUT ok!');
    }
);

app.use(function (err, req, res, next) {
    if (err && err.type === 'entity.too.large') {
        console.log('we are in err middleware!');
        // console.log(err);

        //res.status(<your status code>).send(<your response>);
        res.status(413).send('File Size is too big!');
    } else {
        next(err);
    }
});

var listener = app.listen(process.env.PORT || 8080, function () {
    console.log('Listening on port ' + listener.address().port);
});

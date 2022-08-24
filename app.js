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

app.put('/api/files', express.raw({limit: '1gb', type: '*/*'}), (req, res) => {
    const receivedSize = Buffer.byteLength(req.body);
    console.log('in PUT `api/files/`', receivedSize);
    return res.status(200).send(`PUT ok! - ${receivedSize} Bytes received`);
});

app.use(function (err, req, res, next) {
    if (err && err.type === 'entity.too.large') {
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

var express = require("express");
var path = require("path");
//var cookieParser = require("cookie-parser");
var logger = require("morgan");

//var indexRouter = require("./routes/index");
//var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

//app.use(express.json({limit: "1000MB"}));
//app.use(express.urlencoded({ extended: false, limit: "1000MB" }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));

//app.use("/", indexRouter);
//app.use("/users", usersRouter);

app.put("/api/files", express.raw({limit: '50mb'}), (req, res) => {
  console.log('in PUT `api/files/`');
  return res.status(200).send('PUT ok!');
});

var listener = app.listen(process.env.PORT || 8080, function () {
  console.log("Listening on port " + listener.address().port);
});

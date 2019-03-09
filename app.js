const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload')
const crypto = require("crypto");
const { Pool, Client } = require('pg')
const appConfig = require('config').get('app')
const dbConfig = require('config').get('database')

const app = express();

app.use(session({
  secret: '7713e4e75c5b76235fcb189f2d06b889ffef3dc2147e685787d7ac8b5fc190b7',
  resave: false,
  httpOnly: false,
  SameSite: 'strict',
  name: 'connect.sid',
  saveUninitialized: true,
  cookie: { maxAge: 6.048e8 },
  store: new FileStore()
}))


global.routes = require('require-all')(path.join(__dirname, '/routes'));

const pool = new Pool(dbConfig);

global.pool = pool;
global.crypto = crypto;

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload())

app.use("/assets/css", express.static(path.join(__dirname, "assets/css")));
app.use("/assets/fonts", express.static(path.join(__dirname, "assets/fonts")));
app.use("/assets/img", express.static(path.join(__dirname, "assets/img")));
app.use("/assets/js", express.static(path.join(__dirname, "assets/js")));
app.use("/ace-builds/src-noconflict", express.static(path.join(__dirname, "assets/js/ace-builds/src-noconflict")));

if(appConfig.requireHttps)
  app.get("*", routes.https_redirect);

app.get("/", routes.dashboard.home);
app.get("/dashboard/home", routes.dashboard.home);
app.get("/team/register", routes.team.register);
app.get("/team/sign_in", routes.team.sign_in)
app.get("/challenges", routes.challenges);
app.get("/challenges/:id([1-9])", routes.challenges);
app.get("/about", routes.about)
app.get("/leader board", routes.leader_board)
app.get("*", routes.page_not_found);

app.post("/dashboard/home", routes.dashboard.home);
app.post("/team/register", routes.team.register);
app.post("/team/sign_in", routes.team.sign_in)
app.post("/challenges/:id([1-9])", routes.challenges);

app.listen(appConfig.port);

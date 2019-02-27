const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload')
const crypto = require("crypto");
const { Pool, Client } = require('pg')
const appConfig = require('config').get('app')
const dbConfig = require('config').get('database')

const app = express();

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

if(appConfig.requireHttps)
  app.get("*", routes.https_redirect);

app.get("/", routes.dashboard.home);
app.get("/dashboard/home", routes.dashboard.home);
app.get("/team/register", routes.team.register);
app.get("/challenges", routes.challenges);
app.get("/challenges/:id([1-9])", routes.challenges);
app.get("*", routes.page_not_found);

app.post("/dashboard/home", routes.dashboard.home);
app.post("/team/register", routes.team.register);
app.post("/challenges/:id([1-9])", routes.challenges);

app.listen(appConfig.port);

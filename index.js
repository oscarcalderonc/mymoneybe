"use strict";

const Koa = require("koa");
const Router = require('koa-router');
const logger = require("koa-logger");

const app = new Koa();
const router = new Router();

router.get("/carenalga", (ctx, next) => {
    ctx.body = "Eres tu";
    next();
    ctx.body += " siuuu";
});

router.get("/carenalga2", (ctx, next) => {
    ctx.body += "Otro carenalga";
});

router.get("/", (ctx, next) => {
    ctx.body = "Hello world";
});

app.use(router.routes())
    .use(router.allowedMethods());

app.use(logger());

const server = app.listen(process.env.SERVER_HTTP_PORT, () => {
    console.log(`Server started in port ${process.env.SERVER_HTTP_PORT}`);
});

module.exports = server;
const express = require("express");
const routes = express.Router();

const testes = require("../controller/testController");

routes.get("/", (request, response) => response.json({"message": "System is up!"}));


routes.post("/", testes.test);


module.exports = routes;
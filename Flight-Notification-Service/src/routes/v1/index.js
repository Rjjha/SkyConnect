const express = require("express");

const { InfoController, EmailController } = require("../../controllers");
const { TicketMiddleware } = require("../../middlewares");


const router = express.Router();

router.get("/info", InfoController.info);

router.post("/tickets",TicketMiddleware.validateCreateRequest, EmailController.create);

module.exports = router;

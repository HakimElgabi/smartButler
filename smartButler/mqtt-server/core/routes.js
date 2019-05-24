"use strict";
let express = require("express");
let router = express.Router();
const MqttControllerClass = require("../controllers/MqttController");
const MqttController = new MqttControllerClass();

/* DEBUG ROUTES */
router.get("/debug", (req, res) => {
  res.send({ req: req });
});

router.post("/voice-command", MqttController.voiceCommand);

module.exports = router;

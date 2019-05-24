"use strict";
let express = require("express");
let router = express.Router();
const VoiceController = require("../controllers/VoiceController");

/* DEBUG ROUTES */
router.get("/debug", (req, res) => {
  res.send({ req: req });
});

router.get("/", VoiceController.homepage);
router.get("/rooms/:id", VoiceController.roomControls);

router.post("/command", VoiceController.command);

module.exports = router;

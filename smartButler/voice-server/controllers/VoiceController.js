"use strict";
const Config = require("../server.config");
const axios = require("axios");

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('COM12', { baudRate: 9600 })

const parser = new Readline()
port.pipe(parser)

// port.write('ROBOT POWER ON\n')

class VoiceController {
  /**
   * Display homepage
   *
   * @param {import('express').request} req
   * @param {import('express').response} res
   */
  static async homepage(req, res) {
    res.render("homepage");
    return;
  }

  /**
   * Displays button for voice controls
   *
   * @param {import('express').request} req
   * @param {import('express').response} res
   */
  static async roomControls(req, res) {
    const roomId = req.params.id;

    res.render("roomControls", {
      roomId: roomId,
    });
    return;
  }

  /**
   * Extracts data from voice response and sends an api request to MQTT Server
   *
   * @param {import('express').request} req
   * @param {import('express').response} res
   */
  static async command(req, res) {
    const { room, msg } = req.body;
    let response = null;
    let mqttTopic;
    let mqttMsg;
    if (msg == 'Turning On Air Conditioner'){
      port.write('1\n');
    }
    else if (msg == 'Turning Off Air Conditioner'){
      port.write('0\n');
    }
    else {
    mqttTopic =
      room == "1" || room == "2"
        ? Config.registry.butlers[0].channel
        : Config.registry.butlers[1].channel;
        mqttMsg = `${room}:${msg}`;
    }


    try {
      // Forward data from voice command to mqtt server
      response = await axios.post(
        `${Config.registry.mqttServer.api}/voice-command`,
        {
          topic: mqttTopic,
          msg: mqttMsg,
        }
      );
    } catch (e) {
      console.log("Could not send command to mqtt server");
    }

    res.json({
      mqtt: {
        topic: mqttTopic,
        msg: mqttMsg,
      },
      response: response,
    });

    return;
  }
}

module.exports = VoiceController;

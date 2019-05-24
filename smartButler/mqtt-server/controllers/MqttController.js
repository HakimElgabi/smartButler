const MQTT = require("mqtt");
const Config = require("../server.config");
var mqtt;

class MqttController {
  constructor() {
    mqtt = MQTT.connect(Config.registry.mqttServer.broker);
  }

  async voiceCommand(req, res) {
    const { topic, msg } = req.body;

    let success = false;
    try {
      console.log(
        `Received voice command, emitting topic(${topic}) message(${msg})`
      );
      mqtt.publish(topic, msg);
      success = true;
    } catch (e) {
      console.log(e);
    }

    res.json({ success: success, topic: topic, msg: msg });
    return;
  }

  /**
   *
   * @param {string} msg Encoded message with room number and command
   */
  decodeCommand(msg) {
    let room = msg.substring(0, msg.indexOf(":"));
    let command = msg.substring(msg.indexOf(":") + 1, msg.length);

    return {
      room: room,
      command: command,
    };
  }
}

module.exports = MqttController;

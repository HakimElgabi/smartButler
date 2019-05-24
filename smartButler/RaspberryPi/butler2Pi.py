import paho.mqtt.client as mqtt 
import serial
MQTT_SERVER = "192.168.137.1"
MQTT_PATH = "butler2"

ser = serial.Serial(
        port='/dev/ttyUSB0',
        baudrate = 9600,
	parity=serial.PARITY_NONE,
 	stopbits=serial.STOPBITS_ONE,
 	bytesize=serial.EIGHTBITS,
 	timeout=1
)

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
        print("Connected with result code "+str(rc))
# Subscribing in on_connect() means that if we lose the connection and# reconnect then subscriptions will be renewed.
        client.subscribe(MQTT_PATH)
 
# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
        print("Room "+str(msg.payload))
        if '1' in str(msg.payload):
                ser.write('1')
        if '2' in str(msg.payload):
                ser.write('2')
        if '3' in str(msg.payload):
                ser.write('3')
	if '4' in str(msg.payload):
                ser.write('4')
	while 1:
		incomingByte = ""
		incomingByte = ser.readline()
		if("Journey" in incomingByte):
			print("Journey Complete, Returning to Desk")
			ser.write("5")
			break
    # more callbacks, etc

#def on_serial_message

#ser.isOpen()
 
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
 
client.connect(MQTT_SERVER, 1883, 60)
 

#while 1:
#	incomingByte = ser.read()
	#ser.close()
	#break

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()



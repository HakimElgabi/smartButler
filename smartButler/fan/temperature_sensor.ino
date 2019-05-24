#include <dht.h>
#include <LiquidCrystal.h>

dht DHT;
#define DHT11_PIN 7 // the pin which the humidifier/temp sensor is connected to
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
int motorPin= 9;
int incomingByte;
bool manualMode = false;


void setup() {
  // put your setup code here, to run once:
  pinMode(motorPin,OUTPUT);
  
  Serial.begin(9600);
  lcd.begin(16,2); 
  lcd.setCursor(0,0);
  //int chk = DHT.read11(DHT11_PIN);
  delay(1000);//Wait before accessing Senso 
}

void loop() {
  if (Serial.available() > 0) {
    incomingByte = Serial.read();
    if (incomingByte == '1') {
      manualMode = true;
      Serial.println("fan on");
      digitalWrite(motorPin, HIGH);
//      airconON();
    }
    if (incomingByte == '0') {
      manualMode = false;
      Serial.print("fan off");
      digitalWrite(motorPin, LOW);
//      airconOFF();
    }
  }
  int chk = DHT.read11(DHT11_PIN);
  moveCharsOnScreen(); 
  if(DHT.humidity>50 && !manualMode)
  {
    Serial.println("fan on");
    digitalWrite(motorPin, HIGH);
//    airconON();
  }
  else if (DHT.humidity<50 && !manualMode)
  {
      Serial.print("fan off");
      digitalWrite(motorPin, LOW);
//      airconOFF();
  }

  delay(1200);
  
}

void setDisplayVal(int outputVal)
{
  String t = "Humidity: ";
  String u = "%";
  lcd.print(t + outputVal + u); 
}

void moveCharsOnScreen()
{
  lcd.autoscroll();
  lcd.setCursor(0,0);
  setDisplayVal(DHT.humidity);
}
void displayAirconON()
{
  String on = "air con on:";  
  lcd.print(on); 
}

void displayAirconOFF()
{
  String off = "air con off:";  
  lcd.print(off); 
}
void airconON()
{
  lcd.autoscroll();
  lcd.setCursor(0,0);
  displayAirconON();
}

void airconOFF()
{
  lcd.autoscroll();
  lcd.setCursor(0,0);
  displayAirconOFF();
}

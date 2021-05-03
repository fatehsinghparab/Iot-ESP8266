
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const char* ssid = "galaxyM110022";
const char* password = "12345678";
int sensor_pin = A0; 
int output_value ;
unsigned long lastTime = 0;
unsigned long timerDelay = 5000;

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
//  Serial.println("Connecting");/
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void loop() {
  if(WiFi.status()== WL_CONNECTED){
      HTTPClient http;
//      http.begin("http://192.168.0.102:3000/esp8266")
      http.begin("http://192.168.0.132:8080/report");/
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");/
      output_value= analogRead(sensor_pin);
      Serial.println(output_value);
      String httpRequestData = "humidity=";
      httpRequestData.concat(output_value);
      int httpResponseCode = http.POST(httpRequestData);
      http.end();
      delay(5000);
    }
}

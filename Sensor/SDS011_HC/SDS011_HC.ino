#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
//#include "private.h"
#include "phone.h"
const char* ssid = STASSID;
const char* password = STAPSK;
const char* aws_host = AWS_HOST;
const uint16_t aws_port = AWS_PORT;
const uint16_t device_id = DEVICE_ID;

ESP8266WiFiMulti WiFiMulti;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid, password);

  Serial.print("\n\nWait for WiFi... ");
  while(WiFiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  delay(500);
}

void loop() {
  // put your main code here, to run repeatedly:

  static int stat = 0;
  static byte buf[10];
  static int i;
  int pm25, pm10;
  
  while ( Serial.available()) {
    char c = Serial.read();
    Serial.print("Stat=" + String(stat) + " c=");
    Serial.println(c, HEX);
    int pm25, pm10;
    switch(stat) {
      case 0: if (c == 0xAA) stat = 1; break;
      case 1: if (c == 0xC0) stat = 2; i = 0; break;
      case 2: if (i == 6) stat = 3;
              else buf[i++] = c;
              break;
      case 3: if (c == 0xAB) {
                stat = 0;

                pm25 = buf[0] + buf[1] * 255;
                pm10 = buf[2] + buf[3] * 255;
                Serial.println("PM2.5=" + String(pm25) +". PM10=" + String(pm10));
                delay(1000);
                WiFiClient client;
                if (client.connect(aws_host, aws_port)){
                  String req = "GET /data?pm25=" + String(pm25) + "&pm10=" + String(pm10) + "&device_id=" + String(device_id) + " HTTP/1.1\r\n" +
                               "Host: " + aws_host + "\r\n" +
                               "Connection: close\r\n\r\n";
                  client.print(req);
                  Serial.print(req);
                }
                else
                  Serial.println("Connection failed\n");
                delay(3000);
              }
              else {
                Serial.print("Wrong END");
                Serial.println(c, HEX);
              }
              break;
    }
  }
}

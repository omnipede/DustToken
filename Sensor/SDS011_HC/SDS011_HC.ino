/*  Last Updated: 2019-06-04-Tuesday.
    OLED Screen is arranged.  */
	
// For OLED module.
#include <SSD1306.h>
#include <SSD1306Spi.h>
#include <SSD1306Wire.h>
#include <Wire.h>  // Only needed for Arduino 1.6.5 and earlier.
#include "SSD1306Wire.h" // legacy include: `#include "SSD1306.h"`
//#include "images.h"

// For NodeMCU.
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include "private.h"

const char* ssid = STASSID;
const char* password = STAPSK;
const char* aws_host = AWS_HOST;
const uint16_t aws_port = AWS_PORT;
const uint16_t device_id = DEVICE_ID;

ESP8266WiFiMulti WiFiMulti;

// Initialize the OLED display using Wire library.
SSD1306Wire  display(0x3c, D3, D5); // SH1106: display(0x3c, D3, D5).

#define DEMO_DURATION 3000
typedef void (*oled)(void);
int oledMode = 0;

void setup() {
	// setup code here is to run once.	
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
 
    // Initialising the UI will init the display too.
    display.init();
    display.flipScreenVertically();
    display.setFont(ArialMT_Plain_10);
  
    delay(500);
}

static int stat = 0;
static byte buf[10];
static int i;
int pm25, pm10;
  
void printValue() {
    display.setTextAlignment(TEXT_ALIGN_LEFT);
    display.setFont(ArialMT_Plain_16);
    display.drawString(0, 0, "   pm2.5    pm10");
    display.setFont(ArialMT_Plain_24);
    display.drawString(0, 26, "  " + String(pm25) + "     " + String(pm10));
//  Serial.println(String(pm25) + String(pm10));
}
/*
void drawImage() {
    // see http://blog.squix.org/2015/05/esp8266-nodemcu-how-to-create-xbm.html
    // on how to create xbm files
    display.drawXbm(34, 14, WiFi_Logo_width, WiFi_Logo_height, WiFi_Logo_bits);
}
*/
// oled functions are periodically iterated.
oled modes[] = {printValue};
int modeLength = (sizeof(modes) / sizeof(oled));
long timeSinceLastModeSwitch = 0;

void loop() {
    // main code here is to run repeatedly.
    while (Serial.available()) {
        char c = Serial.read();
        Serial.print("Stat=" + String(stat) + " c=");
        Serial.println(c, HEX);
        switch (stat) {
            case 0: if (c == 0xAA) stat = 1; break;
            case 1: if (c == 0xC0) stat = 2; i = 0; break;
            case 2: if (i == 6) stat = 3;
                else buf[i++] = c;
                break;
            case 3:
			if (c == 0xAB) {
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

                // <OLED's action>
                display.clear();	// clears the display.
                modes[oledMode]();	// draws the current mode.
              
                display.setTextAlignment(TEXT_ALIGN_RIGHT);
                display.drawString(10, 128, String(millis()));
                display.display();	// writes the buffer to the display.
              
                if (millis() - timeSinceLastModeSwitch > DEMO_DURATION) {
                    oledMode = (oledMode + 1) % modeLength;
                    timeSinceLastModeSwitch = millis();
                }
//              Serial.println("pm2.5\tpm10\n" + String(pm25) + "\t" + String(pm10));
                delay(60000);	// Time period is 1 minute(60000 msec).
            }
            else {
                Serial.print("Wrong END");
                Serial.println(c, HEX);
            }   
            break;
        }
    }     
}

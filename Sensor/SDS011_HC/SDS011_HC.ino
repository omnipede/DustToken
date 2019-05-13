void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
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
                pm10 = buf[2] + buf[2] * 255;
                Serial.println("PM2.5=" + String(pm25) +". PM10=" + String(pm10));
              }
              else {
                Serial.print("Wrong END");
                Serial.println(c, HEX);
              }
              break;
    }
  }
}

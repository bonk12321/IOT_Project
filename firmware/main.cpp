#include <Arduino.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Konfiguracja DHT
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Konfiguracja WiFi
const char* ssid = "motoedge60fusion_7993";
const char* password = "Emily041705";

// Twój adres API z Vercela
const char* serverName = "https://iot-project-rouge.vercel.app/api/sensor";

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  Serial.print("Laczenie z WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nPolaczono! IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Blad odczytu z DHT!");
    delay(2000);
    return;
  }

  Serial.printf("Odczyt: %.1f°C, %.1f%% | Wysylam do API...\n", t, h);

  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    // Tworzenie JSON dla Twojego route.ts
    JsonDocument doc;
    doc["temp"] = t;
    doc["hum"] = h;
    doc["device_id"] = "ESP32_STACJA_1"; // Twoje unikalne ID urządzenia

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);
    
    if (httpResponseCode > 0) {
      Serial.print("Sukces! Kod HTTP: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Blad wysylki! Kod: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }

  // Odstep miedzy pomiarami (np. 30 sekund, zeby nie zapchac bazy)
  delay(30000); 
}
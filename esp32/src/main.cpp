#include <WiFi.h>
#include <WiFiUdp.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// --- Configuración del Access Point que crea el ESP32 ---
const char* ap_ssid = "ESP32-Sensor";
const char* ap_password = "12345678"; // WPA2 exige mínimo 8 caracteres

// --- IP y puerto de destino (el dispositivo que va a recibir los datos) ---
// Al conectarse a la red "ESP32-Sensor", el ESP32 reparte IPs por DHCP
// empezando normalmente en 192.168.4.2. Revisa la IP real del dispositivo
// receptor una vez conectado y ajústala aquí.
IPAddress targetIP(192, 168, 4, 2);
const int targetPort = 4210;

// --- Sensor DS18B20 ---
#define ONE_WIRE_BUS 4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

WiFiUDP udp;

void setup() {
  Serial.begin(115200);

  // Crear el punto de acceso propio
  WiFi.softAP(ap_ssid, ap_password);
  Serial.print("Access Point creado. IP del ESP32: ");
  Serial.println(WiFi.softAPIP()); // normalmente 192.168.4.1

  sensors.begin();
  udp.begin(targetPort);
}

void loop() {
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  if (tempC == DEVICE_DISCONNECTED_C) {
    Serial.println("Error: sensor no detectado (-127)");
  } else {
    String payload = String(tempC, 2); // ej. "23.50"

    udp.beginPacket(targetIP, targetPort);
    udp.print(payload);
    udp.endPacket();

    Serial.print("Enviado por UDP: ");
    Serial.println(payload);
  }

  delay(2000);
}
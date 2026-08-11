#include <WiFi.h>
#include <WiFiUdp.h>
#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "MAX30105.h"
#include "spo2_algorithm.h"

const char* ap_ssid = "ESP32-Sensor";
const char* ap_password = "12345678";

IPAddress targetIP(192, 168, 4, 2);
const int targetPort = 4210;

// =========================
// DS18B20
// =========================
#define ONE_WIRE_BUS 4

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// =========================
// I2C MAX30102
// =========================
#define I2C_SDA 8
#define I2C_SCL 9

MAX30105 particleSensor;

bool max30102Ready = false;

WiFiUDP udp;

// =========================
// Variables MAX30102
// =========================
uint32_t irBuffer[100];
uint32_t redBuffer[100];

int32_t bufferLength = 100;

int32_t spo2;
int8_t validSpO2;

int32_t heartRate;
int8_t validHeartRate;


// =========================
// Escáner I2C
// =========================
void i2cScan(int speedHz) {

  Wire.setClock(speedHz);

  Serial.printf("  Escaneo a %d Hz:\n", speedHz);

  byte count = 0;

  for (byte addr = 1; addr < 127; addr++) {

    Wire.beginTransmission(addr);

    byte err = Wire.endTransmission();

    if (err == 0) {

      Serial.printf("    ENCONTRADO: 0x%02X\n", addr);

      count++;

    }
  }

  if (count == 0) {

    Serial.println("    Ningun dispositivo");

  } else {

    Serial.printf(
      "    Total: %d dispositivo(s)\n",
      count
    );
  }
}


// =========================
// Inicializar MAX30102
// =========================
bool initMAX30102() {

  Serial.println("\nInicializando MAX30102...");

  Wire.setClock(100000);

  if (!particleSensor.begin(
        Wire,
        I2C_SPEED_STANDARD
      )) {

    Serial.println(
      "ERROR: MAX30102 no encontrado."
    );

    return false;
  }

  Serial.println(
    "MAX30102 encontrado correctamente."
  );

  // Configuración del sensor
  byte ledBrightness = 60;

  byte sampleAverage = 4;

  byte ledMode = 2;

  int sampleRate = 100;

  int pulseWidth = 411;

  int adcRange = 4096;


  particleSensor.setup(
    ledBrightness,
    sampleAverage,
    ledMode,
    sampleRate,
    pulseWidth,
    adcRange
  );

  // Corriente LEDs
  particleSensor.setPulseAmplitudeRed(0x3F);

  particleSensor.setPulseAmplitudeIR(0x3F);

  // LED verde apagado
  particleSensor.setPulseAmplitudeGreen(0);

  Serial.println(
    "Configuración MAX30102: OK"
  );

  return true;
}


// =========================
// Leer MAX30102
// =========================
void readMAX30102() {

  Serial.println(
    "Leyendo 100 muestras del MAX30102..."
  );

  for (int i = 0; i < bufferLength; i++) {

    while (
      particleSensor.available() == false
    ) {

      particleSensor.check();

      delay(1);
    }

    redBuffer[i] =
      particleSensor.getRed();

    irBuffer[i] =
      particleSensor.getIR();

    particleSensor.nextSample();
  }


  // Calcular SpO2 y ritmo cardíaco
  maxim_heart_rate_and_oxygen_saturation(
    irBuffer,
    bufferLength,
    redBuffer,
    &spo2,
    &validSpO2,
    &heartRate,
    &validHeartRate
  );


  Serial.printf(
    "HR: %ld | válido: %d\n",
    heartRate,
    validHeartRate
  );

  Serial.printf(
    "SpO2: %ld | válido: %d\n",
    spo2,
    validSpO2
  );
}


// =========================
// SETUP
// =========================
void setup() {

  Serial.begin(115200);

  delay(500);

  Serial.println(
    "\n=== DIAGNOSTICO GY-MAX30102 ===\n"
  );


  // =========================
  // WiFi AP
  // =========================

  WiFi.softAP(
    ap_ssid,
    ap_password
  );

  Serial.print(
    "AP creado. IP: "
  );

  Serial.println(
    WiFi.softAPIP()
  );


  // =========================
  // DS18B20
  // =========================

  sensors.begin();

  Serial.println(
    "DS18B20 listo en GPIO4\n"
  );


  // =========================
  // I2C
  // =========================

  Wire.begin(
    I2C_SDA,
    I2C_SCL
  );

  Serial.printf(
    "I2C: SDA=GPIO%d, SCL=GPIO%d\n",
    I2C_SDA,
    I2C_SCL
  );

  delay(100);


  // =========================
  // Escaneo I2C
  // =========================

  int speeds[] = {
    10000,
    50000,
    100000
  };

  for (int s = 0; s < 3; s++) {

    i2cScan(
      speeds[s]
    );

    delay(50);
  }


  // =========================
  // Inicializar MAX30102
  // =========================

  max30102Ready =
    initMAX30102();


  if (!max30102Ready) {

    Serial.println(
      "\nMAX30102 no disponible."
    );

    Serial.println(
      "Se continuará únicamente con DS18B20."
    );

  }


  // =========================
  // UDP
  // =========================

  udp.begin(
    targetPort
  );

  Serial.println(
    "\nIniciando loop...\n"
  );
}


// =========================
// LOOP
// =========================
void loop() {

  // =========================
  // Leer MAX30102
  // =========================

  if (max30102Ready) {

    readMAX30102();
  }


  // =========================
  // Temperatura
  // =========================

  sensors.requestTemperatures();

  float tempC =
    sensors.getTempCByIndex(0);


  // =========================
  // Valores
  // =========================

  float hr = 0;

  int spo2Value = 0;

  if (
    max30102Ready &&
    validHeartRate &&
    heartRate > 0
  ) {

    hr = heartRate;
  }

  if (
    max30102Ready &&
    validSpO2 &&
    spo2 > 0
  ) {

    spo2Value = spo2;
  }


  // =========================
  // JSON
  // =========================

  String payload = "{";


  if (
    tempC != DEVICE_DISCONNECTED_C
  ) {

    payload +=
      "\"temp\":" +
      String(tempC, 1);

  } else {

    payload +=
      "\"temp\":null";
  }


  payload +=
    ",\"hr\":" +
    String(hr, 0);


  payload +=
    ",\"hrValid\":" +
    String(
      validHeartRate &&
      heartRate > 0 ? 1 : 0
    );


  payload +=
    ",\"spo2\":" +
    String(spo2Value);


  payload +=
    ",\"spo2Valid\":" +
    String(
      validSpO2 &&
      spo2 > 0 ? 1 : 0
    );


  payload += "}";


  // =========================
  // UDP
  // =========================

  udp.beginPacket(
    targetIP,
    targetPort
  );

  udp.print(
    payload
  );

  udp.endPacket();


  Serial.println(
    payload
  );
}
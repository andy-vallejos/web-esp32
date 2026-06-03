import mqtt from "mqtt";

const mqttClient = mqtt.connect(import.meta.env.VITE_MQTT_URL, {
  username: import.meta.env.VITE_MQTT_USER,
  password: import.meta.env.VITE_MQTT_PASS,
  clean: true,
});
export default mqttClient;

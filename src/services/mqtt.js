import mqtt from "mqtt";

const mqttClient = mqtt.connect(
  "wss://b4185255.ala.us-east-1.emqxsl.com:8084/mqtt",
  {
    username: "andy-vallejos",
    password: "agvbe26.",
    clean: true,
  },
);
export default mqttClient;

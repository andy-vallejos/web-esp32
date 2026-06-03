import { useEffect } from "react";
import mqttClient from "./services/mqtt";
import "./App.css";

export default function App() {
  useEffect(() => {
    mqttClient.on("connect", () => {
      console.log("MQTT conectado");
      mqttClient.subscribe("led/status");
    });

    mqttClient.on("message", (topic, message) => {
      console.log(topic, message.toString());
    });
    console.log("MQTT client:", mqttClient);
  }, []);

  const send = (value) => {
    mqttClient.publish("led/control", value);
  };

  return (
    <div className="container">
      <button onClick={() => send("1")} className="encendido">
        ON
      </button>
      <button onClick={() => send("0")} className="apagado">
        OFF
      </button>
    </div>
  );
}

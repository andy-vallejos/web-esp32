import { useEffect } from "react";
import mqttClient from "./services/mqtt";
import "./App.css";
import { useState } from "react";

export default function App() {
  const [prendido, setPrendido] = useState(false);
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

  const handleClick = () => {
    setPrendido(!prendido);
  };

  return (
    <div className="container">
      <div className={`foco ${prendido ? "prendido" : ""}`}></div>
      <button
        onClick={() => {
          send("1");
          handleClick();
        }}
        className="encendido"
      >
        ON
      </button>
      <button
        onClick={() => {
          send("0");
          handleClick();
        }}
        className="apagado"
      >
        OFF
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import mqttClient from "./services/mqtt";
import "./App.css";

export default function App() {
  const [prendido, setPrendido] = useState(false);
  const [temperatura, setTemperatura] = useState("--");

  useEffect(() => {
    mqttClient.on("connect", () => {
      console.log("MQTT conectado");
      mqttClient.subscribe("led/status");
      mqttClient.subscribe("sensor/temperatura");
    });

    mqttClient.on("message", (topic, message) => {
      const data = message.toString();
      console.log(topic, data);

      if (topic === "sensor/temperatura") {
        setTemperatura(data);
      }
    });

    return () => {
      mqttClient.removeAllListeners("message");
    };
  }, []);

  const send = (value) => {
    mqttClient.publish("led/control", value);
  };

  const handleClick = (estado) => {
    setPrendido(estado);
  };

  const obtenerClaseTemperatura = () => {
    const tempNum = parseFloat(temperatura);
    if (isNaN(tempNum)) return "desconectado";
    if (tempNum < 18) return "frio";
    if (tempNum <= 27) return "ambiente";
    return "caliente";
  };
  const obtenerAlerta = () => {
    const tempNum = parseFloat(temperatura);
    if (isNaN(tempNum)) return null;

    if (tempNum <= 10) {
      return {
        text: "¡Alerta! Temperatura Críticamente Baja",
        clase: "alerta-frio",
      };
    }
    if (tempNum >= 30) {
      return {
        text: "¡Alerta! Temperatura Críticamente Alta",
        clase: "alerta-calor",
      };
    }
    return null;
  };

  const temperaturaClase = obtenerClaseTemperatura();
  const alerta = obtenerAlerta();

  return (
    <div className="container">
      <div className="interfaz-termometro">
        <div className={`termometro-container ${temperaturaClase}`}>
          <div className="termometro-tubo">
            <div className="termometro-liquido"></div>
          </div>
          <div className="termometro-bulbo"></div>
          <div className="pantalla-temperatura">
            <h1>{temperatura} °C</h1>
          </div>
          {alerta && (
            <div className={`badge-alerta ${alerta.clase}`}>
              <p>{alerta.text}</p>
            </div>
          )}
        </div>
      </div>

      <div className={`foco ${prendido ? "prendido" : ""}`}></div>

      <div className="botones-control">
        <button
          onClick={() => {
            send("1");
            handleClick(true);
          }}
          className="encendido"
        >
          ON
        </button>

        <button
          onClick={() => {
            send("0");
            handleClick(false);
          }}
          className="apagado"
        >
          OFF
        </button>
      </div>
    </div>
  );
}

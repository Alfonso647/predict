const express = require("express");
require("dotenv").config();

const app = express();
const path = require("path");

// Variables de entorno
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/prediction";
const MODEL_VERSION = process.env.MODEL_VERSION || "v1.0";
const MODEL_DIR = process.env.MODEL_DIR || "./model";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const predictRoutes = require("./routes/predictRoutes");
const { initModel } = require("./services/tfModelService");

// MongoDB (usando la variable de entorno)
const mongoose = require("mongoose");

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`[DB] Conexión OK a: ${MONGO_URI}`);
  })
  .catch(err => {
    console.error("Error al conectar con Mongo:", err);
  });

app.use(express.json());

// Servir carpeta del modelo TFJS
const resolvedModelDir = path.resolve(__dirname, MODEL_DIR);
app.use("/model", express.static(resolvedModelDir));

// Rutas
app.use("/", predictRoutes);

// Iniciar servidor + cargar modelo
app.listen(PORT, async () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log(`[PREDICT] Servicio escuchando en ${serverUrl}`);
  console.log(`[PREDICT] Modelo versión: ${MODEL_VERSION}`);
  console.log(`[PREDICT] Directorio de modelo: ${resolvedModelDir}`);

  try {
    await initModel(serverUrl);
  } catch (err) {
    console.error("Error inicializando modelo:", err);
    process.exit(1);
  }
});

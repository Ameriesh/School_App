// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const teacherRoutes = require("./src/routes/teacherRoutes");
const parentsRoutes = require("./src/routes/parentRoutes");
const eleveRoutes = require("./src/routes/elevesRoutes");
const classeRoutes = require("./src/routes/classeRoutes");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/teachers", teacherRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/parents", parentsRoutes);
app.use("/api/eleves", eleveRoutes);
app.use("/api/classes", classeRoutes);

const connectDB = require('./src/config/db');
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
});

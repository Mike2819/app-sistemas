import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  docenteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  tipoRegistro: {
    type: String,
    enum: ["ENTRADA", "SALIDA"],
    required: true,
  },
  coordenadas: {
    lat: {
      type: Number,
      required: false,
    },
    lng: {
      type: Number,
      required: false,
    },
  },
}, {
  timestamps: true, // Esto guardacreatedAt y updatedAt automáticamente
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;

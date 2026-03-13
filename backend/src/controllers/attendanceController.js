import Attendance from "../models/Attendance.js";

// @desc    Registrar una checada (entrada/salida)
// @route   POST /api/attendance
// @access  Privado (requiere token)
export const registerAttendance = async (req, res) => {
  try {
    const { timestamp, tipoRegistro, coordenadas } = req.body;

    // Validación básica de campos requeridos
    if (!timestamp || !tipoRegistro) {
      return res.status(400).json({
        success: false,
        message: "Por favor proporciona la hora (timestamp) y el tipoRegistro (ENTRADA o SALIDA).",
      });
    }

    if (!["ENTRADA", "SALIDA"].includes(tipoRegistro.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "El tipoRegistro debe ser ENTRADA o SALIDA.",
      });
    }

    // El docenteId proviene del middleware de autenticación (JWT)
    const docenteId = req.user._id;

    const newAttendance = new Attendance({
      docenteId,
      timestamp: new Date(timestamp), // Aseguramos que sea Date válido
      tipoRegistro: tipoRegistro.toUpperCase(),
      coordenadas: coordenadas || undefined,
    });

    await newAttendance.save();

    res.status(201).json({
      success: true,
      message: "Registro guardado correctamente.",
      data: newAttendance,
    });
  } catch (error) {
    console.error(`Error en registerAttendance: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error en el servidor al guardar el registro.",
    });
  }
};

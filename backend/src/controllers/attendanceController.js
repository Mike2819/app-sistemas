import Attendance from "../models/Attendance.js";

export const registerAttendance = async (req, res) => {
  try {
    const { timestamp, tipoRegistro, coordenadas } = req.body;

    // Validaciones estructurales (Evita que el servidor crashee)
    if (!timestamp || !tipoRegistro) {
      return res.status(400).json({
        success: false,
        message: "Por favor proporciona la hora y el tipoRegistro.",
      });
    }

    const tipo = tipoRegistro.toUpperCase();

    if (!["ENTRADA", "SALIDA"].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: "El tipoRegistro debe ser ENTRADA o SALIDA.",
      });
    }

    const docenteId = req.user._id;

    // Lógica Anti-Doble Checada
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ajustamos a las 00:00:00 de hoy

    const ultimoRegistro = await Attendance.findOne({
      docenteId,
      timestamp: { $gte: hoy }
    }).sort({ timestamp: -1 });

    if (ultimoRegistro && ultimoRegistro.tipoRegistro === tipo) {
      return res.status(400).json({
        success: false,
        message: `Acción inválida. Tu último registro ya fue una ${tipo}.`,
      });
    }

    // Guardado en Base de Datos
    const newAttendance = new Attendance({
      docenteId,
      timestamp: new Date(timestamp),
      tipoRegistro: tipo,
      coordenadas: coordenadas || undefined,
    });

    await newAttendance.save();

    res.status(201).json({
      success: true,
      message: "Registro guardado correctamente.",
      data: newAttendance,
    });
    
  } catch (error) {
    // Debug
    console.error(`Error CRÍTICO en registerAttendance: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error en el servidor al guardar el registro.",
    });
  }
};
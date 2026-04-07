import Attendance from "../models/Attendance.js";

export const registerAttendance = async (req, res) => {
  try {
    const { timestamp, tipoRegistro, coordenadas } = req.body;

    // Validaciones estructurales
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

    // EVALUACIÓN RELATIVA AL EVENTO
    // Convertimos el string enviado por el celular a un objeto Date
    const fechaDelEvento = new Date(timestamp);
    
    // Creamos el límite de inicio de día (00:00:00) basado en el evento, NO en el servidor
    const inicioDeEseDia = new Date(fechaDelEvento);
    inicioDeEseDia.setHours(0, 0, 0, 0);

    const ultimoRegistro = await Attendance.findOne({
      docenteId,
      timestamp: { $gte: inicioDeEseDia } // Buscamos conflictos en el mismo día del evento
    }).sort({ timestamp: -1 });

    if (ultimoRegistro && ultimoRegistro.tipoRegistro === tipo) {
      return res.status(400).json({
        success: false,
        message: `Acción inválida. Tu último registro ya fue una ${tipo}.`,
      });
    }

    // Guardado en Base de Datos: La hora absoluta es inyectada con éxito
    const newAttendance = new Attendance({
      docenteId,
      timestamp: fechaDelEvento,
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
    console.error(`Error CRÍTICO en registerAttendance: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error en el servidor al guardar el registro.",
    });
  }
};
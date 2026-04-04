import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @desc    Configurar el PIN de 4 dígitos por primera vez
// @route   POST /api/auth/setup-pin
// @access  Privado (requiere token JWT)
export const setupPin = async (req, res) => {
  try {
    const { pin } = req.body;

    // Validación estricta: Solo 4 números
    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: "El PIN debe ser exactamente de 4 dígitos numéricos.",
      });
    }

    // Encriptamos el PIN 
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    // Actualizamos al usuario que hizo la petición
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { pin: hashedPin },
      { new: true } // Retorna el documento actualizado
    );

    res.status(200).json({
      success: true,
      message: "PIN de seguridad configurado correctamente.",
      hasPin: true
    });

  } catch (error) {
    console.error(`Error en setupPin: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error en el servidor al configurar el PIN.",
    });
  }
};

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { nombres, apellidos, email, telefono, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con ese email",
      });
    }

    // Crear el usuario
    const user = await User.create({
      nombres,
      apellidos,
      email,
      telefono,
      password,
    });

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        _id: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        token,
        hasPin: false,
      },
    });
  } catch (error) {
    // Errores de validación de Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se envíen los campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Por favor ingresa email y contraseña",
      });
    }

    // Buscar usuario e incluir el password (excluido por defecto)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Generar token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        _id: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        token,
        hasPin: !!user.pin
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        hasPin: !!user.pin
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

// @desc    Verificar el PIN de 4 dígitos para registrar asistencia
// @route   POST /api/auth/verify-pin
// @access  Privado
export const verifyPin = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ success: false, message: "Por favor ingresa tu PIN." });
    }

    const user = await User.findById(req.user._id);

    // Si por alguna razón no tiene PIN en la BD, bloqueamos
    if (!user.pin) {
      return res.status(400).json({ success: false, message: "No tienes un PIN configurado." });
    }

    // Comparamos el PIN ingresado con el Hash de la base de datos
    const isMatch = await bcrypt.compare(pin, user.pin);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "PIN incorrecto. Intenta de nuevo." });
    }

    res.status(200).json({ success: true, message: "Identidad verificada correctamente." });

  } catch (error) {
    console.error(`Error en verifyPin: ${error.message}`);
    res.status(500).json({ success: false, message: "Error en el servidor al verificar el PIN." });
  }
};

export { register, login, getProfile };

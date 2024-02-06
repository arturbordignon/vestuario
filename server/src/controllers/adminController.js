const Admin = require("../models/Admin");
const Clothing = require("../models/Clothing");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorResponse, successResponse } = require("../utils/responseHelpers");
const nodemailer = require("nodemailer");
const { extractPublicIdFromImageUrl } = require("../utils/cloudinaryUtils");
const cloudinary = require("cloudinary").v2;
const chatController = require("../controllers/chatController");

const adminController = {
  login: async (req, res) => {
    try {
      const admin = await Admin.findOne({ email: req.body.email });
      if (!admin) {
        return res.status(401).send(errorResponse("Email ou senha inválidos"));
      }

      const validPassword = bcrypt.compareSync(req.body.password, admin.passwordHash);
      if (!validPassword) {
        return res.status(401).send(errorResponse("Email ou senha inválidos"));
      }

      const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "4h",
      });
      res.send(successResponse({ token, adminId: admin._id }));
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const admin = await Admin.findOne({ email: req.body.email });

      if (!admin) {
        return res.status(404).send(errorResponse("Email não encontrado"));
      }

      const resetToken = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: admin.email,
        subject: "Resetar Senha",
        text: `Clique no link a seguir ou cole-o em seu navegador para concluir o processo: ${resetLink}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Erro ao enviar email:", error);
          return res.status(500).send(errorResponse("Error ao enviar email"));
        } else {
          res.send(successResponse("Email de recuperação de senha enviado com sucesso"));
        }
      });
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const admin = await Admin.findById(decoded._id);
      if (!admin) {
        return res.status(404).send(errorResponse("Admin não encontrado"));
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      admin.passwordHash = hashedPassword;

      await admin.save();
      res.send(successResponse("Senha redefinida com sucesso"));
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  getAllClothingForAdmin: async (req, res) => {
    try {
      const clothingItems = await Clothing.find();
      res.send(successResponse(clothingItems));
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  addClothing: async (req, res) => {
    try {
      const newClothing = new Clothing({
        title: req.body.title,
        size: req.body.size,
        color: req.body.color,
        gender: req.body.gender,
        condition: req.body.condition,
        season: req.body.season,
        image: req.file.path,
      });

      await newClothing.save();
      res.status(201).json(newClothing);
    } catch (error) {
      console.error(error);
      res.status(500).send(errorResponse(error.message));
    }
  },

  updateClothing: async (req, res) => {
    try {
      const clothing = await Clothing.findById(req.params.id);
      if (!clothing) {
        return res.status(404).send(errorResponse("Roupa não encontrada"));
      }

      if (req.file) {
        if (clothing.image) {
          const publicId = extractPublicIdFromImageUrl(clothing.image);
          await cloudinary.uploader.destroy(publicId);
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        clothing.image = result.url;
      }

      clothing.title = req.body.title || clothing.title;
      clothing.size = req.body.size || clothing.size;
      clothing.color = req.body.color || clothing.color;
      clothing.gender = req.body.gender || clothing.gender;
      clothing.condition = req.body.condition || clothing.condition;
      clothing.season = req.body.season || clothing.season;

      await clothing.save();
      res.send(successResponse(clothing));
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  deleteClothing: async (req, res) => {
    try {
      const clothingId = req.params.id;
      const clothing = await Clothing.findById(clothingId);
      if (!clothing) {
        return res.status(404).send({ status: "Erro", message: "Roupa não encontrada" });
      }

      const publicId = extractPublicIdFromImageUrl(clothing.image);
      await cloudinary.uploader.destroy(publicId);

      await Clothing.findByIdAndDelete(clothingId);

      await chatController.deleteOrUpdateChatsForClothing(clothingId);

      res.send(successResponse("Roupa deletada com sucesso"));
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  markAsDonated: async (req, res) => {
    try {
      const clothingId = req.params.clothingId;
      const clothing = await Clothing.findById(clothingId);
      if (!clothing) return res.status(404).send(errorResponse("Roupa não encontrada"));

      clothing.status = "doada";
      await clothing.save();

      await chatController.deleteOrUpdateChatsForClothing(clothingId, "update");

      res.send(successResponse("Roupa marcada como doada"));
    } catch (error) {
      console.error("Erro ao marcar roupa como doada:", error);
      res.status(500).send(errorResponse(error.message));
    }
  },

  getDonatedClothing: async (req, res) => {
    try {
      const donatedClothingItems = await Clothing.find({ status: "doada" });
      res.send(successResponse(donatedClothingItems));
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  addAdmin: async (req, res) => {
    try {
      const { email } = req.body;

      let admin = await Admin.findOne({ email });
      if (admin) {
        return res.status(400).send(errorResponse("Admin já existe"));
      }

      const tempPassword = "TempPass123";
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(tempPassword, salt);

      admin = new Admin({
        email,
        passwordHash,
      });

      await admin.save();

      const emailToken = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const link = `${process.env.FRONTEND_URL}/admin/set-password?token=${emailToken}`;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "Concluir registro de administrador",
        html: `<p>Você está recebendo isto porque você (ou outra pessoa) solicitou a adição de um novo administrador para sua conta.</p>
               <p>Clique no link a seguir ou cole-o em seu navegador para concluir o processo:</p>
               <a href="${link}">${link}</a>
               <p>Se você não solicitou isso, ignore este e-mail e sua senha permanecerá inalterada.</p>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Erro ao enviar email:", error);
          return res.status(500).send(errorResponse("Erro ao enviar email"));
        } else {
          console.log("Email Enviado: " + info.response);
          res.status(201).send(successResponse("Admin criado e email enviado"));
        }
      });

      res.status(201).send(successResponse("Admin criado e email enviado"));
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  deleteAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const admin = await Admin.findByIdAndDelete(id);
      if (!admin) {
        return res.status(404).send(errorResponse("Admin não encontrado"));
      }
      res.send(successResponse("Admin deletado com sucesso"));
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).send({ message: "Token e nova senha são necessários." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded._id);
      if (!admin) {
        return res.status(404).send({ message: "Admin não encontrado." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      admin.passwordHash = hashedPassword;
      await admin.save();

      res.send({ message: "Senha redefinida com sucesso." });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).send({ message: "Token expirou." });
      } else if (error.name === "JsonWebTokenError") {
        res.status(401).send({ message: "Token inválido." });
      } else {
        res.status(500).send({ message: "Erro interno do servidor." });
      }
    }
  },

  getAllAdmins: async (req, res) => {
    try {
      const admins = await Admin.find().select("-passwordHash");
      res.json({ message: "Admins encontrados com sucesso", data: admins });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = adminController;

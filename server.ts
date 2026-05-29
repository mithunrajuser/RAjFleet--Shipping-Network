import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from 'nodemailer';
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error("SMTP configuration missing");
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `RAjFleet <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: "hello@rajhomeindia.com",
        subject: "New Contact Request – RAjFleet Website",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nSubmitted At: ${new Date().toLocaleString()}`,
      });

      res.json({ success: true, message: "Thank you. Your message has been received." });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ success: false, message: "Unable to send message right now. Please try again later." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

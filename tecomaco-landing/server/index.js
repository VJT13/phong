import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { defaultData } from './defaultData.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Admin Authentication Config
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-1234';

// Nodemailer setup for email notifications
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let transporter = null;
if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    }
  });
  console.log("Nodemailer email notification system configured.");
} else {
  console.log("Nodemailer skipped (missing EMAIL_USER or EMAIL_PASS in .env).");
}

// Log warning if defaults are active
if (ADMIN_USERNAME === 'admin' && ADMIN_PASSWORD === 'admin123') {
  console.warn("WARNING: Using default admin credentials ('admin' / 'admin123'). Please set ADMIN_USERNAME and ADMIN_PASSWORD in your .env file!");
}

// Native JWT token generator/verifier using built-in crypto module
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  // Token expires in 24 hours
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  try {
    const [header, body, signature] = token.split('.');
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) return null; // Expired
    return payload;
  } catch (err) {
    return null;
  }
}

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Missing token' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
  }
  req.admin = decoded;
  next();
};

if (!MONGODB_URI) {
  console.warn("WARNING: MONGODB_URI is not set in .env! Database connection will fail.");
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully.");
    seedDatabase();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err.message);
  });

// Schema definition
const PortfolioSchema = new mongoose.Schema({
  hero: Object,
  capabilities: Object,
  advantages: Array,
  factory: Object,
  certifications: Object,
  clients: Object,
  sourcing: Array,
  contact: Object,
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: String,
  phone: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const Inquiry = mongoose.model('Inquiry', InquirySchema);

// Helper function to seed database if empty
async function seedDatabase() {
  try {
    const count = await Portfolio.countDocuments();
    if (count === 0) {
      console.log("Database is empty. Seeding default data...");
      await Portfolio.create(defaultData);
      console.log("Database seeded successfully!");
    } else {
      console.log("Database already has data. Skipping seed.");
    }
  } catch (err) {
    console.error("Error seeding database:", err.message);
  }
}

// API Routes

// POST /api/admin/login - Authenticate admin credentials and return custom JWT
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = generateToken({ username });
    return res.status(200).json({ success: true, token });
  }
  return res.status(401).json({ success: false, error: 'Tài khoản hoặc mật khẩu không chính xác' });
});

// GET /api/portfolio - Fetch configuration
app.get('/api/portfolio', async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    if (!portfolio) {
      return res.status(200).json(defaultData);
    }
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching portfolio data", message: err.message });
  }
});

// POST /api/portfolio - Update configuration (Secured with authMiddleware)
app.post('/api/portfolio', authMiddleware, async (req, res) => {
  try {
    const { hero, capabilities, advantages, factory, certifications, clients, sourcing, contact } = req.body;
    
    let portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    if (!portfolio) {
      portfolio = new Portfolio({ hero, capabilities, advantages, factory, certifications, clients, sourcing, contact });
    } else {
      portfolio.hero = hero;
      portfolio.capabilities = capabilities;
      portfolio.advantages = advantages;
      portfolio.factory = factory;
      portfolio.certifications = certifications;
      portfolio.clients = clients;
      portfolio.sourcing = sourcing;
      portfolio.contact = contact;
    }
    
    await portfolio.save();
    res.status(200).json({ message: "Portfolio configuration saved successfully!", data: portfolio });
  } catch (err) {
    res.status(500).json({ error: "Server error saving portfolio data", message: err.message });
  }
});

// POST /api/inquiries - Submit a new client inquiry (Public)
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, company, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields (name, email, subject, message)" });
    }

    const newInquiry = new Inquiry({ name, email, company, phone, subject, message });
    await newInquiry.save();

    // Trigger email notification asynchronously if SMTP configured
    if (transporter) {
      const mailOptions = {
        from: EMAIL_USER,
        to: EMAIL_USER, // Send notification to portfolio owner
        subject: `[Portfolio Inquiry] ${subject} - Từ: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #1e293b; background-color: #ffffff;">
            <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-top: 0;">Bạn có liên hệ mới từ Portfolio!</h2>
            <p style="font-size: 14px; margin-bottom: 20px;">Dưới đây là thông tin chi tiết lời nhắn của khách hàng gửi từ form liên hệ:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 140px; color: #64748b;">Họ và tên:</td>
                <td style="padding: 6px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Email liên hệ:</td>
                <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Điện thoại:</td>
                <td style="padding: 6px 0;">${phone || '<i>Không cung cấp</i>'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Công ty:</td>
                <td style="padding: 6px 0;">${company || '<i>Không cung cấp</i>'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Tiêu đề:</td>
                <td style="padding: 6px 0; font-weight: bold;">${subject}</td>
              </tr>
            </table>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #cbd5e1; padding: 16px; border-radius: 0 8px 8px 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0 15px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">Thư thông báo tự động từ Website Portfolio cá nhân của bạn.</p>
          </div>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Nodemailer: Error sending notification email:", error.message);
        } else {
          console.log("Nodemailer: Email notification sent successfully:", info.response);
        }
      });
    }

    res.status(200).json({ success: true, message: "Yêu cầu liên hệ của bạn đã được gửi thành công!" });
  } catch (err) {
    res.status(500).json({ error: "Server error saving inquiry", message: err.message });
  }
});

// GET /api/inquiries - Retrieve list of submissions (Secured)
app.get('/api/inquiries', authMiddleware, async (req, res) => {
  try {
    const list = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ error: "Server error fetching inquiries", message: err.message });
  }
});

// DELETE /api/inquiries/:id - Remove a submission (Secured)
app.delete('/api/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    res.status(200).json({ success: true, message: "Liên hệ đã được xóa thành công!" });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting inquiry", message: err.message });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

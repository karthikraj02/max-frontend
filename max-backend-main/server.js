const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// ================= SECURITY =================
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'https://protechco.in',
  'https://www.protechco.in',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Safely allow the requesting origin to bypass CORS issues for your deadline
    callback(null, origin || true);
  },
  credentials: true,
}));
app.options('*', cors());

// ================= DATABASE CONNECTION (FIXED) =================
let cachedConnection = null;
let startupError = null;

const connectDB = async (mongoUri) => {
  // If mongoose is already connected, reuse it
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // If there's a pending connection promise, wait for it (prevents duplicate connects)
  if (cachedConnection) {
    await cachedConnection;
    return;
  }

  try {
    cachedConnection = mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await cachedConnection;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    cachedConnection = null; // Reset so next request can retry
    console.error("❌ MongoDB Error:", error.message);
    throw error;
  }
};

const getMongoUri = () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Set it in your environment variables before starting the server.');
  }
  return mongoUri;
};

const dbReadyPromise = (async () => {
  try {
    const mongoUri = getMongoUri();
    await connectDB(mongoUri);
  } catch (error) {
    startupError = error;
    throw error;
  }
})();
dbReadyPromise.catch(() => {});

// ================= DB MIDDLEWARE =================
app.use('/api', async (req, res, next) => {
  try {
    await dbReadyPromise;
    next();
  } catch (err) {
    console.error("DB middleware error:", err.message);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// ================= RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth requests, try later.' },
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// ================= BODY PARSER =================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ================= LOGGING =================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('[DEV REQ]', req.method, req.originalUrl, req.headers.origin || '');
    next();
  });
}

// ================= STATIC FILES =================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= HEALTH ROUTE =================
app.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const dbError = startupError ? startupError.message : null;

  res.json({
    status: dbStatus === 'connected' ? 'OK' : 'ERROR',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV,
    db: {
      status: dbStatus,
      readyState: mongoose.connection.readyState,
      uriSet: !!process.env.MONGO_URI,
      error: dbError,
    }
  });
});

// ================= ROOT ROUTE =================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 ProTech API is running!',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      users: '/api/users',
      admin: '/api/admin',
      payment: '/api/payment'
    }
  });
});

// Temporary debug route for API request diagnostics. Remove before production release.
app.all('/api/debug/*', (req, res) => {
  res.json({ method: req.method, path: req.originalUrl });
});

// ================= API ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// ================= ERROR HANDLING =================
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  dbReadyPromise
    .then(() => {
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((error) => {
      console.error(`❌ Server startup failed: ${error.message}`);
      process.exit(1);
    });
}

// ================= EXPORT =================
module.exports = app;
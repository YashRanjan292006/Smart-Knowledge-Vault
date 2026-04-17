const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

const { apiLimiter } = require('./middlewares/rate-limiter');

// Security and utility middlewares
app.use(apiLimiter);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', msg: 'System Online' }));

// Mounted routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/docs', require('./routes/doc.routes'));
app.use('/api/chat', require('./routes/chat.routes'));

// Global error handling middleware
app.use(require('./middlewares/error.middleware'));

module.exports = app;

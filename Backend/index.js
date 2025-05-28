// server.js
const express       = require('express');
const http          = require('http');
const mongoose      = require('mongoose');
const cors          = require('cors');
const morgan        = require('morgan');
require('dotenv').config();

const { Server }    = require('socket.io');
const authRoutes    = require('./routes/authRoutes');
const consentRoutes = require('./routes/consentRoutes');
const userRoutes    = require('./routes/userRoutes');
const errorHandler  = require('./middlewares/errorHandler');
const colors = require('colors'); 
const app    = express();
// Create an HTTP server from the Express app
// const server = http.createServer(app);

// // ————————————————————————————————
// // 1) Attach Socket.IO to the HTTP server
// // ————————————————————————————————
// const io = new Server(server, {
//   cors: {
//     origin: '*'  // adjust to your dashboard’s origin in production
//   }
// });

// // In-memory store: origin → { permission: state, … }
// const sitePermissions = {};

// // Handle new Socket.IO connections
// io.on('connection', (socket) => {
//   console.log(`[WS] Client connected: ${socket.id}`);

//   // Send full current state on new connection
//   socket.emit('initial_state', sitePermissions);

//   // Extension notifies of a new site seen
//   socket.on('new_site', ({ origin }) => {
//     if (!sitePermissions[origin]) {
//       sitePermissions[origin] = {};
//       io.emit('site_added', { origin, perms: {} });
//       console.log(`[WS] site_added → ${origin}`);
//     }
//   });

//   // Extension notifies of a permission update
//   socket.on('update_perm', ({ origin, permission, state }) => {
//     sitePermissions[origin] = sitePermissions[origin] || {};
//     sitePermissions[origin][permission] = state;
//     io.emit('perm_changed', { origin, permission, state });
//     console.log(`[WS] perm_changed →`, { origin, permission, state });
//   });

//   socket.on('disconnect', () => {
//     console.log(`[WS] Client disconnected: ${socket.id}`);
//   });
// });

// // ————————————————————————————————
// 2) Your existing Express setup (unchanged)
// ————————————————————————————————
mongoose.connect(process.env.DB_URI, {


})
.then(() => console.log('MongoDB connected'.bgGreen))
.catch(err => console.error('MongoDB connection error:'.bgRed, err));

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// REST endpoints (no changes)
app.use('/api/auth', authRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/user', userRoutes);

// Global error handler
app.use(errorHandler);

// ————————————————————————————————
// 3) Start listening on the shared server
// ————————————————————————————————
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server (HTTP + WS) running on port ${PORT}`.bgMagenta);
});

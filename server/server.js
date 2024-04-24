const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200, // For legacy browser support
}));

// import routes -----------------------------------
const authRoutes = require('./routes/auth.route.js');
const userRoutes = require('./routes/user.route.js');

// socket.io listener ------------------------------
const socketListen = require('./socketComm.js')
socketListen(io);

// Import global middlewares -----------------------
const { setClientHeader } = require('./validators/index.validator.js');
const connectToMongoDB = require('./db/dbConnect.js');

// app middlewares ---------------------------------
app.use(morgan('dev'));
app.use(bodyParser.json());
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `http://localhost:4500` }));
}

// middlewares -------------------------------------
app.use('/api', setClientHeader, authRoutes);
app.use('/api', setClientHeader, userRoutes);

const PORT = process.env.PORT || 4500;
// app.listen(PORT, () => {
//     console.log(`Server running: http://localhost:${PORT}`)
// })
server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server running: http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200, // For legacy browser support
}));


// connect to DB -----------------------------------
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("DB Error => ", err));

// import routes -----------------------------------
const authRoutes = require('./routes/auth.route.js');
const userRoutes = require('./routes/user.route.js');

// Import global middlewares -----------------------
const { setClientHeader } = require('./validators/index.validator.js');

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
app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`)
})


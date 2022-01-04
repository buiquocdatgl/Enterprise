const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const errorhandler = require('errorhandler');
const helmet = require('helmet');
dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();
const dbService = require('./service/db');
const passport = require('passport');
const passportConfig = require('./middleware/authentication');
const expressSession = require('express-session');

const rootRouter = require('./router/index');

// Apply application middleware
app.use(passport.initialize());
app.use(cors({
    origin: "*",
    credentials: false,
}));
app.use(expressSession({secret: process.env.SECRET_KEY}));
app.use(helmet());
app.use(morgan("dev"));
app.use(errorhandler());
app.use(express.json({urlEncoded: true}));
app.use(passport.session());

dbService.connect(process.env.DB_URL);

app.use(`${process.env.api_version}`, rootRouter)

app.listen(5000, () => {
    console.log(`listening on port: ${PORT}`);
});
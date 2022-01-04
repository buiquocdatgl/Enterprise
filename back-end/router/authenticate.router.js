const authenticateRouter = require('express').Router();
const {login, register} = require('../controller/authenticate.controller')
const passport = require('passport');

authenticateRouter.get('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    res.send("Hello");
})

authenticateRouter.post('/login', 
passport.authenticate('local', {session: false}),
login);

authenticateRouter.post('/register', register);

module.exports = authenticateRouter;
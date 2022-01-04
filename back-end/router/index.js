const authenticateRouter = require('./authenticate.router');
const rootRouter = require('express').Router();

rootRouter.use(`/auth`,authenticateRouter);

module.exports = rootRouter;
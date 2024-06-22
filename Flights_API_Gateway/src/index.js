const express = require("express");
const {ServerConfig} = require("./config");
const apiRoutes = require("./routes");
const {rateLimit} = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {AuthMiddleware} = require('./middlewares');

const app = express();

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	limit: 30, // Limit each IP to 30 requests per `window` (here, per 15 minutes).
})

app.use(express.json()); //we use a middleware because we want to ensure that only a request with json body will pass
app.use(express.urlencoded({extended:true}));//we use a middleware because we want to ensure that we can read special urls and extended true becuase can read nested objects
app.use(limiter);
app.use('/api',apiRoutes);
app.use(
    '/flightsService',
    [AuthMiddleware.checkAuth,AuthMiddleware.checkRights],
    createProxyMiddleware({
      target: ServerConfig.FLIGHT_SERVICE,
      changeOrigin: true,
      pathRewrite: {'^/flightsService' : '/'}
    }),
);
app.use(
    '/bookingsService',
    [AuthMiddleware.checkAuth],
    createProxyMiddleware({
      target: ServerConfig.BOOKING_SERVICE,
      changeOrigin: true,
      pathRewrite: {'^/bookingsService' : '/'}
    }),
);


app.listen(ServerConfig.PORT,(rq,res) =>{
    console.log(`Server is listening at port ${ServerConfig.PORT}`);
})

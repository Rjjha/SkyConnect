const express = require("express");
const {ServerConfig,Queue} = require("./config");
const apiRoutes = require("./routes");
const CRON = require('./utils/common/cron-jobs')

const app = express();

app.use(express.json()); //we use a middleware because we want to ensure that only a request with json body will pass
app.use(express.urlencoded({extended:true}));//we use a middleware because we want to ensure that we can read special urls and extended true becuase can read nested objects


app.use('/api',apiRoutes);

app.listen(ServerConfig.PORT,async(req,res) =>{
    console.log(`Server is listening at port ${ServerConfig.PORT}`);
    CRON();
    await Queue.connectQueue();
    console.log('queue connected');
})

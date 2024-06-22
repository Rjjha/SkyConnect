const express = require("express");
const {ServerConfig} = require("./config");
const apiRoutes = require("./routes");

const app = express();

app.use(express.json()); //we use a middleware because we want to ensure that only a request with json body will pass
app.use(express.urlencoded({extended:true}));//we use a middleware because we want to ensure that we can read special urls and extended true becuase can read nested objects

app.get('/',(req,res)=>{
    res.send('Hi');
})

app.use('/api',apiRoutes);

app.listen(ServerConfig.PORT,(rq,res) =>{
    console.log(`Server is listening at port ${ServerConfig.PORT}`);
})

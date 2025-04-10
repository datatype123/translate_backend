const express = require('express');
const app = express();
const PORT = 3000;
const userRouter = require('./src/routes/users');


//GET default
app.get('/',(req,res)=>{
    res.send('main server');
});

app.use(express.json());
app.use('',userRouter);

app.listen(PORT,()=>{
    console.log(`server is listening in port ${PORT}`);
    
})
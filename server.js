const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const userRouter = require('./src/routes/users');
const voiceRouter = require('./src/routes/voices')


//GET default
app.get('/',(req,res)=>{
    res.send('main server');
});

app.use(express.json());
app.use('',userRouter);

app.use('/api/v1',voiceRouter);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
});
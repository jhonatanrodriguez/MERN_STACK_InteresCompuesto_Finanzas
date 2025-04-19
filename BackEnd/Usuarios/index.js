const express = require('express');
const cors = require('cors');
const app = express();
const usuarioRouter = require('./usuarioRouter')
app.use(express.json());
app.use(cors());
app.use(usuarioRouter);
app.listen(3000, ()=>{
    console.log('listening...')
});



const express = require('express');
const router = express.Router();
const usuarioController = require('./usuarioController');
const Usuario = require('./usuarioModel');

router.get("/intsim", async(req, res)=>{
    try {
        usuarioController.getInteresSimple(Usuario, (err,result)=>{
            if (err) {
                res.status(400).send('');
            } else {
                res.status(200).send(result);
            }
        })
    } catch (error) {
        res.status(500).send({error:'',error});
    }
});
router.get('/simdes', async (req, res)=>{
    try {
        usuarioController.getDescuentoSimple(Usuario, (err, result)=>{
            if (err) {
                res.status(400).send('');
            } else {
                res.status(200).send(result);
            }
        })
    } catch (error) {
        res.status(500).send({error:'', err})
    }
});
router.get('/intcom', async (req, res)=>{
    try {
        usuarioController.getInteresCompuesto(Usuario, (err, result)=>{
            if (err) {
                res.status(400).send('')
            } else {
                res.status(200).send(result)
            }
        });
    } catch (error) {
        res.status(500).send('', err)
    }
});
router.get('/descom', async(req, res)=>{
    try {
        usuarioController.getDescuentoCompuesto(Usuario, (err, result)=>{
            if (err) {
                res.status(400).send('')
            } else {
                res.status(200).send(result)
            }
        })
    } catch (err) {
        res.status(500).send('', err)
    }
});
router.get('/valpre', async(req, res)=>{
    try {
        usuarioController.getSumValoresPresentes(Usuario, (err, result)=>{
            if (err) {
                res.status(400).send('')
            } else {
                res.status(200).send(result)
            }
        })
    } catch (err) {
        res.status(500).send('', err)
    }
})
module.exports = router;


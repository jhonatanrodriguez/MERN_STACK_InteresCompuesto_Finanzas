const usuarioService = require('./usuarioService');

function getInteresSimple(usuario, done){
    usuarioService.getInteresSimple(usuario, done)
}
function getDescuentoSimple(usuario, done){
    usuarioService.getDescuentoSimple(usuario, done)
}
function getInteresCompuesto(usuario, done){
    usuarioService.getInteresCompuesto(usuario, done)
}
function getDescuentoCompuesto(usuario, done){
    usuarioService.getDescuentoCompuesto(usuario, done)
}
function getSumValoresPresentes(usuario, done){
    usuarioService.getSumValoresPresentes(usuario, done)
}
module.exports = {getInteresSimple, getDescuentoSimple, getInteresCompuesto, getDescuentoCompuesto, getSumValoresPresentes }
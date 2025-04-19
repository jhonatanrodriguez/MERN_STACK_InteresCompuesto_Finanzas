const usuarioDAO = require('./usuarioDAO');

function getInteresSimple(usuario, done){
    usuarioDAO.getInteresSimple(usuario, done)
}
function getDescuentoSimple(usuario, done){
    usuarioDAO.getDescuentoSimple(usuario, done)
}
function getInteresCompuesto(usuario, done){
    usuarioDAO.getInteresCompuesto(usuario, done)
}
function getDescuentoCompuesto(usuario, done){
    usuarioDAO.getDescuentoCompuesto(usuario, done)
}
function getSumValoresPresentes(usuario, done){
    usuarioDAO.getSumValoresPresentes(usuario, done)
}
module.exports = { getInteresSimple, getDescuentoSimple, getInteresCompuesto, getDescuentoCompuesto, getSumValoresPresentes }
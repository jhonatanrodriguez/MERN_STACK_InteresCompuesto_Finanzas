const mongoose = require('mongoose');
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true
    },
    apellido: {
        type: String,
        require: true
    },
    cedula: {
        type: String,
        require: true
    },
    nombreBanco: {
        type: String,
        require: true
    },
    clave: {
        type: String,
        require: true
    },
    actividadFinanciera:
    {
        tipo: {
            type: String,
            require: true
        },
        capital: {
            type: Number,
            require: false
        },
        monto: {
            type: Number,
            require: false
        },
        tasaNominal: {
            type: Number,
            require: false
        },
        interes: {
            type: Number,
            require: false
        },
        tiempo:
        {
            unidad: {
                type: String,
                require: false
            },
            cantidad: {
                type: Number,
                require: false
            }
        },
        periodos:
            [
                {
                    type: String,
                    require: false
                }
            ],
        inversionInicial: {
            type: Number,
            require: false
        }
    }
});
const Usuario = mongoose.model('usuario', usuarioSchema);
module.exports = Usuario;
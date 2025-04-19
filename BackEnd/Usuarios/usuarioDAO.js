const mongoose = require('mongoose');
require('../dbconfig/dbFile');
//Metodo para calcular el interes simple
async function getInteresSimple(usuario, done) {
    const data = await usuario.aggregate([
        {
            $lookup:
            {
                from: "bancos",
                localField: "nombreBanco",
                foreignField: "nombre",
                let: {
                    documento: "$cedula", finanzas: "$actividadFinanciera.tipo", dinero: "$actividadFinanciera.capital",
                    tasaN: "$actividadFinanciera.tasaNominal", plazo: "$actividadFinanciera.tiempo.cantidad",
                    medida: "$actividadFinanciera.tiempo.unidad"
                },
                pipeline:
                    [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$$documento", "$cedulaCliente"] }, { $eq: ["$$finanzas", "interes simple"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                monto: {
                                    $switch: {
                                        branches: [
                                            {
                                                case:
                                                {
                                                    $eq: ["$$medida", "dias"]
                                                },
                                                then: {
                                                    $let: {
                                                        vars: {
                                                            interes: {
                                                                $multiply: ['$$dinero', {
                                                                    $multiply: [{ $divide: ['$$tasaN', 360] }, '$$plazo']
                                                                }]
                                                            }
                                                        },
                                                        in: {
                                                            $add: ["$$interes", "$$dinero"]
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                case:
                                                {
                                                    $eq: ["$$medida", "meses"]
                                                },
                                                then: {
                                                    $let: {
                                                        vars: {
                                                            interes: {
                                                                $multiply: ['$$dinero', {
                                                                    $multiply: [{ $divide: ['$$tasaN', 12] }, '$$plazo']
                                                                }]
                                                            }
                                                        },
                                                        in: {
                                                            $add: ["$$interes", "$$dinero"]
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                case:
                                                {
                                                    $eq: ["$$medida", "años"]
                                                },
                                                then: {
                                                    $let: {
                                                        vars: {
                                                            interes: {
                                                                $multiply: ['$$dinero', {
                                                                    $multiply: [{ $divide: ['$$tasaN', 1] }, '$$plazo']
                                                                }]
                                                            }
                                                        },
                                                        in: {
                                                            $add: ["$$interes", "$$dinero"]
                                                        }
                                                    }
                                                }
                                            }
                                        ],
                                        default: "No hay datos!!!."
                                    },
                                }
                            }
                        },
                    ],
                as: "transaccion"
            }
        },
        {
            $unwind: "$transaccion"
        },
        {
            $addFields: {
                financiamiento: "$actividadFinanciera.tipo", plazo: "$actividadFinanciera.tiempo.cantidad",
                unidad: "$actividadFinanciera.tiempo.unidad", capital: "$actividadFinanciera.capital",
                tasaNominal: "$actividadFinanciera.tasaNominal", monto: "$transaccion.monto"
            }
        },
        {
            $addFields: {
                interes: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $eq: ["$actividadFinanciera.tiempo.unidad", "dias"]
                                },
                                then: {
                                    $multiply: ['$actividadFinanciera.capital', {
                                        $multiply:
                                            [{ $divide: ['$actividadFinanciera.tasaNominal', 360] }, '$actividadFinanciera.tiempo.cantidad']
                                    }]
                                }
                            },
                            {
                                case: {
                                    $eq: ["$actividadFinanciera.tiempo.unidad", "meses"]
                                },
                                then: {
                                    $multiply: ['$actividadFinanciera.capital', {
                                        $multiply:
                                            [{ $divide: ['$actividadFinanciera.tasaNominal', 12] }, '$actividadFinanciera.tiempo.cantidad']
                                    }]
                                }
                            },
                            {
                                case: {
                                    $eq: ["$actividadFinanciera.tiempo.unidad", "años"]
                                },
                                then: {
                                    $multiply: ['$actividadFinanciera.capital', {
                                        $multiply:
                                            [{ $divide: ['$actividadFinanciera.tasaNominal', 1] }, '$actividadFinanciera.tiempo.cantidad']
                                    }]
                                }
                            }
                        ], default: "No hay datos!!!."
                    }
                }
            }
        },
        {
            $project: {
                nombre: 1, apellido: 1, cedula: 1, nombreBanco: 1, financiamiento: 1, interes: 1, capital: 1,
                tasaNominal: 1, plazo: 1, unidad: 1, _id: 0, monto: 1
            }
        }
    ])
    done(undefined, data);
}
//Metodo para calcular el descuento simple
async function getDescuentoSimple(usuario, done) {
    const data = await usuario.aggregate([
        {
            $lookup:
            {
                from: "bancos",
                localField: "nombreBanco",
                foreignField: "nombre",
                let: {
                    documento: "$cedula", finanzas: "$actividadFinanciera.tipo", dineroMonto: "$actividadFinanciera.monto",
                    tasaN: "$actividadFinanciera.tasaNominal", plazo: "$actividadFinanciera.tiempo.cantidad",
                    medida: "$actividadFinanciera.tiempo.unidad"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$$documento", "$cedulaCliente"] }, {
                                        $or: [{ $eq: ["$$finanzas", "descuento simple : inversion"] },
                                        { $eq: ["$$finanzas", "descuento simple : financiamiento"] }]
                                    }
                                ]
                            }
                        }
                    }, {
                        $project: {
                            interes: {
                                $switch: {
                                    branches: [
                                        {
                                            case:
                                            {
                                                $eq: ["$$medida", "dias"]
                                            },
                                            then:
                                            {
                                                $let: {
                                                    vars: {
                                                        capital: {
                                                            $divide: ['$$dineroMonto', {
                                                                $add: [1, {
                                                                    $multiply: [{ $divide: ['$$tasaN', 360] },
                                                                        '$$plazo']
                                                                }]
                                                            }]
                                                        }
                                                    },
                                                    in: {
                                                        $multiply: ["$$capital", { $multiply: [{ $divide: ['$$tasaN', 360] }, '$$plazo'] }]
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            case:
                                            {
                                                $eq: ["$$medida", "meses"]
                                            },
                                            then:
                                            {
                                                $let: {
                                                    vars: {
                                                        capital: {
                                                            $divide: ['$$dineroMonto', {
                                                                $add: [1, {
                                                                    $multiply: [{ $divide: ['$$tasaN', 12] },
                                                                        '$$plazo']
                                                                }]
                                                            }]
                                                        }
                                                    },
                                                    in: {
                                                        $multiply: ["$$capital", { $multiply: [{ $divide: ['$$tasaN', 12] }, '$$plazo'] }]
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            case:
                                            {
                                                $eq: ["$$medida", "años"]
                                            },
                                            then:
                                            {
                                                $let: {
                                                    vars: {
                                                        capital: {
                                                            $divide: ['$$dineroMonto', {
                                                                $add: [1, {
                                                                    $multiply: [{ $divide: ['$$tasaN', 1] },
                                                                        '$$plazo']
                                                                }]
                                                            }]
                                                        }
                                                    },
                                                    in: {
                                                        $multiply: ["$$capital", { $multiply: [{ $divide: ['$$tasaN', 1] }, '$$plazo'] }]
                                                    }
                                                }
                                            }
                                        }
                                    ], default: "No hay datos!!!."
                                }
                            }
                        }
                    }
                ],
                as: "transaccion"
            }
        },
        {
            $unwind: "$transaccion"
        },
        {
            $addFields: {
                financiamiento: "$actividadFinanciera.tipo", plazo: "$actividadFinanciera.tiempo.cantidad",
                unidad: "$actividadFinanciera.tiempo.unidad", monto: "$actividadFinanciera.monto",
                tasaNominal: "$actividadFinanciera.tasaNominal", interes: "$transaccion.interes"
            }
        },
        {
            $addFields: {
                capital:
                {
                    $switch: {
                        branches:
                            [
                                {
                                    case: {
                                        $eq: ["$actividadFinanciera.tiempo.unidad", "dias"]
                                    },
                                    then: {
                                        $divide: ['$actividadFinanciera.monto', {
                                            $add: [1, {
                                                $multiply: [{ $divide: ['$actividadFinanciera.tasaNominal', 360] },
                                                    '$actividadFinanciera.tiempo.cantidad']
                                            }]
                                        }]
                                    }
                                },
                                {
                                    case: {
                                        $eq: ["$actividadFinanciera.tiempo.unidad", "meses"]
                                    },
                                    then: {
                                        $divide: ['$actividadFinanciera.monto', {
                                            $add: [1, {
                                                $multiply: [{ $divide: ['$actividadFinanciera.tasaNominal', 12] },
                                                    '$actividadFinanciera.tiempo.cantidad']
                                            }]
                                        }]
                                    }
                                },
                                {
                                    case: {
                                        $eq: ["$actividadFinanciera.tiempo.unidad", "años"]
                                    },
                                    then: {
                                        $divide: ['$actividadFinanciera.monto', {
                                            $add: [1, {
                                                $multiply: [{ $divide: ['$actividadFinanciera.tasaNominal', 1] },
                                                    '$actividadFinanciera.tiempo.cantidad']
                                            }]
                                        }]
                                    }
                                }

                            ], default: "No hay datos!!!."
                    }
                }
            }
        },
        {
            $project: {
                nombre: 1, apellido: 1, cedula: 1, nombreBanco: 1, financiamiento: 1, interes: 1, capital: 1,
                tasaNominal: 1, plazo: 1, unidad: 1, _id: 0, monto: 1
            }
        }
    ])
    done(undefined, data);
}
//Metodo para calcular el interes compuesto
async function getInteresCompuesto(usuario, done) {
    const data = await usuario.aggregate([
        {
            $lookup:
            {
                from: "bancos",
                localField: "nombreBanco",
                foreignField: "nombre",
                let: {
                    documento: "$cedula", finanzas: "$actividadFinanciera.tipo", dineroCapital: "$actividadFinanciera.capital",
                    tasaN: "$actividadFinanciera.tasaNominal", plazo: "$actividadFinanciera.tiempo.cantidad",
                    medida: "$actividadFinanciera.tiempo.unidad"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$$documento", "$cedulaCliente"] }, { $eq: ["$$finanzas", "interes compuesto"] }
                                ]
                            }
                        }
                    }, {
                        $project: {
                            interes: {
                                $switch: {
                                    branches: [
                                        {
                                            case: {
                                                $eq: ["$$medida", "dias"]
                                            },
                                            then: {
                                                $let: {
                                                    vars: {
                                                        monto: {
                                                            $multiply: ["$$dineroCapital",
                                                                { $pow: [{ $add: [1, { $divide: ["$$tasaN", 360] }] }, "$$plazo"] }]
                                                        }
                                                    },
                                                    in: {
                                                        $subtract: ["$$monto", "$$dineroCapital"]
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            case: {
                                                $eq: ["$$medida", "meses"]
                                            },
                                            then: {
                                                $let: {
                                                    vars: {
                                                        monto: {
                                                            $multiply: ["$$dineroCapital",
                                                                { $pow: [{ $add: [1, { $divide: ["$$tasaN", 12] }] }, "$$plazo"] }]
                                                        }
                                                    },
                                                    in: {
                                                        $subtract: ["$$monto", "$$dineroCapital"]
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            case: {
                                                $eq: ["$$medida", "años"]
                                            },
                                            then: {
                                                $let: {
                                                    vars: {
                                                        monto: {
                                                            $multiply: ["$$dineroCapital",
                                                                { $pow: [{ $add: [1, { $divide: ["$$tasaN", 1] }] }, "$$plazo"] }]
                                                        }
                                                    },
                                                    in: {
                                                        $subtract: ["$$monto", "$$dineroCapital"]
                                                    }
                                                }
                                            }
                                        },
                                    ], default: "No hay datos!!!"
                                }
                            }
                        }
                    }
                ],
                as: "transaccion"
            }
        },
        {
            $unwind: "$transaccion"
        },
        {
            $addFields: {
                financiamiento: "$actividadFinanciera.tipo", plazo: "$actividadFinanciera.tiempo.cantidad",
                unidad: "$actividadFinanciera.tiempo.unidad", capital: "$actividadFinanciera.capital",
                tasaNominal: "$actividadFinanciera.tasaNominal", interes: "$transaccion.interes",
            }
        },
        {
            $addFields: {
                monto:
                {
                    $switch: {
                        branches:
                            [
                                {
                                    case: {
                                        $eq: ["$actividadFinanciera.tiempo.unidad", "dias"]
                                    },
                                    then: {
                                        $multiply: ["$actividadFinanciera.capital",
                                            {
                                                $pow: [{ $add: [1, { $divide: ["$actividadFinanciera.tasaNominal", 360] }] },
                                                    "$actividadFinanciera.tiempo.cantidad"]
                                            }]
                                    }
                                },
                                {
                                    case: {
                                        $eq: ["$actividadFinanciera.tiempo.unidad", "meses"]
                                    },
                                    then: {
                                        $multiply: ["$actividadFinanciera.capital",
                                            {
                                                $pow: [{ $add: [1, { $divide: ["$actividadFinanciera.tasaNominal", 12] }] },
                                                    "$actividadFinanciera.tiempo.cantidad"]
                                            }]
                                    }
                                },
                                {
                                    case: {
                                        $eq: ["$actividadFinanciera.tiempo.unidad", "años"]
                                    },
                                    then: {
                                        $multiply: ["$actividadFinanciera.capital",
                                            {
                                                $pow: [{ $add: [1, { $divide: ["$actividadFinanciera.tasaNominal", 1] }] },
                                                    "$actividadFinanciera.tiempo.cantidad"]
                                            }]
                                    }
                                }
                            ], default: "No hay datos!!!"
                    }
                }
            }
        },
        {
            $project: {
                nombre: 1, apellido: 1, cedula: 1, nombreBanco: 1, financiamiento: 1, interes: 1, capital: 1,
                tasaNominal: 1, plazo: 1, unidad: 1, _id: 0, monto: 1
            }
        }
    ]);
    done(undefined, data);
}
//Metodo para calcular el descuento compuesto
async function getDescuentoCompuesto(usuario, done) {
    const data = await usuario.aggregate([
        {
            $lookup:
            {
                from: "bancos",
                localField: "nombreBanco",
                foreignField: "nombre",
                let: {
                    documento: "$cedula", finanzas: "$actividadFinanciera.tipo", dineroMonto: "$actividadFinanciera.monto",
                    tasaN: "$actividadFinanciera.tasaNominal", plazo: "$actividadFinanciera.tiempo.cantidad",
                    medida: "$actividadFinanciera.tiempo.unidad", periodosTiempo: "$actividadFinanciera.periodos"
                },
                pipeline:
                    [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$$documento", "$cedulaCliente"] }, { $eq: ["$$finanzas", "descuento compuesto"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                valoresPresentes: {
                                    $switch: {
                                        branches: [
                                            {
                                                case: {
                                                    $eq: ["$$medida", "años"]
                                                },
                                                then: {
                                                    $map: {
                                                        input: "$$periodosTiempo",
                                                        as: "año",
                                                        in: {
                                                            Año: "$$año",
                                                            valor: {
                                                                $divide: ["$$dineroMonto",
                                                                    { $pow: [{ $add: [1, { $divide: ["$$tasaN", 1] }] }, "$$año"] }]
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                case: {
                                                    $eq: ["$$medida", "meses"]
                                                },
                                                then: {
                                                    $map: {
                                                        input: "$$periodosTiempo",
                                                        as: "año",
                                                        in: {
                                                            Año: "$$año",
                                                            valor: {
                                                                $divide: ["$$dineroMonto",
                                                                    { $pow: [{ $add: [1, { $divide: ["$$tasaN", 12] }] }, "$$año"] }]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ], default: "No hay datos!!!"
                                    }
                                }
                            }
                        }
                    ], as: "transaccion"
            }
        },
        {
            $unwind: "$transaccion"
        },
        {
            $addFields: {
                financiamiento: "$actividadFinanciera.tipo", unidad: "$actividadFinanciera.tiempo.unidad",
                tasaNominal: "$actividadFinanciera.tasaNominal", periodos: "$actividadFinanciera.tiempo.cantidad",
                monto: "$actividadFinanciera.monto", inversion: "$actividadFinanciera.inversionInicial",
                resultado:"$transaccion.valoresPresentes.valor", año:"$transaccion.valoresPresentes.Año",
                inversionInicial:"$actividadFinanciera.inversionInicial"
                
            }
        },
        {
            $unwind: "$resultado"
        },
        {
            $project: {
                nombre: 1, apellido: 1, cedula: 1, nombreBanco: 1, financiamiento: 1,
                tasaNominal: 1, unidad: 1, _id: 0, monto: 1, periodos: 1, inversion: 1,
                resultado: 1, año: 1, total:1, inversionInicial:1
            }
        }
    ]);
    done(undefined, data)
}
    //Metodo para calcular la sumatoria de todos los valores presentes
    async function getSumValoresPresentes(usuario, done){
        const data = await usuario.aggregate([
            {
                $lookup:
                {
                    from: "bancos",
                    localField: "nombreBanco",
                    foreignField: "nombre",
                    let: {
                        documento: "$cedula", finanzas: "$actividadFinanciera.tipo", dineroMonto: "$actividadFinanciera.monto",
                        tasaN: "$actividadFinanciera.tasaNominal", plazo: "$actividadFinanciera.tiempo.cantidad",
                        medida: "$actividadFinanciera.tiempo.unidad", periodosTiempo: "$actividadFinanciera.periodos"
                    },
                    pipeline:
                        [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$$documento", "$cedulaCliente"] }, { $eq: ["$$finanzas", "descuento compuesto"] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    valoresPresentes: {
                                        $switch: {
                                            branches: [
                                                {
                                                    case: {
                                                        $eq: ["$$medida", "años"]
                                                    },
                                                    then: {
                                                        $map: {
                                                            input: "$$periodosTiempo",
                                                            as: "año",
                                                            in: {
                                                                Año: "$$año",
                                                                valor: {
                                                                    $divide: ["$$dineroMonto",
                                                                        { $pow: [{ $add: [1, { $divide: ["$$tasaN", 1] }] }, "$$año"] }]
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    case: {
                                                        $eq: ["$$medida", "meses"]
                                                    },
                                                    then: {
                                                        $map: {
                                                            input: "$$periodosTiempo",
                                                            as: "año",
                                                            in: {
                                                                Año: "$$año",
                                                                valor: {
                                                                    $divide: ["$$dineroMonto",
                                                                        { $pow: [{ $add: [1, { $divide: ["$$tasaN", 12] }] }, "$$año"] }]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            ], default: "No hay datos!!!"
                                        }
                                    }
                                }
                            }
                        ], as: "transaccion"
                }
            },
            {
                $unwind: "$transaccion"
            },
            {
                $addFields: {
                   
                    resultado: "$transaccion.valoresPresentes.valor"
                }
            },
            {
                $unwind: "$resultado"
            },
            {
                $group: {
                    _id: "$nombre", sumaValoresPresentes: { $sum: "$resultado" }
                }

            },
            {
                $addFields: {
                    sumaValoresPresentes: "$sumaValoresPresentes"
                }
            },
            {
                $project: {
                    sumaValoresPresentes: 1, _id: 0
                }
            },
        ])
    done(undefined, data)
}
module.exports = { getInteresSimple, getDescuentoSimple, getInteresCompuesto, getDescuentoCompuesto, getSumValoresPresentes };






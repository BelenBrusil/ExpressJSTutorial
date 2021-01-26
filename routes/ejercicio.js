var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

router.get('/', function(req, res, next) {
    res.render('ejercicio/ejercicio',{
        fechaI: '',
        fechaF: ''
    })
})

router.post('/resultados', function(req, res, next) {
    let fechaI = req.body.fechaI;
    let fechaF = req.body.fechaF;
    console.log(fechaI);
    console.log(fechaF);
    dbConn.query('SELECT distinct(idcliente) FROM detallescompra where fechaContrato BETWEEN \'' + fechaI + '\' AND \'' + fechaF + '\'', function(err, rows, fields){
        if(err){
            res.render('ejercicio/ejercicio')
            console.log('error');
        }else{
            console.log('resultado');
           let matrizM = [];
           let rep = rows.length;
           let monto;
           let idcliente;
           let nombre;
           if(rows.length === 0){
                res.render('ejercicio/resultados',{
                    matrizM : matrizM
                });
            }
           for(let i = 0; i < rep ; i++){
               idcliente = rows[i].idcliente,
               dbConn.query('SELECT  sum(monto) AS monto, nombre FROM detallescompra inner join clientes on detallescompra.idcliente = clientes.idclientes WHERE fechaContrato BETWEEN \'' + fechaI + '\' AND \'' + fechaF + '\' AND idcliente = '  + idcliente, function(err, rows, fields){
                    if(err){
                        console.log('error2');
                        monto = 0;
                        if(i === rep - 1){
                            res.render('ejercicio/ejercicio')
                        }
                    }else{
                        console.log('resultado2');
                        monto = rows[0].monto;
                        console.log(monto);
                        nombre = rows[0].nombre;
                        console.log(nombre);
                        matrizM.push([nombre,monto]);
                        if(i === rep - 1){
                            res.render('ejercicio/resultados',{
                                matrizM : matrizM
                            });
                        }
                    }
                });
           }
        }
    });
})

module.exports = router;

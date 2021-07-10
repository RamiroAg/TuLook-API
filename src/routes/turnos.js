const { Router, request } = require('express');
const router = Router();
const _ = require('underscore');
const fs = require('fs');

const TurnosService = require('../services/TurnoService');
const TurnosServiceInstance = new TurnosService();

const turnos = require('../data/turnos.json');

router.get('/', (req, res) => {
    const turnos = getTurnos();
    res.send(turnos)
});


router.get('/byPeluqueria/:peluqueriaId', (req, res) => {
    const { peluqueriaId } = req.params;

    res.send(turnos.filter(
        function (t) {
            return t.peluqueriaId == peluqueriaId
                && t.estado != 3;
        }
    ));
});

// router.get('/probando-1/:peluqueriaId/:fecha', (req, res) => {
//     const { peluqueriaId, fecha } = req.params;

//     let date = new Date(fecha);
//     if (!isNaN(date)) {
//         res.status(200)
//         .send(TurnosServiceInstance.getAllFranjasByPeluqueria(peluqueriaId, date));        
//     }
//     else{
//         res.status(500).send({'error':'Fecha inválida'});
//     }
// });

router.get('/turnosLibres/:peluqueriaId/:fecha', (req, res) => {
    const { peluqueriaId, fecha } = req.params;
console.log("Params: Fecha", fecha);
    // res.send(TurnosServiceInstance.getAllTurnosDisponibles(peluqueriaId, fecha));


    let date = new Date(fecha);
    if (!isNaN(date)) {
        res.status(200)
            // .send(TurnosServiceInstance.getAllFranjasByPeluqueria(peluqueriaId, date));
            .send(TurnosServiceInstance.getAllTurnosDisponibles(peluqueriaId, fecha));
    }
    else {
        res.status(500).send({ 'error': 'Fecha inválida' });
    }
});

router.get('/byPeluqueria/:peluqueriaId/:fecha', (req, res) => {
    const { peluqueriaId, fecha } = req.params;

    res.send(turnos.filter(
        function (t) {
            return t.peluqueriaId == peluqueriaId
                && t.fecha == fecha;
        }
    ));
});

router.get('/byUsuario/:usuarioId', (req, res) => {
    const { usuarioId } = req.params;

    res.send(turnos.filter(
        function (t) {
            return t.usuarioId == usuarioId
            && t.estado != 3;   //No muestro turnos
        }
    ));
});

router.post('/', (req, res) => {
    const { peluqueriaId, usuarioId, estado, fecha, duracion, servicios } = req.body;
    console.log("TUrnos/POST", peluqueriaId, usuarioId, estado, fecha, duracion, servicios);

    if (peluqueriaId && usuarioId && estado && fecha && duracion && servicios) {
        const id = turnos.length + 1;
        const newTurno = { ...req.body, id };

        turnos.push(newTurno);
        saveTurnos(turnos);

        res.status(200)
            .send(newTurno);
    }
    else {
        res.status(500)
            .json({ "error": "Error al recibir todos los parámetros" });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (estado) {
        _.each(turnos, (turno, i) => {
            if (turno.id == id) {
                turno.estado = estado;
            }
        });
        saveTurnos(turnos);
        res.status(200).json(turnos);
    }
    else {
        res.status(500)
            .json({ "error": "Error al recibir todos los parámetros" });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    _.each(turnos, (turno, i) => {
        if (turno.id == id) {
            turnos.splice(i, 1);
        }
    });

    saveTurnos(turnos);
    res.json(turnos);
});


//Manejo de Persistencia
const dataSource = 'src/data/turnos.json';

const saveTurnos = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataSource, stringifyData)
}

const getTurnos = () => {
    const jsonData = fs.readFileSync(dataSource)
    return JSON.parse(jsonData)
}
//Manejo de Persistencia /

module.exports = router;
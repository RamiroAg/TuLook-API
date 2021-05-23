const { Router, request } = require('express');
const router = Router();
const _ = require('underscore');
const fs = require('fs');

const turnos = require('../data/turnos.json');

router.get('/', (req, res) => {
    const turnos = getTurnos();
    res.send(turnos)
});

router.post('/', (req, res) => {
    const { peluqueriaId, usuarioId, estado, horario, duracion } = req.body;

    if (peluqueriaId && usuarioId && estado && horario && duracion) {
        const id = turnos.length + 1;
        const newTurno = { ...req.body, id };

        turnos.push(newTurno);
        saveTurnos(turnos);

        res.json(turnos);
    }
    else {
        res.status(500)
            .json({ "error": "Error al recibir todos los parámetros" });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { peluqueriaId, usuarioId, estado, horario, duracion } = req.body;

    if (peluqueriaId && usuarioId && estado && horario && duracion) {
        _.each(turnos, (turno, i) => {
            if (turno.id == id) {
                turno.peluqueriaId = peluqueriaId;
                turno.usuarioId = usuarioId;
                turno.estado = estado;
                turno.horario = horario;
                turno.duracion = duracion;
            }
        });
        saveTurnos(turnos); 
        res.json(turnos);
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
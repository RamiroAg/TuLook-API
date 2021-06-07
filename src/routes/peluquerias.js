const { Router, request } = require('express');
const router = Router();
const _ = require('underscore');
const fs = require('fs');

const peluquerias = require('../data/peluquerias.json');

const DireccionService = require('../services/DireccionService');
const DireccionServiceInstance = new DireccionService();
// console.log(peluquerias);

router.get('/', (req, res) => {
    const peluquerias = getPeluquerias();

    _.each(peluquerias, (peluqueria, i) => {
        if (peluqueria.direccionId) {
            peluqueria.direccion = DireccionServiceInstance.getById(peluqueria.direccionId);
        }
    });

    res.json(peluquerias);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    _.each(peluquerias, (peluqueria, i) => {
        if (peluqueria.id == id) {
            res.send(peluqueria);
        }
    });
    res.status(404)
        .json({ "error": "Entidad no encontrada" });
});

router.post('/', (req, res) => {
    const { nombre, direccionId, servicios,
        horarioApertura, horarioCierre, rating } = req.body;

    if (nombre && direccionId && servicios
        && horarioApertura && horarioCierre && rating) {
        const id = peluquerias.length + 1;
        const newPeluqueria = { ...req.body, id };

        peluquerias.push(newPeluqueria);
        savePeluquerias(peluquerias);

        res.status(200)
            .send(newPeluqueria);
    }
    else {
        res.status(500)
            .json({ "error": "Error al recibir todos los parámetros" });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, direccionId, servicios,
        horarioApertura, horarioCierre, rating } = req.body;

    if (nombre && direccionId && servicios
        && horarioApertura && horarioCierre && rating) {
        _.each(peluquerias, (peluqueria, i) => {
            if (peluqueria.id == id) {
                peluqueria.nombre = nombre;
                peluqueria.direccionId = direccionId;
                peluqueria.servicios = servicios;
                peluqueria.horarioApertura = horarioApertura;
                peluqueria.horarioCierre = horarioCierre;
                peluqueria.rating = rating;

                savePeluquerias(peluquerias);
            }
        });

        res.status(200)
            .json(peluquerias);
    }
    else {
        res.status(500)
            .json({ "error": "Error al recibir todos los parámetros" });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    _.each(peluquerias, (peluqueria, i) => {
        if (peluqueria.id == id) {
            peluquerias.splice(i, 1);
            savePeluquerias(peluquerias);
        }
    });
    res.json(peluquerias);
});



//Manejo de Persistencia
const dataSource = 'src/data/peluquerias.json';

const savePeluquerias = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataSource, stringifyData)
}

const getPeluquerias = () => {
    const jsonData = fs.readFileSync(dataSource)
    return JSON.parse(jsonData)
}
//Manejo de Persistencia /


module.exports = router;
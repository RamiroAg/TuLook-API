const { Router, request } = require('express');
const router = Router();
const _ = require('underscore');
const fs = require('fs');

const usuarios = require('../data/usuarios.json');

router.get('/', (req, res) => {
    const usuarios = getUsuarios();
    res.send(usuarios);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    _.each(usuarios, (usuario, i) => {
        if (usuario.id == id) {
            res.send(usuario);
        }
    });
    res.status(404)
        .json({ "error": "Entidad no encontrada" });
});

router.post('/', (req, res) => {
    const { nombre, apellido, direccion, peluqueriasFavoritas } = req.body;

    if (nombre && apellido && direccion && peluqueriasFavoritas) {
        const id = usuarios.length + 1;
        const newUsuario = { ...req.body, id };

        usuarios.push(newUsuario);
        saveUsuarios(usuarios);

        res.status(200)
            .send(newUsuario);
    }
    else {
        res.status(500)
            .json({ "error": "Error al recibir todos los parámetros" });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, direccion, peluqueriasFavoritas } = req.body;

    if (nombre && apellido && direccion && peluqueriasFavoritas) {
        _.each(usuarios, (usuario, i) => {
            if (usuario.id == id) {
                usuario.nombre = nombre;
                usuario.apellido = apellido;
                usuario.direccion = direccion;
                usuario.peluqueriasFavoritas = peluqueriasFavoritas;

                saveUsuarios(usuarios);
            }
        });
        res.status(200).json(usuarios);
    }
    else {
        res.status(500)
            .json({ "error": "Error al recibir todos los parámetros" });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    _.each(usuarios, (usuario, i) => {
        if (usuario.id == id) {
            usuarios.splice(i, 1);

            saveUsuarios(usuarios);
        }
    });
    res.json(usuarios);
});

//Manejo de Persistencia
const dataSource = 'src/data/usuarios.json';

const saveUsuarios = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataSource, stringifyData)
}

const getUsuarios = () => {
    const jsonData = fs.readFileSync(dataSource)
    return JSON.parse(jsonData)
}
//Manejo de Persistencia /

module.exports = router;
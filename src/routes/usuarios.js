const { Router, request } = require('express');
const router = Router();
const _ = require('underscore');
const fs = require('fs');
const admin = require('firebase-admin')

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
    const {
        id,
        nombre,
        notificationToken
    } = req.body;

    // nos tiene que mandar id la app porque vamos a usar el id de firebase para
    // identificar el usuario y "autenticar"
    if (id) {
        const newUsuario = { id, nombre, notificationToken }
        const previousUsuarioIndex = usuarios.findIndex(user => user.id === id);

        if (previousUsuarioIndex >= 0) {
            // si ya existia ese id hago upsert
            usuarios[previousUsuarioIndex] = {
                ...usuarios[previousUsuarioIndex],
                ...newUsuario
            }

            saveUsuarios(usuarios)

            res.status(200)
                .send({ id, nombre, notificationToken })
        } else if (nombre && notificationToken) {
            // si no existia ese id hago insert sin filtrar
            usuarios.push(newUsuario);
            saveUsuarios(usuarios);

            res.status(200)
                .send(newUsuario);
        } else {
            res.status(500)
                .json({ "error": "Error al recibir todos los parámetros" });
        }
    } else {
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


const notifyUsuario = (id, title, body) => {
    const usuarios = getUsuarios();
    const usuario = usuarios.find(usuario => usuario.id === id);

    if (!usuario || !usuario.notificationToken) return;

    admin.messaging().sendToDevice(usuario.notificationToken, {
        notification: {
            title,
            body
        }
    });

}
//Manejo de Persistencia /

module.exports.router = router;
module.exports.persistence = {
    saveUsuarios,
    getUsuarios,
    notifyUsuario
}
const _ = require('underscore');
const fs = require('fs');

class DireccionService {

    constructor() {
        this.direcciones = require('../data/direccion.json');
    }

    getById(id) {
        return this.direcciones.filter(function (d) {
            return (d.id == id);
        });
    }
}

module.exports = DireccionService;
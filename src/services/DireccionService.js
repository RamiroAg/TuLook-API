class DireccionService {

    constructor() {
        this.direcciones = require('../data/direccion.json');
    }

    getById(id) {
        return this.direcciones.filter(function (d) {
            return (d.id == id);
        })[0];
    }
}

module.exports = DireccionService;
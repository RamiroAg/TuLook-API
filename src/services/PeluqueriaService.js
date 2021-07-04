const _ = require('underscore');
const fs = require('fs');

class PeluqueriaService {

    constructor() {
        this.peluquerias = require('../data/peluquerias.json');
    }

    getById(id) {
        return this.peluquerias.filter(function (d) {
            return (d.id == id);
        })[0];
    }
}

module.exports = PeluqueriaService;
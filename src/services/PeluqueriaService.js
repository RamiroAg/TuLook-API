const _ = require('underscore');
const fs = require('fs');

class PeluqueriaService {

    constructor() {
        this.peluquerias = require('../data/peluquerias.json');
    }

    getById(id) {
        let p = null;
        p = this.peluquerias.filter(function (d) {
            return (d.id == id);
        })[0];
        
        console.log("Peluqueria", p);
        return p;
    }
}

module.exports = PeluqueriaService;
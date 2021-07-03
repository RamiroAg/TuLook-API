const _ = require('underscore');
const fs = require('fs');

const reviews = require('../data/reviews.json');

class ReviewService {
    constructor() {
        this.reviews = require('../data/reviews.json');
        this.turnos = require('../data/turnos.json');
    }

    getByTurnoId(turnoId) {
        return this.reviews.filter(function (r) {
            return (r.turnoId == turnoId);
        })[0];
    }

    getByPeluqueria(peluqueriaId) {
        //Levantar todos los turnos de la peluquería
        var turnosByPeluqueria = this.turnos.filter(
            function (t) {
                return (t.peluqueriaId == peluqueriaId)
            });
        //Para cada turno levantar el review por ID y meterlo en un array
        var ret = [];
        _.each(turnosByPeluqueria, (t, i) => {
            const _review = this.getByTurnoId(t.id);
            if (_review) {
                ret.push(_review);
            }
        });

        return ret;
    }

    //Manejo de Persistencia
    dataSource = 'src/data/reviews.json';

    saveReviews = (data) => {
        const stringifyData = JSON.stringify(data)
        fs.writeFileSync(dataSource, stringifyData)
    }

    getReviews = () => {
        const jsonData = fs.readFileSync(dataSource)
        return JSON.parse(jsonData)
    }
    //Manejo de Persistencia /
}

module.exports = ReviewService;
const { Router, request } = require('express');
const router = Router();
const _ = require('underscore');
const fs = require('fs');

const reviews = require('../data/reviews.json');

router.get('/', (req, res) => {
    const reviews = getReviews();
    res.send(reviews)
});

router.post('/', (req, res) => {
    const { turnoId, comentario, calificacion } = req.body;

    if (turnoId && comentario && calificacion) {
        const id = reviews.length + 1;
        const newReview = { ...req.body, id };

        reviews.push(newReview);
        saveReviews(reviews);

        res.json(reviews);
    }
    else {
        res.status(500)
            .json({ "error": "Error al recibir todos los parámetros" });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { turnoId, comentario, calificacion } = req.body;

    if (turnoId && comentario && calificacion) {
        _.each(reviews, (review, i) => {
            if (review.id == id) {
                review.turnoId = turnoId;
                review.comentario = comentario;
                review.calificacion = calificacion;

                saveReviews(reviews);
            }
        });
        res.json(reviews);
    }
    else {
        res.status(500)
            .json({ "error": "Error al recibir todos los parámetros" });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    _.each(reviews, (review, i) => {
        if (review.id == id) {
            reviews.splice(i, 1);

            saveReviews(reviews);
        }
    });
    res.json(reviews);
});


//Manejo de Persistencia
const dataSource = 'src/data/reviews.json';

const saveReviews = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataSource, stringifyData)
}

const getReviews = () => {
    const jsonData = fs.readFileSync(dataSource)
    return JSON.parse(jsonData)
}
//Manejo de Persistencia /

module.exports = router;
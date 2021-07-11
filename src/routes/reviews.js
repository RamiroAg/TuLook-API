const { Router, request } = require('express');
const router = Router();
const _ = require('underscore');
const fs = require('fs');

const reviews = require('../data/reviews.json');

const ReviewService = require('../services/ReviewService');
const ReviewServiceInstance = new ReviewService();

router.get('/', (req, res) => {
    const reviews = getReviews();
    res.send(reviews)
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    _.each(reviews, (review, i) => {
        if (review.id == id) {
            res.send(review);
        }
    });
    res.status(404)
        .json({ "error": "Entidad no encontrada" });
});

router.get('/byPeluqueria/:peluqueriaId', (req, res) => {
    const { peluqueriaId } = req.params;

    const r = ReviewServiceInstance.getByPeluqueria(peluqueriaId);
    //Levantar todos los turnos de la peluquería
    //Para cada turno levantar el review y meterlo en un array

    res.send(r);
});

router.get('/byUsuario/:usuarioId', (req, res) => {
    const { usuarioId } = req.params;

    res.send(reviews.filter(
        function (t) {
            return t.usuarioId == usuarioId;
        }
    ));
});

router.post('/', (req, res) => {
    const { comentario, calificacion, peluqueriaId, usuarioId } = req.body;

    if (comentario && calificacion && peluqueriaId && usuarioId) {
        const id = reviews.length + 1;
        const newReview = { ...req.body, id };

        reviews.push(newReview);
        saveReviews(reviews);

        res.status(200)
            .send(newReview);
    }
    else {
        res.status(500)
            .json({ "error": "Error al recibir todos los parámetros" });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { comentario, calificacion, peluqueriaId, usuarioId } = req.body;

    if (comentario && calificacion && peluqueriaId && usuarioId) {
        _.each(reviews, (review, i) => {
            if (review.id == id) {
                review.comentario = comentario;
                review.calificacion = calificacion;
                review.peluqueriaId = peluqueriaId;
                review.usuarioId = usuarioId;

                saveReviews(reviews);
            }
        });
        res.status(200)
            .json(reviews);
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

module.exports.router = router;
module.exports.persistence = {
    saveReviews,
    getReviews
}

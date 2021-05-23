const {Router} = require('express');
const router = Router();

//Routes
router.get('/', (req, res) => {
    res.json({"Title": "Tu Look - Rest API "});
});

module.exports = router;
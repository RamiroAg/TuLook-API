const express = require('express');
const app = express();
const morgan = require('morgan');
const admin = require('firebase-admin')

//Settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Firebase
//TODO: Descomentar
// const config = process.env.GOOGLE_CONFIG_BASE64 ?? require('./data/firebase_data.json').GOOGLE_CONFIG_BASE64;
// const cert = JSON.parse(Buffer.from(config, 'base64').toString('ascii'));

// admin.initializeApp({
//     credential: admin.credential.cert(cert)
// })


//Routes
app.use(require('./routes/index'));

app.use('/api/peluquerias', require('./routes/peluquerias'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/turnos', require('./routes/turnos'));
app.use('/api/reviews', require('./routes/reviews'));

//Starting server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
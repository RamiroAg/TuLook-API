const _ = require('underscore');
const fs = require('fs');
const PeluqueriaService = require('./PeluqueriaService');

class TurnoService {

    constructor() {
        this.turnos = require('../data/turnos.json');
        this.peluqueriaService = new PeluqueriaService();
    }

    getAllFranjasByPeluqueria(peluqueriaId, fecha) {
        try {
            fecha = new Date(fecha);
            console.log("Fecha", fecha);
            let p = this.peluqueriaService.getById(peluqueriaId);
            
            console.log("apertura/cierre pre cambio", p.horarioApertura, p.horarioCierre);
            p.horarioApertura = new Date(this.setDate(p.horarioApertura, fecha));
            p.horarioCierre = new Date(this.setDate(p.horarioCierre, fecha));
    
            console.log("apertura/cierre", p.horarioApertura, p.horarioCierre);
    
            let franjas = [];
            let franja = new Date(p.horarioApertura);
    
            let horarioCierre = new Date(p.horarioCierre);
            // console.log('Horario Apertura', p.horarioApertura);
            // console.log('Horario Cierre', horarioCierre);
            // console.log('Turno', turno);
            if (!isNaN(horarioCierre)) {
                while (franja.getTime() != horarioCierre.getTime()) {
                    franjas.push(franja);
                    franja = new Date(franja.getTime() + 30 * 60000);
                }
            }
    
            return franjas;
            
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    getAllTurnosDisponibles(peluqueriaId, fecha) {
        // let franjasHorarias = this.getAllFranjasByPeluqueria(peluqueriaId, fecha);
        let turnosOcupados = this.getByPeluqueriaAndFecha(peluqueriaId, fecha);
        let franjasOcupadas = [];

        console.log('Turnos ocupados', turnosOcupados);

        _.each(turnosOcupados, (t, i) => {
            console.log('Turno - Fecha: ', t.fecha)
            var cantidadFranjas = Math.floor(t.duracion / 30);
            console.log('cantidad de franjas', cantidadFranjas, t.duracion);

            for (let index = 0; index < cantidadFranjas; index++) {
                console.log('minutos', new Date(t.fecha).getMinutes());
                var franja = new Date(t.fecha);
                franja = new Date(Date.UTC(franja.getFullYear(), franja.getMonth(), franja.getDate(), franja.getHours(), franja.getMinutes()));
                console.log("Franja antes de aumentar minutos", franja);
                franja.setMinutes(franja.getMinutes() + (30 * index));
                // franja = new Date(Date.UTC(franja));
                // console.log("probando si está bien", franja);
                console.log('insertandoFranja ocupada', franja);
                franjasOcupadas.push(franja);
                console.log('Turno - Franjas que ocupa', t.id,
                    franja);
            }

        });

        let franjasDiarias = this.getAllFranjasByPeluqueria(peluqueriaId, fecha);
        // console.log('franjasDiarias', franjasDiarias);
        _.each(franjasOcupadas, (o, i) => {
            o = new Date(o);
            for (let index = 0; index < franjasDiarias.length; index++) {
                const f = franjasDiarias[index];

                // console.log('comparacion ocupada/franja', o, f);

                if (o.getHours() == f.getHours()
                    && o.getMinutes() == f.getMinutes()) {
                    franjasDiarias.splice(index, 1);
                    continue;
                }
            }
        });
        // console.log('Franjas libres', franjasDiarias);
        return franjasDiarias;
    }

    getByPeluqueriaAndFecha(peluqueriaId, fecha) {
        console.log('getByPeluqueriaAndFecha - Fecha', new Date(fecha));

        // let todosLosTurnos = this.turnos.filter(
        //     function (t) {
        //         return t.peluqueriaId == peluqueriaId;
        //     }
        // );

        // console.log('todos los turnos: ', todosLosTurnos);
        // let fecha2 = new Date(todosLosTurnos[0].fecha);
        fecha = new Date(fecha);
        // console.log("fecha convertida", fecha );

        // console.log('param', fecha, fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
        // console.log('dato', fecha2, fecha2.getFullYear(), fecha2.getMonth(), fecha2.getDate());

        return this.turnos.filter(
            function (t) {
                let date = new Date(t.fecha);
                return t.peluqueriaId == peluqueriaId
                    && t.estado != 3
                    && date.getFullYear() == fecha.getFullYear()
                    && date.getMonth() == fecha.getMonth()
                    && date.getDate() == fecha.getUTCDate();
            }
        )
    }

    getById(id) {
        return this.turnos.filter(function (d) {
            return (d.id == id);
        })[0];
    }

    setDate(target, date) {
        try {
            console.log("SetDate-------------------------------------------------------");
            console.log("params: (target, date)", target, date);
            date = new Date(date);
            // var ret = new Date(target).setFullYear(date.getFullYear(), date.getMonth(), date.getUTCDate());
            var ret = new Date(target).setFullYear(date.getFullYear(), date.getMonth(), date.getUTCDate());
            console.log("target", target);
            console.log("date", date);
            console.log("new date", new Date(date), date.getUTCDate());
            console.log("ret", new Date(ret));
            return ret;
        } catch (error) {
            console.log(error);
            return null;
        }

    }

    getDateUTC(date) {
        // console.log("    getDateUTC-----------------------------------------------------");
        // console.log("params: (date)", date);
        // var d = new Date(date);
        // console.log("var aux d", d);
        // let ret = null;
        // if (d) {
        //     ret = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()))
        // }
        // console.log("getDateUTC", d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
        // return ret;
        return new Date(date);
    }
}

module.exports = TurnoService;
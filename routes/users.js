const express = require('express');
const route = express.Router();
const { users, materias, cursos } = require('../database')
var jwt = require('jsonwebtoken');

// PUNTO 2
route.post('/users', (req, res) => {

    console.log("Post");

    if(req.body.nombre == null || req.body.nombre == "") {
        return res.json({code: 101, data: "Debe ingresar el nombre"});
    }
    else if(req.body.clave == null || req.body.clave == "") {
        return res.json({code: 102, data: "Debe ingresar la clave"});
    }
    else  if(req.body.tipo == null || req.body.tipo == "") {
        return res.json({code: 103, data: "Debe ingresar el tipo"});
    }
    else  if(req.body.email == null || req.body.email == "") {
        return res.json({code: 104, data: "Debe ingresar el email"});
    }

    const newUser = new users({
        email: req.body.email,
        name: req.body.nombre,
        password: req.body.clave,
        type: req.body.tipo
    });
    
    newUser.save((err, data) => {
        
        if(err) {
            return res.json({code: 105, data: err});
        }

        return res.json({code: 200, data: data});
    });

});

// PUNTO 3
route.post('/login', (req, res) => {

    console.log("login:" + req.body);

    users.findOne({password: req.body.clave, email: req.body.email},(err, data) => {

        console.log("data:" + data);

        if(err) {
            return res.json({code: 107, data: err});
        }

        if(data == null) {
            return res.json({code: 108, data: "Los datos ingresados no corresponden a un usuario registrado"});
        }

        var token = jwt.sign({ clave: req.body.clave, email: req.body.email }, 'shhhhh');
        return res.json(token);

    });

});

// MIDDLEWARE
route.use((req, res, next) => {

    try {

        var decoded = jwt.verify(req.headers.token, 'shhhhh');
        console.log("token decode:" + decoded);
        
        req.clave = decoded.clave;
        req.email = decoded.email;


    } catch(err) {

        return res.json("Token invalido");  
    }

    next();

})

// PUNTO 4
route.post('/materia', (req, res) => {

    console.log("post materia");

    if(req.body.materia == null || req.body.materia == "") {
        return res.json({code: 101, data: "Debe ingresar materia"});
    }
    else if(req.body.cupos == null || req.body.cupos == "") {
        return res.json({code: 102, data: "Debe ingresar cupos"});
    }
    else  if(req.body.cuatrimestre == null || req.body.cuatrimestre == "") {
        return res.json({code: 103, data: "Debe ingresar cuatrimestre"});
    }

    users.findOne({password: req.clave, email: req.email},(err, data) => {

        console.log("data:" + data);

        if(err) {
            return res.json({code: 107, data: err});
        }

        if(data == null) {
            return res.json({code: 108, data: "Los datos ingresados no corresponden a un usuario registrado"});
        }

        if(data.type != "admin"){
            return res.json({code: 108, data: "Debe ser admin para ingresar materias"});
        }

        const newMateria = new materias({
            materia: req.body.materia,
            cupos: req.body.cupos,
            cuatrimestre: req.body.cuatrimestre
        });
    
        newMateria.save((err, data) => {
            
            if(err) {
                return res.json({code: 105, data: err});
            }
    
            return res.json({code: 200, data: data});
        });

    });

});

// PUNTO 5
route.post('/inscripcion/:idMateria', (req, res) => {

    console.log("inscripcion");

    var idMateria = req.params.idMateria;
    console.log("idMateria" + idMateria);

    materias.findOne({materia: idMateria},(err, data) => {

        console.log("materia:" + data);

        if(err) {
            return res.json({code: 107, data: err});
        }

        if(data == null) {
            return res.json({code: 108, data: "Los datos ingresados no corresponden a una materia"});
        }

        users.findOne({password: req.clave, email: req.email},(err, user) => {

            console.log("user:" + user);
    
            if(err) {
                return res.json({code: 107, user: err});
            }
    
            if(user.type != "alumno"){
                return res.json({code: 108, data: "Debe ser alumno para inscripcion"});
            }
    
            const newCurso = new cursos({
                materia: idMateria,
                alumno: req.email
            });
        
            newCurso.save((err, data) => {
                
                if(err) {
                    return res.json({code: 105, data: err});
                } 
        
                return res.json({code: 200, data: data});
            });
    
        });

    });

});

// PUNTO 6
route.put('/notas/:idMateria', (req, res) => {

    console.log("notas");
    console.log(req.body);
    console.log(req.params.idMateria);

    var idMateria = req.params.idMateria;

    users.findOne({password: req.clave, email: req.email},(err, user) => {

        //console.log("user:" + user);

        if(err) {
            return res.json({code: 107, data: err});
        }

        if(user.type != "profesor"){
            return res.json({code: 108, data: "Debe ser profesor para ingresar una nota"});
        }

        cursos.updateOne({materia: idMateria, alumno: req.body.alumno}, { nota: req.body.nota }, (err, data) => {

            if(err) {
                return res.json({code: 107, data: err});
            }
    
            return res.json({code: 200, data: data});
        });

    });

});

// PUNTO 8
route.get('/materia', (req, res) => {

    console.log("materia alumnos");

    users.findOne({password: req.clave, email: req.email},(err, user) => {

        console.log("user:" + user);

        if(err) {
            return res.json({code: 107, data: err});
        }

        if(user.type != "alumno"){
            return res.json({code: 108, data: "Debe ser alumno para ver las inscripciones"});
        }

        cursos.find({alumno: user.email},(err, cursos) => {

            if(err) {
                return res.json({code: 107, data: err});
            }

            return res.json({code: 200, data: cursos});

        });

    });

});

module.exports = route;
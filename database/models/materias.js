const { model, Schema } = require('../db');

const materiaSchema = Schema({
    materia: {
        type: String,
        require: true
    },
    cupos: {
        type: Number,
        require: true
    },
    cuatrimestre: {
        type: Number,
        require: true
    }
},
{
    timestamp: {
        createdAt: 'created_at',
        updatedAt: 'update_at'
    }
}
);

const materiaModel = model('Materias', materiaSchema);

module.exports = materiaModel;
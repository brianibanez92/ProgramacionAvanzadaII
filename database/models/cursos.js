const { model, Schema } = require('../db');

const cursoSchema = Schema({
    materia: {
        type: String,
        require: true
    },
    alumno: {
        type: String,
        require: true
    },
    nota: {
        type: Number,
        default: 0
    }
},
{
    timestamp: {
        createdAt: 'created_at',
        updatedAt: 'update_at'
    }
}
);

const cursoModel = model('Cursos', cursoSchema);

module.exports = cursoModel;
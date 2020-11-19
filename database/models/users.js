const { model, Schema } = require('../db');

const userSchema = Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    type: {
        type: String,
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

const userModel = model('Users', userSchema);

module.exports = userModel;
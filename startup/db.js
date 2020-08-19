const mongoose = require("mongoose");

module.exports = function() {
    const dbUser = 'bagishman';
    const dbPassword = 'GGv4b49VZ1jG40xz';

    mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0-pyp0b.mongodb.net/options?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected to the DB'));
};
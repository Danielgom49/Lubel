const bcryptjs = require('bcryptjs');
const helpers = {};

// función para encriptar las contraseña
helpers.encrypt = async (password) => {
    const salt = await bcryptjs.genSalt(10); // para crear un hash
    const hash = bcryptjs.hash(password, salt); // empieza a cifrar la contraseña
    return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcryptjs.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
    }
};

module.exports = helpers;
const mongoose = require("mongoose");

// creación del schema
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required: [true, "El nombre es obligatorio"]
    },
    email:{
        type:String,
        required: [true, "El correo  es obligatorio"],
        unique: true,   
        lowercase: true
    },
    password:{
        type:String,
        required:[true, "La contraseña es obligatoria"]
    }

});

//creación del modelo
module.exports = mongoose.model("User", userSchema);
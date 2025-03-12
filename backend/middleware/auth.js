const jwt = require("jsonwebtoken");

// next: si la petición funciona entonces continuar con el proceso
const auth = (req, res, next) =>{
    const authHeader = req.header("Authorization");

    //Autorization = Bearer token

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({error:"Token invalido"});
    };

    const token = authHeader.split(" ")[1];

    try {
        // verificación del token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // enviar dentro del token la información del usuario
        req.user = verified;

        // si todo sale bien, entonces continua.
        next();
    } catch (error) {
        console.error("Error al verificar el token", error);
        
        let message = "Token invalido";

        if (error.name === "TokenExpireError") {
            message = "Token Expirado";
        }

        res.status(400).json({error: message})
    }
};

module.exports = auth;
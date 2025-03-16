const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/:id", auth, async (req, res) => {
    try {
        const user = await User.findById({_id: req.params.id})

        if (!user) {
            return res.status(400).json({error:"Usuario solicitado no encontrado"})
        }

        res.json(user)
    } catch (error) {
        return res.status(500).json({error:error})
    }
})

module.exports = router;
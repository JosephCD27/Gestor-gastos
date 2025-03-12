// paquetes
const express = require("express");
const auth = require("../middleware/auth");
const Category = require("../models/Category");
const router = express.Router();

router.post("/new", auth , async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({error: "el nombre es obligatorio"})
        }

        // Verificar si ya existe una categoría con el mismo nombre para el mismo usuario
        const categoryExists = await Category.findOne({
            name: name.trim(),
            user: req.user.id,
        });
        
        if (categoryExists) {
            return res.status(400).json({ error: "Ya existe una categoria con este nombre" });
        }

        const category = new Category({
            name,
            user: req.user.id
        });

        await category.save();

        res.status(201).json(category);
    } catch (error) {
        return res.status(500).json({error: err.message})
    }
})


// actualizar categorias
router.put("/:id", auth, async (req, res) => {
    const { name } = req.body;

    try {
        // findByIdAndUpdate({ los datos de busqueda }, { datos a actualizar }, { configuración que trae la actualización})
        const category = await Category.findByIdAndUpdate({
                _id: req.params.id,
                user: req.user.id
            }, 
            { name }, 
            {new:true, runValidators:true}
        );

        if (!category) {
            return res.status(400).json({ error: "la categoria no existe" });
        }

        res.json(category);

    } catch (error) {
        return res.status(500).json({error: err.message})
    }
});

// Listar categorias
router.get("/", auth, async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id });

        if (!categories) {
            return res.status(400).json({ error: "No se encuentran categorias" });
        }

        res.json(categories);
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
})

// buscar categoria
router.get("/:name", auth, async (req, res) => {
    try {
        const category = await Category.find({name: req.params.name})

        if (!category) {
            return res.status(400).json({ error: "No se encuentran categorias" });
        }

        res.json(category);
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
})

// eliminar categoria

router.delete("/:id", auth, async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!category) {
            return res.status(404).json({ error: "Categoria no encontrada" });
        }

        res.status(200).json({ message: "Cateria eliminada correctamente" });
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
})

module.exports = router;
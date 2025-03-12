const express = require("express");
const Expense = require("../models/Expense")
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/new", auth, async (req, res) => {

    try {
        const { title, amount, date, category } = req.body;

        if(!title || !amount || !category) {
            return res.status(400).json({error: "Todos los campos son obligatorios"})
        }

        const expense = new Expense({
            title,
            amount,
            date: date || Date.now(),
            category,
            user: req.user.id
        })

        await expense.save();
        res.status(201).json(expense);

    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

//Listar los gastos
router.get("/", auth, async (req, res)=>{
    try {
        const expenses = await Expense.find({user: req.user.id});

        if (!expenses) {
            return res.status(400).json({error: "No se encontraron gastos"})
        }

        res.status(201).json(expenses);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})


//Actualizar un gasto

router.put("/:id", auth, async (req, res)=>{
    const { title, amount, date } = req.body;

    try {
        const expense = await Expense.findByIdAndUpdate({
            _id: req.params.id,
            user: req.user.id,
        },{
            title, 
            amount, 
            date
        },{
            new:true, 
            runValidators:true
        })

        if (!expense) {
            return res.status(400).json({ error: "el gasto no existe" });
        }

        res.json(expense);
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
})

//Eliminar un gasto

router.delete("/:id", auth, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!expense) {
            return res.status(404).json({ error: "Gasto no encontrado" });
        }

        res.status(200).json({ message: "Gasto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
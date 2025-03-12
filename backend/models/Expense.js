const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, "El gasto debe tener un titulo"]
    },

    amount:{
        type:Number,
        required: [true, "El monto es obligatorio"]
    },

    date:{
        type:Date,
        default: Date.now,
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
});

module.exports = mongoose.model("Expense", expenseSchema);
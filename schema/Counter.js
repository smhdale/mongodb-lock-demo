const mongoose = require('mongoose')

// Define schema
const schema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	value: {
		type: Number,
		default: 0
	}
})

// Export models
module.exports = mongoose.model('Counter', schema)

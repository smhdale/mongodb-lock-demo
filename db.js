const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27017/mongo-lock-demo'
const opts = {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
}

// Export models
exports.Counter = require('./schema/Counter')
exports.Lock = require('./schema/Lock')

// Export connect function
exports.connect = cb => mongoose.connect(uri, opts, cb)

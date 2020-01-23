const mongoose = require('mongoose')

// Define schema
const schema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	owner: {
		type: Number,
		default: null
	},
	lifetime: {
		type: Number,
		default: 30000
	},
	expires: {
		type: Number,
		default: 0
	}
})

/**
 * Attempts to obtain a lock instance.
 *
 * @param {string} name The name of the lock to obtain.
 * @param {number} owner Process ID to set lock's owner to.
 * @returns {Object|null} Lock instance, or null if not obtained.
 */
schema.statics.obtain = async function(name, owner) {
	if (owner == null) {
		console.warn('Please specify an owner to obtain a lock.')
		return null
	}

	// Get current time
	const now = Date.now()

	// Find lock matching name with either no owner or expiry in the past
	const query = {
		name,
		$or: [
			{ owner: null },
			{ expires: { $lt: now } }
		]
	}
	// Set owner, and temporarily set expiry to infinity
	const update = {
		$set: { owner, expires: Infinity }
	}

	// Attempt to find and update lock
	const lock = await this.findOneAndUpdate(query, update, { new: true })
	if (!lock) return null

	// If obtained, update lock's expiry
	lock.expires = now + lock.lifetime
	return lock.save()
}

/**
 * Releases a lock so it can be claimed again.
 *
 * @returns {Object} The lock instance.
 */
schema.methods.release = function() {
	this.owner = null
	return this.save()
}

// Export model
module.exports = mongoose.model('Lock', schema)

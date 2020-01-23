const { Counter, Lock } = require('./db')

const COUNTER = 'counter'
const LOCKS = ['cron']

const bootstrapCounter = () => Counter.findOneAndUpdate(
	{ name: COUNTER },
	{ $set: { name: COUNTER } },
	{ upsert: true, setDefaultsOnInsert: true }
)
const releaseAllLocks = () => Lock.updateMany(
	{ owner: { $ne: null } },
	{ $set: { owner: null } },
	{ multi: true }
)
const bootstrapLock = name => Lock.findOneAndUpdate(
	{ name },
	{ $set: { name } },
	{ upsert: true, setDefaultsOnInsert: true }
)

/**
 * If they don't already exist, create a counter and lock in the database.
 * Also releases any held locks.
 */
module.exports = async () => {
	await bootstrapCounter()
	await releaseAllLocks()
	return Promise.all(LOCKS.map(bootstrapLock))
}

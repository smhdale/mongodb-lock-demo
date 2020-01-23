const cron = require('node-schedule')
const { connect, Lock, Counter } = require('./db')
const bootstrap = require('./bootstrap')

const PID = process.pid
const LOCK_NAME = 'cron'
const COUNTER_NAME = 'counter'

// Set up cron jobs
async function taskIncrement() {
	console.log('Running increment task at', new Date())

	// Try and obtain lock
	const lock = await Lock.obtain(LOCK_NAME, PID)
	if (lock) {
		try {
			console.log('Lock obtained')

			// Run task
			const counter = await Counter.findOne({ name: COUNTER_NAME })
			console.log('Counter value:', counter.value)
			counter.value++
			await counter.save()
			console.log('Counter incremented to:', counter.value)

		} finally {
			// Release lock
			await lock.release()
			console.log('Lock released')
		}
	} else {
		// Blank space instead of update lines
		console.log('\n\n\n')
	}

	console.log('')
}

// Connect, bootstrap and start cron
connect(async err => {
	if (err) throw err

	// Bootstrap counter & lockes
	await bootstrap()

	// Announce self
	console.log('My ID:', PID)
	console.log('')

	// Run cron every 5 seconds
	cron.scheduleJob('*/5 * * * * *', taskIncrement)
})

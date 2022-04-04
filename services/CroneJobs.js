const cron = require('node-cron')
const User = require('../models/userModel')
const RemovePastTherapeutAvailableDates = require('./jobs/RemovePastTherapeutDates')

function CroneJobs() {
    cron.schedule('0 0 */22 * * *', RemovePastTherapeutAvailableDates);
}

module.exports = CroneJobs
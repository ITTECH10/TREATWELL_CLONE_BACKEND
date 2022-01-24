const EmailNotifications = require('./EmailNotifications')

class TherapeutEmail extends EmailNotifications {
    constructor() {
        super()
    }

    async therapyBooked(pacient, therapeut) {
        const subject = "Neuer Termin"
        const body = `${pacient.firstName} ${pacient.lastName} hat einen neuen Termin vereinbart!`

        await super.sendToTherapeut(therapeut, subject, body)
    }
}

module.exports = TherapeutEmail
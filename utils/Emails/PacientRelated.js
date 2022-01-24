const EmailNotifications = require('./EmailNotifications')

class PacientEmail extends EmailNotifications {
    constructor() {
        super()
    }

    async therapyBooked(pacient, therapeut) {
        const subject = "Neuer Termin"
        const body = `Sie haben erfolgreich einen Termin mit ${therapeut.name} vereinbart!`

        await super.sendToPacient(pacient, subject, body)
    }
}

module.exports = PacientEmail
const EmailNotifications = require('./EmailNotifications')

class ClientEmail extends EmailNotifications {
    constructor() {
        super()
    }

    async therapyBooked(pacient, therapeut) {
        const subject = "Neuer Termin"
        const body = `${pacient.firstName} ${pacient.lastName} hat einen neuen Termin beim ${therapeut.name} vereinbart!`

        await super.sendToClient(subject, body)
    }
}

module.exports = ClientEmail
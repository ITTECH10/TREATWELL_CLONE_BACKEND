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

    async welcomeGreetings(therapeut, password) {
        const subject = 'Willkommen bei gesundo24'
        const body = `Willkomen!  Hier sind Ihre Informationen 
        E-mail: ${therapeut.email}
        Passwort: ${password}`

        await super.sendToTherapeut(therapeut, subject, body)
    }
}

module.exports = TherapeutEmail
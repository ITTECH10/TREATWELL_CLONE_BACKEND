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

    async contactTherapeutFromPopupMap(therapeut, req) {
        const subject = "Rückruf erwünscht"
        const body = `Hallo ${therapeut.firstName} ${therapeut.lastName}
        Mein name is ${req.body.name} und mein telefonnummer ist ${req.body.phone}
        Ich kontaktiere Sie aus folgenden Gründen ${req.body.description}
        `
        await super.sendToTherapeut(therapeut, subject, body)
    }
}

module.exports = TherapeutEmail
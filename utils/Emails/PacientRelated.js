const EmailNotifications = require('./EmailNotifications')

class PacientEmail extends EmailNotifications {
    constructor() {
        super()
    }

    async welcomeGreetings(pacient) {
        const subject = 'Herzlich Willkommen bei Gesundo24.de'
        const body = `
            Hallo, ${pacient.firstName} ${pacient.lastName}
            Herzlich Willkommen bei Gesundo24.de!
            Diese E-Mail wird automatisch generiert. 
            Bitte antworten Sie nicht auf diese E-Mail!
        `
        await super.sendToPacient(pacient, subject, body)
    }

    async therapyBooked(pacient, therapeut) {
        const subject = "Neuer Termin"
        const body = `Sie haben erfolgreich einen Termin mit ${therapeut.name} vereinbart!`

        await super.sendToPacient(pacient, subject, body)
    }

    async resetPassword(pacient, url) {
        const subject = 'Passwort vergessen?'
        const body = `Um Ihr Passwort zu ändern, klicken Sie bitte auf den unten stehenden Link.
        ${url}
        Hinweis: Ab Erhalt dieser E-Mail haben Sie 10 Minuten Zeit, um Ihr Passwort zu ändern.
        Diese E-Mail wird automatisch generiert, bitte antworten Sie nicht darauf.`

        await super.sendToPacient(pacient, subject, body)
    }
}

module.exports = PacientEmail
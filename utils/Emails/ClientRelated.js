const EmailNotifications = require('./EmailNotifications')

class ClientEmail extends EmailNotifications {
    constructor() {
        super()
    }

    async therapeutRegistered(therapeut) {
        const subject = 'Neuer Therapeut'
        const body = `
        Hallo, ein neuer Therapeut ist auf gesundo24.de registriert!
        Hier sind die Details:
        Name: ${therapeut.firstName} ${therapeut.lastName}
        E-mail: ${therapeut.email}
        Telefon: ${therapeut.phone}
        Location: ${therapeut.location}
        Adresse: ${therapeut.address}
        Webseite: ${therapeut.website}
        `

        await super.sendToClient(subject, body)
    }

    async pacientRegistered(pacient) {
        const subject = 'Neuer Pacient'
        const body = `
        Hallo, ein neuer Pacient ist auf gesundo24.de registriert!
        Hier sind die Details:
        Name: ${pacient.firstName} ${pacient.lastName}
        E-mail: ${pacient.email}
        `
        await super.sendToClient(subject, body)
    }

    async therapyBooked(pacient, therapeut) {
        const subject = "Neuer Termin"
        const body = `${pacient.firstName} ${pacient.lastName} hat einen neuen Termin beim ${therapeut.name} vereinbart!`

        await super.sendToClient(subject, body)
    }

    async becomePartner(therapeut) {
        const subject = "Neuer Partner"
        const body = `
            Hallo Ich möchte mit Ihnen ein Partner werden 
            hier sind meine infos
            Name: ${therapeut.firstName} ${therapeut.lastName} 
            E-mail: ${therapeut.email}
            Telefon: ${therapeut.phone}
            Strasse: ${therapeut.street}
            Ort: ${therapeut.place}
            PLZ: ${therapeut.plz}
            Nachricht: ${therapeut.message}`

        await super.sendToClient(subject, body)
    }
}

module.exports = ClientEmail
const EmailNotifications = require('./EmailNotifications')

class PacientEmail extends EmailNotifications {
    constructor() {
        super()
    }

    async welcomeGreetings(pacient) {
        const subject = 'Herzlich Willkommen bei Gesundo24.de'
        const body = `Liebe/r patient/in,
        vielen Dank für Deine Registrierung!
        Wir sind sehr froh und dankbar, 
        dass du dabei bist! Wir haben eine große Vision die Naturheilkunde samt 
        aller alternativen Therapien in Deutschland so stark zu machen, 
        dass diese ein fester Bestandsteil der ganzen Medizin werden. 
        Dadurch wird auch jeder einzelner Heilpraktiker stark, kann gutes Geschäft aufbauen und muss nicht (wie so oft) 
        am Existenzminimum leben. Wir sind alle Heilpraktiker aus Leidenschaft – und gleichzeitig, 
        sollen wir davon leben können.

        Gesundo24.de setzt sich genau für diese Ideen ein:

        *Eine Plattform für die Besten Deutschlands
        *Neukundengewinnung
        *Detaillierte Unterstützung beim Praxisaufbau (von Menschen die schon mehrere Hundert Praxen erfolgreich aufgebaut haben)
        *Stärkung der alternativen Medizin im Allgemeinen
        
        Wir sind uns sicher, dass wir zusammen etwas Großartiges auf die Beine stellen werden!
 
        Für weitere Fragen, stehen wir dir gerne zur Verfügung – entweder per Mail an info@gesundo24.de oder telefonisch unter 030-22389838.
        Bitte unterstützen die Plattform, indem du sie bei Facebook und Instagram likest und weiterteilst.

        Facebook: @gesundo24
        Instagram: @gesundo24.de

        Liebe Grüße,
        Tanja, Suzana und Caro von Gesundo24.de

        ...`
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
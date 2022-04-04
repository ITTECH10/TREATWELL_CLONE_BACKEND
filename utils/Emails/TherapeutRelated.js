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
        const subject = 'Herzlich Willkommen bei Gesundo24.de'
        const body =
            `Liebe/r Heilpraktiker/in,
        vielen Dank für Deine Registrierung!
        Anbei deine Log-In Daten. Bevor wir dir technische Details erläutern, 
        möchten wir dir folgendes sagen: wir sind sehr froh und dankbar, 
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
        Deine Log-in Daten:

        E-mail: ${therapeut.email}
        Passwort: ${password}
        
        Jetzt noch zu technischen Details (Log-in, Terminierung etc.) :

        Gehe auf www.gesundo24.de
        Klicke auf Login
        Du gibst deine Login-Daten ein
        Du kannst selbst deine verfügbaren Termine freigeben und speichern
        Sobald ein Termin gebucht wird, wirst du per Mail benachrichtigt. Wir empfehlen dir, den Patienten vorab anzurufen.
        
        Für weitere Fragen, stehen wir dir gerne zur Verfügung – entweder per Mail an info@gesundo24.de oder telefonisch unter 030-22389838.

        Bitte unterstützen die Plattform, indem du sie bei Facebook und Instagram likest und weiterteilst.

        Facebook: @gesundo24
        Instagram: @gesundo24.de

        Liebe Grüße,
        Tanja, Suzana und Caro von Gesundo24.de

        ...`

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
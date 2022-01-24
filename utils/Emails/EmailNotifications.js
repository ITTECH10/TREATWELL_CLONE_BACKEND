const nodemailer = require('nodemailer')

// newTransport() {
//     return nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: 465,
//         secure: true,
//         auth: {
//             user: process.env.SMTP_USERNAME,
//             pass: process.env.SMTP_PASSWORD
//         }
//     });
// }

class EmailNotifications {
    newTransport() {
        return nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            }
        });
    }

    async sendToPacient(pacient, subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: pacient.email,
            subject: subject,
            text: text
        }

        await this.newTransport().sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
        })
    }

    async sendToTherapeut(therapeut, subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: therapeut.email,
            subject: subject,
            text: text
        }

        await this.newTransport().sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
        })
    }

    async sendToClient(subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO_CLIENT,
            subject: subject,
            text: text
        }

        await this.newTransport().sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
        })
    }
}

module.exports = EmailNotifications
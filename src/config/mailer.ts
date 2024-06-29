import nodemailer from 'nodemailer'
import path from 'path'
import ejs from 'ejs'

const HOST = process.env.MAIL_HOST ?? ''
const PORT = parseInt(process.env.MAIL_PORT ?? '')
const USER = process.env.MAIL_USER ?? ''
const PASS = process.env.MAIL_PASS ?? ''
const MAIL_EMAIL = process.env.MAIL_EMAIL ?? ''
const MAIL_SECURE: boolean = process.env.MAIL_SECURE === 'true'


const transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    auth: {
        user: USER,
        pass: PASS
    }
})

// send mail
const sendMail = async (to: string, subject: string, template: string, context: object): Promise<void> => {
    const html = await renderTemplate(template, context)
    const mailOptions = {
        from: `Anansesem ${MAIL_EMAIL}`,
        replyTo: MAIL_EMAIL,
        to,
        subject,
        html
    }

    await transporter.sendMail(mailOptions)
}

// function to render a specific mail template
const renderTemplate = async (template: string, context: object): Promise<string> => {
    const templatePath = path.join(__dirname, '../mails', `${template}.ejs`)
    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, context, (err, str) => {
            if (err) reject(err)
            else resolve(str)
        })
    })
}


export default sendMail
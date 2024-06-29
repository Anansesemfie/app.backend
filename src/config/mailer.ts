import nodemailer from 'nodemailer'
import path from 'path'
import ejs from 'ejs'
import { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_ADMIN, PORT } from '../utils/env'
import { createToken } from '../utils/tokenUtils'

const domain = `localhost:${PORT}/`

const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
    }
})

// send mail
const sendMail = async (to: string, subject: string, template: string, context: object): Promise<void> => {
    const html = await renderTemplate(template, context)
    const mailOptions = {
        from: `Anansesem ${MAIL_ADMIN}`,
        replyTo: MAIL_ADMIN,
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

interface EmailJobData {
    to: string;
    subject: string;
    template: string;
    context: object
}

const processEmailJob = async (job: { data: EmailJobData }): Promise<string> => {
    const { to, subject, template, context } = job.data
    if (template === 'verification') {
        const token = createToken(to);
        (context as any).verificationLink = `${domain}verify?token=${token}`
    }
    await sendMail(to, subject, template, context)
    return `Email sent to ${to}`;
}

export default processEmailJob;

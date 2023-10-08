const nodemailer = require("nodemailer");
const config = require("./config");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.mailer.smtpHost,
      port: config.mailer.smtpPort,
      auth: {
        user: config.mailer.smtpUser,
        pass: config.mailer.smtpPass
      }
    });
  }

  async sendMail(targetEmail, content) {
    const message = {
      from: 'Open Music App',
      to: targetEmail,
      subject: 'Ekspor Playlist',
      text: 'Terlampir hasil dari ekspor playlist',
      attachments: [
        {
          filename: 'playlists.json',
          content,
        },
      ],
    }

    return this.transporter.sendMail(message);
  }
}

module.exports = MailService;

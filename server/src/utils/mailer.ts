import config from "config";
import nodemailer, { SendMailOptions } from "nodemailer";
import log from "./logger";

interface smtpCredentials {
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}

const smtp = config.get<smtpCredentials>("smtp");

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

export default async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) log.error(err, "Error sending email");
    else log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

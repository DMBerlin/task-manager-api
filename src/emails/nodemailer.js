const nodemailer = require("nodemailer");

const from = '"Terra Viva!" <atendimento@terravivaseguros.com.br>';

const mail = nodemailer.createTransport({
  //pool: true,
  host: "gpterraviva.com.br",
  port: 465,
  secure: true,
  auth: {
    user: "crm@gpterraviva.com.br",
    pass: "rh4DA6rpK004"
  }
});

const sendEmail = (to, text) => {
  mail.verify(async (error, success) => {
    try {
      if (success) {
        const res = await mail.sendMail({ from, to, text });
        console.log(res);
      } else {
        throw new Error(error);
      }
    } catch (err) {
      console.log(err);
    }
  });
};

/**
 * Function Exports
 */
module.exports = { sendEmail };

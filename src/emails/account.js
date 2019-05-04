const sgMail = require('@sendgrid/mail');
const apiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(apiKey);

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to      : email,
		from    : 'crm@terravivaseguros.com.br',
		subject : 'Welcome!',
		text    : `Welcome to the app, ${name}!`
	});
};

const sendFarewellEmail = (email, name) => {
	sgMail.send({
		to      : email,
		from    : 'crm@terravivaseguros.com.br',
		subject : 'Sad you have to go!',
		text    : `Soo sad you have to leave :(. Hope to see you back. Thanks ${name}!`
	});
};

/**
 * Exports functions
 */
module.exports = {
	sendWelcomeEmail,
	sendFarewellEmail
};

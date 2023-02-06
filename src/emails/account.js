const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox4d4a71a256b04c17a6ee136b10275720.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});


const sendWelcomeEmail = (email,username) => {

    const data = {
        to:email,
        from:'thummarharsh171@gmail.com',
        subject:'Thanks for joining in.',
        text:`Welcome to the app ${username} ,Let me know how you get along with the app.`
    };

    mg.messages().send(data, function (error, body) {
        console.log("email is sended");
    });
}

const sendCancelationEmail = (email,username) => {

    const data = {
        to:email,
        from:'thummarharsh171@gmail.com',
        subject:'Sorry to see you go.',
        text:`Goodbye ${username} ,I hope to see you back sometime soon.`
    };

    mg.messages().send(data, function (error, body) {
        console.log("email is canceled");
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}


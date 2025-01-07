const paypal = require('paypal-rest-sdk');

//connect your paypal account here
paypal.configure({
    mode:'sandbox',
    client_id:'',
    client_secret:''
});

module.exports = paypal;
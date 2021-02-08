const nodemailer =  require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure: false,
    auth: {
        user:'practisehacker',
        pass:'7224020012Kush',
    }
});

let renderTemplate =(data,relativePath)=>{
    let mailHTML ;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        // relative path is place where from these function is called
        data,
        function(err,template){
            if(err){console.log("error in rendering the template: " + err);return;}
            mailHTML= template;
        }    
    )
    return mailHTML;

}
module.exports={
    transporter: transporter,
    renderTemplate:renderTemplate
}
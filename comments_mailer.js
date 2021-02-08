const nodeMailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment = (comment)=>{
    console.log('inside new comment mailer',comment);
    let htmlString = nodeMailer.renderTemplate({comment: comment,},'/comments/new_comment.ejs');



    nodeMailer.transporter.sendMail({
         from: 'practisehacker@gmail.com',
         to:comment.user.email,
         subject:"New Comment Published!",
        //  html:'<h1>Yupp! Your Comment Published!!!!!!!!</h1>',
        html:htmlString,
    },(err,info)=>{
        if(err) {console.log('error in sending mail',err).return};
        console.log("Message Send",info);
        return;
    })
}
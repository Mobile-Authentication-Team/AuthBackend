const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {secureKey,NMmail,NMpassword} = require('../app.config');
var transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: NMmail,
      pass: NMpassword
    }
  });

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            user
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'fail',
            error
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ userMail: req.body.userMail });
        if (user) {
            const cmp = await bcrypt.compare(req.body.userPassword, user.userPassword);
            if (cmp) {
                const token = jwt.sign({
                    userMail: user.userMail
                }, secureKey, { expiresIn: '10m' })
                res.send({
                    "mesaj": "Auth Success",
                    "token": token,
                    "user": {
                        "userName": user.userName,
                        "userMail": user.userMail
                    }
                });
            } else {
                res.send({ "mesaj": "Wrong username or password1." });
            }
        } else {
            res.send("Wrong username or password2.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
};

exports.resetPass = async (req, res) => {
    try {
        const user = await User.findOne({ userMail: req.body.userMail });
        if (user) {
            let randomPassword = Math.random().toString(36).slice(-8);
            let un=user.userName;
            user.userPassword=randomPassword;
            console.log(randomPassword);
            await user.save(function(err){
                if(err)
                    console.log(err+"");
            });
            var mailOptions = {
                from: NMmail,
                to: user.userMail,
                subject: 'Yeni Şifren | BTU Auth Team',
                html: `<h1> Merhaba ${un}. Şifren başarıyla sıfırlandı! </h1><br>Yeni şifren: ${randomPassword}<br>Yeni şifren ile giriş yapabilirsin!<br><br><b>BTU Auth Team</b>`
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.send({ "baslik":"Başarılı!",
                        "mesaj":`Şifre sıfırlama işlemine devam etmek için lütfen ${user.userMail} adresini kontrol edin.`});
        } else {
            res.send({ "baslik":"Başarılı!",
                        "mesaj": "Kayıtlı mail yok." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }

}

exports.test = async (req, res) => {
    res.status(201).send({ message: req.userData.userMail + " - AuthComplate" })
}
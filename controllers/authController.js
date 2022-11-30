const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secureKey = require('../auth.config')


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
                    userMail:user.userMail
                },secureKey.secret,{expiresIn:'10m'})
                res.send({"mesaj":"Auth Success",
                          "token":token});
            } else {
                res.send({"mesaj":"Wrong username or password1."});
            }
        } else {
            res.send("Wrong username or password2.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
};

exports.test = async(req,res)=>{
    res.status(201).send({message:req.userData.userMail+" - AuthComplate"})
}

const bcrypt = require('bcryptjs');
const User = require('mongoose').model('User');
var CryptoJS = require("crypto-js");

const saltRounds = 15;


function validateSignIn(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return { message: `${errors.errors[0]['msg']}` };

    return false;
}

function validatetionSignUp(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return { message: `${errors.errors[0]['msg']}` };

    return false;
}

module.exports = {
    signIn: async (req, res, next) => {
        res.status(200).json({ message: 'Login successful' });
    },

    signUp: async (req, res, next) => {    
        try {
            let newUser = req.body;  

            if(newUser == undefined || newUser == null)
                return res.status(400).json({ message: 'Bad Request!' });

            // Decrypt password
            var bytes  = CryptoJS.AES.decrypt(newUser.password, 'fdjYbmv51$zvQpyH80%FcCbqpGL52');
            var originalPass = bytes.toString(CryptoJS.enc.Utf8);

            bcrypt.genSalt(saltRounds)
                .then((salt) => {
                    return Promise.all([salt, bcrypt.hash(originalPass, salt)]);
                }).then(([salt, hashedPass]) => {
                    delete newUser.password;
                    const newObject = Object.assign({}, { passwordHash: hashedPass, salt }, newUser);

                    return Promise.resolve(User.create(newObject));
                }).then(async (data) => {
                    try {
                        const getUser = await User
                            .findOne({ email: data.email })
                            .select({ username: 1, email: 1, roles: 1, accessToken: 1, userUID: 1, avatar: 1, recipes: 1, darkTheme: 1 });
                        if(Object.keys(getUser).length > 0) {
                            
                            return Promise.resolve(res.status(201).json({ user: getUser, message: 'Sign up is successfully!' }));
                        } else {
                            res.status(404).json({ error: err, message: "User is not exist!" });
                        }
                    } catch(err) {
                        res.status(404).json({ error: err, message: "User is not exist!" });
                    }
                }).catch(err => {
                    res.status(400).json({ error: err, message: "Sign up is failed. User validation is failed!" });
                });
        } catch(error) {
            next(error);
        }
    },

    getAllUsers: async (req, res, next) => {
        //todo get User for check is username or email is used!!!
        User.find({})
            .select({ username: 1, email: 1})
            .exec()
            .then(data => {
                return Promise.resolve(res.status(200).json({ data }));
            }).catch(error => console.log(error.message));
    },
};
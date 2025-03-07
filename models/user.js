const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 20;

const userSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.String, required: true, unique: true },
    email: { type: mongoose.Schema.Types.String, required: true, unique: true },
    passwordHash: { type: mongoose.Schema.Types.String, required: true },
    salt: { type: mongoose.Schema.Types.String, required: true },
    roles: [{ type: mongoose.Schema.Types.String }],
    accessToken: { type: mongoose.Schema.Types.String, required: true },
    userUID: { type: mongoose.Schema.Types.String, required: true },
    avatar: { type: mongoose.Schema.Types.String, required: true },
    darkTheme: { type: mongoose.Schema.Types.Boolean, default: false },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
});

//express validation before mongoose!
userSchema.path('email').validate(function() {
    return RegExp('^[A-Za-z0-9._-]+@[a-z0-9.-]+.[a-z]{2,4}$').test(this.email);
}, 'Email is incorrect format!');

userSchema.method({
    matchPassword: function(password) {
        return bcrypt.compare(password, this.passwordHash);
    }
});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) { next(err); return; }
        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) { next(err); return; }
          this.password = hash;
          next();
        });
      });
      return;
    }
    next();
  });

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async() => {
    try {
        let users = await User.find();

        
        if (users.length > 0) return;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) { 
                next(err); 
                return; 
            }

            bcrypt.hash('Hanzo7902', salt, (err, hash) => {
                if(err) { 
                    next(err); 
                    return; 
                }

                return User.create({
                    email: 'raiders@gmail.com',
                    salt,
                    passwordHash: hash,
                    roles: ['User', 'Admin', 'Owner'],
                    username: "raiders",
                    accessToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImJjNDAxN7U3MtE4MWM5NTMxY2YxYjY4MjY4M2Q5OThlNGY1NTg5MTkiLCJ0eXAiOiJKV1PifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbWVzc2VuZ2VyLWY2MTZmIiwiYXVkIjoibWVzc2VuZ2VyLWY2MTZmIiwiYXV0aF90aW1lIjoxNzQxMjc1NTg0LCJ1c2VyX2lkIjoiRlVhaHR2T2kwNmF2NUdoWXZyaElTdmJDTlVxMSIsInN1YiI6IkZVYWh0dk9pMDZhdjVHaFl4cmhJU3ZiQ05VcTEiLCJpYXQiOjE3NDEyNzU1ODQsImV4cCI6MTc0MTI3OTE0NCwiZW1haWwiOiJzdGVsYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsic3RlbGFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.C1zL3lxSSRxi4e0P9_03Gq53Mu-d2uGX6jO_h1KZ71TEHzpOK9f-sQ-EYEd7TjfgBQNfcbbiYkERbuC-QOjP13VdKxSyWZ8OqRLbVX99EO5TruiLeeJLawZ9oMRpeYtbcF94VN52mS--qeCZ8YqtJszYNuihIvFrix1Rn2sPcWyNJsvbmKvEe7qNlHE13SX-BiRPTr7PQ7NnlqM9bhmBbWHegw2Me8s4wvjPdWifU-lBbaYZn47ToqUrDhL3RdfnZnWgbyxljgFObjBH_9Xq-w0vHHXWOzwrU-XB24U26lwlRUSMztn_UFFfxdSd5JjcF-sZRIQ6jS8Rnq1bx0CWew",
                    userUID: "FUahtvOi02av5GhYv7hISvbCNUq9",
                    avatar: "https://firebasestorage.googleapis.com/v0/b/signin-autumn.appspot.com/o/avatars%2Favatar-anonymous.png?alt=media&token=25565dda-5768-443d-b761-ed68e13ab212",
                    darkTheme: false,
                    recipes: []
                });
            });
        });
    } catch (next) {
        next();
    }
};

module.exports = User;
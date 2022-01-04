const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const UserSchema = mongoose.Schema({ 
    username: {type: String, required: true},
    password: {type: String, required: true},
    fullname: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    address: {type: String, required: false},
    age: {type: Number, required: true},
    gender: {type: String, required: true, enum: ['male', 'female', 'unkown']},
    roles: {type: String, required: true, enum: [process.env.USER, process.env.ADMIN]}
}, {collection: 'users'})


UserSchema.pre('save', async function (next) {
    try {
        const user = this;
        if (!user.isModified("password")) {
          next();
        }
        user.password = CryptoJS.AES.encrypt(
          user.password,
          process.env.ENCRYPT_KEY,
        ).toString();
        next();
      } catch (error) {
        next(error);
      }
})

UserSchema.methods.validatePassword = async function(password, next) {
    try {
        const decrypted = CryptoJS.AES.decrypt(
          this.password,
          process.env.ENCRYPT_KEY,
        );
        const rawPassword = decrypted.toString(CryptoJS.enc.Utf8);
        if (rawPassword === password) {
          return next(null, this);
        } else {
          return next(null, false);
        }
      } catch (error) {
        return next(error);
      }
}

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel;
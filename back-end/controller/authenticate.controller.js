const Jwt = require('jsonwebtoken');
const User = require('../model/user');

const signToken = (payload) => {
    return Jwt.sign({
        issuer: "enterprice-project-v1",
        subject: payload,
    }, process.env.SECRET_KEY,
    {
      expiresIn: "86400s",
    }
    )
}

const authenticateControler = {
    login: async (req, res) => {
        if(req.isAuthenticated()) {
            res.status(200).json({
                status: 200,
                user: req.user,
                isAuthenticated: true,
                token: signToken(req.user._id)
            })
        }
    },
    register: async (req, res) => {
        const registerAccount = req.body;
        const {username} = registerAccount;
        const checkAccountExistedInDb = await User.findOne({username});
        if(checkAccountExistedInDb) {
            res.status(400).json({message: "Account already exists", status: 400})
        }
        else {
            const createAccount = new User({...registerAccount});
            await createAccount.save();
            res.status(201).json({message: "Account registed successfully", status: 201, account: createAccount});
        }
    }
}

module.exports = authenticateControler;
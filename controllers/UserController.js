import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            role: req.body.role,
        });
        const user = await doc.save();
        const token = jwt.sign({
                _id: user._id,
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: '25d'}
        );
        const {passwordHash, ...userData} = user._doc
        res.json({
            ...userData,
            token
        });
    } catch (err) {
        res.status(500).json({
            message: 'Unable to register'
        })
    }
};

export const edit = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await UserModel.updateOne({
            _id: req.body.user,
        },
        {
            email: req.body.email,
            passwordHash: hash,
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            role: req.body.role,
        });
        // const user = await doc.save();
        const token = jwt.sign({
                _id: user._id,
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: '25d'}
        );
        const {passwordHash, ...userData} = user._doc
        res.json({
            ...userData,
            token
        });
    } catch (err) {

    }
};
export const login = async (req,res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if(!user) {
            return res.status(404).json({
                message: "We couldn't find user"
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        // console.log(b)
        if(!isValidPass) {
            return res.status(400).json({
                message: "Incorrect login or password"
            });
        }
        const token = jwt.sign({
                _id: user._id,
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: '15d'}
        );
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        });

    } catch (err) {
        res.status(500).json({
            message: 'Unable to log in'
        })
    }
};

export const getMe =  async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                message: "We couldn't find user"
            });
        }
        const {passwordHash, ...userData} = user._doc
        res.json(userData);
    } catch (err) {
        res.status(500).json({
            message: 'No access'
        })
    }
};
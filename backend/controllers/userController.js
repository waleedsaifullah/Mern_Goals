const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler =require('express-async-handler')
// const nodemailer = require('nodemailer')
// const sendGridTransport = require('nodemailer-sendgrid-transport')

const User = require('../model/userModel')

// const transporter = nodemailer.createTransport(sendGridTransport({
//     auth: {
//         api_key: process.env.GRID_KEY
//     }
// }))

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    
    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })

        // var mail = {
        //     to: user.email,
        //     from: 'waleedsaifullah786@gmail.com',
        //     subject: 'SignUp Completed Sucessfully',
        //     text: 'Awesome sauce',
        //     html: '<h1>You have sucessfully signed up</h1>'
        // };
    
        // transporter.sendMail(mail, function(err, res) {
        //     if (err) { 
        //         console.log(err) 
        //     }
        //     console.log(res);
        // });
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

    // res.json({
    //     message: 'Register User'
    // })
})

const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }
    
    // res.json({
    //     message: 'Login User'
    // })
})

const getMe = asyncHandler(async(req, res) => {
    // const { _id, name, email } = await User.findById(req.user.id)

    res.status(200).json(req.user)
    // res.json({
    //     message: 'User data'
    // })
})

// Generate Token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
} 


module.exports = {
    registerUser,
    loginUser,
    getMe
}
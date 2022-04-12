const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
    try {
        // generate new password
        // console.log("hi\n");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        const user1 = await User.findOne({ email: req.body.email });
        const user2 = await User.findOne({ username: req.body.username });
        // console.log(user1);
        // console.log("hi");
        // console.log(user2);
        if(!user1 && !user2){
        //create new user
            const newUser = new User({
                name:req.body.name,
                username: req.body.username,
                email: req.body.email,
                college: req.body.college,
                password: hashedPassword,
            });
            console.log("hey");
            //save user and respond
            const user = await newUser.save().then(() => console.log("ok"));
            res.status(200).json(user);
        }else if(user1){
            res.status(400).json({message:"User already exist with entered email id"});
        }else{
            res.status(400).json({message:"User already exists with entered username"});
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password")

        res.status(200).json(user)
    } catch (err) {
        console.log("login error");
        res.status(500)
    }
});

module.exports = router;
const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            return res.status(200).json("Account has been updated");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
});

//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
});

//get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc;
        return res.status(200).json(other);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//get all users name
router.get("/all", async (req, res) => {
    try {
        const allUsers = [{ key: "", values: "" }];
        await (await User.find()).forEach(function (User) {
            const currentUser = {
                key: User.username,
                value: User.username
            }
            allUsers.push(currentUser);
        });
        return res.status(200).json(allUsers);
    } catch (err) {
        return res.status(500).json(err);
    }
});
//get all users
router.get("/allUsers", async (req, res) => {
    try {
        const allUsers = [];
        await (await User.find()).forEach(function (User) {
            allUsers.push(User);
        });
        return res.status(200).json(allUsers);

    } catch (err) {
        return res.status(500).json(err);
    }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        // console.log("hi");
        // console.log(friendList);
        return res.status(200).json(friendList)
    } catch (err) {
        return res.status(500).json(err);
    }
});
//get followers
router.get("/followers/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followers.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        return res.status(200).json(friendList)
    } catch (err) {
        return res.status(500).json(err);
    }
});

//get suggestions
router.get("/suggestions/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const userCollege = await User.find({"college":user.college});
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId);
            })
        );
        var friendList = [];

        await Promise.all(userCollege.map((collegeUser) => {
                const { _id, username, profilePicture } = collegeUser;                
                friendList.push({_id,username,profilePicture});
            })
        );
        await Promise.all(friends.map(async(friend) => {
            try{
                // console.log(friend);
                const { _id } = friend;
                const user2 = await User.findById(_id);
                const user2Friends = await Promise.all
                (
                    user2.followings.map((friendId) => 
                    {
                        return User.findById(friendId);
                    })
                );
                user2Friends.map((friend2) => 
                {
                    const { _id, username, profilePicture } = friend2;
                    friendList.push({ _id, username, profilePicture });

                });
            } catch (err) {
                console.log("showing error");
                console.log(err);
                return res.status(500);
            }
        }));
        
        return res.status(200).json(friendList);
    } catch (err) {
        return res.status(500);
    }
});
//follow a user

router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                return res.status(200).json("user has been followed");
            } else {
                return res.status(403).json("you allready follow this user");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you cant follow yourself");
    }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                return res.status(200).json("user has been unfollowed");
            } else {
                return res.status(403).json("you dont follow this user");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you cant unfollow yourself");
    }
});

module.exports = router;
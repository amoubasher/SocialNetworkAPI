
const router = require('express').Router();
const {User} = require("../../models")

//TODO - ROUTE THAT GETS ALL THE USERS, include friends?
router.get('/', (req,res)=> {
    User.find({}, (err, users) => {
        res.status(200).json(users)
    }).populate("thoughts").populate("friends");
})

//TODO - ROUTE THAT CREATES A NEW USER
router.post('/', (req,res)=> {
    User.create ({
        username: req.body.username,
        email: req.body.email
    }, (err, user) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(user)
        }
    })
});

//TODO - ROUTE THAT GETS A SINGLE USER BASED ON USER ID
router.get('/:userId', (req,res) => {
    User.findOne( { _id: req.params.userId }, (err, user) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(user)
        }
    })
})

//TODO - ROUTE THAT UPDATES A SINGLE USER
router.put('/:userId', (req,res)=> {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        {runValidator: true, new: true }
    ).then((user) => {
        !user 
            ? res.status(404).json( {message: "user not found"} )
            : res.status(200).json(user)
    }).catch((err) => res.status(500).json(err))
})

//TODO - ROUTE THAT DELETES A SINGLE USER BASED ON USER ID
router.delete('/:userId', (req,res)=> {
    User.findOneAndDelete({ _id: req.params.userId }, (err, user) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(`User ${user.username} deleted`)
        }
    })
});

//TODO - ROUTE THAT ADDS A FRIEND TO A USER
router.put('/:userId/friends/:friendId', (req,res)=> {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidator: true, new: true }
    ).then((user) => {
        !user
            ? res.status(404).json( {message: "user not found"} )
            : res.status(200).json(`New Friend added!`)
    }).catch((err) => res.status(500).json(err))
})

//TODO - ROUTE THAT DELETES A FRIEND FROM A USER'S FRIENDS, DONT DELETE THE FRIEND AS A USER THOUGH!
router.delete('/:userId/friends/:friendId', (req,res)=> {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { runValidator: true, new: true }
  ).then((user) => {
    !user
      ? res.status(404).json({ message: "user not found" })
      : res.status(200).json(`Friend deleted!`);
  }).catch((err) => res.status(500).json(err));
});

module.exports = router;

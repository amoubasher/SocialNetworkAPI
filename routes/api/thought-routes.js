
const router = require('express').Router();
const { Thought, Reaction, User} = require('../../models')

//TODO: ROUTE TO GET ALL THOUGHTS
router.get('/', (req,res)=> {
    Thought.find({}, (err, thoughts)=> {
        res.status(200).json(thoughts)
    })
})

//TODO: ROUTE TO CREATE A NEW THOUGHT
// router.post('/', (req,res)=> {
//     Thought.create({
//         thoughtText: req.body.thoughtText,
//         username: req.body.username
//     }, (err, thought) => {
//         if (err) {
//             res.status(500).json(err)
//         } else {
//             res.status(200).json(`New thought posted!`)
//         }
//     })
// });

router.post("/", async (req, res) => {
  try {
    const thought = await
    Thought.create(
req.body);
      const user = await User.findOneAndUpdate(
        {
          _id: req.body.userId,
        },
        {
          $push: { thoughts: thought._id },
        },
        {
          new: true,
        }
      );
        res.status(200).json("thought created")} 
        catch (err) {
    res.status(500).json(err);
  }
});

//TODO: ROUTE TO GET SINGLE THOUGHT BASED ON THOUGHT ID
router.get('/:thoughtId', (req,res)=> {
    Thought.findOne({ _id: req.params.thoughtId }, (err, thought) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(thought)
        }
    }).populate("reactions")
})

//TODO: ROUTE TO UPDATE A THOUGHT
router.put('/:thoughtId', (req,res)=> {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId },
        { $set: req.body},
        { runValidators: true, new: true },
        (err, thought) => {
        if(err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(thought)
        }
    })
})

//TODO: ROUTE TO DELETE A THOUGHT BASED ON THOUGHT ID
router.delete('/:thoughtId', (req,res)=> {
    Thought.findOneAndDelete({ _id: req.params.thoughtId }, (err, thought) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(`Thought deleted!`)
        }
    })
});

//TODO: ROUTE TO ADD REACTION TO A THOUGHT
router.post('/:thoughtId/reactions', (req,res)=> {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId }, 
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true}
        ) .then((thoughts) => {
            !thoughts ? res.status(404).json({ message: "Thought not found"})
            : res.status(200).json(`Reaction added!`)
        }).catch((err) => {
            res.status(500).json(err)
        })
});

//TODO: ROUTE TO DELETE A REACTION ON A THOUGHT
router.delete('/:thoughtId/reactions/:reactionId', (req,res)=> {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
        { $pull: { reactions: { reactionId: req.params.reactionId}}}
    ).then((thoughts) => {
        !thoughts ? res.status(404).json({ message: "Thought not found"})
        : res.status(200).json(`Successfully deleted reaction!`)
    })
})

module.exports = router;

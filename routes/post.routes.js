const router = require("express").Router();

const User = require("../models/User.model");
const Post = require("../models/Post.model");

// ****************************************************************************************
// GET route to display the form to create a new post
// ****************************************************************************************

// localhost:3000/post-create
router.get("/post-create", (req, res) => {
  User.find()
    .then((dbUsers) => {
      res.render("posts/create", { dbUsers });
    })
    .catch((err) => console.log(`Err while displaying post input page: ${err}`));
});

// ****************************************************************************************
// POST route to submit the form to create a post
// ****************************************************************************************

// <form action="/post-create" method="POST">

router.post("/post-create", (req, res)=>{
  const title = req.body.title;
  const content = req.body.content;
  const author = req.body.author;
  //this is the short syntax for the lines above
  //It's called "destructuring"
  //const {title, content, author} = req.body

  Post.create({title, content, author})
  .then((newPost)=>{
    User.findByIdAndUpdate(author, {$push: {posts: newPost._id}})
    .then(()=>{res.redirect("/posts")})
  })
  .catch((err)=>{
    console.log(err);
  })
})

// ****************************************************************************************
// GET route to display all the posts
// ****************************************************************************************

router.get("/posts", (req, res)=>{
  Post.find()
  .populate("author")
  .then((posts)=>res.render("posts/list", {posts}))
})

// ****************************************************************************************
// GET route for displaying the post details page
// shows how to deep populate (populate the populated field)
// ****************************************************************************************

router.get("/post-details/:id", (req, res)=>{
  Post.findById(req.params.id)
  .populate("author")
  //.populate("comments")
  .populate({
    path: "comments",
    populate: {
      path: "author",
      model: "User"}
  })
  .then((post)=>{res.render("posts/details", post)})
})

module.exports = router;

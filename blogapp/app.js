var express = require('express');
bodyParser = require('body-parser');
mongoose = require("mongoose");
expressSanitizer = require("express-sanitizer"); //used to clear scripts out of the request body
methodOveride = require("method-override");
var app = express();

//Application configuration
mongoose.connect("mongodb://localhost:27017/restful-blog", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOveride("_method"));
app.use(expressSanitizer());

//Moongoose configuration
//Schema definition
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});
//Model compilation
var Blog = mongoose.model("Blog", blogSchema);

//Test data for site
// Blog.create({
//   title: "Test Blog",
//   image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//   body: "Hello this a blog post"
// });


//RESTFul routes
//Index redirect
app.get("/", function (req, res) {
  res.redirect("/blogs");
});

//Index Route
app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("index", { blogs: blogs });
    }
  });
});

//New Route
app.get("/blogs/new", function (req, res) {
  res.render("new");
});

//Create route
app.post("/blogs", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.render("new");
    }
    else {
      res.redirect("/blogs");
    }
  })
});

//Show route
app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    }
    else {
      res.render("show", { blog: foundBlog });
    }
  })
});

//Edit Route
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect('/blogs');
    }
    else {
      res.render("edit", { blog: foundBlog })
    }
  });
});

//Update Route
app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  //this method is used to get new data for the id and update it
  //Blog.findByIdAndUpdate(id,newData,)
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    }
    else {
      res.redirect("/blogs/" + req.params.id);
    }
  })
});

//Delete Route
app.delete("/blogs/:id", function (req, res) {
  //destroy
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    }
    else {
      res.redirect("/blogs");
    }
  })
});

app.listen("3000", function () {
  console.log("App is running!");
})

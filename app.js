const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");


const app = express();

// connect to dtabase
const dbURI =
  "mongodb+srv://abdulazizztanvir:OKTW7jHKz1MDWq8g@learning.lbxlf5j.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) => app.listen( process.env.PORT || 3000))
  .catch((err) => console.log(err));
// register view engine
app.set("view engine", "ejs");

// static middleware by express

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.redirect("/blogs");
});


app.get("/about", (req, res) => {
    res.render("about", { title: "About" });
  });
  // redirects
  app.get("/about-us", (req, res) => {
    res.redirect("/about");
  });
  
  app.get("/blogs/create", (req, res) => {
    res.render("create", { title: "Create" });
  });

app.get("/blogs", (req, res) => {
  Blog.find()
    .then((result) => {
      res.render("index", {
        title: "All Blogs",
        blogs: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);

  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/:id", (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then((result) => {
          console.log(result);
        res.render('details', {
          blogs: result,
          title: "Blog Details",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });


  app.delete("/blogs/:id", (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
      .then((result) => {
        res.json({ redirect: "/blogs" });
      })
      .catch((err) => {
        console.log(err);
      });

  })

  


// page not found 404
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

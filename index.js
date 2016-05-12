var express          = require("express"),
    mongoose         = require("mongoose"),
    bodyParser       = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override")
    app	             = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


app.set('port', (process.env.PORT || 5000));

mongoose.connect("mongodb://localhost/restful_blog");
//bog schema and model
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema, "blogs");

// Blog.create({
//     title: "The blog",
//     image: "http://animaliaz-life.com/data_images/dog/dog6.jpg",
//     body: "The is my first blog",
// })

//RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err){
            console.log("ERROR");
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if (err){
            res.render("new");
        } else{
            res.redirect("/blogs")
        }
    });
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});

app.listen(app.get('port'), function(){
    console.log("Server is running at port", app.get("port"));
});

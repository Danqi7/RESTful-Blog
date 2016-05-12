var express    = require("express"),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser"),
    app	       = express();

mongoose.connect("mongodb://localhost/restful_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', (process.env.PORT || 5000));

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

app.listen(app.get('port'), function(){
    console.log("Server is running at port", app.get("port"));
});

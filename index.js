//IMPORTING ALL THE NEW DEPENDENCIES WHICH IS INSTALLED IN PACKAGE.JSON
var express=require("express"),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    methodOverride=require("method-override"),
    expressSanitizer=require("express-sanitizer"),
    app=express();    
    port=process.env.PORT||3000;
    app.set("view engine","ejs");
    app.set("views","./view");

//USING ALL THE IMPORTED DEPENDENCIES IN THE BLOG APP  
app.use(bodyParser.urlencoded({extended:true})); 
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//CONNECTION OF MONGOOSE TO THE SERVER MONGODB
mongoose.connect(process.env.URL||"mongodb://127.0.0.1/Restful_BlogApp",{useNewUrlParser:true,useUnifiedTopology:true});
//var MongoClient=require('mongodb').MongoClient;
// var url="mongodb://restful-blog-app-js.herokuapp.com/Restful_BlogApp";
// mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},function(err,client)
// {
//     if(err)
//     {
//         console.log("Error");
//         throw err;
//     }
//     else{
//         console.log("DB connected....");
//     }
// });
// var db;
// var mongodb=require("mongodb");
// var connection="mongodb+srv://swarnim:anand00008@test-vqkmj.mongodb.net/BlogApp?retryWrites=true&w=majority"
//     mongodb.connect(connection,{useNewUrlParser:true,useUnifiedTopology:true},function(err,client)
//     {
//         db=client.db();
//         app.listen(3000);
//     })

//CONVERTING ALL THE SCHEMA IN JSON FORMAT
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

//COMPILED VERSION OF BLOG SCHEMA
var Blogs=mongoose.model("Blogs",blogSchema);

// var myquery = { title: 'kjhsdkjhkjfd' };
// Blogs.collection.deleteOne(myquery, function(err, obj) {
//   if (err) throw err;
//   else
//   {
//   console.log("1 document deleted");
//   }
// });

//INDEX PAGE
app.get("/",function(req,res)
{
    res.redirect("/blog");
});

//INDEX PAGE
app.get("/blog",function(req,res)
{
        Blogs.find({},function(err,blogs)
        {
            if(err)
            console.log(err);
            else
            res.render("index",{blogs1:blogs});
        }); 
    
});

//NEW FORM FOR CREATING A BLOG
app.get("/blog/new",function(req,res)
{
    res.render("new");
});

//CREATE BLOG
app.post("/blog",function(req,res)
{
   
        req.body.blog.body=req.sanitize(req.body.blog.body);//req.sanitizer is used to remove all the script tags
        Blogs.create(req.body.blog,function(err,newblog)    //from the textarea of code.
        {
            if(err)
            {
                res.render("new");
                console.log(error);
            }
            else
            {
                res.redirect("/blog");
            }
        })
    
    
});

//SHOW PAGE OF ALL BLOGS
app.get("/blog/:id",function(req,res)
{
    Blogs.findById(req.params.id,function(err,foundblog)
    {
        if(err)
        {
            res.redirect("/blog");
        }
        else
        {
            res.render("show",{blog2:foundblog})
        }
    })
});

//EDIT PAGE OF A SPECIFIC BLOG
app.get("/blog/:id/edit",function(req,res)
{
    Blogs.findById(req.params.id,function(err,editblog)
    {
        if(err)
        res.redirect("/blog");
        else{
            res.render("edit",{blog12:editblog});
        }
    })
});

//UPDATE THE SPECIFIC BLOG
app.put("/blog/:id",function(req,res)
{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blogs.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateblog)
    {
        if(err)
        res.redirect("/blog");
        else{
            res.redirect("/blog/"+ req.params.id);
        }
    })
});

//DELETE THE SPECIFIC BLOG
app.delete("/blog/:id",function(req,res)
{
    Blogs.findByIdAndDelete(req.params.id,function(err)
    {
        if(err)
        res.redirect("/blog");
        else
        res.redirect("/blog");
    })
});

app.listen(port,function()
{
    console.log("server started");
})
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const e = require("express");

const app = express();
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articalSchema = {
    title: String,
    content: String
}
const Article = mongoose.model("Article",articalSchema);
//////////////////////////// Request   targetting all articles

app.route("/articles")
.get(function(req, res){
    Article.find({}, function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
        
    })
})


.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content:  req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("sucessfully added a new article.");
        }else{
            res.send(err);
        }
    });
})


.delete(function(req, res){
    Article.deleteMany({}, function(err){

        if(!err){
            res.send("Sucessfully deleted all articles");
        }
        else{
            res.send(err);
        }
    });
});

//////////////////////////// Request   targetting specific articles
// articleTitle will find match in data base. if articleTitle=dbtitle. we can perform operation
app.route("/articles/:articleTitle")
.get(function(req,res){

    
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);

        }else{
             res.send("No artcles matchig tittle" );
        }
    })
})
//localhost:3000/articles/abhay     // abhay id a article id. where put function search for abhay and update document with new data
.put(function(req, res){
    Article.update(
        { title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("sucessfully updated article.");
            }
            
        }
    )
})

.patch(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("sucessfully updated article")
            }else{
                res.send(err);
            }
        }
    )
})
.delete(function(req, res){
    Article.deleteOne(
        {title: req.body.articleTitle},
        function(err){
            if(!err){
                res.send("sucessfully deleted selected articles");
            }else{
                res.send(err);
            }
        }
    );
});
app.listen(3000, function(){
    console.log("server is running on localhost port 3000");
});
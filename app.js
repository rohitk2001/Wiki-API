const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNEWUrlParser:true});

const articleSchema = {
  title:String,
  content:String
};

const Article = mongoose.model("Article",articleSchema);

app.route('/articles')
  .get(function(req,res){
    Article.find(function(err,foundArticles){
      if(!err){
        res.send(foundArticles);
      }else{
        res.send(err);
      }
    });
  })
  .post(function(req,res){
    const newArticle = new Article({
      title:req.body.title,
      content:req.body.content
    });
    newArticle.save(function(err){
      if(!err){
        res.send("Success!");
      }else{
        res.send(err);
      }
    });
  })
  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(!err){
        res.send("Succesfully deleted all arrticles");
      }else{
        res.send(err);
      }
    });
  });

app.route("/articles/:articleTitle")
    .get(function(req,res){
      Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
          res.send(foundArticle);
        }else{
          res.send("No matching article found!");
        }
      });
    })
    .put(function(req,res){
      Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err,updateArticle){
          if(updateArticle){
            res.send(updateArticle);
          }else{
            res.send("No matching article found!");
          }
      })
    })
    .patch(function(req,res){
      Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
          if(!err){
            res.send("Success");
          }else{
            res.send(err);
          }
      })
    })
    .delete(function(req,res){
      Article.deleteOne({title:req.params.articleTitle},function(err){
        if(!err){
          res.send("Succesfully deleted one article");
        }else{
          res.send(err);
        }
      });
    });

  app.listen(3000,function(){
    console.log("Server running on port 3000");
  });

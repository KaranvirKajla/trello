const express = require("express");
const app= express();
const bodyParser= require("body-parser")
const mongoose = require("mongoose");
const Person = require("./models/person");
const PrivateBoard = require("./models/privateBoard");

const PublicBoard = require("./models/publicBoard");
const List = require("./models/list");
const Card = require("./models/card");
const Comment = require("./models/comment");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.get("/",function(req,res){
    res.render("index.ejs");
})
app.get("/signUp",function(req,res){
    res.render("signUp.ejs");
})
app.post("/signUp",function (req,res) {
    let email = req.body.email;
    console.log("emailemailemailemailemailemailemailemailemail",email)
    Person.create({email:email},function(err,person){
        if(err){console.log(err)}else{
            console.log(person);
            res.redirect("/signUp2/"+person._id);
        }
    })

})
app.get("/signUp2/:id",function(req,res){
    let id = req.params.id;
    Person.findOne({_id:id},function(err,found){
        if(err){console.log(err)}else{
            res.render("signUp2.ejs",{person:found});
        }
    })

})
app.post("/signUp2",function(req,res){
    let email = req.body.email;
    let name= req.body.name;
    let password = req.body.password;
    //console.log("signUp2signUp2signUp2signUp2signUp2signUp2signUp2signUp2signUp2",req.body)

    Person.findOneAndUpdate({email:email},{name:name,password:password},function(err,found){
        if(err){console.log(err)}else{
           console.log(found);
        }
    })
})
app.get("/login",function(req,res){
    res.render("login.ejs")
})
app.post("/login",function (req,res) {
   // console.log("loginloginloginloginloginloginloginloginloginlogin",req.body)
    let email = req.body.email;
    let password = req.body.password;
    Person.findOne({email:email},function(err,found){
        if(err){console.log(err)}else{
            res.redirect("/home/"+found._id)
        }
    })
})
app.get("/home/:id",function(req,res){
    let id = req.params.id;
    Person.findOne({_id:id},function(err,found){
        if(err){console.log(err)}else{
           // console.log("homehomehomehomehomehomehomehomehomehomehomehome",found)
            res.render("home.ejs",{person:found});
        }
    })

})
app.get("/createBoard/:id",function(req,res){
    let id = req.params.id;
    Person.findOne({_id:id},function(err,found){
        if(err){console.log(err)}else{
           // console.log("createBoardcreateBoardcreateBoardcreateBoardcreateBoardcreateBoardcreateBoardcreateBoard",found);
            res.render("createBoard.ejs",{person:found});
        }
    })

})
app.post("/createBoard",function(req,res){
    let email = req.body.email;
    let name = req.body.name;
    let type = req.body.type;
    //console.log("createBoardcreateBoardcreateBoardcreateBoardcreateBoardcreateBoardcreateBoardcreateBoardcreateBoardcreateBoard",req.body);
    if(type==="private"){
        PrivateBoard.create({creator:email,name:name},function(err,board){
            if(err){console.log(err);}else{
                console.log(board);
                Person.findOne({email:email},function(err,found){
                    if(err){console.log(err);}else{
                        found.privateBoards.push(board);
                        found.save(function(err,data){
                            if(err){console.log(err);}else{
                                console.log(data);
                            }
                        })
                        res.redirect("/b/"+found._id+"/"+board._id);
                    }
                })
            }
        })
    }else{

    }

})
app.get("/c/:id/:bid/:lid/:cid",function(req,res){
    let id = req.params.id;
    let bid = req.params.bid;
    let lid = req.params.lid;
    let cid = req.params.cid;
    //console.log("cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",id,"bbbbbb",bid,"llllllll",lid,"cccccc",cid)
    Person.findOne({_id:id}).populate("privateBoards").exec(function(err,found){
        if(err){console.log("11111111111111111111111111111111",err)}else{
          

            PrivateBoard.findOne({_id:bid}).populate({path:"lists",populate:{path:"cards"}}).exec(function(err,foundBoard){
                if(err){console.log(err);}else{






                    console.log("ffffffffffffffffffffffffffffffffffff",foundBoard)
                    console.log(foundBoard.lists[0]);
                    res.render("board.ejs",{person:found,board:foundBoard,list:lid});
                }
            })

        }
    })

})
app.get("/l/:id/:bid/:lid",function(req,res){
    let id = req.params.id;
    let bid = req.params.bid;
    let lid = req.params.lid;
    console.log("/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid",bid,"lllllllll",lid)
    Person.findOne({_id:id}).populate("privateBoards").exec(function(err,found){
        if(err){console.log("11111111111111111111111111111111",err)}else{
         
            PrivateBoard.findOne({_id:bid}).populate({path:"lists",populate:{path:"cards"}}).exec(function(err,foundBoard){
                if(err){console.log(err);}else{






                    console.log("ffffffffffffffffffffffffffffffffffff",foundBoard)
                 
                    res.render("board.ejs",{person:found,board:foundBoard,list:lid});
                }
            })

        }
    })

})
app.get("/b/:id/:bid",function(req,res){
    let id = req.params.id;
    let bid = req.params.bid;
   // console.log("/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid",bid)
    Person.findOne({_id:id}).populate("privateBoards").exec(function(err,found){
        if(err){console.log("11111111111111111111111111111111",err)}else{
            PrivateBoard.findOne({_id:bid}).populate({path:"lists",populate:{path:"cards"}}).exec(function(err,foundBoard){
                if(err){console.log(err);}else{






                    console.log("ffffffffffffffffffffffffffffffffffff",found,foundBoard)
                 
                    res.render("board.ejs",{person:found,board:foundBoard});
                }
            })

        }
    })

})
app.post("/lists",function(req,res){
    let id = req.body.id;
    let bid = req.body.bid;
    let listTitle = req.body.listTitle;

    List.create({title:listTitle,cards:[]},function(err,list){
        if(err){console.log(err)}else{
            PrivateBoard.findOne({_id:bid},function(err,foundBoard){
                if(err){console.log(err)}else{
                    foundBoard.lists.push(list);
                    foundBoard.save(function(err,data){
                        if(err){console.log(err)}else{
                            console.log(data);

                        }
                    })
                    console.log("list._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._id",list._id);


                    res.redirect("/l/"+id+"/"+bid+"/"+list._id);
                }
            })
        }

    })

})
app.post("/cards",function(req,res){
    let id = req.body.id;
    let bid = req.body.bid;
    let lid = req.body.lid;
    let cardTitle = req.body.cardTitle;
console.log("cardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscards","iiiiiiiiiii",id,"bbbbbbbbb",bid,"llllllllllll",lid,cardTitle);
    Card.create({title:cardTitle,comments:[]},function(err,card){
        if(err){console.log(err)}else{
            List.findOne({_id:lid},function(err,foundList){
                if(err){console.log(err);}else{
                    foundList.cards.push(card);
                    foundList.save(function(err,data){
                        if(err){console.log(err);}else{
                            console.log(data);
                        }
                    })
                    res.redirect("/c/"+id+"/"+bid+"/"+lid+"/"+card._id);
                }
            })

        }
    })
})
app.get("/card/:id/:bid/:lid/:cid",function(req,res){
    let id = req.params.id;
    let bid = req.params.bid;
    let lid = req.params.lid;
    let cid = req.params.cid;
    console.log("cccccccccccc",cid)
   /* Card.findOne({_id:cid},function(err,foundCard){
        if(err){console.log(err);}else{
            console.log("cardcardcardcardcardcardcardcardcardcardcardcardcardcardcardcardcardcardcardcardcardcardcardcardcard",foundCard)
            res.render("card.ejs",{pid:id,bid:bid,lid:lid,card:foundCard})
        }
    })*/
    Card.findOne({_id:cid}).populate("comments").exec(function(err,foundCard){
        if(err){console.log(err);}else{
            console.log(res);
            res.render("card.ejs",{pid:id,bid:bid,lid:lid,card:foundCard})
        }
    })
})

app.post("/card",function(req,res){
    let id = req.body.id;
    let bid = req.body.bid;
    let lid = req.body.lid;
    let cid = req.body.cid;
    let title = req.body.title;
    let description = req.body.description;
    console.log("postcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcard",title,description)
    Card.findOneAndUpdate({_id:cid},{description:description,title:title},function(err,found){
        if(err){console.log(err)}else{
            console.log(found);
            res.redirect("/card/"+id+"/"+bid+"/"+lid+"/"+cid);
        }
    })
})
app.post("/cardComment",function(req,res){
    let id = req.body.id;
    let bid = req.body.bid;
    let lid = req.body.lid;
    let cid = req.body.cid;
    let desc = req.body.comment;

    Person.findOne({_id:id},function(err,found){
        if(err){console.log(err);}else{
            console.log(found);


            Comment.create({creator:found.name,desc:desc,date:new Date().toLocaleTimeString()+"  "+new Date().toLocaleDateString()},function(err,comment){
                if(err){console.log(err)}else{
                    Card.findOne({_id:cid},function(err,foundCard){
                        if(err){console.log(err);}else{
                            console.log("pushpushpushpushpushpushpushpushpushpushpushpushpushpushpushpushpushpushpush");
                            foundCard.comments.push(comment);
                            foundCard.save(function(err,data){
                                if(err){console.log(err);}else{
                                    console.log(data);
                                }
                            })
                            res.redirect("/card/"+id+"/"+bid+"/"+lid+"/"+cid);
                        }
                    })
                }
            })


        }
    })



})

app.post("/background",function(req,res){
    let id = req.body.id;
    let bid = req.body.bid;
    let background = req.body.background;
    PrivateBoard.findOneAndUpdate({_id:bid},{background:background},function(err,found){
        if(err){console.log(err)}else{
            console.log(found);
            res.redirect("/b"+"/"+id+"/"+bid);
        }
    })
})
app.get("/boardDetails/:id/:bid",function(req,res){
    let id = req.params.id;
    let bid = req.params.bid;
    Person.findOne({_id:id},function(err,found){
        if(err){console.log(err);}else{


            PrivateBoard.findOne({_id:bid},function(err,foundBoard){
                if(err){console.log(err);}else{
                    console.log(foundBoard)
                    res.render("boardDetails.ejs",{person:found,board:foundBoard});
                }
            })


        }
    })
  
   
})

app.post("/boardDetails",function(req,res){
    let id = req.body.id;
    let bid = req.body.bid;
    let name = req.body.name;
    let description = req.body.description;
    let background = req.body.background;
    console.log("boardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetails",id,"bbb",bid,"nnn",name,"ddd",description,"bbb",background);
    PrivateBoard.findOneAndUpdate({_id:bid},{name:name,description:description,background:background},function(err,found){
        if(err){console.log(err)}else{
            res.redirect("/b/"+id+"/"+bid);
        }
    })
})








mongoose.connect("mongodb://localhost:27017/trello").then(()=>{
    app.listen(3000,function () {
        console.log("Server started")
    })
})
const express = require("express");
const app= express();
const bodyParser= require("body-parser")
const mongoose = require("mongoose");
const Person = require("./models/person");

const Board = require("./models/board");
const List = require("./models/list");
const Card = require("./models/card");
const Comment = require("./models/comment");
const Team = require("./models/team")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());

let myLogger = function(req,res,next){
    let id = req.params.id;
    console.log("myloggermyloggermyloggermyloggermyloggermyloggermyloggermyloggermylogger")
    Person.findOne({_id:id},function(err,found){
        if(err){console.log(err)}else{
            if(found.login==true){next();}else{
                res.redirect("/login/false");
            }
        }
    })
}






app.get("/",function(req,res){
    res.render("index.ejs");
})
app.get("/signUp",function(req,res){
    res.render("signUp.ejs");
})
app.post("/signUp",function (req,res) {
    let email = req.body.email;
    console.log("emailemailemailemailemailemailemailemailemail",email)
    Person.create({email:email,login:true},function(err,person){
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
           res.redirect("/home/"+found._id)
        }
    })
})
app.get("/login/:alert",function(req,res){
    let alert = req.params.alert;
    res.render("login.ejs",{alert:alert})
})
app.post("/login",function (req,res) {
   // console.log("loginloginloginloginloginloginloginloginloginlogin",req.body)
    let email = req.body.email;
    let password = req.body.password;
    Person.findOneAndUpdate({email:email},{login:true},function(err,found){
        if(err){console.log(data);}else{
            console.log("loginloginloginloginloginloginloginloginloginloginloginloginlogin",found);
            if(found===null || password!=found.password){
                res.redirect("/login/true")
            }else
            res.redirect("/home/"+found._id)
        }
    })
    // Person.findOne({email:email},function(err,found){
    //     if(err){console.log(err)}else{

    //         found.update({login:true},function(err,data){
    //             if(err){console.log(err);}else{
                   
    //             }
    //         })
           
    //     }
    // })
})
app.get("/logout/:id",function(req,res){
    let id = req.params.id;
    console.log("logoutlogoutlogoutlogoutlogoutlogoutlogoutlogoutlogoutlogoutlogoutlogoutlogoutlogoutlogoutlogout",id);
    Person.findOneAndUpdate({_id:id},{login:false},function(err,data){
        if(err){console.log(err)}else{
            res.redirect("/login/false");
        }
    })
})




app.get("/home/:id",myLogger,function(req,res){
    let id = req.params.id;
    Person.findOne({_id:id}).populate("boards").populate({path:"teams",populate:{path:"boards"}}).exec(function(err,found){
        if(err){console.log(err)}else{
           // console.log("homehomehomehomehomehomehomehomehomehomehomehome",found)
            res.render("home.ejs",{person:found});
        }
    })

})
app.get("/createBoard/:id",myLogger,function(req,res){
    let id = req.params.id;
    Person.findOne({_id:id}).populate("teams").exec(function(err,found){
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
        Board.create({creator:email,name:name},function(err,board){
            if(err){console.log(err);}else{
                console.log(board);
                Person.findOne({email:email},function(err,found){
                    if(err){console.log(err);}else{
                        found.boards.push(board);
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
        let tid = type;
        console.log(tid);

        Board.create({creator:email,name:name},function(err,board){
            if(err){console.log(err);}else{
                Team.findOne({_id:tid}).populate("boards").exec(function(err,foundTeam){
                    if(err){console.log(err);}else{
                        foundTeam.boards.push(board);
                        foundTeam.save(function(err,data){
                            if(err){console.log(err);}else{
                                console.log(data);
                            }
                        })
                        console.log("createBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeamcreateBoardTeam",board)
                        Person.findOne({email:email},function(err,found){
                            if(err){console.log(err);}else{
                                res.redirect("/tb/"+found._id+"/"+foundTeam._id+"/"+board._id);
                            }
                        })
                        
                    }
                })
            }
        })
    }

})
app.get("/c/:id/:bid/:lid/:cid",myLogger,function(req,res){
    let id = req.params.id;
    let bid = req.params.bid;
    let lid = req.params.lid;
    let cid = req.params.cid;
    //console.log("cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",id,"bbbbbb",bid,"llllllll",lid,"cccccc",cid)
    Person.findOne({_id:id}).populate("Boards").exec(function(err,found){
        if(err){console.log("11111111111111111111111111111111",err)}else{
          

            Board.findOne({_id:bid}).populate({path:"lists",populate:{path:"cards"}}).exec(function(err,foundBoard){
                if(err){console.log(err);}else{






                    console.log("ffffffffffffffffffffffffffffffffffff",foundBoard)
                    console.log(foundBoard.lists[0]);
                    res.render("board.ejs",{person:found,board:foundBoard,list:lid});
                }
            })

        }
    })

})
app.get("/l/:id/:bid/:lid",myLogger,function(req,res){
    let id = req.params.id;
    let bid = req.params.bid;
    let lid = req.params.lid;
    console.log("/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid",bid,"lllllllll",lid)
    Person.findOne({_id:id}).populate("boards").exec(function(err,found){
        if(err){console.log("11111111111111111111111111111111",err)}else{
         
            Board.findOne({_id:bid}).populate({path:"lists",populate:{path:"cards"}}).exec(function(err,foundBoard){
                if(err){console.log(err);}else{






                    console.log("ffffffffffffffffffffffffffffffffffff",foundBoard)
                 
                    res.render("board.ejs",{person:found,board:foundBoard,list:lid});
                }
            })

        }
    })

})
app.get("/b/:id/:bid",myLogger,function(req,res){
    let id = req.params.id;
    let bid = req.params.bid;
   // console.log("/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid",bid)
    Person.findOne({_id:id}).populate("boards").exec(function(err,found){
        if(err){console.log("11111111111111111111111111111111",err)}else{
            Board.findOne({_id:bid}).populate({path:"lists",populate:{path:"cards"}}).exec(function(err,foundBoard){
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
            Board.findOne({_id:bid},function(err,foundBoard){
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
app.get("/card/:id/:bid/:lid/:cid",myLogger,function(req,res){
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
    Board.findOneAndUpdate({_id:bid},{background:background},function(err,found){
        if(err){console.log(err)}else{
            console.log(found);
            res.redirect("/b"+"/"+id+"/"+bid);
        }
    })
})
app.get("/boardDetails/:id/:bid",myLogger,function(req,res){
    let id = req.params.id;
    let bid = req.params.bid;
    Person.findOne({_id:id},function(err,found){
        if(err){console.log(err);}else{


            Board.findOne({_id:bid},function(err,foundBoard){
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
    Board.findOneAndUpdate({_id:bid},{name:name,description:description,background:background},function(err,found){
        if(err){console.log(err)}else{
            res.redirect("/b/"+id+"/"+bid);
        }
    })
})



app.get("/createTeam/:id",myLogger,function(req,res){
    let id = req.params.id;
    Person.findOne({_id:id},function(err,found){
        if(err){console.log(err);}else{
            res.render("createTeam.ejs",{person:found});
        }
    })
   
})
app.post("/createTeam",function(req,res){
    let id = req.body.id;
    let name = req.body.name;
    let type = req.body.type;
    let description = req.body.description;

    Person.findOne({_id:id},function(err,found){
        if(err){console.log(err);}else{
            
            Team.create({creator:found,name:name,type:type,description:description,members:[found],boards:[]},function(err,team){
                if(err){console.log(err)}else{
                    console.log(team);
                    found.teams.push(team);
                    found.save(function(err,data){
                        if(err){console.log(err);}else{
                            console.log("createTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeamcreateTeam",found);
                            res.redirect("/homeBoard/"+found._id+"/"+team._id);
                        }
                    });

                }
            })





        }
    })
    
})

app.get("/homeBoard/:id/:tid",myLogger,function(req,res){
    let id = req.params.id;
    let tid = req.params.tid;
    Person.findOne({_id:id}).populate("boards").exec(function(err,found){
        if(err){console.log(err);}else{

            Team.findOne({_id:tid}).populate("boards").populate("members").exec(function(err,foundTeam){
                if(err){console.log(err);}else{
                    res.render("homeBoard.ejs",{person:found,team:foundTeam})
                }
            })
            
        }
    })
  
    
})
app.get("/list/:id/:bid/:lid",myLogger,function(req,res){
    let lid = req.params.lid;
    let id = req.params.id;
    let bid = req.params.bid;
    List.findOne({_id:lid},function(err,foundList){
        if(err){console.log(err);}else{
            res.render("list.ejs",{list:foundList,id:id,bid:bid});
        }
    })
   
})
app.post("/list",function(req,res){
    let id = req.body.id;
    let bid = req.body.bid;
    let lid = req.body.lid;
    let title = req.body.title;
    List.findOneAndUpdate({_id:lid},{title:title},function(err,foundList){
        if(err){console.log(err)}else{
            console.log(foundList);
            res.redirect("/b/"+id+"/"+bid);
        }
    })
})

app.post("/deleteCard",function(req,res){
    let id  = req.body.id;
    let bid = req.body.bid;
    let lid = req.body.lid;
    let cid = req.body.cid;
    List.findOne({_id:lid},function(err,foundList){
        if(err){console.log(err);}else{
            foundList.cards.remove({_id:cid});
            foundList.save(function(err,data){
                if(err){console.log(err);}else{
                    console.log(data);

                    Card.findOne({_id:cid},function(err,foundCard){
                        if(err){console.log(err);}else{
                            for(i=0;i<foundCard.comments.length;i++){
                                Comment.findOneAndRemove({_id:foundCard.comments[i]._id},function(err,removeComment){
                                    if(err){console.log(err);}else{
                                        res.redirect("/b/"+id+"/"+bid);
                                    }
                                })
                            }
                        }
                    })
                  

                }
            })
        }
    })
   

})

app.post("/deleteList",function(req,res){
    let id = req.body.id;
    let bid = req.body.bid;
    let lid = req.body.lid;

    List.findOne({_id:lid},function(err,foundList){
        if(err){console.log(err)}else{
            console.log("deleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteList",foundList)
            for(i=0;i<foundList.cards.length;i++){
                Card.findOneAndRemove({_id:foundList.cards[i]._id},function(err,card){
                    if(err){console.log(err);}else{
                        console.log(card);
                    }
                })
            }

            Board.findOne({_id:bid},function(err,foundBoard){
                if(err){console.log(err);}else{
                    foundBoard.lists.remove({_id:lid});
                    foundBoard.save(function(err,data){
                        if(err){console.log(err);}else{
                            console.log(data);

                            foundList.remove(function(err,data){
                                if(err){console.log(err);}else{
                                    console.log(data);
                                    res.redirect("/b/"+id+"/"+bid);
                                }
                            })
                        }
                    })
                }
            })


        }
 })


})

app.get("/tb/:id/:tid/:bid",myLogger,function(req,res){
    let id = req.params.id;
    let tid = req.params.tid;
    let bid = req.params.bid;
  console.log("/tb/:id/:tid/:bid/tb/:id/:tid/:bid/tb/:id/:tid/:bid/tb/:id/:tid/:bid/tb/:id/:tid/:bid/tb/:id/:tid/:bid/tb/:id/:tid/:bid/tb/:id/:tid/:bid/tb/:id/:tid/:bid/tb/:id/:tid/:bid/tb/:id/:tid/:bid/tb/:id/:tid/:bid/tb/:id/:tid/:bid");
    Team.findOne({_id:tid}).populate("boards").exec(function(err,foundTeam){
        if(err){console.log("11111111111111111111111111111111",err)}else{
            Board.findOne({_id:bid}).populate({path:"lists",populate:{path:"cards"}}).exec(function(err,foundBoard){
                if(err){console.log(err);}else{

                    Person.findOne({_id:id}).populate("boards").populate("teams").exec(function(err,found){
                        if(err){console.log(err);}else{
                            console.log("ffffffffffffffffffffffffffffffffffff",found,foundBoard)
                 
                            res.render("teamBoard.ejs",{person:found,team:foundTeam,board:foundBoard});
                        }
                    })




                  
                }
            })

        }
    })

})



app.get("/tc/:id/:tid/:bid/:lid/:cid",myLogger,function(req,res){
    let id = req.params.id;
    let tid = req.params.tid;
    let bid = req.params.bid;
    let lid = req.params.lid;
    let cid = req.params.cid;
    //console.log("cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",id,"bbbbbb",bid,"llllllll",lid,"cccccc",cid)
    Team.findOne({_id:tid}).populate("Boards").exec(function(err,foundTeam){
        if(err){console.log("11111111111111111111111111111111",err)}else{
          

            Board.findOne({_id:bid}).populate({path:"lists",populate:{path:"cards"}}).exec(function(err,foundBoard){
                if(err){console.log(err);}else{



                    Person.findOne({_id:id}).populate("boards").populate("teams").exec(function(err,found){
                        if(err){console.log(err);}else{
                            console.log("ffffffffffffffffffffffffffffffffffff",found,foundBoard)
                 
                            res.render("teamBoard.ejs",{person:found,team:foundTeam,board:foundBoard});
                        }
                    })

                }
            })

        }
    })

})
app.get("/tl/:id/:tid/:bid/:lid",myLogger,function(req,res){
    let id = req.params.id;
    let tid = req.params.tid;
    let bid = req.params.bid;
    let lid = req.params.lid;
    console.log("/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid/b/:id/:bid",bid,"lllllllll",lid)
    Team.findOne({_id:tid}).populate("boards").exec(function(err,foundTeam){
        if(err){console.log("11111111111111111111111111111111",err)}else{
         
            Board.findOne({_id:bid}).populate({path:"lists",populate:{path:"cards"}}).exec(function(err,foundBoard){
                if(err){console.log(err);}else{




                    Person.findOne({_id:id}).populate("boards").populate("teams").exec(function(err,found){
                        if(err){console.log(err);}else{
                            console.log("ffffffffffffffffffffffffffffffffffff",found,foundBoard)
                 
                            res.render("teamBoard.ejs",{person:found,team:foundTeam,board:foundBoard});
                        }
                    })

                 
                  
                }
            })

        }
    })

})

app.get("/teamList/:id/:tid/:bid/:lid",myLogger,function(req,res){
    let lid = req.params.lid;
    let tid = req.params.tid;
    let id = req.params.id;
    let bid = req.params.bid;

    List.findOne({_id:lid},function(err,foundList){
        if(err){console.log(err);}else{
            res.render("teamList.ejs",{list:foundList,id:id,bid:bid,tid:tid});
        }
    })
   
})

app.post("/teamLists",function(req,res){
    let id = req.body.id;
    let tid = req.body.tid;
    let bid = req.body.bid;
    let listTitle = req.body.listTitle;

    List.create({title:listTitle,cards:[]},function(err,list){
        if(err){console.log(err)}else{
            Board.findOne({_id:bid},function(err,foundBoard){
                if(err){console.log(err)}else{
                    foundBoard.lists.push(list);
                    foundBoard.save(function(err,data){
                        if(err){console.log(err)}else{
                            console.log(data);

                        }
                    })
                    console.log("list._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._idlist._id",list._id);


                    res.redirect("/tl/"+id+"/"+tid+"/"+bid+"/"+list._id);
                }
            })
        }

    })

})
app.get("/tc/:id/:tid/:bid/:lid/:cid",myLogger,function(req,res){
    let id = req.params.id;
    let tid = req.params.tid;
    let bid = req.params.bid;
    let lid = req.params.lid;
    let cid = req.params.cid;
    //console.log("cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",id,"bbbbbb",bid,"llllllll",lid,"cccccc",cid)
    Team.findOne({_id:tid}).populate("boards").exec(function(err,foundTeam){
        if(err){console.log("11111111111111111111111111111111",err)}else{
         
            Board.findOne({_id:bid}).populate({path:"lists",populate:{path:"cards"}}).exec(function(err,foundBoard){
                if(err){console.log(err);}else{




                    Person.findOne({_id:id}).populate("boards").populate("teams").exec(function(err,found){
                        if(err){console.log(err);}else{
                            console.log("ffffffffffffffffffffffffffffffffffff",found,foundBoard)
                 
                            res.render("teamBoard.ejs",{person:found,team:foundTeam,board:foundBoard});
                        }
                    })

                 
                  
                }
            })

        }
    })

})
app.post("/teamCards",function(req,res){
    let id = req.body.id;
    let tid = req.body.tid;
    let bid = req.body.bid;
    let lid = req.body.lid;
    let cardTitle = req.body.cardTitle;
console.log("cardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscardscards","iiiiiiiiiii",tid,"bbbbbbbbb",bid,"llllllllllll",lid,cardTitle);
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
                    res.redirect("/tc/"+id+"/"+tid+"/"+bid+"/"+lid+"/"+card._id);
                }
            })

        }
    })
})


app.get("/teamBoardDetails/:id/:tid/:bid",myLogger,function(req,res){
    let id = req.params.id;
    let tid = req.params.tid;
    let bid = req.params.bid;
    Team.findOne({_id:tid},function(err,found){
        if(err){console.log(err);}else{


            Board.findOne({_id:bid},function(err,foundBoard){
                if(err){console.log(err);}else{
                    console.log(foundBoard)
                    res.render("teamBoardDetails.ejs",{pid:id,team:found,board:foundBoard});
                }
            })


        }
    })
  
   
})

app.post("/teamBoardDetails",function(req,res){
    let id = req.body.id;
    let tid = req.body.tid;
    let bid = req.body.bid;
    let name = req.body.name;
    let description = req.body.description;
    let background = req.body.background;
    console.log("boardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetailsboardDetails",tid,"bbb",bid,"nnn",name,"ddd",description,"bbb",background);
    Board.findOneAndUpdate({_id:bid},{name:name,description:description,background:background},function(err,found){
        if(err){console.log(err)}else{
            res.redirect("/tb/"+id+"/"+tid+"/"+bid);
        }
    })
})

app.post("/teamBackground",function(req,res){
    let id = req.body.id;
    let tid = req.body.tid;
    let bid = req.body.bid;
    let background = req.body.background;
    Board.findOneAndUpdate({_id:bid},{background:background},function(err,found){
        if(err){console.log(err)}else{
            console.log(found);
            res.redirect("/tb/"+id+"/"+tid+"/"+bid);
        }
    })
})


app.get("/teamCard/:id/:tid/:bid/:lid/:cid",myLogger,function(req,res){
    let id = req.params.id;
    let tid = req.params.tid;
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
            res.render("teamCard.ejs",{pid:id,tid:tid,bid:bid,lid:lid,card:foundCard})
        }
    })
})


app.post("/teamDeleteCard",function(req,res){
    let id  = req.body.id;
    let tid = req.body.tid;
    let bid = req.body.bid;
    let lid = req.body.lid;
    let cid = req.body.cid;
    List.findOne({_id:lid},function(err,foundList){
        if(err){console.log(err);}else{
            foundList.cards.remove({_id:cid});
            foundList.save(function(err,data){
                if(err){console.log(err);}else{
                    console.log(data);

                    Card.findOne({_id:cid},function(err,foundCard){
                        if(err){console.log(err);}else{
                            for(i=0;i<foundCard.comments.length;i++){
                                Comment.findOneAndRemove({_id:foundCard.comments[i]._id},function(err,removeComment){
                                    if(err){console.log(err)}else{
                                        foundCard.remove(function(err,removeCard){
                                            if(err){console.log(err);}else{
                                                console.log("BeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBeforeBefore")
                                                res.redirect("/tb/"+id+"/"+tid+"/"+bid);
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })

                }
            })
        }
    })
   

})

app.post("/teamDeleteList",function(req,res){
    let id = req.body.id;
    let tid = req.body.tid;
    let bid = req.body.bid;
    let lid = req.body.lid;

    List.findOne({_id:lid},function(err,foundList){
        if(err){console.log(err)}else{
            console.log("deleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteListdeleteList",foundList)
            for(i=0;i<foundList.cards.length;i++){
                Card.findOneAndRemove({_id:foundList.cards[i]._id},function(err,card){
                    if(err){console.log(err);}else{
                        console.log(card);
                    }
                })
            }

            Board.findOne({_id:bid},function(err,foundBoard){
                if(err){console.log(err);}else{
                    foundBoard.lists.remove({_id:lid});
                    foundBoard.save(function(err,data){
                        if(err){console.log(err);}else{
                            console.log(data);

                            foundList.remove(function(err,data){
                                if(err){console.log(err);}else{
                                    console.log(data);
                                    res.redirect("/tb/"+id+"/"+tid+"/"+bid);
                                }
                            })
                        }
                    })
                }
            })


        }
 })


})



app.post("/teamCard",function(req,res){
    let id = req.body.id;
    let tid = req.body.tid;
    let bid = req.body.bid;
    let lid = req.body.lid;
    let cid = req.body.cid;
    let title = req.body.title;
    let description = req.body.description;
    console.log("postcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcardpostcard",title,description)
    Card.findOneAndUpdate({_id:cid},{description:description,title:title},function(err,found){
        if(err){console.log(err)}else{
            console.log(found);
            res.redirect("/teamCard/"+id+"/"+tid+"/"+bid+"/"+lid+"/"+cid);
        }
    })
})
app.post("/teamCardComment",function(req,res){
    let id = req.body.id;
    let tid = req.body.tid;
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
                            res.redirect("/teamCard/"+id+"/"+tid+"/"+bid+"/"+lid+"/"+cid);
                        }
                    })
                }
            })


        }
    })



})



app.get("/homeMember/:id/:tid",myLogger,function(req,res){
    let id = req.params.id;
    let tid = req.params.tid;
    Person.findOne({_id:id}).populate("boards").exec(function(err,found){
        if(err){console.log(err);}else{

            Team.findOne({_id:tid}).populate("boards").populate("members").exec(function(err,foundTeam){
                if(err){console.log(err);}else{
                    res.render("homeMember.ejs",{person:found,team:foundTeam})
                }
            })
            
        }
    })
})


app.get("/teamDetails/:id/:tid",myLogger,function(req,res){
    let id = req.params.id;
    let tid = req.params.tid;
    Team.findOne({_id:tid},function(err,foundTeam){
        if(err){console.log(err);}else{
            res.render("teamDetails.ejs",{pid:id,team:foundTeam});
        }
    })
   
})

app.post("/teamDetails",function(req,res){
    let id = req.body.id;
    let tid = req.body.tid;
    let name= req.body.name;
    let type = req.body.type;
    let description= req.body.description;
    Team.findOneAndUpdate({_id:tid},{name:name,description:description},function(err,data){
        if(err){console.log(err);}else{
            res.redirect("/teamDetails/"+id+"/"+tid)
        }
    })
    
})

app.get("/addMember/:id/:tid",myLogger,function(req,res){
    let tid = req.params.tid;
    let id = req.params.id;
    Person.find({},function(err,found){
        if(err){console.log(err)}else{
            Team.findOne({_id:tid}).exec(function(err,foundTeam){
                let filterPersons = found.filter(function(item){
                    return foundTeam.members.indexOf(item._id)===-1;
                })

                console.log("addMemberaddMemberaddMemberaddMemberaddMemberaddMemberaddMemberaddMemberaddMemberaddMemberaddMemberaddMemberaddMemberaddMemberaddMemberaddMember",filterPersons)
                res.render("addMember.ejs",{pid:id,persons:filterPersons,tid:tid})

            })

       
    }
    })
    
})
app.get("/addedMember/:id/:tid/:amid",myLogger,function(req,res){
    let id = req.params.id;
    let tid = req.params.tid;
    let amid = req.params.amid;
    Team.findOne({_id:tid},function(err,foundTeam){
        if(err){console.log(err);}else{
            foundTeam.members.push(amid);
            foundTeam.save(function(err,data){
                if(err){console.log(err);}else{

                    Person.findOne({_id:amid},function(err,foundPerson){
                        if(err){console.log(err);}else{
                            foundPerson.teams.push(tid);
                            foundPerson.save(function(err,dd){
                                if(err){console.log(err);}else{
                                    console.log(data);
                                }
                            })
                        }
                    })
                    console.log(data);
                    res.redirect("/homeMember/"+id+"/"+tid);
                }
            })
            
        }
    })
})



mongoose.connect("mongodb://localhost:27017/trello").then(()=>{
    app.listen(3000,function () {
        console.log("Server started")
    })
})
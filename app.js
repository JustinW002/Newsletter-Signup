const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const config=require("./config.js");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.listen(3000,function(){
    console.log("Connected to port 3000");
});

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    var firstName=req.body.firstName;
    var lastName=req.body.lastName;
    var email=req.body.email;
    var data={
        members:[
            {email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:lastName
            }}]
    };
    var jsonData=JSON.stringify(data);
    var options={
        url:'https://'+config.serverId+'.api.mailchimp.com/3.0/lists/'+config.audienceId,
        method:"POST",
        headers:{"Authorization": "justin "+config.MY_KEY},
        body:jsonData

    }
   
    request(options,function(error,response,body){
        if(error){
            res.sendFile(__dirname+"/failure.html");
        } else{
            if(response.statusCode===200)
            res.sendFile(__dirname+"/success.html");
            else
            res.sendFile(__dirname+"/failure.html");
        }
            });
});

app.post("/failure",function (req,res) {
    res.redirect("/");  
});



//packages
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

//initialize express
const app = express();
//set bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));
//make a folder as public
//share css file and images by creating a shared folder "public"
//and place each file in its respective folder
app.use(express.static("public"));

//request handler for the route index
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//POST route failure
app.post("/failure", function(req, res){
  res.redirect("/");
});


//post handler for route index
app.post("/", function(req, res) {
  //get data from the form
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  //create the data to be sent to mailChimp as object
  //the object has the following format from the API documentation
  //for batch subscribe and unsubcribe
  const data = {
    //members is an array of objects in our case only one
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  }

  //convert the data to json
  const jsonData = JSON.stringify(data);
  const listId = "685ea55ad8";
  const server = "us17";
  //construct the url for sending the data using the API
  const url = "https://" + server + ".api.mailchimp.com/3.0/lists/" + listId;
  //options with authorization
  const options = {
    method: "POST",
    auth: "AMG:23476552486649a10ec7683565fa8af6-us17"
  };

  //connect to mailChimp using API
  const request = https.request(url, options, function(response) {
    //check if request was succesfull
    if (response.statusCode === 200) {
      //if so send succcess.html file to the route root
      res.sendFile(__dirname+"/success.html");
    } else {
      //otherwise send failure.html file to the route root
      res.sendFile(__dirname+"/failure.html");
    }

    //used for debugging
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  });

  //send the data to the mailChimp for creating the contact
  request.write(jsonData);
  request.end();
});



//express server
var port = 3000;
//process.env.PORT for Heroku
app.listen(process.env.PORT || port, function() {
  console.log("Server is rinning on port " + port);
});

//api key
//23476552486649a10ec7683565fa8af6-us17

//list id
//685ea55ad8

const express = require("express");
const cors = require("cors");
require("dotenv").config();

//Object for the database
const prisma = require("./prisma/client");
//Object for the server
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/create-user", async (req, res) => {
    //Store requested data values in object
    const {username, email, password} = req.body;
    //Create new user with requested data
    const user = await prisma.user.create({
        data: { username, email, password}
    });

    //Respond with new User to server
    res.json(user);
});

app.get("/get/user/all", async (req, res) => {
  //
  try{
    const users = prisma.user.findMany();
    res.json(users);
  }
  catch(err){
    res.status(500).json({error: "Unable to grab user"});
  }
});

app.get("get/user/:id", async (req, res) =>{
  const userId = Number(req.params.id);
  try{
    //Search for user via id
    const user = prisma.user.findUnique({
      where: { id: userId}
    });

    //If no user found prompt error
    if(!user){
      res.status(404).json({error: "User cannot be found"});
    }

    //Return user
    res.json(user);
  }

  catch(err){
    res.status(500).json({error: "Unable to grab user"});
  }
});

app.get("get/user/:username", async (req, res) => {
  const username = String(req.params.username);
  try{
    //search for user by username nd store id and username
    const user = prisma.user.findUnique({
      where: { username: username},
      select: { id: true,
                username: true
      }
    });

    if(!user){
      res.status(404).json({error: "User cannot be found"})
    }

    res.json(user);
  }
  catch(err){
        res.status(500).json({error: "Unable to grab user"});
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//runs code: node index.js
//Link for server: http://localhost:4000/
//Commands https://expressjs.com/en/5x/api.html
//Commands: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
//View database: npx prisma studio
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
  res.send("Server is running innit");
});

app.post("/create/user", async (req, res) => {
    //Store requested data values in object
    const {username, email, password} = req.body;
    //Create new user with requested data
    const user = await prisma.user.create({
        data: { username, email, password}
    });

    //Respond with new User to server
    res.json(user);
});

app.post("/delete/user/:id", async (req, res) => {
  const userId = Number(req.params.id);
  try{
    await prisma.user.delete({
      where: { id: userId }
    });
    res.json({ message: "User deleted successfully" });
  }
  catch(err){
    res.status(500).json({error: "Unable to delete user"});
  }
});

app.post("/update/user/username/:username", async (req, res) => {
  const userId = String(req.params.username);
  const { username, email, password } = req.body;

  try{
    const updatedUser = await prisma.user.update({
      where: { username: userId },
      data: { username, email, password }
    });

    res.json(updatedUser);
  }
  catch(err){
    res.status(500).json({error: "Unable to update user username "});
  }
  });

app.post("/update/user/email/:email", async (req, res) => {
  const userId = String(req.params.email);
  const { username, email, password } = req.body;

  try{
      const updatedUser = await prisma.user.update({
        where: { email: userId },
        data: { username, email, password }
      });

      res.json(updatedUser);
  }
  catch(err){
    res.status(500).json({error: "Unable to update user email "});
  }
  });

  app.get("/get/user/all", async (req, res) => {
    try{
      //Grab multipule users from database and return to server 
      const users = await prisma.user.findMany();
      res.json(users);
    }
    catch(err){
      res.status(500).json({error: "Unable to grab all users"});
    }
  });

  app.get("/get/user/id/:id", async (req, res) =>{
    const userId = Number(req.params.id);
    try{
      //Search for user via id
      const user = await prisma.user.findUnique({
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
      res.status(500).json({error: "Unable to grab user by ID"});
    }
  });

  app.get("/get/user/username/:username", async (req, res) => {
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
      res.status(500).json({error: "Unable to grab user by username"});
  }
  });

  app.get("/get/user/email/:email", async (req, res) => {
  const email = String(req.params.email);
  try{
    //search for user by email and store id and email
    const user = await prisma.user.findUnique({
      where: { email: email},
      select: { id: true,
                email: true
      }
    });

    if(!user){
      res.status(404).json({error: "User cannot be found"})
    }

    res.json(user);
  }
  catch(err){
        res.status(500).json({error: "Unable to grab user by email"});
  }
  });

  app.get("/get/user/:id/message/:id", async (req, res) => {
  const userId = Number(req.params.id);
  try{
    //Search for user messages by message id
    const messages = await prisma.message.findUnique({
      where: { userId: userId}
    });

    res.json(messages);
  }
  catch(err){
    res.status(500).json({error: "Unable to grab user messages by ID"});
  }
  });

  app.get("/get/user/:id/message/all", async (req, res) => {
    try{
      //Grab all messages sent from a user
      const messages = await prisma.user.message.findMany({
        where: { userId: Number(req.params.id) }
      });
      res.json(messages);
    }

    catch(err){
      res.status(500).json({error: "Unable to grab all user messages"});
    }
  });

  app.post("/create/user/:id/message", async (req, res) => {
    //Store the message data in an object
    const { content, userId} = req.body;

    try{
      //Create the message with requested data
      const message = await prisma.message.create({
        data: { content, userId}
      });
      //Respond with new message to server
      res.json(message);
    }
    catch(err){
      res.status(500).json({error: "Unable to create message"});
    }
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//runs API server: 
    //cd server
    //npm start
//Link for server: http://localhost:4000/
//Commands https://expressjs.com/en/5x/api.html
//Commands: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
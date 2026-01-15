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

app.post("/users", async (req, res) => {
    //Store requested data values in object
    const {username, email, password} = req.body;
    //Create new user with requested data
    const user = await prisma.user.create({
        data: { username, email, password}
    });

    //Respond with new User to server
    res.json(user);
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
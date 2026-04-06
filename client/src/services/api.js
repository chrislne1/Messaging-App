//Method to create a user
export const createUser = async (data) => {
    const res = await fetch("http://localhost:4000/create/user", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res.json()
}

//Method to delete user by id
export const deleteUser = async (data) => {
    const res = await fetch("http://localhost:4000/delete/user/" + data, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
    });
    return res.json()
}

//Method to update a users username
export const updateUsername = async (data) => {
    const res = await fetch("http://localhost:4000/update/user/username/+" + data.username, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res.json()
}

//Method to update a users email
export const updateEmail = async (data) => {
    const res = await fetch("http://localhost:4000/update/user/email/" + data.email, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res.json()
}

//Method to grab all users
export function getAllUsers(){
    return fetch("/get/user/all").then(res => res.json());
}

//Method to grab a user by id
export function getUserById(userId){
    return fetch(`/get/user/id/${userId}`).then(res => res.json());
}

//Method to grab a user by username
export function getUserByUsername(username){
    return fetch(`/get/user/username/${username}`).then(res => res.json());
}

//Method to grab a user by email
export function getUserByEmail(email){
    return fetch(`/get/user/email/${email}`).then(res => res.json());
}

//Method to grab a users message by the message id
export function getUserMessagesById(userId, messageId){
    return fetch(`/get/user/${userId}/message/${messageId}`).then(res => res.json());
}

//Method to grab all of a users messages 
export function getAllUserMessages(userId){
    return fetch(`/get/user/${userId}/messages/all`).then(res => res.json());
}

//Method to create a message from a user
export const createMessage = async (userId, content) => {
    const res = await fetch("http://localhost:4000/create/user/" + userId + "/message", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ content })
    });
    return res.json();
}
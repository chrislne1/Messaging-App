export const createUser = async (data) => {
    const res = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res.json()
};

//Method to grab all users
export function getAllUsers(){
    return fetch("/get/user/all").then(res => res.json());
}

//Method to grab a user by id
export function getUserById(id){
    return fetch(`/get/user/${id}`).then(res => res.json());
}
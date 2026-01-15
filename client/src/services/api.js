export const createUser = async (data) => {
    const res = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res.json()
};
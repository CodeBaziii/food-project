document.querySelector("#loginForm").addEventListener("submit",function(e){
    e.preventDefault()

    const username = document.querySelector("#username").value
    const password = document.querySelector("#password").value

    const users = JSON.parse(localStorage.getItem("users")) || []

    const validUser = users.find(user => user.username === username && user.password === password)

console.log(validUser);

    if(validUser) {
        const token = btoa(JSON.stringify({
        username,
        exp: Date.now() + 86400000
    }))
    console.log(token);
    localStorage.setItem("token" , token)
    localStorage.setItem("loggedUser" , username)
    showNotification("ورود با موفقبت انجام شد")
    window.location.href = "index.html"
    }else{
        showNotification("نام کاربری یا کلمه عبور اشتباه است." , "error")
    }
})


function showNotification(massage , type = "success"){

    const notification = document.querySelector("#notification");

    notification.innerHTML = massage;
    notification.className = type === "error" ? "show error" : "show"

    setTimeout(() => {
        notification.style.display = "none";
    },3000)

}
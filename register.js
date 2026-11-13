

function showNotification(massage , type = "success"){

    const notification = document.querySelector("#notification");

    notification.innerHTML = massage;
    notification.className = type === "error" ? "show error" : "show"

    setTimeout(() => {
        notification.style.display = "none";
    },3000)

}




document.querySelector("#registerForm").addEventListener("submit",function(e){
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem("users")) || [];




    const username = document.querySelector("#username").value
    const password = document.querySelector("#password").value

    const exitingUser = users.find(user => user.username === username)
    console.log(exitingUser);
    if(exitingUser){
        showNotification("این کاربر قبلا ثبت نام شده است." , "error")
        return;
    }



    users.push({username, password})
    localStorage.setItem("users", JSON.stringify(users))
    showNotification("ثبت نام با موفقیتت انجام شد")
})
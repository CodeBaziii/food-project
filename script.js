let cart = []
const foods = []


// دریافت اطلاعات API

async function fetchMeal() {
    try {
        const response = await fetch("./foods-1.json");
        const data =  await response.json();
        data.forEach(food => foods.push(food));
        displayMeals(foods)
    } catch (error) {
        console.log(error);
    }
}

fetchMeal()
// نمایش کارت غذا ها

function displayMeals(meals){
    const mealsList = document.querySelector("#mealList");
    mealsList.innerHTML = ''
    meals.forEach((meal) => {
        const mealItem = `
            <div class="meal">
              <img src="${meal.image}" alt="${meal.name}">
              <h3>${meal.name}</h3>
              <p>قیمت : ${convertToPersianDigits(meal.price)} دلار</p>
              <button onClick="addToCart('${meal.id}','${meal.name}','${meal.price}','${meal.image}')">افزودن به سبدخرید</button>
            </div>
        `
        mealsList.innerHTML += mealItem
    })
}


// تابع تبدیل اعداد به فارسی
function convertToPersianDigits(number) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return number.toString().replace(/\d/g, (digit) => persianDigits[digit]);
}


//عضویت و ورود
function manageAuth(){
     const authSection = document.querySelector("#authSection")
    const token = localStorage.getItem("token")
    if(token){
        const username = localStorage.getItem("loggedUser")
        authSection.innerHTML = `
                <div class="user-menu-container">
                    <img src="./images/user-icon.png" alt="User Icon" id="userIcon" class="user-icon">
                    <div id="userMenu" class="user-menu hidden">
                        <p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        ${username}
                        </p>
                        <p>
                        <button id="logoutButton">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>
                            خروج
                        </button>
                        </p>
                    </div>
                </div>
        `

        document.querySelector("#userIcon").addEventListener("click", (e) => {
            document.querySelector("#userMenu").classList.toggle("hidden")
        })
        document.querySelector("#logoutButton").addEventListener("click",() => {
            localStorage.removeItem("token")
            localStorage.removeItem("loggedUser")
            location.reload()
        })
    }else{
        authSection.innerHTML = `
        <a href="login.html">ورود</a> | <a href="register.html">ثبت نام</a>
        `
    }
}

//لود شدن صفحه
window.addEventListener("load", () => {
    manageAuth()
    updateCart()
})


//سبد خرید
function addToCart(id, title, price, imgAddress){
    const cart = loadUserCart()
    const exitingItem = cart.find(item => item.id == id)

    if(exitingItem){
        exitingItem.quantity += 1
    }else{
        cart.push({
        id,
        title,
        price,
        imgAddress,
        quantity : 1
    })
    }

    saveUserCart(cart)
    updateCart()
    showNotification(`${title} به سبد خرید اضافه شد`)
}

function saveUserCart(cart){
    console.log(cart);
    const username = localStorage.getItem("loggedUser")
    localStorage.setItem(`cart_${username}`, JSON.stringify(cart))
}

function loadUserCart(){
    const username = localStorage.getItem("loggedUser")
    const userCart = JSON.parse(localStorage.getItem(`cart_${username}`)) || []
    return userCart
}

function updateCart(){
    const cart = loadUserCart()
    const countCart = cart.reduce((sum , item)=> sum + item.quantity,0)
    console.log(countCart);
    document.querySelector("#cartCount").innerHTML = convertToPersianDigits(countCart)

}


//ساخت و نمایش مودال سبد خرید
document.querySelector("#cartIcon").addEventListener("click",()=> {
    const modal = document.querySelector("#cartModal")
    modal.style.display = "block"
    displayCartInModal()
})

function displayCartInModal(){
    const cart = loadUserCart()
    const cartItemsContainer = document.querySelector("#cartItems")
    const checkoutButton =  document.querySelector("#checkoutButton")
    const cartTotal =  document.querySelector("#cartTotal")
    const loginReminder =  document.querySelector("#loginReminder")
    cartItemsContainer.innerHTML = ""
    if(cart.length===0){
        cartItemsContainer.innerHTML = `
        <tr><td colspan="6">سبد خرید شما خالی است.</td></tr>
        `
        return;
    }
    cart.forEach((item,index) => {
        console.log(item);
        cartItemsContainer.innerHTML += `
        <tr>
            <td><img src="${item.imgAddress}" alt="${item.title}" id="" class=""></td>
            <td>${item.title}</td>
            <td>${convertToPersianDigits(item.price)} دلار</td>
            <td class="btns-modal">
                <div>
                    <button onClick="changeQuantity(${index} ,-1)">-</button>
                    ${convertToPersianDigits(item.quantity)}
                    <button onClick="changeQuantity(${index} ,1)">+</button>
                </div>
            </td>
            <td>${convertToPersianDigits(item.price*item.quantity)} دلار</td>
            <td>
                <button class="removeFromCart" onClick="removeFromCart(${index})">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                </button>
            </td>
        </tr>
        `

    })

    updateTotal()

    const token = localStorage.getItem("token")
    if(token){
       checkoutButton.style.display="block"
       loginReminder.style.display="none"
    }else{
       checkoutButton.style.display="none"
       loginReminder.style.display="block"
    }
}


document.querySelector(".close").addEventListener("click" , ()=>{
    const modal = document.querySelector("#cartModal")
    modal.style.display = "none"
})

function changeQuantity(index , delta){
    let cart = loadUserCart()
    if(cart[index].quantity + delta > 0){
        cart[index].quantity += delta
    }

    saveUserCart(cart)
    displayCartInModal()
    updateCart()
    updateTotal()
}

function removeFromCart(index){
    let cart = loadUserCart()
    cart.splice(index, 1)
    saveUserCart(cart)
    displayCartInModal();
    updateCart()
    updateTotal()
}


function updateTotal() {
    let total = 0;
    const cartTotal =  document.querySelector("#cartTotal")
    let cart = loadUserCart()

    cart.forEach(product => {
        total += product.price * product.quantity;
    });

     cartTotal.innerHTML = `
    <h3>مجموع خرید : ${convertToPersianDigits(total)} دلار</h3>
    `
}


//نشان دادن نوتیف
let notificationTimer;

function showNotification(message, type = "success") {
    const notification = document.querySelector("#notification");

    notification.innerHTML = message;

    notification.className = type === "error"
        ? "show error"
        : "show";

    notification.style.display = "block";

    clearTimeout(notificationTimer);

    notificationTimer = setTimeout(() => {
        notification.className = "";
        notification.style.display = "none";
    }, 1000);
}


// جستجو محصولات با اسم محصولات

document.querySelector("#searchForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    const searchInput = document.querySelector("#searchInput").value.toLowerCase().trim()
    searchFoodByName(searchInput)
});

function searchFoodByName(query){
    const result  = foods.filter(item => item.name.toLowerCase().includes(query))
    displayMeals(result)
}

//فیلتر جستجو محصولات

let selectedCountry = ""
let selectedIngredient = ""
let selectedCategory = ""
const emptyResult = document.querySelector("#empty-foodList")

function filterFoods(){
    const filteredFoods = foods.filter((food) =>{
        const matchCountry = !selectedCountry || food.country === selectedCountry
        const matchIngredient = !selectedIngredient || food.ingredients.includes(selectedIngredient)
        const matchCategory = !selectedCategory || food.category.includes(selectedCategory)

        return matchCountry && matchIngredient && matchCategory
    })
    displayMeals(filteredFoods)
    showEmptyError(filteredFoods)
}


//کشور

const countryCards = document.querySelectorAll(".region-buttons div")

countryCards.forEach((item) => {
    item.addEventListener("click", function(){
        selectedCountry = this.getAttribute("data-region")
        filterFoods()


        //تغییر استایل کشور انتخاب شده
        countryCards.forEach((card) => {
            card.classList.remove("selected")
        })
        this.classList.add("selected")
    })
})

//ماده اولیه

document.querySelector("#ingredientSelect").addEventListener("change", (e)=>{
    selectedIngredient =  e.target.value
    filterFoods()
})

// دسته بندی

document.querySelector("#categorySelect").addEventListener("change", (e)=>{
    selectedCategory = e.target.value
    filterFoods()
})



//پاک کردن فیلتر ها

document.querySelector("#clearFilters").addEventListener("click", (e)=>{
    document.querySelector("#searchInput").value = ""
    document.querySelector("#ingredientSelect").value = ""
    document.querySelector("#categorySelect").value = ""
    location.reload()
    fetchMeal()
})



//ارور غذای مورد تظر پیدا نشد

function showEmptyError(filteredFoods){
    if(filteredFoods.length === 0){
        emptyResult.classList.add("show")
    }else{
        emptyResult.classList.remove("show")

    }
}
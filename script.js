const backHomeBtn = document.querySelector("#budget_details button.back_home")
const budgetsPage = document.getElementById("budgets")
const budgetsDetailPage = document.querySelector("#budget_details")
const budgetCards = document.querySelectorAll("#budgets .budget_card")
const addBudgetButton = document.querySelector("#budgets button")
const budgetForm = document.getElementById("budget_form")
const closeModalBudgetBtn = document.querySelector("#budget_form i")
const addSpentBtn = document.querySelector(".add_spent_btn")
const spentForm = document.getElementById("spent_form")
const closeModalSpentBtn = document.querySelector("#spent_form i")
const notifications = document.getElementById("notifications")

// back to halaman budget
backHomeBtn.addEventListener("click", () => {
    budgetsDetailPage.classList.add("hidden")
    budgetsPage.classList.remove("hidden")
})

// klik to budget detail
budgetCards.forEach((budgetsCard) => {
    budgetsCard.addEventListener("click", () => {
        budgetsPage.classList.add("hidden")
        budgetsDetailPage.classList.remove("hidden")
    
    })
})

// klik to tambah budget
addBudgetButton.addEventListener("click", () => {
    budgetForm.classList.remove("hidden")
})

// Close Modal Budget Form
function closeModalBudget(){
    budgetForm.classList.add("hidden")
}

closeModalBudgetBtn.addEventListener("click", () => {
    closeModalBudget()
})

// klik to spent form
addSpentBtn.addEventListener("click", () => {
    spentForm.classList.remove("hidden")
})

// Close Modal Spent Form
closeModalSpentBtn.addEventListener("click", () => {
    spentForm.classList.add("hidden")
})


// Form Budgets 
function getFormValue(formData) {
    let result = new Object()

    for (const data of formData.entries()){
        const [key, value] = data

        Object.assign(result, 
            {[key]: value}
        )
    }
    return result
}

function getExistingData(){
    return JSON.parse(localStorage.getItem("budgets")) ?? []
}

function saveDataBudget(dataBaru){
    const existingData = getExistingData()
    existingData.push(dataBaru)
    
    localStorage.setItem("budgets", JSON.stringify(existingData))
}

function resetInput(){
    document.querySelectorAll("form input").forEach((input) => {
        input.value = ''
    })
}

// Notification
function showNotification(message){
    const newNotification = document.createElement("div")
    newNotification.innerHTML = message
    newNotification.classList.add("notification")
    notifications.appendChild(newNotification)
    setTimeout(() => {
        newNotification.classList.add("out")

        setTimeout(() => {
            notifications.removeChild(newNotification)
        }, 300)
    }, 4000)
}

// Submit form budget
document.querySelector("#budget_form form").addEventListener("submit", (e) => {
    e.preventDefault()

    const data = getFormValue(new FormData(e.target))
    saveDataBudget(data)
    closeModalBudget()
    resetInput()
    showNotification(`✅Budget ${data.nama_budget} berhasil disimpan!`)
    
})




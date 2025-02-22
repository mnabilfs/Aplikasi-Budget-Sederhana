const backHomeBtn = document.querySelector("#budget_details button.back_home")
const budgetsPage = document.getElementById("budgets")
renderBudgets()

const budgetsDetailPage = document.querySelector("#budget_details")
const budgetForm = document.getElementById("budget_form")
const closeModalBudgetBtn = document.querySelector("#budget_form i")
const addSpentBtn = document.querySelector(".add_spent_btn")
const spentForm = document.getElementById("spent_form")
const closeModalSpentBtn = document.querySelector("#spent_form i")
const notifications = document.getElementById("notifications")

function selectBudgetCardsAndButton(){
    const budgetCards = document.querySelectorAll("#budgets .budget_card")
    const addBudgetButton = document.querySelector("#budgets button")

    // evenListener klik budget detail card to budget detail 
    budgetCards.forEach((card) => {
    card.addEventListener("click", () => {
    
        const budgetId = card.getAttribute("data-budgetId")    
        renderBudgetsDetail(budgetId)
        budgetsPage.classList.add("hidden")
        budgetsDetailPage.classList.remove("hidden")
    
    })
})

// evenListener klik to tambah budget
addBudgetButton.addEventListener("click", () => {
    budgetForm.classList.remove("hidden")
})
}

// Render Budgets
function renderBudgets(){
const BudgetData = getExistingData()
const budgetList = BudgetData.map((budget) => {
    return `<div class="budget_card" data-budgetId=${budget.id}>
            <h2 class="budget_name">${budget.nama_budget}</h2>
            <p class="budget_amount">Rp ${budget.total}</p>
            <p class="budget_total">Total Rp ${budget.total}</p>
        </div>`  
}).concat([`<button class="add_budget_btn">+</button>`]).join("")

    budgetsPage.innerHTML = budgetList
    selectBudgetCardsAndButton()
}

// Render BudgetsDetail
function renderBudgetsDetail(budgetId){

    const currentBudget = getBudgetById(budgetId)

    document.querySelector("#budget_details .budget_card").setAttribute("data-budgetid", budgetId)

    // Menyesuaikan Detail Listcard dengan Budgets
    document.querySelector("#budget_details .budget_card h2").innerText =
        currentBudget.nama_budget
    
    document.querySelector("#budget_details .budget_card .budget_amount").innerText =
        "Rp " + currentBudget.total
    
    document.querySelector("#budget_details .budget_card .budget_total").innerText =
        "Rp " + currentBudget.total
}

// back to halaman budget
backHomeBtn.addEventListener("click", () => {
    budgetsDetailPage.classList.add("hidden")
    budgetsPage.classList.remove("hidden")
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

// Close Btn Modal Spent Form
closeModalSpentBtn.addEventListener("click", () => {
    closeModalPengeluaran()
})

// Close Pengeluaran
function closeModalPengeluaran(){
    spentForm.classList.add("hidden")
}


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

function getBudgetById(id){
    const budgets = getExistingData()

    return budgets.filter((budget) => budget.id == id)[0]
}

function saveDataBudget(dataBaru){
    const existingData = getExistingData()
    existingData.push(dataBaru)
    
    localStorage.setItem("budgets", JSON.stringify(existingData))
}

// Reset Input Form
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
    const dataWithId = {
        id: generateId(),
        ...data,
    }
    
    saveDataBudget(dataWithId)
    closeModalBudget()
    resetInput()
    showNotification(`✅Budget ${data.nama_budget} berhasil disimpan!`)
    renderBudgets()
})

// Submit Pengeluaran
document.querySelector("#spent_form form").addEventListener("submit", (e) =>{
    e.preventDefault()
    const data = getFormValue(new FormData(e.target))

    addPengeluaran(data)
    closeModalPengeluaran()
    resetInput()
    showNotification(`✅ Pengeluaran ${data.nama_pengeluaran} berhasil ditambahkan`)
})


// Tambah Pengeluaran
function addPengeluaran(data){
 
    const budgetId = document.querySelector("#budget_details .budget_card").getAttribute("data-budgetid")
    
    const currentBudget = getBudgetById(budgetId)

    const currentSpent = currentBudget.pengeluaran ?? []

    const budgetWithSpent = {
        ...currentBudget, 
        pengeluaran: [...currentSpent, data]}

    const allBudgets = getExistingData()

    const updateBudgets = allBudgets.map((budget) => {
        if(budget.id == budgetId) {
            return budgetWithSpent
        } else {
            return budget
        }
    })

    localStorage.setItem("budgets", JSON.stringify(updateBudgets))
}


// Generate Id unik 
function generateId(){
    return new Date().getTime()
}




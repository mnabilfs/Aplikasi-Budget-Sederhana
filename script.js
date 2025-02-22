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
        
        renderPengeluaran(budgetId)
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
    
    const sisaBudget = hitungSisaBudget(budget)

    return `<div class="budget_card" data-budgetId=${budget.id}>
            <h2 class="budget_name">${budget.nama_budget}</h2>
            <p class="budget_amount">${formatRupiah(sisaBudget)}</p>
            <p class="budget_total">Total ${formatRupiah(budget.total)}</p>
        </div>`  
}).concat([`<button class="add_budget_btn">+</button>`]).join("")

    budgetsPage.innerHTML = budgetList
    selectBudgetCardsAndButton()
}

function renderPengeluaran(budgetId){
    const {pengeluaran} = getBudgetById(budgetId)

    // Debugging for error undefined pengeluaran
    const budget = getBudgetById(budgetId)
    if (!budget || !budget.pengeluaran) {
        console.warn("Budget tidak ditemukan atau belum memiliki pengeluaran.")
        document.querySelector("#budget_details .spent").innerHTML = "<p>Belum ada pengeluaran.</p>"
        return
    }

    const listPengeluaran = pengeluaran.map((item) => {
        return `<div class="spent_item">
                <div class="spent_item_description">
                    <h4>${item.nama_pengeluaran}</h4>
                    <p>${item.tanggal}</p>
                </div>
                <div class="spent_item_price">
                    <p>${formatRupiah(item.jumlah)}</p>
                </div>
            </div>`
    }).join("")

    document.querySelector("#budget_details .spent").innerHTML = listPengeluaran
}

// Render BudgetsDetail
function renderBudgetsDetail(budgetId){

    const currentBudget = getBudgetById(budgetId)

    const sisaBudget = hitungSisaBudget(currentBudget)

    document.querySelector("#budget_details .budget_card").setAttribute("data-budgetid", budgetId)

    // Menyesuaikan Detail Listcard dengan Budgets
    document.querySelector("#budget_details .budget_card h2").innerText =
        currentBudget.nama_budget
    
    document.querySelector("#budget_details .budget_card .budget_amount").innerText =
        formatRupiah(sisaBudget) 
    
    document.querySelector("#budget_details .budget_card .budget_total").innerText =
        formatRupiah(currentBudget.total)
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

    const budgetId = document.querySelector("#budget_details .budget_card").getAttribute("data-budgetid")
    const data = getFormValue(new FormData(e.target))

    addPengeluaran(data)
    closeModalPengeluaran()
    resetInput()
    showNotification(`✅ Pengeluaran ${data.nama_pengeluaran} berhasil ditambahkan`)
    renderPengeluaran(budgetId)
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


// Calculate Sisa Budget
function hitungSisaBudget(dataBudget){
    const totalPengeluaran = dataBudget.pengeluaran?.map((item) => 
        +item.jumlah).reduce((jumlah, total) => jumlah + total)
    
    return +dataBudget.total - totalPengeluaran
    
}

function formatRupiah(angka){
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka)
}
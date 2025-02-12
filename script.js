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
closeModalBudgetBtn.addEventListener("click", () => {
    budgetForm.classList.add("hidden")
})

// klik to spent form
addSpentBtn.addEventListener("click", () => {
    spentForm.classList.remove("hidden")
})

// Close Modal Spent Form
closeModalSpentBtn.addEventListener("click", () => {
    spentForm.classList.add("hidden")
})
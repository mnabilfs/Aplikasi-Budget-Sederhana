const backHomeBtn = document.querySelector("#budget_details button.back_home");
const budgetsPage = document.getElementById("budgets");
renderBudgets();

const budgetsDetailPage = document.querySelector("#budget_details");
const budgetForm = document.getElementById("budget_form");
const closeModalBudgetBtn = document.querySelector("#budget_form i");
const addSpentBtn = document.querySelector(".add_spent_btn");
const spentForm = document.getElementById("spent_form");
const closeModalSpentBtn = document.querySelector("#spent_form i");
const notifications = document.getElementById("notifications");
const updateBudgetButton = document.querySelector(
  "#budget_details .budget_card .icon"
);
const body = document.getElementsByTagName("body")[0];

// > code kelasfrontend.com not working <
// function checkSystemTheme() {
//   const darkTheme = window.matchMedia("(prefers-color-scheme : dark)");

//   if (darkTheme.matches) {
//     body.classList.add("dark");
//     document.getElementById("light_theme_icon").classList.add("hidden");
//     document.getElementById("dark_theme_icon").classList.remove("hidden");
//   }
// }

// document.getElementById("theme_switch").addEventListener("click", () => {
//   if (body.classList.contains("dark")) {
//     document.getElementById("light_theme_icon").classList.remove("hidden");
//     document.getElementById("dark_theme_icon").classList.add("hidden");
//   } else {
//     document.getElementById("light_theme_icon").classList.add("hidden");
//     document.getElementById("dark_theme_icon").classList.remove("hidden");
//   }
// });

// checkSystemTheme();

// debugging error cant switch theme
function checkSystemTheme() {
  const darkTheme = window.matchMedia("(prefers-color-scheme : dark)");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    body.classList.add(savedTheme);
  } else if (darkTheme.matches) {
    body.classList.add("dark");
  }

  updateThemeIcons();
}

function updateThemeIcons() {
  if (body.classList.contains("dark")) {
    document.getElementById("light_theme_icon").classList.add("hidden");
    document.getElementById("dark_theme_icon").classList.remove("hidden");
  } else {
    document.getElementById("light_theme_icon").classList.remove("hidden");
    document.getElementById("dark_theme_icon").classList.add("hidden");
  }
}

document.getElementById("theme_switch").addEventListener("click", () => {
  body.classList.toggle("dark");

  // Simpan tema ke localStorage
  localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "");

  updateThemeIcons();
});

// Panggil fungsi saat halaman dimuat
checkSystemTheme();


const selectUrutan = document.getElementById("sort_pengeluaran");

document.getElementById("delete_budget").addEventListener("click", () => {
  const budgetId = document.getElementById("budget_id").value;
  deleteBudget(budgetId);
});

document.getElementById("delete_pengeluaran").addEventListener("click", () => {
  const budgetId = document
    .querySelector("#budget_details .budget_card")
    .getAttribute("data-budgetid");
  const pengeluaranId = document.getElementById("id_pengeluaran").value;

  deletePengeluaran(budgetId, pengeluaranId);
});

updateBudgetButton.addEventListener("click", () => {
  openUpdateBudget();
});

function selectBudgetCardsAndButton() {
  const budgetCards = document.querySelectorAll("#budgets .budget_card");
  const addBudgetButton = document.querySelector("#budgets button");

  // evenListener klik budget detail card to budget detail
  budgetCards.forEach((card) => {
    card.addEventListener("click", () => {
      const budgetId = card.getAttribute("data-budgetId");

      renderBudgetsDetail(budgetId);
      const urutan = selectUrutan.value;
      renderPengeluaran(budgetId, urutan);
      budgetsPage.classList.add("hidden");
      budgetsDetailPage.classList.remove("hidden");
    });
  });

  // evenListener klik to tambah budget
  addBudgetButton.addEventListener("click", () => {
    openCreateBudget();
  });
}

// Render Budgets
function renderBudgets() {
  const BudgetData = getExistingData();

  const budgetList = BudgetData.map((budget) => {
    const sisaBudget = hitungSisaBudget(budget);

    return `<div class="budget_card" data-budgetId=${budget.id}>
            <h2 class="budget_name">${budget.nama_budget}</h2>
            <p class="budget_amount">${formatRupiah(sisaBudget)}</p>
            <p class="budget_total">Total ${formatRupiah(budget.total)}</p>
        </div>`;
  })
    .concat([`<button class="add_budget_btn">+</button>`])
    .join("");

  budgetsPage.innerHTML = budgetList;
  selectBudgetCardsAndButton();
}

document.getElementById("sort_pengeluaran").addEventListener("change", (e) => {
  const budgetId = document
    .querySelector("#budget_details .budget_card")
    .getAttribute("data-budgetid");
  renderPengeluaran(budgetId, e.target.value);
});

function renderPengeluaran(budgetId, sortBy) {
  const { pengeluaran } = getBudgetById(budgetId);

  const [index, type] = sortBy?.split("|");

  sortPengeluaran(pengeluaran, index, type);

  // Debugging for error undefined pengeluaran
  // const budget = getBudgetById(budgetId);
  // if (!budget || !budget.pengeluaran) {
  //   console.warn("Budget tidak ditemukan atau belum memiliki pengeluaran.");
  //   document.querySelector("#budget_details .spent").innerHTML =
  //     "<p>Belum ada pengeluaran.</p>";
  //   return;
  // }


  const listPengeluaran =
    pengeluaran
      ?.map((item) => {
        return `<div class="spent_item" data-pengeluaranid="${item.id}">
                <div class="spent_item_description">
                    <h4>${item.nama_pengeluaran}</h4>
                    <p>${item.tanggal}</p>
                </div>
                <div class="spent_item_price">
                    <p>${formatRupiah(item.jumlah)}</p>
                </div>
            </div>`;
      })
      .join("") ?? null;

  document.querySelector("#budget_details .spent").innerHTML = listPengeluaran;

  document
    .querySelectorAll("#budget_details .spent .spent_item")
    .forEach((element) => {
      element.addEventListener("click", () => {
        openUpdatePengeluaran(
          element.getAttribute("data-pengeluaranid"),
          pengeluaran
        );
      });
    });
}

function sortPengeluaran(pengeluaran, indexData, type) {
  if (!pengeluaran) {
    return []
  }
  
  let perubahan = 0;
  do {
    perubahan = 0;
    for (let i = 0; i < pengeluaran.length - 1; i++) {
      const leftData =
        indexData == "jumlah"
          ? +pengeluaran[i][indexData]
          : pengeluaran[i][indexData];
      const rightData =
        indexData == "jumlah"
          ? +pengeluaran[i + 1][indexData]
          : pengeluaran[i + 1][indexData];
      if (
        (type == "asc" && leftData > rightData) ||
        (type == "desc" && leftData < rightData)
      ) {
        let temp = pengeluaran[i];
        pengeluaran[i] = pengeluaran[i + 1];
        pengeluaran[i + 1] = temp;
        perubahan++;
      }
    }
  } while (perubahan > 0);

  return pengeluaran;
}

// Render BudgetsDetail
function renderBudgetsDetail(budgetId) {
  const currentBudget = getBudgetById(budgetId);

  const sisaBudget = hitungSisaBudget(currentBudget);

  document
    .querySelector("#budget_details .budget_card")
    .setAttribute("data-budgetid", budgetId);

  // Menyesuaikan Detail Listcard dengan Budgets
  document.querySelector("#budget_details .budget_card h2").innerText =
    currentBudget.nama_budget;

  document.querySelector(
    "#budget_details .budget_card .budget_amount"
  ).innerText = formatRupiah(sisaBudget);

  document.querySelector(
    "#budget_details .budget_card .budget_total"
  ).innerText = formatRupiah(currentBudget.total);
}

// back to halaman utama
backHomeBtn.addEventListener("click", () => {
  showBudgetPage();
  renderBudgets();
});

function showBudgetPage() {
  budgetsDetailPage.classList.add("hidden");
  budgetsPage.classList.remove("hidden");
  renderBudgets();
}

// Close Modal Budget Form
function closeModalBudget() {
  budgetForm.classList.add("hidden");
}

closeModalBudgetBtn.addEventListener("click", () => {
  closeModalBudget();
});

function openCreateBudget() {
  document.querySelector("#budget_form h4").innerHTML = "Tambah Budget";
  document.querySelector("#budget_form button.danger").classList.add("hidden");
  resetInput();
  openModalBudget();
}

function openUpdateBudget() {
  document.querySelector("#budget_form h4").innerHTML = "Update Budget";
  document
    .querySelector("#budget_form button.danger")
    .classList.remove("hidden");

  const budgetId = document
    .querySelector("#budget_details .budget_card")
    .getAttribute("data-budgetid");
  const currentBudget = getBudgetById(budgetId);

  // set nama budget
  document.getElementById("nama_budget").value = currentBudget.nama_budget;

  // set total budget
  document.getElementById("total_budget").value = currentBudget.total;

  // set id budget
  document.getElementById("budget_id").value = currentBudget.id;

  openModalBudget();
}

// Open Modal Budget
function openModalBudget() {
  budgetForm.classList.remove("hidden");
}

// klik tambah pengeluaran
addSpentBtn.addEventListener("click", () => {
  openCreatePengeluaran();
});

// Close form pengeluaran
closeModalSpentBtn.addEventListener("click", () => {
  closeModalPengeluaran();
});

function openCreatePengeluaran() {
  document.querySelector("#spent_form h4").innerHTML = "Tambah Pengeluaran";
  document.getElementById("delete_pengeluaran").classList.add("hidden");

  resetInput();
  openModalPengeluaran();
}

function openUpdatePengeluaran(pengeluaranId, pengeluaran) {
  document.querySelector("#spent_form h4").innerHTML = "Update Pengeluaran";
  document.getElementById("delete_pengeluaran").classList.remove("hidden");

  const currentPengeluaran = pengeluaran?.filter(
    (item) => item.id == pengeluaranId
  )[0];

  // set nama pengeluaran
  document.getElementById("nama_pengeluaran").value =
    currentPengeluaran.nama_pengeluaran;

  // set jumlah pengeluaran
  document.getElementById("jumlah_pengeluaran").value =
    currentPengeluaran.jumlah;

  // set tanggal pengeluaran
  document.getElementById("tanggal_pengeluaran").value =
    currentPengeluaran.tanggal;

  // set id pengeluaran
  document.getElementById("id_pengeluaran").value = currentPengeluaran.id;

  openModalPengeluaran();
}

function openModalPengeluaran() {
  spentForm.classList.remove("hidden");
}

// Close Pengeluaran
function closeModalPengeluaran() {
  spentForm.classList.add("hidden");
}

// Form Budgets
function getFormValue(formData) {
  let result = new Object();

  for (const data of formData.entries()) {
    const [key, value] = data;

    Object.assign(result, { [key]: value });
  }
  return result;
}

function getExistingData() {
  return JSON.parse(localStorage.getItem("budgets")) ?? [];
}

function getBudgetById(id) {
  const budgets = getExistingData();

  return budgets.filter((budget) => budget.id == id)[0];
}

function addNewBudget(dataBaru) {
  const dataWithId = {
    id: generateId(),
    ...dataBaru,
  };

  const existingData = getExistingData();

  existingData.push(dataWithId);
  saveBudget(existingData);
}

// Reset Input Form
function resetInput() {
  document.querySelectorAll("form input").forEach((input) => {
    input.value = "";
  });
}

// Notification
function showNotification(message) {
  const newNotification = document.createElement("div");
  newNotification.innerHTML = message;
  newNotification.classList.add("notification");
  notifications.appendChild(newNotification);
  setTimeout(() => {
    newNotification.classList.add("out");

    setTimeout(() => {
      notifications.removeChild(newNotification);
    }, 300);
  }, 4000);
}

function updateBudget(dataBaru, budgetId) {
  const existingData = getExistingData();

  const updatedBudget = existingData?.map((budget) => {
    if (budget.id == budgetId) {
      return { id: budgetId, ...dataBaru, pengeluaran: budget.pengeluaran };
    }
    return budget;
  });

  saveBudget(updatedBudget);
  renderBudgetsDetail(budgetId);
}

// delete budget
function deleteBudget(budgetId) {
  const allBudgets = getExistingData();

  const confirmed = confirm("Apakah yakin ingin menghapus?");
  if (confirmed) {
    const deleteBudgets = allBudgets.filter((budget) => budget.id != budgetId);

    saveBudget(deleteBudgets);
    showNotification("✅Budget berhasil di hapus!");
    closeModalBudget();
    showBudgetPage();
  } else {
    closeModalBudget();
  }
}

// Submit form budget
document.querySelector("#budget_form form").addEventListener("submit", (e) => {
  e.preventDefault();

  const data = getFormValue(new FormData(e.target));

  const idBudget = document.getElementById("budget_id").value;

  if (idBudget) {
    updateBudget(data, idBudget);
  } else {
    addNewBudget(data);
  }

  closeModalBudget();
  resetInput();
  showNotification(`✅Budget ${data.nama_budget} berhasil disimpan!`);
  renderBudgets();
});

// Submit Pengeluaran
document.querySelector("#spent_form form").addEventListener("submit", (e) => {
  e.preventDefault();

  const budgetId = document
    .querySelector("#budget_details .budget_card")
    .getAttribute("data-budgetid");

  const data = getFormValue(new FormData(e.target));

  const pengeluaranId = document.getElementById("id_pengeluaran").value;

  if (pengeluaranId) {
    updatePengeluaran(pengeluaranId, data);
  } else {
    addPengeluaran(data);
  }

  closeModalPengeluaran();
  resetInput();
  showNotification(
    `✅ Pengeluaran ${data.nama_pengeluaran} berhasil disimpan!`
  );
  renderBudgetsDetail(budgetId);
  const urutan = selectUrutan.value;
  renderPengeluaran(budgetId, urutan);
});

// Tambah Pengeluaran
function addPengeluaran(data) {
  const budgetId = document
    .querySelector("#budget_details .budget_card")
    .getAttribute("data-budgetid");

  const currentBudget = getBudgetById(budgetId);

  const currentSpent = currentBudget.pengeluaran ?? [];

  const budgetWithSpent = {
    ...currentBudget,
    pengeluaran: [...currentSpent, { ...data, id: generateId() }],
  };

  const allBudgets = getExistingData();

  const updatedBudgets = allBudgets.map((budget) => {
    if (budget.id == budgetId) {
      return budgetWithSpent;
    } else {
      return budget;
    }
  });

  saveBudget(updatedBudgets);
}

function updatePengeluaran(pengeluaranId, data) {
  const budgetId = document
    .querySelector("#budget_details .budget_card")
    .getAttribute("data-budgetid");

  const allBudgets = getExistingData();

  const updatedBudget = allBudgets?.map((budget) => {
    if (budget.id == budgetId) {
      const pengeluaran = budget?.pengeluaran?.map((item) => {
        if (item.id == pengeluaranId) {
          return { ...data, id: item.id };
        }
        return item;
      });

      return {
        ...budget,
        pengeluaran,
      };
    }

    return budget;
  });

  saveBudget(updatedBudget);
}

function deletePengeluaran(budgetId, pengeluaranId) {
  const allBudgets = getExistingData();
  const confirmed = confirm("Yakin ingin menghapus pengeluaran?");

  if (confirmed) {
    const afterDelete = allBudgets.map((budget) => {
      if (budget.id == budgetId) {
        return {
          ...budget,
          pengeluaran: budget.pengeluaran.filter(
            (pengeluaran) => pengeluaran.id != pengeluaranId
          ),
        };
      }
      return budget;
    });

    saveBudget(afterDelete);
    closeModalPengeluaran();
    const urutan = selectUrutan.value;
    renderPengeluaran(budgetId, urutan);
    showNotification("✅Pengeluaran berhasil dihapus");
  }
  closeModalPengeluaran();
}

// Generate Id unik
function generateId() {
  return new Date().getTime();
}

// Calculate Sisa Budget
function hitungSisaBudget(dataBudget) {
  const totalPengeluaran =
    dataBudget.pengeluaran
      ?.map((item) => +item.jumlah)
      .reduce((jumlah, total) => jumlah + total, 0) ?? 0;

  return +dataBudget.total - totalPengeluaran;
}

// Format Satuan Rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

function saveBudget(budgets) {
  localStorage.setItem("budgets", JSON.stringify(budgets));
}

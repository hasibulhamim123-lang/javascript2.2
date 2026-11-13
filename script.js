let expenseForm = document.querySelector(".expense-form");
let expenseDesc = document.querySelector(".expense-input-desc");
let expenseAmount = document.querySelector(".expense-input-amount");
let expenseType = document.querySelector(".expense-select-type");
let expenseCategory = document.querySelector(".expense-select-category");
let expenseDate = document.querySelector(".expense-input-date");
let addBtn = document.querySelector(".expense-btn-add");
let totalIncome = document.querySelector(".total-income");
let totalExpenses = document.querySelector(".total-expenses");
let balance = document.querySelector(".balance");
let expenseList = document.querySelector(".expense-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editId = null;

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let description = expenseDesc.value.trim();
  let amount = Number(expenseAmount.value);
  let type = expenseType.value;
  let category = expenseCategory.value;
  let date = expenseDate.value;

  if (description === "" || amount <= 0 || date === "") {
    return;
  }
  if (editId === null) {
    transactions.push({
      id: Date.now(),
      description,
      amount,
      type,
      category,
      date,
    });
  } else {
    for (let item of transactions) {
      if (item.id === editId) {
        item.description = description;
        item.amount = amount;
        item.type = type;
        item.category = category;
        item.date = date;
      }
    }
    editId = null;
    addBtn.innerText = "Add Transaction";
  }
  saveData();
  expenseForm.reset();
  renderApp();
});

function renderSummary() {
  let income = transactions.reduce((sum, item) => {
    return item.type === "income" ? sum + item.amount : sum;
  }, 0);

  let expenses = transactions.reduce((sum, item) => {
    return item.type === "expense" ? sum + item.amount : sum;
  }, 0);

  let currentBalance = income - expenses;

  totalIncome.innerText = income.toFixed(2);
  totalExpenses.innerText = expenses.toFixed(2);
  balance.innerText = currentBalance.toFixed(2);

  if (currentBalance < 0) {
    balance.classList.add("negative");
  } else {
    balance.classList.remove("negative");
  }
}

function renderTransactions() {
  expenseList.innerHTML = "";

  for (let item of transactions) {
    let li = document.createElement("li");
    let info = document.createElement("div");
    let title = document.createElement("strong");
    title.innerText = item.description;
    let details = document.createElement("p");
    details.innerText = item.category + " | " + item.date + " | " + item.type;
    let amountText = document.createElement("span");
    amountText.innerText = (item.type === "income" ? "+ " : "- ") + item.amount;
    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", () => {
      editTransaction(item.id);
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteTransaction(item.id);
    });

    let actions = document.createElement("div");
    actions.append(editBtn, deleteBtn);
    info.append(title, details);
    li.append(info, amountText, actions);
    expenseList.append(li);
  }
}

function editTransaction(id) {
  for (let item of transactions) {
    if (item.id === id) {
      expenseDesc.value = item.description;
      expenseAmount.value = item.amount;
      expenseType.value = item.type;
      expenseCategory.value = item.category;
      expenseDate.value = item.date;

      editId = id;
      addBtn.innerText = "Update Transaction";
      break;
    }
  }
}

function deleteTransaction(id) {
  transactions = transactions.filter((item) => {
    return item.id !== id;
  });

  if (editId === id) {
    editId = null;
    expenseForm.reset();
    addBtn.innerText = "Add Transaction";
  }
  saveData();
  renderApp();
}
function renderApp() {
  renderSummary();
  renderTransactions();
}
renderApp();

// Note App
let notesForm = document.querySelector(".notes-form");
let noteTitle = document.querySelector(".note-title");
let noteBody = document.querySelector(".note-body");
let saveNoteBtn = document.querySelector(".save-note-btn");
let searchNote = document.querySelector(".search-note");
let notesList = document.querySelector(".notes-list");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editNoteId = null;

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

notesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let title = noteTitle.value.trim();
  let body = noteBody.value.trim();
  if (title === "" || body === "") {
    return;
  }
  if (editNoteId === null) {
    let note = {
      id: Date.now(),
      title: title,
      body: body,
      updatedAt: Date.now(),
    };
    notes.push(note);
  } else {
    for (let note of notes) {
      if (note.id === editNoteId) {
        note.title = title;
        note.body = body;
        note.updatedAt = Date.now();
      }
    }
    editNoteId = null;
    saveNoteBtn.innerText = "Save Note";
  }
  saveNotes();
  notesForm.reset();
  renderNotes();
});

function renderNotes() {
  notesList.innerHTML = "";
  notes.sort((a, b) => b.updatedAt - a.updatedAt);
  let searchText = searchNote.value.toLowerCase();

  for (let note of notes) {
    let titleMatch = note.title.toLowerCase().includes(searchText);
    let bodyMatch = note.body.toLowerCase().includes(searchText);
    if (titleMatch === false && bodyMatch === false) {
      continue;
    }

    let card = document.createElement("div");
    card.classList.add("note-card");
    let title = document.createElement("h3");
    title.innerText = note.title;
    let body = document.createElement("p");
    body.innerText = note.body.slice(0, 60);

    if (note.body.length > 60) {
      body.innerText += "...";
    }

    let time = document.createElement("small");
    let editDate = new Date(note.updatedAt);
    let dateText = editDate.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    dateText = dateText.replace("am", "AM").replace("pm", "PM");
    time.innerText = "Edited " + dateText;
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("delete-note-btn");

    card.addEventListener("click", () => {
      editNote(note.id);
    });
    deleteBtn.addEventListener("click", (e) => {
      deleteNote(note.id);
    });
    card.append(title, body, time, deleteBtn);
    notesList.append(card);
  }
}

function editNote(id) {
  for (let note of notes) {
    if (note.id === id) {
      noteTitle.value = note.title;
      noteBody.value = note.body;

      editNoteId = id;
      saveNoteBtn.innerText = "Update Note";
      break;
    }
  }
}

function deleteNote(id) {
  let confirmDelete = confirm("Are you sure?");

  if (confirmDelete === false) {
    return;
  }
  let newNotes = [];
  for (let note of notes) {
    if (note.id !== id) {
      newNotes.push(note);
    }
  }
  notes = newNotes;
  saveNotes();
  renderNotes();
}

searchNote.addEventListener("input", () => {
  renderNotes();
});
renderNotes();

// Quiz Builder

let quizForm = document.querySelector(".quiz-form");
let questionInput = document.querySelector(".question-input");
let optionInputs = document.querySelectorAll(".option-input");
let correctAnswer = document.querySelector(".correct-answer");
let questionList = document.querySelector(".question-list");
let startBtn = document.querySelector(".start-btn");

let builderScreen = document.querySelector(".quiz-builder");
let playScreen = document.querySelector(".play-screen");
let resultScreen = document.querySelector(".result-screen");

let quizQuestion = document.querySelector(".quiz-question");
let quizOptions = document.querySelector(".quiz-options");
let quizProgress = document.querySelector(".quiz-progress");
let finalScore = document.querySelector(".final-score");
let backBtn = document.querySelector(".back-btn");

let questions = [];
let currentIndex = 0;
let score = 0;

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let options = [];
  for (let input of optionInputs) {
    options.push(input.value.trim());
  }
  let question = {
    question: questionInput.value.trim(),
    options: options,
    correct: Number(correctAnswer.value),
  };
  questions.push(question);
  quizForm.reset();
  renderQuestions();
});

function renderQuestions() {
  questionList.innerHTML = "";

  for (let i = 0; i < questions.length; i++) {
    let li = document.createElement("li");
    li.innerText = questions[i].question;
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", () => {
      questions.splice(i, 1);
      renderQuestions();
    });

    li.append(deleteBtn);
    questionList.append(li);
  }

  startBtn.disabled = questions.length < 3;
}

startBtn.addEventListener("click", () => {
  builderScreen.hidden = true;
  playScreen.hidden = false;
  currentIndex = 0;
  score = 0;
  showQuestion();
});

function showQuestion() {
  if (currentIndex >= questions.length) {
    showResult();
    return;
  }

  let currentQuestion = questions[currentIndex];
  quizQuestion.innerText = currentQuestion.question;
  quizOptions.innerHTML = "";
  quizProgress.innerText =
    "Question " + (currentIndex + 1) + " of " + questions.length;
  for (let i = 0; i < currentQuestion.options.length; i++) {
    let button = document.createElement("button");
    button.innerText = currentQuestion.options[i];
    button.addEventListener("click", () => {
      if (i === currentQuestion.correct) {
        score++;
      }
      currentIndex++;
      showQuestion();
    });

    quizOptions.append(button);
  }
}

function showResult() {
  playScreen.hidden = true;
  resultScreen.hidden = false;
  finalScore.innerText = "Your Score: " + score + " / " + questions.length;
}

backBtn.addEventListener("click", () => {
  resultScreen.hidden = true;
  builderScreen.hidden = false;
});

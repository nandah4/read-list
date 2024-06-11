const DATA_RENDER = "render-data-haha";
const LOCAL_KEY = "save-local";
const EVENT_SAVE = "savede-event";
const data = [];

function genderateRandomID() {
  return +new Date();
}

function findBookById(todoId) {
  for (const book of data) {
    if (book.id === todoId) {
      return book;
    }
  }
  return null;
}

function printObjectData(id, title, author, date, isCompleted) {
  return {
    id,
    title,
    author,
    date,
    isCompleted,
  };
}

function moveBookToCompleted(bookId) {
  const bookTarget = findBookById(bookId);

  if (bookTarget == null) {
    return;
  }
  bookTarget.isCompleted = true;

  document.dispatchEvent(new Event(DATA_RENDER));
  saveDataToLocal();
}

function undoBooks(bookId) {
  const bookTarget = findBookById(bookId);

  if (bookTarget == null) {
    return;
  }

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(DATA_RENDER));
  saveDataToLocal();
}

function removeBookFromData(bookId) {
  const findIndex = data.findIndex((item) => item.id === bookId);
  if (findIndex === -1) {
    data.splice(findIndex, 1);
  }
  document.dispatchEvent(new Event(DATA_RENDER));
  saveDataToLocal();
}

function makeListBook(listBook) {
  const { id, title, author, date, isCompleted } = listBook;

  const uncompletedDiv = document.getElementById("uncompleted");
  uncompletedDiv.classList.add("border");

  const card = document.createElement("div");
  card.classList.add("card");

  const textTitle = document.createElement("p");
  textTitle.classList.add("text-title");
  textTitle.innerText = title;

  const fieldAuthor = document.createElement("p");
  fieldAuthor.classList.add("text-author");
  fieldAuthor.innerText = `Author : ${author}`;

  const fieldYear = document.createElement("p");
  fieldYear.classList.add("text-year");
  fieldYear.innerText = `Tahun : ${date}`;

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("button-div");
  const buttonFirst = document.createElement("button");
  buttonFirst.classList.add("button");
  buttonFirst.id = "buttonFirst";
  buttonFirst.innerText = "Sudah dibaca";
  const buttonSeccond = document.createElement("button");
  buttonSeccond.classList.add("button");
  buttonSeccond.id = "buttonSecond";
  buttonSeccond.innerText = "Hapus Buku";
  buttonDiv.append(buttonFirst, buttonSeccond);

  card.append(textTitle, fieldAuthor, fieldYear, buttonDiv);

  if (isCompleted) {
    buttonFirst.innerText = "Kembalikan Buku";
    buttonFirst.addEventListener("click", function () {
      undoBooks(id);
    });

    buttonSeccond.addEventListener("click", function () {
      removeBookFromData(id);
      console.log
    });
  } else {
    buttonFirst.addEventListener("click", function () {
      moveBookToCompleted(id);
    });
  }

  return card;
}

function saveDataToLocal() {
  const parseData = JSON.stringify(data);
  localStorage.setItem(LOCAL_KEY, parseData);
  document.dispatchEvent(new Event(DATA_RENDER));
}

function getDataFromLocal() {
  const dataFromLocal = localStorage.getItem(LOCAL_KEY);
  let parseData = JSON.parse(dataFromLocal);

  if (parseData !== null) {
    for (const item of parseData) {
      data.push(item);
    }
  }
  document.dispatchEvent(new Event(DATA_RENDER));
}

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const date = document.getElementById("year").value;
  const isCompleted = document.getElementById("isCompleted").checked;

  const id = genderateRandomID();
  const objectData = printObjectData(id, title, author, date, isCompleted);

  data.push(objectData);
  console.log(objectData);
  document.dispatchEvent(new Event(DATA_RENDER));
  saveDataToLocal();
}

document.addEventListener(DATA_RENDER, function () {
  const uncompleted = document.querySelector("#uncompleted");
  const completed = document.querySelector("#completed");

  uncompleted.innerHTML = "";
  completed.innerHTML = "";

  for (const book of data) {
    const elemenValue = makeListBook(book);
    if (book.isCompleted) {
      completed.append(elemenValue);
    } else {
      uncompleted.append(elemenValue);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const formData = document.querySelector("#form-data");

  formData.addEventListener("submit", function (event) {
    addBook();
    event.preventDefault();
  });

  getDataFromLocal();
});

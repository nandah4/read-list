const DATA_RENDER = "render-data-haha";
const LOCAL_KEY = "save-local";
const data = [];

function isBrowserSupportStorage() {
  if( typeof (Storage) === 'undefined') {
    alert('Your browser does not support Web Storage');
  }
  return true;
}

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
  const findIndexItem = data.findIndex((item) => item.id === bookId);
  if (findIndexItem !== -1) {
    data.splice(findIndexItem, 1);
  }
  document.dispatchEvent(new Event(DATA_RENDER));
  saveDataToLocal();
}

function makeListBook(listBook) {
  const { id, title, author, date, isCompleted } = listBook;

  const uncompletedDiv = document.getElementById("uncompleted");
  const completedDiv = document.getElementById("completed");

  const card = document.createElement("div");
  card.classList.add("card");

  const textTitle = document.createElement("p");
  textTitle.classList.add("text-title");
  textTitle.innerText = title;

  const fieldAuthor = document.createElement("p");
  fieldAuthor.classList.add("text-author");
  fieldAuthor.innerText = `Penulis : ${author}`;

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

  const totalIsCompletedFalse = data.filter(
    (item) => item.isCompleted == false
  );
  const totalIsCompletedTrue = data.filter((item) => item.isCompleted == true);
  const hiddenMessage = document.getElementById("hiddenMessage");
  const hiddenMessageTrue = document.getElementById("hiddenMessageTrue");

  if (totalIsCompletedFalse.length > 0) {
    uncompletedDiv.classList.add("border");
    uncompletedDiv.classList.add("h-52");
    hiddenMessage.setAttribute("hidden", true);
  } else {
    uncompletedDiv.classList.remove("border");
    uncompletedDiv.classList.remove("h-52");
    hiddenMessage.removeAttribute("hidden");
  }
  if (totalIsCompletedTrue.length > 0) {
    completedDiv.classList.add("border");
    completedDiv.classList.add("h-52");
    hiddenMessageTrue.setAttribute("hidden", true);
  } else {
    completedDiv.classList.remove("border");
    completedDiv.classList.remove("h-52");
    hiddenMessageTrue.removeAttribute("hidden");
  }

  if (isCompleted) {
    buttonFirst.innerText = "Kembalikan Buku";
    buttonFirst.addEventListener("click", function () {
      undoBooks(id);
    });

    buttonSeccond.addEventListener("click", function () {
      removeBookFromData(id);
    });
  } else {
    buttonFirst.addEventListener("click", function () {
      moveBookToCompleted(id);
    });

    buttonSeccond.addEventListener("click", function () {
      removeBookFromData(id);
    });
  }

  return card;
}

function saveDataToLocal() {
  if(isBrowserSupportStorage()) {
    const parseData = JSON.stringify(data);
    localStorage.setItem(LOCAL_KEY, parseData);
  }
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
  document.dispatchEvent(new Event(DATA_RENDER));
  saveDataToLocal();
}

function showElemenBook(listBook) {
  const { title, author, date, isCompleted } = listBook;

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

  if (isCompleted) {
    const buttonFirst = document.createElement("button");
    buttonFirst.classList.add("button-done");
    buttonFirst.innerText = "Sudah dibaca";
    buttonDiv.append(buttonFirst);
  } else {
    const buttonSeccond = document.createElement("button");
    buttonSeccond.classList.add("button-done");
    buttonSeccond.innerText = "Belum Selesai Dibaca";
    buttonDiv.append(buttonSeccond);
  }

  card.append(textTitle, fieldAuthor, fieldYear, buttonDiv);
  return card;
}

function findBookByTitle(title) {
  return data.filter((item) =>
    item.title.toLowerCase().includes(title.toLowerCase())
  );
}

function showBook() {
  const inputSearch = document
    .getElementById("search")
    .value.trim()
    .toLowerCase();

  if (inputSearch === "") {
    document.dispatchEvent(new CustomEvent("render-search", { detail: [] }));
    return null;
  }

  const searchResult = findBookByTitle(inputSearch);

  document.dispatchEvent(
    new CustomEvent("render-search", { detail: searchResult })
  );
}

document.addEventListener("render-search", function (event) {
  const searchDiv = document.querySelector("#box-search");
  const searchResult = event.detail;
  searchDiv.innerHTML = "";
  const hiddenMessage = document.getElementById('hiddenMessageSearch');

  if (searchResult.length === 0) {
    searchDiv.classList.remove("border");
    searchDiv.classList.remove("h-52");
    hiddenMessage.removeAttribute('hidden')
  } else {
    hiddenMessage.setAttribute('hidden', true)
    searchDiv.classList.add("border");
    searchDiv.classList.add("h-52");
  }


  for (const item of searchResult) {
    const elemenValue = showElemenBook(item);
    searchDiv.append(elemenValue);
  }
});

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
  const searchData = document.querySelector("#search-data");

  formData.addEventListener("submit", function (event) {
    addBook();
    event.preventDefault();
  });

  searchData.addEventListener("submit", function (event) {
    showBook();
    event.preventDefault();
  });

  if(isBrowserSupportStorage()) {
    getDataFromLocal();   
  }
});

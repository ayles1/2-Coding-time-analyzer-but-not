// Scripting notes form
//Setting variables names
const notesFormInput = document.querySelectorAll("input")[0];
const notesContent = document.getElementsByClassName("content")[0];

const conditionList = document.getElementsByClassName("condition");
const blanksList = document.getElementsByClassName("blanks");
const deletesList = document.getElementsByClassName("deletes");
const notesFormInputPlaceholder = notesFormInput.placeholder;
const contentItems = document.getElementsByClassName("content__item");

//Scripting Event Listeners
notesFormInput.addEventListener("focus", () => {
  notesFormInput.placeholder = "";
});
notesFormInput.addEventListener("blur", () => {
  notesFormInput.placeholder = notesFormInputPlaceholder;
});

//-----------Most interesting part-------------------------
//Scripting notes to local storage and back
let notes = !JSON.parse(localStorage.getItem("Notes"))
  ? {}
  : JSON.parse(localStorage.getItem("Notes"));

notesFormInput.addEventListener("keyup", (event) => {
  if (event.code == "Enter") {
    let newNote = document.createElement("div");
    newNote.classList.add("content__item");
    let fragment = document.createDocumentFragment();

    let newNoteCondition = document.createElement("div");
    newNoteCondition.classList.add("content__condition");
    newNoteCondition.classList.add("condition");
    newNoteCondition.innerHTML = `<div class='condition__item all'>&#10066;</div>`;
    fragment.appendChild(newNoteCondition);

    let newNoteBlank = document.createElement("div");
    newNoteBlank.classList.add("content__blanks");
    newNoteBlank.classList.add("blanks");
    newNoteBlank.innerHTML = `<div class='blanks__item'>${notesFormInput.value}</div>`;
    fragment.appendChild(newNoteBlank);

    let newNoteDelete = document.createElement("div");
    newNoteDelete.classList.add("content__deletes");
    newNoteDelete.classList.add("deletes");
    newNoteDelete.innerHTML = `<div class='deletes__item'>&#10006;</div>`;
    fragment.appendChild(newNoteDelete);

    newNote.appendChild(fragment);

    notesContent.prepend(newNote);
    notes[`note${contentItems.length}`] = notesFormInput.value;
    localStorage.setItem("Notes", JSON.stringify(notes));
    notesCounter.innerHTML = `There is ${contentItems.length} notes now`;
    notesFormInput.value = "";
  }
});
//---------------------------------------------------------------------
//---------------------------------------------------------------------
//Recreating notes blocks
function recreateBlocks() {
  let parsedNotes = JSON.parse(localStorage.getItem("Notes"));
  for (key in parsedNotes) {
    try {
      let newNote = document.createElement("div");
      newNote.classList.add("content__item");
      let fragment = document.createDocumentFragment();

      let newNoteCondition = document.createElement("div");
      newNoteCondition.classList.add("content__condition");
      newNoteCondition.classList.add("condition");
      newNoteCondition.classList.add("all");
      newNoteCondition.innerHTML = `<div class='condition__item all'>&#10066;</div>`;
      fragment.appendChild(newNoteCondition);

      let newNoteBlank = document.createElement("div");
      newNoteBlank.classList.add("content__blanks");
      newNoteBlank.classList.add("blanks");
      newNoteBlank.innerHTML = `<div class='blanks__item'>${parsedNotes[key]}</div>`;
      fragment.appendChild(newNoteBlank);

      let newNoteDelete = document.createElement("div");
      newNoteDelete.classList.add("content__deletes");
      newNoteDelete.classList.add("deletes");
      newNoteDelete.innerHTML = `<div class='deletes__item'>&#10006;</div>`;
      fragment.appendChild(newNoteDelete);

      newNote.appendChild(fragment);

      notesContent.prepend(newNote);
    } catch {
      console.error("Hello world");
    }
  }
}
recreateBlocks();

// Adding onclick to note status
document.addEventListener("click", (event) => {
  if (event.target.closest(".condition__item")) {
    if (event.target.classList.contains("done")) {
      event.target.innerHTML = "&#10066;";
      event.target.classList.remove("done");
    } else {
      event.target.innerHTML = "&#9745";
      event.target.classList.add("done");
    }
  }
});

// Scripting delete mark

document.addEventListener("click", (event) => {
  if (event.target.closest(".deletes__item")) {
    for (let key in notes) {
      if (
        notes[key] ===
        event.target.parentNode.parentNode.childNodes[1].firstChild.innerHTML
      ) {
        delete notes[key];
      }
    }
    localStorage.setItem("Notes", JSON.stringify(notes));

    //deleting from clientApp
    event.target.parentNode.parentNode.outerHTML = "";
    notesCounter.innerHTML = `There is ${contentItems.length} notes now`;
  }
});

//Editing notes counter
const notesCounter = document.querySelector(".info__count");
notesCounter.innerHTML = `There is ${contentItems.length} notes now`;

// Filtering notes by status
//Button status all
const buttonAll = document.querySelector(".statuses__all");
function filterStatusAll() {
  for (let i = 0; i < contentItems.length; i++) {
    if (contentItems[i].style.display == "none") {
      contentItems[i].style.display = "flex";
    }
  }
  notesCounter.innerHTML = `There is ${contentItems.length} notes now`;
}
buttonAll.addEventListener("click", filterStatusAll);

//Status active
let buttonActive = document.querySelector(".statuses__active");
function filterStatusActive() {
  let activeCounter = 0;
  for (let i = 0; i < contentItems.length; i++) {
    if (contentItems[i].firstChild.firstChild.classList.contains("done")) {
      contentItems[i].style.display = "none";
    } else {
      contentItems[i].style.display = "flex";
      activeCounter++;
    }
  }
  notesCounter.innerHTML = `There is ${activeCounter} notes now`;
}
buttonActive.addEventListener("click", filterStatusActive);

//Status completed
const buttonComplited = document.querySelector(".statuses__completed");
function filterStatusCompleted() {
  let completedCounter = 0;
  for (let i = 0; i < contentItems.length; i++) {
    if (!contentItems[i].firstChild.firstChild.classList.contains("done")) {
      contentItems[i].style.display = "none";
    } else {
      contentItems[i].style.display = "flex";
      completedCounter++;
    }
  }
  notesCounter.innerHTML = `There is ${completedCounter} notes now`;
}
buttonComplited.addEventListener("click", filterStatusCompleted);

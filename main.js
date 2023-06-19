const todoContainer = document.querySelector("#todo-container");
const addForm = document.querySelector(".add-todo");
const addInput = document.querySelector(".add-input");
const addInput2 = document.querySelector(".add-input2");
const addInput3 = document.querySelector(".add-input3");
const addInput4 = document.querySelector(".add-input4");

const resetBtn = document.querySelector(".reset-btn");
const editModal = document.querySelector("#edit-modal");
const closeModalBtn = document.querySelector("#close-modal");
const editInput = document.querySelector("#edit-input");
const editInput2 = document.querySelector("#edit-input2");
const editInput3 = document.querySelector("#edit-input3");
const editInput4 = document.querySelector("#edit-input4");

const editCancel = document.querySelector("#edit-cancel");
const editSubmit = document.querySelector(".edit-submit");

const API = "http://localhost:8000/contacts";

async function getContact() {
  const res = await fetch(API);
  const data = await res.json();
  return data;
}

async function getOneContact(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

async function deleteContact(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
}

async function addContact(newContact) {
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(newContact),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function editContact(newData, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(newData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

render();

async function render() {
  let data = await getContact();
  todoContainer.innerHTML = "";
  data.forEach((item) => {
    todoContainer.innerHTML += `<div class="todo-item">
    <img class = "image" src="${item.url}" alt="">
        <span>${item.name}</span>
        <span>${item.surname}</span>

        <span>${item.phone}</span>
        <div>
          <button id="${item.id}" class="edit-btn">Edit</button>
          <button id="${item.id}" class="delete-btn">Delete</button>
        </div>
      </div>`;
  });
}

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (
    !addInput.value.trim() ||
    !addInput2.value.trim() ||
    !addInput3.value.trim() ||
    !addInput4.value.trim()
  ) {
    return;
  }

  const contact = {
    name: addInput.value,
    surname: addInput2.value,
    url: addInput3.value,
    phone: addInput4.value,
  };

  await addContact(contact);

  addInput.value = "";
  addInput2.value = "";
  addInput3.value = "";
  addInput4.value = "";

  render();
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    await deleteContact(e.target.id);
    render();
  }
});

let id = null;

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit-btn")) {
    editModal.style.visibility = "visible";
    const contact = await getOneContact(e.target.id);
    id = e.target.id;
    editInput.value = contact.name;
    editInput2.value = contact.surname;
    editInput3.value = contact.url;
    editInput4.value = contact.phone;
    editInput.focus();
  }
});

function handleCloseModal() {
  editModal.style.visibility = "hidden";
}

closeModalBtn.addEventListener("click", handleCloseModal);
editCancel.addEventListener("click", handleCloseModal);

editSubmit.addEventListener("click", async () => {
  if (!editInput.value.trim()) {
    return;
  }
  const newData = {
    name: editInput.value,
    surname: editInput2.value,
    url: editInput3.value,
    phone: editInput4.value,
  };
  await editContact(newData, id);
  render();
  handleCloseModal();
});

const form = document.querySelector('form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const phoneInput = document.querySelector('#phone');
const userList = document.querySelector('#user-list');

// Load users from local storage on page load
window.addEventListener('load', () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  users.forEach(user => {
    const li = createUserListItem(user);
    userList.appendChild(li);
  });
});

// Save user to local storage and display in list
form.addEventListener('submit', event => {
  event.preventDefault();
  const user = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value
  };
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const existingUser = users.find(u => u.email === user.email);
  if (existingUser) {
    const index = users.indexOf(existingUser);
    users.splice(index, 1, user);
    localStorage.setItem('users', JSON.stringify(users));
    const li = Array.from(userList.children).find(li => {
      const [liName, liEmail, liPhone] = li.textContent.split(' - ');
      return liEmail === user.email;
    });
    if (li) {
      li.innerHTML = '';
      const updatedLi = createUserListItem(user);
      li.appendChild(updatedLi.firstChild);
    }
  } else {
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    const li = createUserListItem(user);
    userList.appendChild(li);
  }
  form.reset();
});

// Create user list item with delete and edit buttons
function createUserListItem(user) {
  const li = document.createElement('li');
  li.textContent = `${user.name} - ${user.email} - ${user.phone}`;
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    deleteUser(user);
  });
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => {
    editUser(user);
  });
  li.appendChild(deleteBtn);
  li.appendChild(editBtn);
  return li;
}

// Delete user from local storage and list
function deleteUser(user) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const updatedUsers = users.filter(u => u.email !== user.email);
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  const li = Array.from(userList.children).find(li => {
    const [liName, liEmail, liPhone] = li.textContent.split(' - ');
    return liEmail === user.email;
  });
  if (li) {
    userList.removeChild(li);
  }
}

// Edit user information
function editUser(user) {
  nameInput.value = user.name;
  emailInput.value = user.email;
  phoneInput.value = user.phone;
}

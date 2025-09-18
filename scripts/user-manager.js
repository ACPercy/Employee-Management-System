class UserManager {
  constructor() {
    // Data
    this.users = JSON.parse(localStorage.getItem("users")) || [];
    this.currentSortField = null;
    this.sortAscending = true;


    // DOM Elements
    this.manageUsers = document.getElementById("manageUsers");
    this.userTable = document.getElementById("userTable");
    this.userTableBody = document.getElementById("userTableBody");
    this.userForm = document.getElementById("userForm");
    this.userFormContainer = document.getElementById("userFormContainer");
    this.searchUser = document.getElementById("searchUser");
    this.addUserBtn = document.getElementById("addUserBtn");
    this.viewUserTableBtn = document.getElementById("viewUserTableBtn");
    this.cancelUserBtn = document.getElementById("cancelUserForm");

    // Bind events
    const userManagement = () => {
      // Show the table and controls
      this.userTable.style.display = "table";
      this.searchUser.style.display = "flex";
      this.addUserBtn.style.display = "flex";
      this.viewUserTableBtn.style.display = "flex";
     
      this.userFormContainer.style.display = "none";
      // Render table rows
      this.renderTable();
    };

    this.manageUsers.addEventListener("click", userManagement);
    this.viewUserTableBtn.addEventListener("click", userManagement);
    this.addUserBtn.addEventListener("click", () => this.showAddUserForm());
    this.viewUserTableBtn.addEventListener("click", () => this.showUserTable());
    this.userForm.addEventListener("submit", (e) => this.handleAddUser(e));
    this.searchUser.addEventListener("input", () => this.renderUsers());
    this.cancelUserBtn.addEventListener("click", () => this.cancelUserForm());

    // Initial render
    this.renderUsers();
  }

  // Save users in localStorage
  saveUsers() {
    localStorage.setItem("users", JSON.stringify(this.users));
  }

  // Generate next ID
  generateId() {
    return this.users.length > 0
      ? this.users[this.users.length - 1].userid + 1
      : 1;
  }

  // Add user
  handleAddUser(e) {
  e.preventDefault();

  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  let role = document.getElementById("newRole").value.trim();

  if (!username || !password || !role) {
    console.log("All fields are required.");
    return;
  }

  // Capitalize first letter of role
  role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  const newUser = new User(null, role, username, password);
  this.users.push(newUser);

  // Reassign IDs
  this.users.forEach((user, index) => {
    user.userid = index + 1;
  });

  this.saveUsers();
  this.renderUsers();

  this.userForm.reset();
  this.showUserTable();
  }


  cancelUserForm() {
  this.userForm.reset();
  this.userFormContainer.style.display = "none";
  this.userTable.style.display = "table";
  this.searchUser.style.display = "flex";
  this.addUserBtn.style.display = "flex";
  this.viewUserTableBtn.style.display = "flex";
  }

  // Delete user
  deleteUser(id) {
  this.users = this.users.filter((user) => user.userid !== id);

  // Reassign IDs after deletion
  this.users.forEach((user, index) => {
    user.userid = index + 1;
  });

  this.saveUsers();
  this.renderUsers();
  }

  // Render user table
renderUsers(list = this.users) {
  // Clear table body
  const tbody = this.userTableBody;
  tbody.innerHTML = "";

  // Sort arrows helper
  const headers = this.userTable.querySelectorAll("th");
  headers.forEach(th => {
    th.textContent = th.textContent.replace(" ▲", "").replace(" ▼", "");
  });

  // Add arrow to sorted column
  if (this.currentSortField) {
    const index = { userid: 0, username: 1, role: 2 }[this.currentSortField];
    if (headers[index]) {
      headers[index].textContent += this.sortAscending ? " ▲" : " ▼";
    }
  }

  // ✅ Search filter
  const searchValue = this.searchUser.value.toLowerCase();
  const filteredList = list.filter(
    (user) =>
      user.username.toLowerCase().includes(searchValue) ||
      user.role.toLowerCase().includes(searchValue)
  );

  // ✅ Render filtered rows
  filteredList.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.userid}</td>
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>
        <button class="deleteButton">Delete</button>
      </td>
    `;

    // Delete button
    row.querySelector(".deleteButton").addEventListener("click", () => {
      this.deleteUser(user.userid);
    });

    tbody.appendChild(row);
  });
}

  sortUsersBy(field) {
  if (this.currentSortField === field) {
    this.sortAscending = !this.sortAscending; // toggle direction
  } else {
    this.currentSortField = field;
    this.sortAscending = true;
  }

  this.users.sort((a, b) => {
    let valA = a[field];
    let valB = b[field];

    // Ensure proper comparison
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return this.sortAscending ? -1 : 1;
    if (valA > valB) return this.sortAscending ? 1 : -1;
    return 0;
  });

  this.renderUsers();
}

  // Show form
  showAddUserForm() {
    this.userTable.style.display = "none";
    this.searchUser.style.display = "none";
    this.addUserBtn.style.display = "none";
    this.userFormContainer.style.display = "flex";
  }

  showUserTable() {
  this.userFormContainer.style.display = "none";
  this.userTable.style.display = "table";
  this.searchUser.style.display = "flex";
  this.addUserBtn.style.display = "flex";
  this.viewUserTableBtn.style.display = "flex";
}
}

const userManager = new UserManager();
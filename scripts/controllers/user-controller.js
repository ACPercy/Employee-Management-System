import { UserManager } from "../managers/user-manager.js";
import { EmployeeManager } from "../managers/employee-manager.js";

export class UserController {
  constructor(empManager) {
    this.empManager = empManager; 
    this.userManager = new UserManager(this.empManager);
    this.editIndex = null;
    this.currentSortField = null;
    this.sortAscending = true;

    // Cache DOM
    this.cacheDOM();

    // Bind events
    this.bindEvents();

    // Populate dropdown with employee EIDs
    this.populateEmployeeEIDDropdown();

    // Initial render of users
    this.renderTable();
  }

  showTable() {
    this.userTable.style.display = "table";
    this.userFormContainer.style.display = "none";
    this.userForm.reset();
    this.searchUserInput.style.display = "flex";
    this.addUserBtn.style.display = "flex";
    this.viewUserTableBtn.style.display = "flex";
  }

  showForm(title = "Add New User Account") {
    this.userForm.reset();
    this.userFormTitle.textContent = title;
    this.userFormContainer.style.display = "flex";
    this.userTable.style.display = "none";
    this.searchUserInput.style.display = "none";
    this.addUserBtn.style.display = "none";
    this.viewUserTableBtn.style.display = "none";
  }

  cacheDOM() {
    // User section
    this.userSection = document.getElementById("user-section");
    this.searchUserInput = document.getElementById("search-user");
    this.addUserBtn = document.getElementById("add-user-btn");
    this.viewUserTableBtn = document.getElementById("view-user-table-btn");

    // User table
    this.userTable = document.getElementById("user-table");
    this.userTableBody = document.getElementById("user-table-body");

    // User form container
    this.userFormContainer = document.getElementById("user-form-container");
    this.userForm = document.getElementById("user-form");
    this.userFormTitle = document.getElementById("user-form-title");

    // Form fields
    this.eidSelect = document.getElementById("user-eid");
    this.roleInput = document.getElementById("user-role"); // role is an input in your HTML
    this.usernameInput = document.getElementById("user-username");
    this.passwordInput = document.getElementById("user-password");

    // Form buttons
    this.userSubmitBtn = document.getElementById("user-submit-btn");
    this.userCancelBtn = document.getElementById("user-cancel-btn");
  }


  bindEvents() {
    // View Employees Button
    this.viewUserTableBtn.addEventListener("click", () => this.showTable());

    // Add Employee Button
    this.addUserBtn.addEventListener("click", () => {
      this.populateEmployeeEIDDropdown();
      this.showForm("Add New User Account")
    });

    // Handle form submit → add new employee
    this.userForm.addEventListener("submit", (e) => this.handleSubmit(e));

    // Auto-fill details when EID is selected
    this.eidSelect.addEventListener("change", () => this.handleEIDSelection());

    // Cancel button → reset form
    this.userCancelBtn.addEventListener("click", () => this.showTable());

    // Search users in real time
    this.searchUserInput.addEventListener("input", () => {
      const query = this.searchUserInput.value.toLowerCase();
      const users = this.userManager.getAll();

      const filtered = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.eid.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
      );

      this.renderTable(filtered);
    });

    // Bind click on sortable headers
    this.userTable.querySelectorAll("th[data-field]").forEach(th => {
      th.addEventListener("click", () => {
        const field = th.dataset.field;
        this.sortByField(field);
      });
    });
  }

  // Populate EID dropdown with employees
  populateEmployeeEIDDropdown() {
    const employees = this.empManager.getNonAdminEmployees(); // exclude admin
    this.eidSelect.innerHTML = `<option value="">Select Employee</option>`;
    
    employees.forEach(emp => {
      const option = document.createElement("option");
      option.value = emp.eid;
      option.textContent = `${emp.eid} - ${emp.firstName} ${emp.lastName}`;
      this.eidSelect.appendChild(option);
    });
  }

  // When an EID is selected, auto-fill name/role
  handleEIDSelection() {
    const selectedEID = this.eidSelect.value;
    if (!selectedEID) return;

    const employee = this.empManager.getAll().find(emp => emp.eid === selectedEID);
    if (employee) {
      this.roleInput.value = employee.role // auto-fill role
      this.usernameInput.value = employee.eid;

      // Generate temporary password
      this.passwordInput.type = "text";
      this.passwordInput.value = employee.eid + "@" + Math.random().toString(36).slice(-3);
      setTimeout(() => { 
        this.passwordInput.type = "password"; // Hide after 5s
      }, 5000);
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const eid = this.eidSelect.value;
    const username = this.usernameInput.value;
    const password = this.passwordInput.value;
    const role = this.roleInput.value;

    if (!eid || !username || !password || !role) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      // Use UserManager's method instead of manually creating object
      this.userManager.addUser(eid, username, password, role, true, null);

      this.userForm.reset();
      this.renderTable();
      this.showTable();

      if (this.adminController) {
        this.adminController.homeController.render();
      }
    } catch (err) {
      alert(err.message); // will show "Username already exists!" etc.
    }
  }

  renderTable(list = null) {
    const users = list || this.userManager.getAll();
    this.userTableBody.innerHTML = "";

    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.eid}</td>
        <td>${user.username}</td>
        <td>${user.status}</td>
        <td>
          <button class="edit-button">Edit</button>
          <button class="delete-button">Delete</button>
        </td>
      `;
      this.userTableBody.appendChild(row);
    });
  }

  sortByField(field) {
    if (this.currentSortField === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.currentSortField = field;
      this.sortAscending = true;
    }

    // Update table headers
    this.userTable.querySelectorAll("th").forEach(th => {
      if (!th.dataset.label) return;
      const label = th.dataset.label;
      if (th.dataset.field === field) {
        th.innerHTML = `${label} ${this.sortAscending ? "▲" : "▼"}`;
      } else {
        th.innerHTML = label;
      }
    });

    // Sort the users
    const users = [...this.userManager.getAll()];
    users.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });

    // Re-render user table with sorted data
    this.renderTable(users);
  }

}
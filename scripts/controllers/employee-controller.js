import { EmployeeManager } from "../managers/employee-manager.js";

export class EmployeeController {
  constructor() {
    // Initialize manager and state
    this.empManager = new EmployeeManager();
    this.editIndex = null;
    this.currentSortField = null;
    this.sortAscending = true;

    // Cache DOM elements
    this.cacheDOM();

    // Bind events
    this.bindEvents();

    // Initial render
    this.renderTable();
  }

  showTable() {
    this.employeeTable.style.display = "table";
    this.employeeFormContainer.style.display = "none";
    this.employeeForm.reset();
    this.searchEmployeeInput.style.display = "flex";
    this.addEmployeeBtn.style.display = "flex";
    this.viewEmployeeTableBtn.style.display = "flex";
  }

  showForm(title = "Add New Employee", reset = true, isEdit = false) {
    if (reset) this.employeeForm.reset();
    this.employeeFormTitle.textContent = title;
    this.submitBtn.textContent = isEdit ? "Update Employee" : "Add Employee";
    this.employeeFormContainer.style.display = "flex";
    this.employeeTable.style.display = "none";
    this.searchEmployeeInput.style.display = "none";
    this.addEmployeeBtn.style.display = "none";
    this.viewEmployeeTableBtn.style.display = "none";
  }

  // Cache all DOM elements in one place
  cacheDOM() {
    // Employee section
    this.employeeSection = document.getElementById("employee-section");
    this.searchEmployeeInput = document.getElementById("search-employee");
    this.addEmployeeBtn = document.getElementById("add-employee-btn");
    this.viewEmployeeTableBtn = document.getElementById("view-employee-table-btn");

    // Employee table
    this.employeeTable = document.getElementById("employee-table");
    this.employeeTableBody = document.getElementById("employee-table-body");

    // Employee form container
    this.employeeFormContainer = document.querySelector(".employee-form-container");
    this.employeeForm = document.getElementById("employee-form");
    this.employeeFormTitle = document.getElementById("employee-form-title");

    // Form fields
    this.eidField = document.getElementById("employee-eid");
    this.firstNameInput = document.getElementById("employee-firstname");
    this.lastNameInput = document.getElementById("employee-lastname");
    this.emailInput = document.getElementById("employee-email");
    this.departmentSelect = document.getElementById("employee-department");
    this.positionSelect = document.getElementById("employee-position");
    this.roleSelect = document.getElementById("employee-role");
    this.salaryInput = document.getElementById("employee-salary");

    // Form buttons
    this.submitBtn = document.getElementById("employee-submit-btn");
    this.cancelBtn = document.getElementById("employee-cancel-btn");
  }

  // Bind all event listeners in one place
  bindEvents() {
    // View Employees Button
    this.viewEmployeeTableBtn.addEventListener("click", () => this.showTable());

    // Add Employee Button
    this.addEmployeeBtn.addEventListener("click", () => this.showForm("Add New Employee", true));
   
    // Handle form submit → add new employee
    this.employeeForm.addEventListener("submit", (e) => this.handleSubmit(e));

    // Cancel button → reset form
    this.cancelBtn.addEventListener("click", () => this.showTable());

    // Auto-generate EID while typing first name
    this.firstNameInput.addEventListener("input", () => {
      const first = this.firstNameInput.value.trim();
      if (first) {
          this.eidField.value = this.empManager.generateEID(first);
      } else {
          this.eidField.value = "";
      }
    });

    // Search employees in real time
    this.searchEmployeeInput.addEventListener("input", () => {
      const query = this.searchEmployeeInput.value.toLowerCase();
      const employees = this.empManager.getAll();

      const filtered = employees.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query) ||
        String(emp.eid).toLowerCase().includes(query)
      );

      this.renderTable(filtered);
    });

    // Add sorting for table headers
    this.employeeTable.querySelectorAll("th[data-field]").forEach(th => {
      th.addEventListener("click", () => this.sortByField(th.dataset.field));
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    // Collect form values
    const eid = this.eidField.value;
    const firstName = this.firstNameInput.value;
    const lastName = this.lastNameInput.value;
    const email = this.emailInput.value;
    const department = this.departmentSelect.value;
    const position = this.positionSelect.value;
    const role = this.roleSelect.value;
    const salary = parseFloat(this.salaryInput.value);

    // Validate required fields
    if (!firstName || !lastName || !email || !department || !position || !role || !salary) {
      alert("Please fill in all required fields.");
      return;
    }

    if (this.editIndex !== null) {
      // Update existing employee
      this.empManager.updateEmployee(this.editIndex, {
        eid,
        firstName,
        lastName,
        email,
        department,
        position,
        role,
        salary
      });
      // Sync with user if exists
      if (this.userManager) {
        const user = this.userManager.getAll().find(u => u.eid === eid);
        if (user) {
          user.username = eid;
          user.role = role;
          this.userManager.saveAll();
        }
      }
      this.editIndex = null; // reset after update
    } else {
        // Add new employee
        this.empManager.addEmployee(eid, firstName, lastName, email, department, position, role, salary);
    }

    // Re-render table
    this.renderTable();
    this.showTable();
  }

  renderTable(list = null) {
    const employees = list || this.empManager.getAll();
    this.employeeTableBody.innerHTML = "";

    employees.forEach(emp => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${emp.id}</td>
        <td>${emp.eid}</td>
        <td>${emp.firstName} ${emp.lastName}</td>
        <td>${emp.email}</td>
        <td>${emp.department}</td>
        <td>${emp.position}</td>
        <td>${emp.role}</td>
        <td>${emp.salary}</td>
        <td>
          <button class="edit-button" data-id="${emp.id}">Edit</button>
          <button class="delete-button" data-id="${emp.id}">Delete</button>
        </td>
      `;
      row.querySelector(".edit-button").addEventListener("click", () => this.editEmployee(emp.id));
      row.querySelector(".delete-button").addEventListener("click", () => this.deleteEmployee(emp.id));
      this.employeeTableBody.appendChild(row);
    });
  }

  editEmployee(id) {
    const emp = this.empManager.getById(Number(id));
    if (!emp) return;

    this.editIndex = id; // save ID instead of index

    this.showForm("Update Employee Info", false, true);

    // populate form
    this.eidField.value = emp.eid;
    this.firstNameInput.value = emp.firstName;
    this.lastNameInput.value = emp.lastName;
    this.emailInput.value = emp.email;
    this.departmentSelect.value = emp.department;
    this.positionSelect.value = emp.position;
    this.roleSelect.value = emp.role;
    this.salaryInput.value = emp.salary;
  }

  deleteEmployee(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
      this.empManager.deleteEmployee(Number(id));
      this.renderTable(this.empManager.getAll());
    }
  }

  sortByField(field) {
    if (this.currentSortField === field) {
      // Toggle ascending/descending
      this.sortAscending = !this.sortAscending;
    } else {
      this.currentSortField = field;
      this.sortAscending = true;
    }

    // Update header arrows
    this.employeeTable.querySelectorAll("th").forEach(th => {
      if (!th.dataset.label) return; // skip columns without label (like Actions)
      const label = th.dataset.label;
      if (th.dataset.field === field) {
        th.innerHTML = `${label} ${this.sortAscending ? "▲" : "▼"}`;
      } else {
        th.innerHTML = label; // reset other headers
      }
    });

    // Sort the data
    const employees = [...this.empManager.getAll()];
    employees.sort((a, b) => {
      let valA, valB;

      if (field === "name") {
        valA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else {
        valA = a[field];
        valB = b[field];
      }

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });

    // Re-render table with sorted data
    this.renderTable(employees);
  }



}

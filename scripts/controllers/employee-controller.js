import { EmployeeManager } from "../managers/employee-manager.js";
import { EmployeeProfileController } from "./employee-profile-controller.js";

export class EmployeeController {
  constructor(empManager, employeeProfileController) {
    // Initialize manager and state
    this.empManager = empManager;
    this.employeeProfileController = employeeProfileController;
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
    if (this.employeeProfile) this.employeeProfile.style.display = "none";
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
    this.roleSelect = document.getElementById("employee-role");
    this.positionSelect = document.getElementById("employee-position");
    this.positionsData = {
      Employee: {
        "Human Resources": ["HR Generalist", "Recruiter"],
        "IT / Technology": ["Software Engineer", "QA Tester"],
        "Sales": ["Sales Executive", "Sales Representative"]
      },
      Manager: {
          "Human Resources": ["HR Manager"],
          "IT / Technology": ["IT Manager"],
          "Sales": ["Sales Manager"]
      }
    };
    this.salaryInput = document.getElementById("employee-salary");

    // Form buttons
    this.submitBtn = document.getElementById("employee-submit-btn");
    this.cancelBtn = document.getElementById("employee-cancel-btn");

    this.employeeProfile = document.getElementById("employee-profile-main-container");
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

    this.departmentSelect.addEventListener("change", () => {
      this.updatePositions();
      this.updateRoleOptions();
    });
    this.roleSelect.addEventListener("change", () => this.updatePositions());

    this.employeeTable.addEventListener("click", (e) => {
      if (e.target.classList.contains("view-button")) {
        const eid = e.target.dataset.eid;
        const emp = this.empManager.getAll().find(emp => emp.eid === eid);
        if (!emp) return;

        // Hide employee table and controls
        this.searchEmployeeInput.style.display = "none";
        this.addEmployeeBtn.style.display = "none";
        this.employeeTable.style.display = "none"; 
        this.employeeFormContainer.style.display = "none";

        // Show employee profile container only
        this.employeeProfile.style.display = "flex";

        // Hide the edit button if exists
        const editBtn = document.getElementById("employee-edit-profile-btn");
        if (editBtn) editBtn.style.display = "none";

        // Render the clicked employee’s profile
        this.employeeProfileController.renderEmployee(eid);
      }
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

    let managerId = null;
    // If employee is not a manager, assign the existing manager of the department
    if (role !== "Manager") {
      const existingManager = this.getManagerByDepartment(department);
      if (existingManager) managerId = existingManager.eid; // or ID
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
        salary,
        managerId 
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
        this.empManager.addEmployee(eid, firstName, lastName, email, department, position, role, salary, managerId);
    }

    // Re-render table
    this.renderTable();
    this.showTable();
    if (this.adminController) {
      this.adminController.homeController.render();
    }
    if (this.adminController?.userController) {
      this.adminController.userController.populateEmployeeEIDDropdown();
    }
    this.updatePositions();
  }

  renderTable(list = null) {
    const employees = list || this.empManager.getNonAdminEmployees();
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
          <button class="view-button" data-eid="${emp.eid}">View</button>
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
    this.updateRoleOptions();
    this.roleSelect.value = emp.role;
    this.updatePositions();
    this.positionSelect.value = emp.position;
    this.salaryInput.value = emp.salary;

  }

  deleteEmployee(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
      this.empManager.deleteEmployee(Number(id));
      this.renderTable(this.empManager.getAll());
    }

    if (this.adminController) {
      this.adminController.homeController.render();
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

  updatePositions() {
    const selectedRole = this.roleSelect.value;
    const selectedDept = this.departmentSelect.value;

    // Clear current options
    this.positionSelect.innerHTML = '<option value="">Select Position</option>';

    // Check if positions exist for the selected role and department
    if (selectedRole && selectedDept && this.positionsData[selectedRole] && this.positionsData[selectedRole][selectedDept]) {
      const positions = this.positionsData[selectedRole][selectedDept];
      positions.forEach(pos => {
        const option = document.createElement("option");
        option.value = pos;
        option.textContent = pos;
        this.positionSelect.appendChild(option);
      });
    }
  }

  // Find the manager in a specific department
  getManagerByDepartment(department) {
    return this.empManager.getAll().find(emp => emp.department === department && emp.role === "Manager");
  }

  updateRoleOptions() {
    const selectedDept = this.departmentSelect.value;

    // Enable both options by default
    this.roleSelect.querySelector('option[value="Manager"]').disabled = false;
    this.roleSelect.querySelector('option[value="Employee"]').disabled = false;

    // If a manager already exists for this department, disable "Manager"
    const existingManager = this.getManagerByDepartment(selectedDept);
    if (existingManager) {
      this.roleSelect.querySelector('option[value="Manager"]').disabled = true;
      // Optional: auto-select "Employee" if "Manager" was selected
      if (this.roleSelect.value === "Manager") this.roleSelect.value = "Employee";
    }
  }
}

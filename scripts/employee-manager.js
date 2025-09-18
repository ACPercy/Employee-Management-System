// Employee class
class Employee {
  constructor(eid, name, email, department, position, role, salary) {
    this.eid = eid;
    this.name = name;
    this.email = email;
    this.department = department;
    this.position = position;
    this.role = role;
    this.salary = salary;
  }
}

// Employee Manager class
class EmployeeManager {
  constructor() {
    // DOM elements
    this.eidField = document.getElementById("eid");
    this.nameInput = document.getElementById("name");
    this.emailInput = document.getElementById("email");
    this.departmentSelect = document.getElementById("department");
    this.positionSelect = document.getElementById("position");
    this.roleSelect = document.getElementById("role");
    this.salaryInput = document.getElementById("salary");
    this.employeeForm = document.getElementById("employeeForm");
    this.employeeFormContainer = document.querySelector(".employeeFormContainer");
    this.employeeTable = document.getElementById("employeeTable");
    this.employeeTableBody = document.getElementById("employeeTableBody");
    this.addEmployeeBtn = document.getElementById("addEmployeeBtn");
    this.viewEmployeeTableBtn = document.getElementById("viewEmployeeTableBtn");
    this.searchEmployee = document.getElementById("searchEmployee");
    this.employeeSubmitBtn = document.getElementById("employeeSubmitBtn");
    this.cancelBtn = document.getElementById("cancelBtn");
    this.formTitle = document.getElementById("formTitle");
    this.manageEmployees = document.getElementById("manageEmployees");

    // Data
    this.employees = JSON.parse(localStorage.getItem("employees")) || [];
    this.editIndex = null;
    this.currentSortField = null;
    this.sortAscending = true;

    // Bind events
    this.addEmployeeBtn.addEventListener("click", () => this.openEmployeeForm("add"));
    this.viewEmployeeTableBtn.addEventListener("click", () => this.showEmployeeTable());
    this.cancelBtn.addEventListener("click", () => this.cancelEmployeeForm());
    this.employeeForm.addEventListener("submit", (e) => this.handleSubmit(e));
    this.searchEmployee.addEventListener("input", (e) => this.renderTable(this.searchEmployees(e.target.value)));
    this.nameInput.addEventListener("input", () => {
  if (this.editIndex === null && this.nameInput.value.trim() !== "") {
    this.eidField.value = this.generateEID(this.nameInput.value.trim());
  }
});
    this.manageEmployees.addEventListener("click", () => this.showEmployeeTable());

    // Initial render
    this.renderTable();
  }

  saveToStorage() {
    localStorage.setItem("employees", JSON.stringify(this.employees));
  }

  // Auto-generate EID when typing a name (only if adding new employee)
  generateEID(name) {
    const firstLetter = name.charAt(0).toUpperCase() || "E";
    const numbers = this.employees
      .filter(emp => emp.eid.charAt(0) === firstLetter)
      .map(emp => parseInt(emp.eid.slice(1), 10));
    const nextNumber = (numbers.length ? Math.max(...numbers) : 0) + 1;
    return `${firstLetter}${nextNumber.toString().padStart(4, "0")}`;
  }

  openEmployeeForm(mode, eid = null) {
  // Show form, hide table & search
  this.employeeFormContainer.style.display = "flex";
  this.employeeTable.style.display = "none";
  this.searchEmployee.style.display = "none";
  this.addEmployeeBtn.style.display = "none";

  if (mode === "add") {
    // Clear inputs for new employee
    this.employeeForm.reset();
    this.editIndex = null;
    this.eidField.value = ""; // Will be auto-generated as user types name
    this.formTitle.textContent = "Add New Employee";
    this.employeeSubmitBtn.textContent = "Add Employee";
  } 
  else if (mode === "edit") {
    // Find the employee to edit
    const empIndex = this.employees.findIndex(emp => emp.eid === eid);
    if (empIndex === -1) return;

    const emp = this.employees[empIndex];
    this.editIndex = empIndex;

    // Fill form with existing employee data
    this.eidField.value = emp.eid;        // EID stays the same
    this.nameInput.value = emp.name;
    this.emailInput.value = emp.email;
    this.departmentSelect.value = emp.department;
    this.positionSelect.value = emp.position;
    this.roleSelect.value = emp.role;
    this.salaryInput.value = emp.salary;

    this.formTitle.textContent = "Update Employee Info";
    this.employeeSubmitBtn.textContent = "Update";
  }
}
    

  cancelEmployeeForm() {
    this.employeeForm.reset();
    this.eidField.value = "";
    this.editIndex = null;
    this.employeeSubmitBtn.textContent = "Add Employee";
    this.formTitle.textContent = "Add New Employee";
    this.employeeFormContainer.style.display = "none";
    this.employeeTable.style.display = "table";
    this.searchEmployee.style.display = "flex";
    this.addEmployeeBtn.style.display = "flex";
  }

  handleSubmit(e) {
  e.preventDefault();

  const name = this.nameInput.value.trim();
  const email = this.emailInput.value.trim();
  const department = this.departmentSelect.value;
  const position = this.positionSelect.value;
  const role = this.roleSelect.value;
  const salary = this.salaryInput.value.trim();

  // Only generate EID if adding
  const eid = this.editIndex === null ? this.generateEID(name) : this.employees[this.editIndex].eid;

  // If all fields are empty, do not proceed
  if (!eid || !name || !email || !department || !position || !role || !salary) {
    console.log("All fields are required.");
    return; // prevents blank row
  }

  const employee = new Employee(eid, name, email, department, position, role, salary);

  if (this.editIndex === null) {
    this.employees.push(employee);
  } else {
    this.employees[this.editIndex] = employee;
    this.editIndex = null;
    this.employeeSubmitBtn.textContent = "Add Employee";
  }

  this.saveToStorage();
  this.renderTable();
  this.cancelEmployeeForm();
}




  editEmployee(eid) {
    this.openEmployeeForm("edit", eid);
  }

  deleteEmployee(eid) {
    const index = this.employees.findIndex(emp => emp.eid === eid);
    if (index === -1) return;
    if (!confirm("Are you sure you want to delete this employee?")) return;
    this.employees.splice(index, 1);
    this.saveToStorage();
    this.renderTable();
  }

  renderTable(list = this.employees) {
    // Clear table body
    const tbody = this.employeeTableBody;
    tbody.innerHTML = "";

    // Sort arrows helper
    const headers = this.employeeTable.querySelectorAll("th");
    headers.forEach(th => {
      th.textContent = th.textContent.replace(" ▲", "").replace(" ▼", "");
    });

    // Add arrow to sorted column
    if (this.currentSortField) {
      const index = {eid:0,name:1,email:2,department:3,position:4,role:5,salary:6}[this.currentSortField];
      if (headers[index]) headers[index].textContent += this.sortAscending ? " ▲" : " ▼";
    }

    list.forEach(emp => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${emp.eid}</td>
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.department}</td>
        <td>${emp.position}</td>
        <td>${emp.role}</td>
        <td>${emp.salary}</td>
        <td>
          <button class="editButton" onclick="manager.editEmployee('${emp.eid}')">Edit</button>
          <button class="deleteButton" onclick="manager.deleteEmployee('${emp.eid}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  showEmployeeTable() {
  this.employeeFormContainer.style.display = "none";
  this.employeeTable.style.display = "table";
  this.searchEmployee.style.display = "flex";
  this.addEmployeeBtn.style.display = "flex";
  this.renderTable();
  }

  searchEmployees(query) {
    query = query.toLowerCase();
    return this.employees.filter(emp =>
      emp.eid.toLowerCase().includes(query) ||
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) ||
      emp.position.toLowerCase().includes(query) ||
      emp.role.toLowerCase().includes(query) 
    );
  }
  
  sortEmployeesBy(field) {
    if (this.currentSortField === field) this.sortAscending = !this.sortAscending;
    else { this.currentSortField = field; this.sortAscending = true; }

    this.employees.sort((a, b) => {
      let valA = field === "salary" ? parseFloat(a[field]) : a[field].toLowerCase();
      let valB = field === "salary" ? parseFloat(b[field]) : b[field].toLowerCase();
      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });

    this.renderTable();
  }
}

// Initialize manager
const manager = new EmployeeManager();

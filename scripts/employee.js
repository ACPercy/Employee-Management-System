// Employee class
class Employee {
  constructor(eid, name, email, department, salary) {
    this.eid = eid;
    this.name = name;
    this.email = email;
    this.department = department;
    this.salary = salary;
  }
}

// Employee Manager class
class EmployeeManager {
  constructor() {
    this.nameInput = document.getElementById("name");
    this.eidField = document.getElementById("eid");

    // Auto-generate EID when typing a name (only if adding new employee)
    this.nameInput.addEventListener("input", () => {
      if (this.editIndex === null) {
        this.eidField.value = this.generateEID(this.nameInput.value);
      }
    });

    this.employees = JSON.parse(localStorage.getItem("employees")) || [];
    this.editIndex = null;

    // Cache DOM elements
    this.form = document.getElementById("employeeForm");
    this.table = document.getElementById("employeeTable");
    this.addEmployeeForm = document.querySelector(".addEmployeeForm");
    this.submitBtn = document.getElementById("submitBtn");
    this.showAddForm = document.getElementById("showAddForm");
    
    this.cancelBtn = document.getElementById("cancelBtn");
    this.searchInput = document.getElementById("searchInput");

    // Bind events
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.showAddForm.addEventListener("click", (e) => this.showAddEmployeeForm(e));
    this.cancelBtn.addEventListener("click", () => this.cancelForm());
    this.searchInput.addEventListener("input", (e) => {
      this.searchEmployees(e.target.value);
    });

    // Initial render
    this.renderTable();

    this.currentSortField = null;
    this.sortAscending = true;
  }

  saveToStorage() {
    localStorage.setItem("employees", JSON.stringify(this.employees));
  }

  //Generate auto EID
  generateEID(name) {
    const firstLetter = name.charAt(0).toUpperCase();

    // Get all numbers for this letter
    const numbers = this.employees
    .filter(emp => emp.eid.charAt(0) === firstLetter)
    .map(emp => parseInt(emp.eid.slice(1), 10));

    // Get the highest number, default to 0 if none exist
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;

    // Next number is max + 1
    const nextNumber = maxNumber + 1;

    return `${firstLetter}${nextNumber.toString().padStart(4, "0")}`;
  }

  renderTable(list = this.employees) {
    // Get search value
    const searchValue = this.searchInput ? this.searchInput.value.toLowerCase() : "";
    // Helper function to add arrow to sorted column
    const getHeader = (field, label) => {
    let arrow = "";
      if (this.currentSortField === field) {
        arrow = this.sortAscending ? " ▲" : " ▼";
      }
      return `<th onclick="manager.sortEmployeesBy('${field}')">${label}${arrow}</th>`;
    };

    this.table.innerHTML = `
      <tr>
        ${getHeader("eid", "EID")}
        ${getHeader("name", "Name")}
        ${getHeader("email", "Email")}
        ${getHeader("department", "Department")}
        ${getHeader("salary", "Salary")}
        <th>Actions</th>
      </tr>
    `;
    
    list.forEach((emp, index) => {
      this.table.innerHTML += `
        <tr>
          <td>${emp.eid}</td>
          <td>${emp.name}</td>
          <td>${emp.email}</td>
          <td>${emp.department}</td>
          <td>${emp.salary}</td>
          <td>
            <button class="editButton" onclick="manager.editEmployee(${index})">Edit</button>
            <button class="deleteButton" onclick="manager.deleteEmployee(${index})">Delete</button>
          </td>
        </tr>
      `;
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let eid = this.eidField.value; // read generated EID
    const name = this.nameInput.value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;
    const salary = document.getElementById("salary").value;
    
    if (this.editIndex === null) {
    // Create new employee
      const employee = new Employee(eid, name, email, department, salary);
      this.employees.push(employee);
    } else {
    // Keep old EID when editing
      eid = this.employees[this.editIndex].eid;
      this.eidField.value = eid;
      const employee = new Employee(eid, name, email, department, salary);
      this.employees[this.editIndex] = employee;
      this.editIndex = null;
      this.submitBtn.textContent = "Add Employee";
    }

    this.saveToStorage();
    this.form.reset();
    this.eidField.value = ""; // clear after reset
    this.addEmployeeForm.style.display = "none";
    this.renderTable();
  }

  editEmployee(index) {
    this.addEmployeeForm.style.display = "flex";
    this.table.style.display = "none"; // hide table while editing
    this.searchInput.style.display = "none";
    const emp = this.employees[index]; 
      this.eidField.value = emp.eid;
      this.nameInput.value = emp.name;
      document.getElementById("email").value = emp.email;
      document.getElementById("department").value = emp.department;
      document.getElementById("salary").value = emp.salary;

    this.editIndex = index;
    this.submitBtn.textContent = "Update Employee";
  }

  deleteEmployee(index) {
    this.employees.splice(index, 1);
    this.saveToStorage();
    this.renderTable();
  }

  showAddEmployeeForm(e) {
    e.preventDefault();
    // Always open in "Add Employee" mode
    this.addEmployeeForm.style.display = "flex";
    this.table.style.display = "none";
    this.searchInput.style.display = "none";

    // Reset form for new entry
    this.form.reset();
    this.eidField.value = "";
    this.editIndex = null;
    this.submitBtn.textContent = "Add Employee";
  }

  cancelForm() {
  // Hide form and show table
  this.addEmployeeForm.style.display = "none";
  this.table.style.display = "table";
  this.searchInput.style.display = "flex"

  // Reset state
  this.form.reset();
  this.eidField.value = "";
  this.editIndex = null;
  this.submitBtn.textContent = "Add Employee";
  }

  sortEmployeesBy(field) {
    if (this.currentSortField === field) {
      this.sortAscending = !this.sortAscending; // toggle direction
    } else {
    this.currentSortField = field;
    this.sortAscending = true; // default ascending
    }

    this.employees.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (field === "salary") { // numeric sort
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      }

      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });

    this.renderTable();
  }

  searchEmployees(query) {
    query = query.toLowerCase();
    // Filter employees based on search input
    const filteredEmployees = this.employees.filter(emp =>
      emp.eid.toLowerCase().includes(query) ||
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query)
    );

    this.renderTable(filteredEmployees); // pass filtered results
  }
}

// Initialize manager
const manager = new EmployeeManager();

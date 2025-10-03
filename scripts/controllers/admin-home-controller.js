export class AdminHomeController {
  constructor({ employeeController, userController }) {
    this.employeeController = employeeController;
    this.userController = userController;

    // Fix: link to their managers
    this.empManager = employeeController?.empManager;
    this.userManager = userController?.userManager;

    // Cache DOM
    this.totalEmployeesEl = document.getElementById("total-employees");
    this.totalDepartmentsEl = document.getElementById("total-departments");
    this.totalUsersEl = document.getElementById("total-users");
    this.activeUsersEl = document.getElementById("total-active-users");
    this.inactiveUsersEl = document.getElementById("total-inactive-users");

    this.render();
  }

  render() {
    // Employees
    const employees = this.empManager?.getNonAdminEmployees() || [];
    this.totalEmployeesEl.textContent = employees.length;

    // Departments (unique)
    const departments = [...new Set(employees.map(e => e.department))];
    this.totalDepartmentsEl.textContent = departments.length;

    // Users
    const users = this.userManager?.getAll() || [];
    this.totalUsersEl.textContent = users.length;

    // Active / Inactive users
    const activeUsers = users.filter(u => u.status === "Active").length;
    const inactiveUsers = users.filter(u => u.status === "Inactive").length;

    this.activeUsersEl.textContent = activeUsers;
    this.inactiveUsersEl.textContent = inactiveUsers;
  }
}
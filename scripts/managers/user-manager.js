import { User } from "../models/user.js";
import { BaseManager } from "./base-manager.js";

export class UserManager extends BaseManager {
  constructor(employeeManager) {
    super("users");
    this.employeeManager = employeeManager;
  }

  // Add a new user account
  addUser(employeeEid, username, password, role, mustChangePassword = true, tempPassword = null) {
    const users = this.getAll();

    // Check if username already exists
    if (users.some(u => u.username === username)) {
      throw new Error("Username already exists!");
    }

    let newUser;

    if (role.toLowerCase() === "admin") {
      // Admin does NOT need EmployeeManager
      const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;

      newUser = new User(
        newId,
        employeeEid,          // use given EID, e.g., ADM001
        "Percy",             // firstName
        "Perseus",      // lastName
        "admin@example.com",  // email
        "System Administration",     // department
        role,
        "System Administrator",      // position
        30000,                    // salary
        null,
        username,
        password,
        tempPassword,
        mustChangePassword,
        "Active",
        "2025-08-08",
        null
      );
    } else {
      // Normal employee user
      const employee = this.employeeManager.getAll().find(emp => emp.eid === employeeEid);
      if (!employee) throw new Error(`Employee with EID ${employeeEid} not found!`);

      const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const today = new Date().toISOString().split("T")[0];

      newUser = new User(
        newId,
        employee.eid,
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.department,
        role || employee.role,
        employee.position,
        employee.salary,
        username,
        password,
        tempPassword,
        mustChangePassword,
        "Inactive",
        today,
        null
      );
    }

    // Save user
    users.push(newUser);
    this.saveData(users);
    return newUser;
  }

  findUser(role, username, password) {
    const users = this.getAll();

    // Admin stored like normal user, no localStorage dependency
    return users.find(u =>
      u.role.toLowerCase() === role.toLowerCase() &&
      u.username === username &&
      (u.password === password || (u.mustChangePassword && u.tempPassword === password))
    );
  }

  updateUser(updatedUser) {
    const users = this.getAll();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index > -1) {
      users[index] = updatedUser;
      this.saveData(users);
    }
  }

}

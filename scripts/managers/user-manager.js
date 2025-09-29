import { User } from "../models/user.js";
import { BaseManager } from "./base-manager.js";
import { EmployeeManager } from "./employee-manager.js";

export class UserManager extends BaseManager {
  constructor() {
    super("users");
    this.users = this.data;
    this.employeeManager = new EmployeeManager(); // so we can fetch employee data
  }

  // Add a new user account
  addUser(employeeEid, username, password, role, mustChangePassword = true, tempPassword = null) {
    const users = this.getAll();

    // Check if employee exists
    const employee = this.employeeManager.getAll().find(emp => emp.eid === employeeEid);
    if (!employee) {
      throw new Error(`Employee with EID ${employeeEid} not found!`);
    }

    // Auto-increment user ID
    const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;

    // Create new User instance
    const newUser = new User(
      newId,
      employee.eid,             // same eid as employee
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.department,
      employee.position,
      role || employee.role,    // role can be passed or fallback to employee role
      employee.salary,
      username,
      password,
      tempPassword,
      mustChangePassword,
      "Active"
    );

    // Save user
    users.push(newUser);
    this.saveData(users);
    return newUser;
  }

  findUser(role, username, password) {
    const users = this.getAll();
    return users.find(u =>
      u.role.toLowerCase() === role.toLowerCase() &&
      u.username === username &&
      (u.password === password || (u.mustChangePassword && u.tempPassword === password)) 
    );
  }

  updateUser(updatedUser) {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index > -1) {
      this.users[index] = updatedUser;
      this.saveData(this.users);
    }
  }

}

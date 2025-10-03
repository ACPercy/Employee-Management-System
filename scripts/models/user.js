import { Employee } from "./employee.js";

// User Class 
export class User extends Employee {
  constructor(
    id, 
    eid, 
    firstName, 
    lastName, 
    email, 
    department, 
    role, 
    position, 
    salary, 
    managerId = null,
    username, 
    password = null, 
    tempPassword = null, 
    mustChangePassword = false, 
    status = "Inactive",
    joinDate,
    lastLogin = null ) {
    super (id, eid, firstName, lastName, email, department, role, position, salary, managerId, joinDate)
    this.username = username;
    this.password = password;
    this.tempPassword = tempPassword;   
    this.mustChangePassword = mustChangePassword;
    this.status = status; // "Inactive" by default
    this.lastLogin = lastLogin;
  }
}
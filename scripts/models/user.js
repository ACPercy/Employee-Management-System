import { Employee } from "./employee.js";

// User Class 
export class User extends Employee {
  constructor(
    id, 
    eid, 
    firstname, 
    lastname, 
    email, 
    department, 
    position, 
    role, 
    salary, 
    username, 
    password = null, 
    tempPassword = null, 
    mustChangePassword = false, 
    status = "Inactive") {
    super (id, eid, firstname, lastname, email, department, position, role, salary)
    this.username = username;
    this.password = password;
    this.tempPassword = tempPassword;
    this.password = null;    
    this.mustChangePassword = mustChangePassword;
    this.status = status; // "Inactive" by default
  }
}
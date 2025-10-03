// Employee Class 
export class Employee  {
  constructor(id, eid, firstName, lastName, email, department, role, position, salary, managerId = null, joinDate = null) {
    this.id = id;
    this.eid = eid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.department = department;
    this.role = role;
    this.position = position;
    this.salary = salary;
    this.managerId = managerId;
    this.joinDate = joinDate || new Date().toISOString().split("T")[0];
  }
}
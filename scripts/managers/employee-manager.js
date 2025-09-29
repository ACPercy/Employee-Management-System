import { Employee } from "../models/employee.js";
import { BaseManager } from "./base-manager.js";

export class EmployeeManager extends BaseManager {
  constructor() {
    super("employees"); // storage key for localStorage
  }

  // Add employee (specialized for Employee objects)
  addEmployee(eid, firstName, lastName, email, department, position, role, salary, fixedId = null) {
    const employees = this.getAll();

    let id;
    if (fixedId !== null) {
      // Use fixed ID for admin
      id = fixedId;
    } else {
      // Normal employees start from 2
      id = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 2;
    }

    // If no EID provided, auto-generate
    let finalEid = eid;
    if (!eid) {
      finalEid = this.generateEID(firstname);
    }

    const newEmployee = {
      id: Number(id),
      eid: finalEid,
      firstName,
      lastName,
      email,
      department,
      position,
      role,
      salary
    };

    employees.push(newEmployee);
    this.saveData(employees);
  }


  // Auto-generate EID based on first name initial + number
  generateEID(firstName) {
    const initial = firstName.charAt(0).toUpperCase();
    const existing = this.getAll();

    // If initial is A, skip A001 because it's reserved for admin
    const sameInitial = existing.filter(emp => emp.eid && emp.eid.startsWith(initial));

    let maxNumber = 0;
    sameInitial.forEach(emp => {
      const num = parseInt(emp.eid.slice(1));
      if (!isNaN(num) && num > maxNumber) maxNumber = num;
    });

    let nextNumber = maxNumber + 1;

    // Special case: Admin already occupies A001
    if (initial === "A" && nextNumber === 1) {
      nextNumber = 2;
    }

    return `${initial}${String(nextNumber).padStart(3, "0")}`;
  }

  updateEmployee(id, updatedData) {
    const employees = this.getAll();
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) return;

    employees[index] = { ...employees[index], ...updatedData };
    this.saveData(employees);
  }

  deleteEmployee(id) {
    const employees = this.getAll().filter(emp => Number(emp.id) !== Number(id));
    console.log("Deleting ID:", id, "New list:", employees);
    this.saveData(employees);
  }

  getById(id) {
    const employees = this.getAll();
    return employees.find(emp => Number(emp.id) === Number(id));
  }
}
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'age', 'dob', 'email', 'salary', 'address', 'contactNumber', 'actions'];
  dataSource = new MatTableDataSource<Employee>();
  showForm = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe((data: Employee[]) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteEmployee(id: number) {
    this.dataSource.data = this.dataSource.data.filter(emp => emp.id !== id);
  }

  addEmployee(employee: Employee) {
    this.dataSource.data = [...this.dataSource.data, employee];
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const newEmployee: Employee = {
        id: this.dataSource.data.length > 0 ? Math.max(...this.dataSource.data.map(emp => emp.id)) + 1 : 1,
        ...form.value
      };
      this.addEmployee(newEmployee);
      form.resetForm();
      this.showForm = false; // Hide the form after submission
    }
  }
}

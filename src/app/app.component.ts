import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {FireBaseService, IEmployee} from './services/fire-base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public form: FormGroup;

  public employeeList: IEmployee[] = [];
  public employeeDetails: IEmployee;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private fireBaseService: FireBaseService
  ) {
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.fireBaseService.getEmployees().subscribe((res) => {
      this.employeeList = res.map((employee) => {
        return {
          id: employee.payload.doc.id,
          ...employee.payload.doc.data() as {}
        } as IEmployee;
      });
    });
  }

  openModal(content: TemplateRef<any>, employeeId: string): void {
    this.employeeDetails = this.employeeList.find((employee: IEmployee) => employee.id === employeeId);

    this.formInit(this.employeeDetails);
    this.modalService.open(content, {backdrop: 'static', centered: true});
  }

  formInit(data: IEmployee): void {
    this.form = this.fb.group({
      name: [data ? data.name : '', Validators.required],
      number: [data ? data.number : '', Validators.required],
      email: [data ? data.email : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ])
      ]
    });
  }

  addEmployee(): void {
    this.fireBaseService.addEmployee(this.form.value).then();
  }

  updateEmployee(employeeId: string): void {
    this.fireBaseService.updateEmployee(employeeId, this.form.value).then();
  }

  deleteEmployee(employeeId: string): void {
    this.fireBaseService.deleteEmployee(employeeId).then();
  }

}

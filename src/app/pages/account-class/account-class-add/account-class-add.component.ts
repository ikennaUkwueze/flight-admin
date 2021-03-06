import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountClasses, Staffs } from '../../../providers';
import {ApiResponse, SelectOption, AccountClass, Staff } from '../../../models';

@Component({
  selector: 'app-account-class-add',
  templateUrl: './account-class-add.component.html',
  styleUrls: ['./account-class-add.component.scss']
})
export class AccountClassAddComponent implements OnInit {

  @Input() currentForm: string;
  @Input() record: AccountClass | null;
  @Input() formType: string;
  @Input() staffRecords: Array<Staff>;
  prevStaffRecords: Array<Staff>;
  prevRecords: AccountClass | null;
  staffOptions: Array<SelectOption>;
  loading = false;
  addForm: FormGroup;
  

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private accountClasses: AccountClasses,
              private staffs: Staffs,
              private toastr: ToastrService,
               ) {
      this.createForm();
      this.getStaffs();
  }

  ngOnInit() {
  }

  createForm() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      functions: [''],
      hierarchy: [''],
      accountClass_type: [''],
      subsidiary: [''],
      head: [''],
      assistant: [''],
    });
  }

  // ====================  All Methods to load external links for Object IDs  ======================= //
  // get accountClasses for the select box
  getStaffs() {
    this.staffs.recordRetrieve().then(data => {
      if (data.success) {
        this.staffOptions = data.payload.map(item => ({id: item.id, text: `${item.surname} ${item.given_name}`}));
        console.log('List of staffs  ================ \n' + JSON.stringify(this.staffOptions) );
      } else {
        this.showNotification('Could not retrieve staffs');
        console.log(data.message);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    const payload = this.addForm.value;
    console.log(payload);
    if (this.addForm.invalid) {
      this.showNotification('Invalid form! Please fill all the required* inputs.');
      this.loading = false;
      return;
    }
    try {
      console.log(payload);
      this.accountClasses.recordCreate(payload).then((res: ApiResponse) => {
          console.log(res);
        if (res.success) {
        } else {
          this.showNotification(res.message);
        }
      }, (err) => this.showNotification(err.message));
    } catch (error) {
      this.showNotification(error.message);
    }
    this.loading = false;
    return;
  }


  showNotification(message) {
    this.toastr.show(message, 'Adding Record', {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: 'alert alert-primary alert-with-icon',
      });
    }

}

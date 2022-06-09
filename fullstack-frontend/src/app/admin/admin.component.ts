import { Component } from '@angular/core';
import { WebService } from '../web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  adminForm;
  adminSearchForm;
  uid;

  constructor(private webService: WebService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService) { }

  ngOnInit() {

    //initialise form builder for add admin
    this.adminForm = this.formBuilder.group({
      email: ['', Validators.required],
      superAdmin: ['', Validators.required],

    });

    this.adminSearchForm = this.formBuilder.group({
      search: ['', Validators.required],

    });
    this.webService.getUsers();

  }
  //calls add user in webservice
  onSubmit() {
    this.webService.addUser(this.adminForm.value);
    this.adminForm.reset();

  }
  //passes search data for querying
  onSearch() {
    this.webService.getAdminSearch(this.adminSearchForm.value.search);
    this.adminForm.reset();
  }
  //resets the current search
  reset() {
    this.adminForm.reset();
    this.ngOnInit();
  }
  //passes id of user to delete to the confirm delete modal
  passDeleteData(user) {
    this.uid = user._id

  }
  //when users clicks yes onDelete will return 1 which will procees with deleteing the user
  onDelete(confirm) {


    if (confirm == 1) {

      this.webService.deleteUser(this.uid);

    }
  }

  //validation methods
  isAddInvalid(control) {
    return this.adminForm.controls[control].invalid &&
      this.adminForm.controls[control].touched;
  }

  isAddUnTouched() {
    return this.adminForm.controls.email.pristine ||
      this.adminForm.controls.superAdmin.pristine;

  }
  isAddIncomplete() {
    return this.isAddInvalid('email') ||
      this.isAddInvalid('superAdmin')
    this.isAddUnTouched();

  }
}
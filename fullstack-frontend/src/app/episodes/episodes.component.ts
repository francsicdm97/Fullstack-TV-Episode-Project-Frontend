import { Component } from '@angular/core';
import { WebService } from '../web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

declare var $: any;
@Component({
  selector: 'episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.css']
})

export class EpisodesComponent {


  constructor(private webService: WebService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService) { }

  episodeForm;
  editEpisodeForm;
  sortForm;
  episodeID;
  pageAmount = [];

  ngOnInit() {

    //gets page data stored in session storage so pagination remembers the last page a user visited
    if (sessionStorage.page) {
      this.page = sessionStorage.page;
    }
    //initialise form builder for add episode
    this.episodeForm = this.formBuilder.group({
      url: ['', Validators.required],
      name: ['', Validators.required],
      season: ['', Validators.required],
      number: ['', Validators.required],
      airdate: ['', Validators.required],
      airtime: ['', Validators.required],
      airstamp: ['', Validators.required],
      runtime: ['', Validators.required],
      image: 'http://static.tvmaze.com/uploads/images/original_untouched/70/175852.jpg',
      summary: ['', Validators.required],
      _links: ['', Validators.required],

    });

    //initialise form builder for edit episode
    this.editEpisodeForm = this.formBuilder.group({
      editUrl: ['', Validators.required],
      editName: ['', Validators.required],
      editSeason: ['', Validators.required],
      editNumber: ['', Validators.required],
      editAirdate: ['', Validators.required],
      editAirtime: ['', Validators.required],
      editAirstamp: ['', Validators.required],
      editRuntime: ['', Validators.required],
      editImage: 'http://static.tvmaze.com/uploads/images/original_untouched/70/175852.jpg',
      editSummary: ['', Validators.required],
      edit_links: ['', Validators.required],

    });

    //initialise form builder for sort field
    this.sortForm = this.formBuilder.group({
      sortField: 1,
      sort: 1,
    });

    //update pagination
    this.genPagination();
    this.webService.getEpisodes(this.page, this.sortForm.value.sortField, this.sortForm.value.sort);
    this.webService.getUsers();
  }

  //passes episode data into the edit modal and pre populates it for the user to edit
  passEditData(episodeData) {
    this.episodeID = episodeData._id
    this.editEpisodeForm.controls.editUrl.setValue(episodeData.url);
    this.editEpisodeForm.controls.editName.setValue(episodeData.name);
    this.editEpisodeForm.controls.editSeason.setValue(episodeData.season);
    this.editEpisodeForm.controls.editNumber.setValue(episodeData.number);
    this.editEpisodeForm.controls.editAirdate.setValue(episodeData.airdate);
    this.editEpisodeForm.controls.editAirstamp.setValue(episodeData.airstamp);
    this.editEpisodeForm.controls.editAirtime.setValue(episodeData.airtime);
    this.editEpisodeForm.controls.editRuntime.setValue(episodeData.runtime);
    this.editEpisodeForm.controls.editImage.setValue(episodeData.image);
    this.editEpisodeForm.controls.editSummary.setValue(episodeData.summary);
    this.editEpisodeForm.controls.edit_links.setValue(episodeData._links);
  }

  //method to edit an episode
  onEdit() {

    this.webService.editEpisode(this.editEpisodeForm.value, this.page, this.sortForm.value.sortField, this.sortForm.value.sort, this.episodeID);
    this.editEpisodeForm.reset();

  }

  //method that takes parameters for the search function to work currently the ratings are not where they need to be.
  onSort(sort) {

    this.webService.getEpisodes(this.page, this.sortForm.value.sortField, this.sortForm.value.sort);
    this.webService.getUsers();

  }

  //method to add an episode
  onSubmit() {
    this.webService.addEpisode(this.episodeForm.value, this.page, this.sortForm.value.sortField, this.sortForm.value.sort);
    this.episodeForm.reset();
    this.genPagination();

  }

  //when the user clicks on the delete button and clicks yes on the modal the episode will be deleted
  onDelete(confirm) {
    if (confirm == 1) {

      this.webService.deleteEpisode(this.episodeID, this.page, this.sortForm.value.sortField, this.sortForm.value.sort);
      this.genPagination();
    }

  }

  page = 1; //variable to initialise pagination

  //generates the page amount on the pagination
  genPagination() {

    this.webService.getCountEpisodes().
      subscribe(
        (response: any) => {
          const pn = Math.ceil(response.count / 6);
          this.pageAmount = Array(pn);
        })
  }

  //method for pagination for when the user clicks on next
  nextPage() {
    if (this.page === this.pageAmount.length) {
      return;
    }
    this.page = Number(this.page) + 1;
    sessionStorage.page = Number(this.page);
    this.webService.getEpisodes(this.page, this.sortForm.value.sortField, this.sortForm.value.sort);
    this.webService.getUsers();
  }

  //method for pagination for when the user clicks on a page number
  goToPage(page) {
    this.page = Number(page);
    sessionStorage.page = Number(this.page);
    this.webService.getEpisodes(this.page, this.sortForm.value.sortField, this.sortForm.value.sort);
    this.webService.getUsers();
  }

  //method for pagination for when the user clicks on previous
  previousPage() {
    if (this.page > 1) {
      this.page = Number(this.page) - 1;
      sessionStorage.page = Number(this.page);
      this.webService.getEpisodes(this.page, this.sortForm.value.sortField, this.sortForm.value.sort);
      this.webService.getUsers();
    }
  }

  //validation methods
  isAddInvalid(control) {
    return this.episodeForm.controls[control].invalid &&
      this.episodeForm.controls[control].touched;
  }

  isAddUnTouched() {
    return this.episodeForm.controls._links.pristine ||
      this.episodeForm.controls.airdate.pristine ||
      this.episodeForm.controls.airstamp.pristine ||
      this.episodeForm.controls.airtime.pristine ||
      this.episodeForm.controls.name.pristine ||
      this.episodeForm.controls.number.pristine ||
      this.episodeForm.controls.runtime.pristine ||
      this.episodeForm.controls.season.pristine ||
      this.episodeForm.controls.summary.pristine ||
      this.episodeForm.controls.url.pristine;

  }

  isAddIncomplete() {
    return this.isAddInvalid('_links') ||
      this.isAddInvalid('airdate') ||
      this.isAddInvalid('airstamp') ||
      this.isAddInvalid('airtime') ||
      this.isAddInvalid('name') ||
      this.isAddInvalid('number') ||
      this.isAddInvalid('runtime') ||
      this.isAddInvalid('season') ||
      this.isAddInvalid('summary') ||
      this.isAddInvalid('url') ||
      this.isAddUnTouched();

  }
}
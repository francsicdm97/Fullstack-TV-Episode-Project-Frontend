import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { WebService } from '../web.service';
import { FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  email;
  episodeID;
  rid;
  editReviewForm;

  constructor(public auth: AuthService, private webService: WebService,
    private formBuilder: FormBuilder,
    route: ActivatedRoute) { }

  ngOnInit() {

    //get list of current user reviews
    this.getUserReviews();
    //initialise form builder for edit review
    this.editReviewForm = this.formBuilder.group({

      editComment: ['', Validators.required],
      editStars: ['', Validators.required],
      editActingRating: ['', Validators.required],
      editMusicRating: ['', Validators.required],
      editStoryRating: ['', Validators.required],

    });

    //get list of users
    this.webService.getUsers();

  }

  //pass edit data to edit form to populate fields
  passEditData(reviewData) {
    this.rid = reviewData._id;
    console.log('this ris' + this.rid);
    this.editReviewForm.controls.editComment.setValue(reviewData.comment);
    this.editReviewForm.controls.editStars.setValue(reviewData.stars);
    this.editReviewForm.controls.editActingRating.setValue(reviewData.actingRating);
    this.editReviewForm.controls.editMusicRating.setValue(reviewData.musicRating);
    this.editReviewForm.controls.editStoryRating.setValue(reviewData.storyRating);
  }

  //gets the current user logged in and calls user get reviews from webservice
  getUserReviews() {

    this.auth.getUser$().subscribe(response => {
      this.email = response.email;
      this.webService.getUserReviews(this.email)
      console.log('ngonit' + this.email)

    });

  }

  //method to edit review
  onEdit() {

    this.webService.editUserReview(this.editReviewForm.value, this.rid);

  }

  //passes delete data to confirm modal
  passDeleteData(reviewData) {
    console.log(reviewData.episodeID)
    this.episodeID = reviewData.episodeID;
    this.rid = reviewData._id;

  }

  //if yes click on confirm window then delete review
  onDelete(confirm) {
    if (confirm == 1) {

      this.webService.deleteUserReview(this.episodeID, this.rid);

    }
  }
}










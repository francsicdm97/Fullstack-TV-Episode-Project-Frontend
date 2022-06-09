import { Component } from '@angular/core';
import { WebService } from '../web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ControlContainer, EmailValidator } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'episode',
    templateUrl: './episode.component.html',
    styleUrls: ['./episode.component.css']
})
export class EpisodeComponent {

    reviewForm;
    editReviewForm;
    rid;
    episodeID;

    constructor(private webService: WebService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private auth: AuthService) { }

    ngOnInit() {
        //initialise form builder for add review
        this.reviewForm = this.formBuilder.group({

            comment: ['', Validators.required],
            stars: ['', Validators.required],
            actingRating: ['', Validators.required],
            musicRating: ['', Validators.required],
            storyRating: ['', Validators.required],
        });
        //initialise form builder for edit review
        this.editReviewForm = this.formBuilder.group({

            editComment: ['', Validators.required],
            editStars: ['', Validators.required],
            editActingRating: ['', Validators.required],
            editMusicRating: ['', Validators.required],
            editStoryRating: ['', Validators.required],

        });

        //get lists from webservie
        this.webService.getEpisode(this.route.snapshot.params.id);
        this.webService.getReviews(this.route.snapshot.params.id);
        this.webService.getUsers();
        this.episodeID = this.route.snapshot.params.id;

    }

    //method to pass data of a review into the edit review modal and populate the fields so the user can make changes
    passEditData(reviewData) {

        this.rid = reviewData._id
        this.editReviewForm.controls.editComment.setValue(reviewData.comment);
        this.editReviewForm.controls.editStars.setValue(reviewData.stars);
        this.editReviewForm.controls.editActingRating.setValue(reviewData.actingRating);
        this.editReviewForm.controls.editMusicRating.setValue(reviewData.musicRating);
        this.editReviewForm.controls.editStoryRating.setValue(reviewData.storyRating);
    }

    //method to edit a review
    onEdit() {
        this.webService.editReview(this.editReviewForm.value, this.rid);



    }

    //method to create a new review, the users email is passed through from the current user logged in
    onSubmit(userEmail) {
        this.webService.postReview(this.reviewForm.value, userEmail, this.episodeID);
        this.reviewForm.reset();


    }

    //passes delete data into confirm delete modal
    passDeleteData(episodeData, reviewData) {
        this.episodeID = episodeData._id;
        this.rid = reviewData._id;

    }

    //receives data from passDeleteData and deletes review if "yes" is selected
    onDelete(confirm) {
        if (confirm == 1) {

            this.webService.deleteReview(this.episodeID, this.rid);

        }
    }

    //validation methods
    isAddInvalid(control) {
        return this.reviewForm.controls[control].invalid &&
            this.reviewForm.controls[control].touched;
    }

    isAddUnTouched() {
        return this.reviewForm.controls.comment.pristine ||
            this.reviewForm.controls.stars.pristine ||
            this.reviewForm.controls.actingRating.pristine ||
            this.reviewForm.controls.musicRating.pristine ||
            this.reviewForm.controls.storyRating.pristine;

    }

    isAddIncomplete() {
        return this.isAddInvalid('comment') ||
            this.isAddInvalid('stars') ||
            this.isAddInvalid('actingRating') ||
            this.isAddInvalid('musicRating') ||
            this.isAddInvalid('storyRating') ||
            this.isAddUnTouched();

    }
   

}
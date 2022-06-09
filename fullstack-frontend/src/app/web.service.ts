import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable()
export class WebService {

    //Subjects declared
    private episodes_private_list;
    episodesSubject = new Subject();
    episodes_list = this.episodesSubject.asObservable();

    private episode_private_list;
    episodeSubject = new Subject();
    episode_list = this.episodeSubject.asObservable();

    private season_private_list;
    seasonSubject = new Subject();
    season_list = this.seasonSubject.asObservable();

    private reviews_private_list;
    reviewsSubject = new Subject();
    reviews_list = this.reviewsSubject.asObservable();

    private user_private_list;
    userSubject = new Subject();
    user_list = this.userSubject.asObservable();

    private user_review_private_list;
    user_reviewSubject = new Subject();
    user_review_list = this.user_reviewSubject.asObservable();

    episodeID;
    reviewID;
    email;

    constructor(private http: HttpClient,
        private auth: AuthService) { }

    //method to get all episodes, parameters passed to back end for sort function    
    getEpisodes(page, sort, order) {

        return this.http.get('http://localhost:5000/api/v1.0/episodes/' + sort + '/' + order + '?pn=' + page)
            .subscribe(response => {
                this.episodes_private_list = response;
                this.episodesSubject.next(this.episodes_private_list);



            })
    }

    //method to get one episode, parameters passed to back end for one episode  
    getEpisode(id) {
        return this.http.get(
            'http://localhost:5000/api/v1.0/episodes/' + id)
            .subscribe(response => {
                this.episode_private_list = [response];
                this.episodeSubject.next(this.episode_private_list);
                this.episodeID = id;

            })
    }

    //method to get all episodes where parameters season apply, season is passed to back end
    getEpisodeSeason(season) {
        return this.http.get('http://localhost:5000/api/v1.0/episodes' + season)
            .subscribe(response => {
                this.season_private_list = response;
                this.seasonSubject.next(this.season_private_list);

            })
    }

    //method to count episodes for pagination numbers
    getCountEpisodes() {
        return this.http.get(
            'http://localhost:5000/api/v1.0/episodes/count')

    }

    //method to add an episodes, parameters passed to back end for one episode to be created and to reload the current episode page
    addEpisode(episode, page, sort, order) {
        let postData = new FormData();
        postData.append("url", episode.url);
        postData.append("name", episode.name);
        postData.append("season", episode.season);
        postData.append("number", episode.number);
        postData.append("airdate", episode.airdate);
        postData.append("airtime", episode.airtime);
        postData.append("airstamp", episode.airstamp);
        postData.append("runtime", episode.runtime);
        postData.append("image", episode.image);
        postData.append("summary", episode.summary);
        postData.append("_links", episode._links);

        this.http.post(
            'http://localhost:5000/api/v1.0/episodes',
            postData).subscribe(
                response => {
                    this.getEpisodes(page, sort, order);
                    this.getUsers();

                });

    }

    //method to edit one episodes, parameters passed to back end for one episode to be updated and to reload the current episode page
    editEpisode(episode, page, sort, order, eid) {
        let putData = new FormData();
        putData.append("url", episode.editUrl);
        putData.append("name", episode.editName);
        putData.append("season", episode.editSeason);
        putData.append("number", episode.editNumber);
        putData.append("airdate", episode.editAirdate);
        putData.append("airtime", episode.editAirtime);
        putData.append("airstamp", episode.editAirstamp);
        putData.append("runtime", episode.editRuntime);
        putData.append("image", episode.editImage);
        putData.append("summary", episode.editSummary);
        putData.append("_links", episode.edit_links);


        this.http.put(
            'http://localhost:5000/api/v1.0/episodes/' +
            eid,
            putData).subscribe(
                response => {
                    this.getEpisodes(page, sort, order);
                    this.getUsers();
                });

    }

    //method to delete one episodes, parameters passed to back end for one episode to be deleted and to reload the current episode page
    deleteEpisode(eid, page, sort, order) {

        this.http.delete(
            'http://localhost:5000/api/v1.0/episodes/' +
            eid
        ).subscribe(
            response => {
                this.getEpisodes(page, sort, order);
                this.getUsers();
            });

    }

    //method to get all reviews for an episode which is determined by the id parameter
    getReviews(id) {
        return this.http.get(
            'http://localhost:5000/api/v1.0/episodes/' + id +
            '/reviews')
            .subscribe(
                response => {
                    this.reviews_private_list = response;
                    this.reviewsSubject.next(this.reviews_private_list);
                }
            )
    }


    //method to add a review for an episode which is determined by the id parameter
    postReview(review, userEmail, eid) {
        let postData = new FormData();
        postData.append("username", userEmail);
        postData.append("episodeID", eid);
        postData.append("comment", review.comment);
        postData.append("stars", review.stars);
        postData.append("actingRating", review.actingRating);
        postData.append("musicRating", review.musicRating);
        postData.append("storyRating", review.storyRating);

        let today = new Date();
        let todayDate = today.getDate() + "-" + (today.getMonth() + 1) + '-' + today.getFullYear() + " at " +
            today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        postData.append("date", todayDate);

        this.http.post(
            'http://localhost:5000/api/v1.0/episodes/' +
            this.episodeID + '/reviews',
            postData).subscribe(
                response => {
                    this.getReviews(this.episodeID);
                    this.getUsers();
                });

    }

    //method to edit a reviews for an episode when the users is on an episode
    editReview(review, rid) {
        let putData = new FormData();
        putData.append("comment", review.editComment);
        putData.append("stars", review.editStars);
        putData.append("actingRating", review.editActingRating);
        putData.append("musicRating", review.editMusicRating);
        putData.append("storyRating", review.editStoryRating);


        let today = new Date();
        let todayDate = today.getDate() + "-" + (today.getMonth() + 1) + '-' + today.getFullYear() + " at " +
            today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        putData.append("date", todayDate);
        this.http.put(
            'http://localhost:5000/api/v1.0/episodes/' +
            this.episodeID + '/reviews/' + rid,
            putData).subscribe(
                response => {
                    this.getReviews(this.episodeID);
                    this.getUsers();
                });

    }

    //method to edit a reviews for an episode when the user edits via their profile page
    editUserReview(review, rid) {
        let putData = new FormData();


        putData.append("comment", review.editComment);
        putData.append("stars", review.editStars);
        putData.append("actingRating", review.editActingRating);
        putData.append("musicRating", review.editMusicRating);
        putData.append("storyRating", review.editStoryRating);


        let today = new Date();
        let todayDate = today.getDate() + "-" + (today.getMonth() + 1) + '-' + today.getFullYear() + " at " +
            today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        putData.append("date", todayDate);
        this.http.put(
            'http://localhost:5000/api/v1.0/episodes/' +
            this.episodeID + '/reviews/' + rid,
            putData).subscribe(
                response => {
                    this.auth.getUser$().subscribe(response => {
                        this.email = response.email;
                        this.getUserReviews(this.email)
                    });
                });

    }

    //method to delete a reviews for an episode when the users is on an episode
    deleteReview(eid, rid) {

        this.http.delete(
            'http://localhost:5000/api/v1.0/episodes/' +
            eid + '/reviews/' + rid
        ).subscribe(
            response => {
                this.getReviews(this.episodeID);
                this.getUsers();
            });

    }

    //method to delete a reviews for an episode when the user edits via their profile page
    deleteUserReview(eid, rid) {

        this.http.delete(
            'http://localhost:5000/api/v1.0/episodes/' +
            eid + '/reviews/' + rid
        ).subscribe(
            response => {
                this.auth.getUser$().subscribe(response => {
                    this.email = response.email;
                    this.getUserReviews(this.email)
                });
            });

    }

    //method to get reviews for a user defined in the parameter 
    getUserReviews(username) {
        return this.http.get('http://localhost:5000/api/v1.0/users/' + username + '/reviews')
            .subscribe(response => {
                this.user_review_private_list = response;
                this.user_reviewSubject.next(this.user_review_private_list);


            })
    }

    //method to get all users
    getUsers() {

        return this.http.get('http://localhost:5000/api/v1.0/users')
            .subscribe(response => {
                this.user_private_list = response;
                this.userSubject.next(this.user_private_list);
            })
    }

    //method to search the user list via email
    getAdminSearch(email) {
        return this.http.get('http://localhost:5000/api/v1.0/users' + email)
            .subscribe(response => {
                this.user_private_list = response;
                this.userSubject.next(this.user_private_list);

            })
    }

    //method to add new user
    addUser(user) {
        let postData = new FormData();
        postData.append("email", user.email);
        postData.append("superAdmin", user.superAdmin)

        this.http.post(
            'http://localhost:5000/api/v1.0/users',
            postData).subscribe(
                response => {
                    this.getUsers();
                });

    }

    //method to delete user
    deleteUser(uid) {

        this.http.delete(
            'http://localhost:5000/api/v1.0/users/' + uid
        ).subscribe(
            response => {
                this.getUsers();
            });

    }
}
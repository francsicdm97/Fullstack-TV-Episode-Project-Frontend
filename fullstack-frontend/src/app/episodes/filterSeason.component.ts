import { Component } from '@angular/core';
import { WebService } from '../web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'filterSeason',
  templateUrl: './filterSeason.component.html',
  styleUrls: ['./filterSeason.component.css']
})
export class filterSeasonComponent {

  seasonForm;

  constructor(private webService: WebService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService) { }

  ngOnInit() {
    //initialise filter by season form
    this.seasonForm = this.formBuilder.group({
      season: 1,

    });
    //get episodes based on season
    this.webService.getEpisodeSeason(this.seasonForm.value.season);

  }

  //search method to search admin
  onSeasonSearch() {
    this.webService.getEpisodeSeason(this.seasonForm.value.season);
  }
}
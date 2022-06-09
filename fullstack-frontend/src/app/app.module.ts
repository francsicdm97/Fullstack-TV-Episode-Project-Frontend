import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EpisodesComponent } from './episodes/episodes.component';
import { EpisodeComponent } from './episodes/episode.component';
import{FormsModule, ReactiveFormsModule}from '@angular/forms';
import{AuthService} from "./auth/auth.service" 
import { NavComponent } from './nav.component';
import { JwPaginationComponent } from 'jw-angular-pagination';
import {filterSeasonComponent} from './episodes/filterSeason.component';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth/auth.guard';
var routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'episodes',
    component: EpisodesComponent,
    
  },
  {
    path: 'filter',
    component: filterSeasonComponent,
    
  },
  {
    path: 'episodes/:id',
    component: EpisodeComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard] //if an unauthorised user trys to go to this link they will be asked to log in

  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard] //if an unauthorised user trys to go to this link they will be asked to log in

  }
];


@NgModule({
  declarations: [
    AppComponent, EpisodesComponent, HomeComponent, EpisodeComponent,
    NavComponent,  JwPaginationComponent,  filterSeasonComponent, ProfileComponent, AdminComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    RouterModule.forRoot(routes), FormsModule, ReactiveFormsModule,
    ConfirmationPopoverModule.forRoot({confirmButtonType:'danger'})
    
  ],
  providers: [WebService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

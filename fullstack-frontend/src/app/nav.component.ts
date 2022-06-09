import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { WebService } from './web.service';

@Component({
  selector: 'navigation',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  constructor(private webService: WebService,
    private authService: AuthService) { }

  ngOnInit() {

    //initialise user list
    this.webService.getUsers();
  }
}



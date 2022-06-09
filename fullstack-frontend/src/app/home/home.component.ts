import { Component } from '@angular/core';
import { WebService } from '../web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

    seasonForm;

    constructor(private webService: WebService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private sanitizer: DomSanitizer) { }

    season1: SafeResourceUrl;
    season2: SafeResourceUrl;
    season3: SafeResourceUrl;

    ngOnInit() {
        //displays embedded Youtube links for season trailers
        this.season1 = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/b9EkMc79ZSU");
        this.season2 = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/R1ZXOOLMJ8s");
        this.season3 = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/YEG3bmU_WaI");

    }

}
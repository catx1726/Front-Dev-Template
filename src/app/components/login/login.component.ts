import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() all;

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    console.log('login component noOninit!', this.all);
  }
}

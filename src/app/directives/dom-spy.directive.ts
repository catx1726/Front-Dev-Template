import { Directive } from '@angular/core';

@Directive({
  selector: '[appDomSpy]'
})
export class DomSpyDirective {
  constructor() {}

  ngOnInit() {
    console.log('Directive domSpy ngOnInit!');
  }

  ngOnDestroy() {
    console.log('Directive domSpy ngOnDestroy!');
  }
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScratchCardsPage } from './scratch-cards.page';

describe('ScratchCardsPage', () => {
  let component: ScratchCardsPage;
  let fixture: ComponentFixture<ScratchCardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScratchCardsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScratchCardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

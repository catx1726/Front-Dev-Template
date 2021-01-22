import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheckListPage } from './check-list.page';

describe('CheckListPage', () => {
  let component: CheckListPage;
  let fixture: ComponentFixture<CheckListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

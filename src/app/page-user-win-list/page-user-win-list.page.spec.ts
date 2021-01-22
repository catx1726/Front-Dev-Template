import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageUserWinListPage } from './page-user-win-list.page';

describe('PageUserWinListPage', () => {
  let component: PageUserWinListPage;
  let fixture: ComponentFixture<PageUserWinListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageUserWinListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageUserWinListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

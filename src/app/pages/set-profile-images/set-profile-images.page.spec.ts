import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetProfileImagesPage } from './set-profile-images.page';

describe('SetProfileImagesPage', () => {
  let component: SetProfileImagesPage;
  let fixture: ComponentFixture<SetProfileImagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetProfileImagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetProfileImagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PromptsPage } from './prompts.page';

describe('PromptsPage', () => {
  let component: PromptsPage;
  let fixture: ComponentFixture<PromptsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PromptsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

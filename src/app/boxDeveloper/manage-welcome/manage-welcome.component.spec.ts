import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWelcomeComponent } from './manage-welcome.component';

describe('ManageWelcomeComponent', () => {
  let component: ManageWelcomeComponent;
  let fixture: ComponentFixture<ManageWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageWelcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPaperComponent } from './all-paper.component';

describe('AllPaperComponent', () => {
  let component: AllPaperComponent;
  let fixture: ComponentFixture<AllPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPaperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

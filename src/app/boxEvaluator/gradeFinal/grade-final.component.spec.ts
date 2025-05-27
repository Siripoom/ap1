import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeFinalComponent } from './grade-final.component';

describe('GradeFinalComponent', () => {
  let component: GradeFinalComponent;
  let fixture: ComponentFixture<GradeFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeFinalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

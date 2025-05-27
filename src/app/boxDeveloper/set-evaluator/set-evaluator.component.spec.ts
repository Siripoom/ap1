import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetEvaluatorComponent } from './set-evaluator.component';

describe('SetEvaluatorComponent', () => {
  let component: SetEvaluatorComponent;
  let fixture: ComponentFixture<SetEvaluatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetEvaluatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetEvaluatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

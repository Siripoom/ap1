import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperEvaComponent } from './paper-eva.component';

describe('PaperEvaComponent', () => {
  let component: PaperEvaComponent;
  let fixture: ComponentFixture<PaperEvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperEvaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperEvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

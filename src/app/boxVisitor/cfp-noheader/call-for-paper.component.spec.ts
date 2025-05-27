import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CFP } from './call-for-paper.component';

describe('CFP', () => {
  let component: CFP;
  let fixture: ComponentFixture<CFP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CFP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CFP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

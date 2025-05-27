import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyContactComponent } from './only-contact.component';

describe('OnlyContactComponent', () => {
  let component: OnlyContactComponent;
  let fixture: ComponentFixture<OnlyContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlyContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlyContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactVisitorComponent } from './contact-visitor.component';

describe('ContactVisitorComponent', () => {
  let component: ContactVisitorComponent;
  let fixture: ComponentFixture<ContactVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactVisitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

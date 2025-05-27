import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMassageComponent } from './contact-massage.component';

describe('ContactMassageComponent', () => {
  let component: ContactMassageComponent;
  let fixture: ComponentFixture<ContactMassageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactMassageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactMassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

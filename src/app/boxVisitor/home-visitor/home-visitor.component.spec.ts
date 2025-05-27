import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVisitorComponent } from './home-visitor.component';

describe('HomeVisitorComponent', () => {
  let component: HomeVisitorComponent;
  let fixture: ComponentFixture<HomeVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeVisitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopOrderComponent } from './stop-order.component';

describe('StopOrderComponent', () => {
  let component: StopOrderComponent;
  let fixture: ComponentFixture<StopOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

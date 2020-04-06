import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitOrderComponent } from './limit-order.component';

describe('LimitOrderComponent', () => {
  let component: LimitOrderComponent;
  let fixture: ComponentFixture<LimitOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

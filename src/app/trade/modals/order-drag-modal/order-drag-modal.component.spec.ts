import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDragModalComponent } from './order-drag-modal.component';

describe('OrderDragModalComponent', () => {
  let component: OrderDragModalComponent;
  let fixture: ComponentFixture<OrderDragModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDragModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDragModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

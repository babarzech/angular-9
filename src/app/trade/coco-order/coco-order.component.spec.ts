import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CocoOrderComponent } from './coco-order.component';

describe('CocoOrderComponent', () => {
  let component: CocoOrderComponent;
  let fixture: ComponentFixture<CocoOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CocoOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CocoOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

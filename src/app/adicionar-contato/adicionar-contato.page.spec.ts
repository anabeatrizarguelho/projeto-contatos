import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdicionarContatoPage } from './adicionar-contato.page';

describe('AdicionarContatoPage', () => {
  let component: AdicionarContatoPage;
  let fixture: ComponentFixture<AdicionarContatoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarContatoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

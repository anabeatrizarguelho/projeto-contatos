import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarContatosPage } from './listar-contatos.page';

describe('ListarContatosPage', () => {
  let component: ListarContatosPage;
  let fixture: ComponentFixture<ListarContatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarContatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

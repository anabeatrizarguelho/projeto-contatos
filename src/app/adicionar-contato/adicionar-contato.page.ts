import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';
import { arrowBackOutline, trashOutline } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonItem, IonInput, IonList, ToastController, IonLabel } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { Firebase } from '../services/firebase.service';

@Component({
  selector: 'app-adicionar-contato',
  templateUrl: './adicionar-contato.page.html',
  styleUrls: ['./adicionar-contato.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon, RouterLink, IonInput, IonList, IonItem, IonLabel]
})
export class AdicionarContatoPage implements OnInit, OnDestroy, AfterViewInit {
  contato = {
    nome: '',
    email: ''
  };
  contatos: any[] = [];
  private contatosSub?: Subscription;

  constructor(
    private firebaseService: Firebase,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    addIcons({ arrowBackOutline, trashOutline });
  }

  async deletarContato(id: string) {
    try {
      await this.firebaseService.deleteContato(id);
      await this.presentToast('Contato excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      await this.presentToast('Erro ao excluir contato', 'danger');
    }
  }

  ngAfterViewInit() {
    this.subscribeContatos();
  }

  ngOnDestroy(): void {
    this.contatosSub?.unsubscribe();
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  async adicionarContato() {
    if (!this.contato.nome || !this.contato.email) {
      await this.presentToast('Por favor, preencha todos os campos', 'warning');
      return;
    }

    try {
      const result = await this.firebaseService.addContato(this.contato);
      if (result.success) {
        await this.presentToast('Contato adicionado com sucesso!');
        
        // Limpar o formulário
        this.contato = {
          nome: '',
          email: ''
        };
      } else {
        throw new Error('Falha ao adicionar contato');
      }
    } catch (error: any) {
      console.error('Erro ao adicionar contato:', error);
      let errorMessage = 'Erro ao adicionar contato. ';
      
      if (error.code) {
        switch(error.code) {
          case 'PERMISSION_DENIED':
            errorMessage += 'Sem permissão para adicionar.';
            break;
          case 'NETWORK_ERROR':
            errorMessage += 'Verifique sua conexão.';
            break;
          default:
            errorMessage += 'Tente novamente mais tarde.';
        }
      }
      
      await this.presentToast(errorMessage, 'danger');
    }
  }

  // Assina os contatos do Firestore para exibir em tempo real na mesma página
  private subscribeContatos() {
    this.contatosSub = this.firebaseService.getContatos().subscribe({
      next: (data) => {
        this.contatos = data || [];
      },
      error: (err) => console.error('Erro ao buscar contatos do Firebase:', err)
    });
  }

}

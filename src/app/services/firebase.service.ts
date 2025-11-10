import { Injectable } from '@angular/core';
import { Database, ref, push, remove, onValue, set, get } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Firebase {
  private dbPath = 'contatos';

  constructor(private database: Database) {
    this.initializeContactsNode();
  }

  private async initializeContactsNode() {
    const contatosRef = ref(this.database, this.dbPath);
    const snapshot = await get(contatosRef);
    if (!snapshot.exists()) {
      // Se não existir cria com um array vazio
      await set(contatosRef, {});
    }
  }

  // Método para adicionar um novo contato
  async addContato(contato: any) {
    try {
      const contatosRef = ref(this.database, this.dbPath);
  
      const contatoFormatado = {
        nome: contato.nome || '',
        email: contato.email || '',
        createdAt: new Date().toISOString()
      };
      
      const newContactRef = push(contatosRef);
      await set(newContactRef, contatoFormatado);
      return { success: true, id: newContactRef.key };
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
      throw error;
    }
  }

  // Método para listar todos os contatos
  getContatos(): Observable<any[]> {
    const contatosRef = ref(this.database, this.dbPath);
    return new Observable(observer => {
      const unsubscribe = onValue(contatosRef, (snapshot) => {
        try {
          const data = snapshot.val();
          const contatos = data ? Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })) : [];
          observer.next(contatos);
        } catch (error) {
          observer.error(error);
        }
      }, error => {
        console.error('Erro ao buscar contatos:', error);
        observer.error(error);
      });

      return () => unsubscribe();
    });
  }

  // Método para deletar um contato
  async deleteContato(id: string) {
    try {
      const contatoRef = ref(this.database, `${this.dbPath}/${id}`);
      await remove(contatoRef);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      throw error;
    }
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuario: any;

  constructor(private storage: Storage, private router: Router) {
    this.storage.create();
  }

  async isLoggedIn(): Promise<boolean> {
    this.usuario = await this.storage.get('usuario');
    return this.usuario !== null;
  }

  async getRole(): Promise<string> {
    if (!this.usuario) {
      this.usuario = await this.storage.get('usuario');
    }
    return this.usuario ? this.usuario.rol : null;
  }

  async getUsuario(): Promise<any> {
    if (!this.usuario) {
      this.usuario = await this.storage.get('usuario');
    }
    return this.usuario;
  }

  async logout() {
    await this.storage.remove('usuario');
    this.router.navigate(['/login']);
  }

  async isAdmin(): Promise<boolean> {
    const usuario = await this.getUsuario();
    return usuario && usuario.rol === 'admin';
  }
}

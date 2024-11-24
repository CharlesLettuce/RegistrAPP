import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  usuario: string;
  contrasena: string;
  email: string;

  constructor(private router: Router, private storage: Storage, private authService: AuthService) {
    this.usuario = '';
    this.contrasena = '';
    this.email = '';
    this.storage.create();
  }

  async login() {
    const usuarios = await fetch('http://localhost:3000/usuarios').then(res => res.json());
    const usuario = usuarios.find((u: Usuario) => u.usuario === this.usuario && u.contrasena === this.contrasena);

    if (usuario) {
      await this.storage.set('usuario', usuario);
      if (usuario.rol === 'alumno') {
        this.router.navigate(['/alumno']);
      } else if (usuario.rol === 'profesor') {
        this.router.navigate(['/profesor']);
      } else if (usuario.rol === 'admin') {
        this.router.navigate(['/admin']);
      }
    } else {
      alert('Credenciales incorrectas');
    }
  }

  async forgotPassword() {
    if (this.email) {
      alert('Correo de recuperación enviado');
    } else {
      alert('Por favor, ingresa tu correo electrónico');
    }
  }

  ngOnInit() {}
}

interface Usuario {
  id: number;
  usuario: string;
  contrasena: string;
  rol: string;
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  correo: string = '';
  codigo: string = '';
  nuevaContrasena: string = '';
  codigoEnviado: boolean = false;
  codigoVerificado: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  enviarCodigo() {
    // Simular el envío del código de verificación
    if (this.correo) {
      this.codigoEnviado = true;
      alert('Código de verificación enviado a tu correo electrónico');
    } else {
      alert('Por favor, ingresa tu correo electrónico');
    }
  }

  verificarCodigo() {
    // Verificar el código de verificación
    if (this.codigo === '111111') {
      this.codigoVerificado = true;
      alert('Código verificado correctamente');
    } else {
      alert('Código incorrecto');
    }
  }

  async cambiarContrasena() {
    if (this.nuevaContrasena) {
      // Actualizar la contraseña en la base de datos
      const usuarios = await fetch('http://localhost:3000/usuarios').then(res => res.json());
      const usuario = usuarios.find((u: any) => u.correo === this.correo);

      if (usuario) {
        usuario.contrasena = this.nuevaContrasena;
        await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario)
        });
        alert('Contraseña cambiada correctamente');
        this.router.navigate(['/login']);
      } else {
        alert('Usuario no encontrado');
      }
    } else {
      alert('Por favor, ingresa tu nueva contraseña');
    }
  }
}
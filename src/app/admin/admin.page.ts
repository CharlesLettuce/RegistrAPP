import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  usuarios: any[] = [];
  clases: any[] = [];
  nuevoUsuario: any = { usuario: '', contrasena: '', rol: '', asignaturas: ['']  };
  nuevaClase: any = { descripcion: '', asignatura: '', observaciones: '' };

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.cargarUsuarios();
    await this.cargarClases();
  }

  async cargarUsuarios() {
    this.usuarios = await fetch('http://localhost:3000/usuarios').then(res => res.json());
  }

  async cargarClases() {
    this.clases = await fetch('http://localhost:3000/clases').then(res => res.json());
  }

  async crearUsuario() {
    if (this.nuevoUsuario.rol === 'profesor') {
      this.nuevoUsuario.asignaturas = this.nuevoUsuario.asignaturas.filter((asignatura: string) => asignatura.trim() !== '');
    }
    await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.nuevoUsuario)
    });
    await this.cargarUsuarios();
  }

  async eliminarUsuario(id: string) {
    await fetch(`http://localhost:3000/usuarios/${id}`, { method: 'DELETE' });
    await this.cargarUsuarios();
  }

  async crearClase() {
    const profesor = await this.authService.getUsuario();
    const clase = { ...this.nuevaClase, profesor, fecha: new Date().toISOString() };
    await fetch('http://localhost:3000/clases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clase)
    });
    await this.cargarClases();
  }

  async eliminarClase(id: number) {
    await fetch(`http://localhost:3000/clases/${id}`, { method: 'DELETE' });
    await this.cargarClases();
  }
  agregarAsignatura() {
    this.nuevoUsuario.asignaturas.push('');
  }
  eliminarAsignatura(index: number) {
    this.nuevoUsuario.asignaturas.splice(index, 1);
  }
  logout() {
    this.authService.logout();
  }
}
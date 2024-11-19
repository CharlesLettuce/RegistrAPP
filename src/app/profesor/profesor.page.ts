import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage-angular";
import { toDataURL } from "qrcode";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-profesor",
  templateUrl: "./profesor.page.html",
  styleUrls: ["./profesor.page.scss"],
})
export class ProfesorPage implements OnInit {
  qrCodeData: string = "";
  qrCodeImage: string = "";
  descripcionClase: string = "";
  asignatura: string = "";
  observaciones: string = "";
  clasesAnteriores: any[] = [];
  asignaturas: string[] = [];

  constructor(
    private router: Router,
    private storage: Storage,
    private authService: AuthService,
  ) {
    this.storage.create();
  }

  async generarQR() {
    const clase = {
      id: Date.now(),
      profesor: await this.storage.get("usuario"),
      fecha: new Date().toISOString(),
      descripcion: this.descripcionClase,
      asignatura: this.asignatura,
      observaciones: this.observaciones,
    };

    await fetch("http://localhost:3000/clases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clase),
    });

    this.qrCodeData = JSON.stringify(clase);
    this.qrCodeImage = await toDataURL(this.qrCodeData);
    this.loadClasesAnteriores();
  }

  async loadClasesAnteriores() {
    const usuario = await this.storage.get("usuario");
    const response = await fetch(
      `http://localhost:3000/clases?profesor.id=${usuario.id}`,
    );
    this.clasesAnteriores = await response.json();
  }

  async loadAsignaturas() {
    const usuario = await this.storage.get("usuario");
    this.asignaturas = usuario.asignaturas;
  }

  logout() {
    this.authService.logout();
  }

  async ngOnInit() {
    await this.loadClasesAnteriores();
    await this.loadAsignaturas();
  }
}
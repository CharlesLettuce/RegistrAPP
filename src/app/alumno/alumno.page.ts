import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AuthService } from '../auth.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  usuario: any;

  constructor(
    private qrScanner: QRScanner,
    private authService: AuthService,
    private storage: Storage,
    private router: Router
  ) {
    this.storage.create();
  }

  async ngOnInit() {
    this.usuario = await this.authService.getUsuario();
  }

  scanQR() {
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        let scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
          console.log('Scanned something', text);
          this.qrScanner.hide(); // esconde la camara
          scanSub.unsubscribe(); // deja de escanear

          // Parse the scanned QR code data
          const clase = JSON.parse(text);

          // Fetch the class data from the server
          const response = await fetch(`http://localhost:3000/clases/${clase.id}`);
          const claseData = await response.json();

          // Add the student to the attendance list
          if (!claseData.asistentes) {
            claseData.asistentes = [];
          }
          claseData.asistentes.push(this.usuario);

          // Update the class data on the server
          await fetch(`http://localhost:3000/clases/${clase.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(claseData),
          });

          alert('Asistencia registrada');
        });
        this.qrScanner.show();
      } else if (status.denied) { // denegaron la camara
        this.qrScanner.openSettings();
      } else { // por si fue denegada la camara pero no permanentemente
      }
    }).catch((e: any) => console.log('Error is', e));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
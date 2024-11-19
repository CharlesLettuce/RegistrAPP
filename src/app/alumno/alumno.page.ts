import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})

export class AlumnoPage implements OnInit {
  usuario: any;

  constructor(private qrScanner: QRScanner, private authService: AuthService) {}

  async ngOnInit() {
    this.usuario = await this.authService.getUsuario();
  }

  scanQR() {
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          this.qrScanner.hide(); // esconde la camara
          scanSub.unsubscribe(); // deja de escanear
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
  }
}
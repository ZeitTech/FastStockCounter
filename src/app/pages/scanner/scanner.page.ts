import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { ItemData } from 'src/app/models/ItemData.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {

  lstItems: ItemData[] = [];

  slideOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(private itemService: StorageService,
              private barcodeCtrl: BarcodeScanner,
              private alertCtrl: AlertController,
              private navCtrl: NavController,
              private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  loadItems() {
    this.lstItems = [];
    this.itemService.getItems().then( data => {
      if(data) {
        let items = JSON.parse(data);
        items.forEach( item => {
          let data: ItemData = new ItemData();
          data.name = item.name;
          data.code = item.code;
          data.barcode = item.barcode;
          data.uofM = item.uofM;
          data.quantity = item.quantity;      
          this.lstItems.push(data);
        }); 
      }
    });
  }

  scan() {

    this.barcodeCtrl.scan().then( data => {
      let foundItem = this.lstItems.find( x => x.barcode === data.text);
      console.log(foundItem);
      if(!foundItem) {
        this.addItemAlert(data.text);
      } else {
        this.updateItemAlert(foundItem);
      }
    }).catch( err => { console.log(err); });

  }

  async addItemAlert(barcode: string) {
    const alert = await this.alertCtrl.create({
      header: 'Add item?',
      message: `Item with barcode ${ barcode } do not exist, do you want to add it?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Add',
          handler: () => {
            this.navCtrl.navigateForward('/tabs/inventory/addItem');
          }
        }
      ]
    });
    alert.present();
  }

  async updateItemAlert(item: ItemData) {
    let idx = this.lstItems.findIndex( x => x.code === item.code);
    let qtty = item.quantity + 1;
    this.lstItems[idx].quantity = qtty;
    this.itemService.setItems(this.lstItems);
    this.toast(`Item ${ item.name } quantity: ${ item.quantity }`);
  }

  async toast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1200
    });
    toast.present();
  }

}

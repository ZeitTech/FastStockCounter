import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { InventoryData } from 'src/app/models/InventoryData.model';
import { ItemData } from 'src/app/models/ItemData.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  inventoryName: string;
  inventoryDate: string;
  inventoryNote: string;

  constructor(private navCtrl: NavController,
              private itemService: StorageService,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController) { }

  async ngOnInit() {
    let data = await this.itemService.getInventoryData();
    let invData = JSON.parse(data);
    this.inventoryName = invData.inventoryName;
    this.inventoryDate = invData.inventoryDate;
    this.inventoryNote = invData.inventoryNote;
  }

  goBack() {
    this.navCtrl.back();
  }

  updateInventoryData() {
    let invData: InventoryData = new InventoryData();
    invData.inventoryName = this.inventoryName;
    invData.inventoryDate = this.inventoryDate;
    invData.inventoryNote = this.inventoryNote;
    this.itemService.setInventoryData(invData);
    this.toast('Inventory data updated succesfully');
    this.goBack();
  }

  async toast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1200
    });
    toast.present();
  }

  deleteAllItems() {
    let del: ItemData[] = [];
    this.itemService.setItems(del);
    this.toast('All items deleted succesfully');
  }

  async alert() {
    const alert = await this.alertCtrl.create({
      header: 'Delete all items',
      message: 'ALL ITEMS BE WILL DELETED',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Okay',
          handler: () => {
            this.deleteAllItems();
          }
        }
    ]
    });
    alert.present();
  }

}

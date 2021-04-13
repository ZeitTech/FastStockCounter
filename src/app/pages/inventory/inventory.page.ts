import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController } from '@ionic/angular';
import { ItemData } from 'src/app/models/ItemData.model';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  lstItems: ItemData[] = [];
  inventoryName: string;

  slideOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(private itemService: StorageService,
              private alertCtrl: AlertController,
              private router: Router,
              private socialSCtrl: SocialSharing,
              private file: File) { }

  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.loadInvData();
    this.loadItems();
  }
  
  loadInvData() {    
    this.itemService.getInventoryData().then( data => {
      let invData = JSON.parse(data);
      this.inventoryName = invData.inventoryName;
    });
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

  deleteItem(item: ItemData) {
    let idx = this.lstItems.findIndex( x => x.code === item.code);
    this.deleteAlert(`Delete ${item.name}`, 'Are you sure to delete this item?', idx);
  }

  async deleteAlert(header: string, message: string, item) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Delete',
          handler: () => {
            this.lstItems.splice(item, 1);
            this.itemService.updateItems(this.lstItems);
          }
        }

      ]
    });
    alert.present();
  }

  editItem(item: ItemData) {
    let navExtras: NavigationExtras = {
      queryParams: {
        itemCode: item.code
      }
    }
    this.router.navigate(['/tabs/inventory/addItem'], navExtras);
  }



  export() {

    this.itemService.getInventoryData().then( data => {
      let invData = JSON.parse(data);
      let toExpArr = [];
      let header: string = 'Inventory Name, Created Inventory, Inventory Note, Date Export, Item Name, Item Code, Item Barcode, Item Unit Of Measure, Quantity \n';
      toExpArr.push(header);
      let dateExport = new Date().toISOString();
      this.lstItems.forEach( item => {
        let row = `${this.inventoryName}, ${invData.inventoryDate}, ${invData.inventoryNote}, ${dateExport}, ${item.name}, ${item.code}, ${item.barcode}, ${item.uofM}, ${item.quantity} \n`;
        toExpArr.push(row);
      });
      let fileName = 'exports_' + Date.now() + '.csv';
      this.itemService.setExportItems(fileName, invData, dateExport);
      this.createFile(toExpArr.join(''), fileName);
    });
    

  }

  async createFile(toWrite: string, fileName: string) {
    this.file.checkFile(this.file.dataDirectory, fileName).then( exist => {
        return this.writeInFile(toWrite, fileName);
    }).catch( err => {
      return this.file.createFile( this.file.dataDirectory, fileName, false).then( fileEntry => {
        this.writeInFile(toWrite, fileName);
      }).catch( err => { console.log(err); })
    });


  }

  async writeInFile(text: string, fileName: string) {
    const file = `${this.file.dataDirectory}${fileName}`
    await this.file.writeExistingFile(this.file.dataDirectory, fileName, text);
    this.socialSCtrl.share('Test', 'Test', file);
  }

}

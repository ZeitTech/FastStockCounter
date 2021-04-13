import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ItemData } from 'src/app/models/ItemData.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  lstItems: ItemData[] = [];

  name: string = '';
  code: string = '';
  barcode: string = '';
  uofM: string = '';
  quantity: number = 0;

  isNameValid: boolean = true;
  isCodeValid: boolean = true;
  isBarcodeValid: boolean = true;
  isUofMValid: boolean = true;

  lookupCode: string;
  isNew: boolean = true;
  currentItem: ItemData;
  constructor(  private navCtrl: NavController,
                private itemService: StorageService,
                private toastCtrl: ToastController,
                private route: ActivatedRoute,
                private barcodeCtrl: BarcodeScanner) { }

  ionViewWillEnter() {
    this.loadItems();
  }

  loadItems() {
    this.lstItems = []
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
        })
      }
    });    
  }

  ngOnInit() {
  
    this.lookupCode = '';

    this.itemService.getItems().then( async data => {

      this.lstItems = [];

      if(data) {
        this.lstItems = await this.json2ObjArray(data);
        this.route.queryParams.subscribe( params => {
          if( params && params.itemCode) {
            this.lookupCode = params.itemCode;
            this.itemService.getByCode(this.lookupCode).then( data => {
              if(data) {
                this.name = data.name
                this.code = data.code
                this.barcode = data.barcode
                this.uofM = data.uofM
                this.quantity = data.quantity

                this.currentItem = new ItemData();
                this.currentItem.name = data.name;
                this.currentItem.code = data.code;
                this.currentItem.barcode = data.barcode;
                this.currentItem.uofM = data.uofM;
                this.currentItem.quantity = data.quantity;
                
                this.isNew = false;
              }
            });
          } else {
            this.isNew = true;
            this.currentItem = null;
          }
        })
      }

    })

  }

  json2ObjArray(data): Promise<ItemData[]> {      

    let lstItems: ItemData[] = [];
    if(data) {
      let items = JSON.parse(data);
      items.forEach( item => {
        let data: ItemData = new ItemData();
        data.name = item.name;
        data.code = item.code;
        data.barcode = item.barcode;
        data.uofM = item.uofM;
        data.quantity = item.quantity;
        lstItems.push(data);
      });
      return Promise.resolve(lstItems);
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  validateName(): boolean {
    this.isNameValid = true;
    if(this.name != '') {
      this.isNameValid = true;
    } else {
      this.isNameValid = false;
      this.isValidToast('Name is empty');
    }
    return this.isNameValid;
  }
  
  validateCode(): boolean {
    this.isCodeValid = true;
    let codeExist = this.lstItems.find( x => x.code === this.code);
    if(this.code != '' && !codeExist) {
      this.isCodeValid = true;
    } else {
      this.isCodeValid = false;
      this.isValidToast('Code is empty or alredy exist');
    }
    return this.isCodeValid;
  }

  validateBarcode(): boolean {
    this.isBarcodeValid = true;
    let barcodeExist = this.lstItems.find( x => x.barcode === this.barcode);
    if(!barcodeExist) {
      this.isBarcodeValid = true;
    } else {
      this.isBarcodeValid = false;
      this.isValidToast('Barcode alredy exist');
    }
    return this.isBarcodeValid;
  }

  validateUofM(): boolean {
    this.isUofMValid = true;
    if(this.uofM != '') {
      this.isUofMValid = true;
    } else {
      this.isUofMValid = false;
      this.isValidToast('UofM is empty');
    }
    return this.isUofMValid;
  }

  addItem() {
    let item: ItemData = new ItemData();
    item.name = this.name;
    item.code = this.code;
    item.barcode = this.barcode;
    item.uofM = this.uofM;
    item.quantity = this.quantity;
    this.lstItems.push(item);
    this.itemService.setItems(this.lstItems);
    this.isValidToast('Item added succesfully');
    this.goBack();
  }

  updateItem() {
    let idx = this.lstItems.findIndex( x => x.code === this.currentItem.code );
    this.lstItems[idx].name = this.name;
    this.lstItems[idx].code = this.code;
    this.lstItems[idx].barcode = this.barcode;
    this.lstItems[idx].uofM = this.uofM;
    this.lstItems[idx].quantity = this.quantity;
    this.itemService.updateItems(this.lstItems);
    this.isValidToast('Item updated succesfully');
    this.goBack();
  }

  validate() {
    let result = false;
    console.log(this.isNew)
    if(this.isNew) {
      
      if(this.validateBarcode() === true && this.validateCode() === true) {
        result = true;
      }
      
      if(result) {
        if(this.validateName() && this.validateUofM()) {
          this.addItem();
        } else {
          this.updateItem();
        }
      return result;
      }
    } else {

      if(this.currentItem) {
        result = this.validateByIndex();
        
        if(result)
          console.log('update')
          this.updateItem();
        } else {
          this.isValidToast('Error updating item');
          return false;
        }
      
    }
    
    return result;
  }
  
  validateByIndex(): boolean {
    let currentItemIndex: number = this.lstItems.findIndex( x => x.code === this.currentItem.code);
    let changedItemIndex: number = this.lstItems.findIndex( x => x.code === this.code);
  
    this.isCodeValid = true;

    if(currentItemIndex != changedItemIndex && changedItemIndex >= 0) {
      this.isCodeValid = false;
      this.isValidToast('Item exist code');
      return false;
    } else {

      if(this.barcode) {
        let currentItemBC: number = this.lstItems.findIndex( x => x.barcode === this.currentItem.barcode);
        let changedItemBC: number = this.lstItems.findIndex( x => x.barcode === this.barcode);

        this.isBarcodeValid = true;

        if(currentItemBC != changedItemBC && changedItemBC >= 0) {
          this.isBarcodeValid = false;
          this.isValidToast('Item exist barcode');
          return false;
        }
      }
      return true;
    }
  }

  addBarcode() {
    this.barcodeCtrl.scan().then( data => {
      this.barcode = data.text;
    }).catch( err => {
      console.log(err);
    })
  }

  async isValidToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1200
    });
    toast.present();
  }

}

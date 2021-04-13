import { Injectable } from '@angular/core';
import { ItemData } from '../models/ItemData.model';
import { Plugins } from '@capacitor/core';
import { InventoryData } from '../models/InventoryData.model';
import { TicketData } from '../models/TicketData.model';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async getItems() {
    let items = await Storage.get({key: 'items'});
    return items.value;
  }

  async setItems(data: ItemData[]) {
    console.log(data);
    await Storage.set({
      key: 'items',
      value: JSON.stringify(data) 
    });
  }

  async updateItems(data: ItemData[]) {
    await Storage.set({
      key: 'items',
      value: JSON.stringify(data)
    })
  }

  async getByCode(item) {
    let items = await this.getItems();
    let data = JSON.parse(items);
    let itemCode: ItemData = data.find( x => x.code === item);
    return itemCode;
  }

  async getInventoryData() {
    let inventoryData = await Storage.get({key: 'inventoryData'})    
    return inventoryData.value;
  }

  async setInventoryData(invData: InventoryData) {
    await Storage.set({
      key: 'inventoryData',
      value: JSON.stringify(invData)
    });
  }

  async setExportItems(fileName: string, invData, date) {
    let expData: TicketData[] = [];
    let exportData: TicketData = new TicketData();
    exportData.fileName = fileName;
    exportData.name = invData.inventoryName;
    exportData.note = invData.inventoryNote;
    exportData.createDate = invData.inventoryDate;
    exportData.exportDate = date;
    expData.push(exportData);
    await Storage.set({
      key: 'exportsData',
      value: JSON.stringify(expData)
    });
  }

  async getExportsItems() {
    let expData = await Storage.get({key: 'exportsData'})
    return expData.value;
  }

}

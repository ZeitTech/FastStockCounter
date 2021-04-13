import { Component, OnInit } from '@angular/core';
import { InventoryData } from './models/InventoryData.model';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  
  constructor(private itemService: StorageService) {}

  ngOnInit() {
    this.itemService.getInventoryData().then( data => {
      let values = JSON.parse(data);
      if(values) {
        let invData: InventoryData = new InventoryData();
        invData.inventoryName = values.inventoryName;
        invData.inventoryDate = values.inventoryDate;
        invData.inventoryNote = values.inventoryNote;
      } else {
        let invData: InventoryData = new InventoryData();
        invData.inventoryName = 'Inventory';
        invData.inventoryDate = new Date().toISOString();
        invData.inventoryNote = '';      
        this.itemService.setInventoryData(invData);
      }
    });
  }

}

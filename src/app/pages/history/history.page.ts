import { Component, OnInit } from '@angular/core';
import { TicketData } from 'src/app/models/TicketData.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  lstHistory: TicketData[] = [];

  constructor(private itemService: StorageService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadExports();
  }

  loadExports() {
    this.lstHistory = [];
    this.itemService.getExportsItems().then( data => {
      if(data) {
        let expData = JSON.parse(data);
        expData.forEach( exp => {
          let history: TicketData = new TicketData();
          history.fileName = exp.fileName;
          history.createDate = exp.createDate;
          history.exportDate = exp.exportDate;
          history.name = exp.name;
          history.note = exp.note;
          this.lstHistory.push(history);
        });
      }
    });
  }

}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddItemPage } from './add-item.page';

const routes: Routes = [
  {
    path: '',
    component: AddItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddItemPageRoutingModule {}

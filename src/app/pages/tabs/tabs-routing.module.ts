import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'scanner',
        loadChildren: () => import('../scanner/scanner.module').then(m => m.ScannerPageModule)
      },
      {
        path: 'inventory',
        children: [
          {
            path: '',
            loadChildren: () => import('../inventory/inventory.module').then(m => m.InventoryPageModule)
          },
          {
            path: 'addItem',
            loadChildren: () => import('../add-item/add-item.module').then(m => m.AddItemPageModule)
          },
          {
            path: 'settings',
            loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
          }
        ]
      },
      {
        path: 'history',
        loadChildren: () => import('../history/history.module').then(m => m.HistoryPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/scanner',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/scanner',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

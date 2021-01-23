import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstateHomePage } from './estate-home.page';

const routes: Routes = [
  {
    path: '',
    component: EstateHomePage,
    children: [
      {
        path: 'overview',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/overview/overview.module').then( m => m.OverviewPageModule)
          }
        ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/map/map.module').then( m => m.MapPageModule)
          }
        ]
      },
      {
        path: 'similar',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/similar/similar.module').then( m => m.SimilarPageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstateHomePageRoutingModule {}

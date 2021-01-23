import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimilarPage } from './similar.page';

const routes: Routes = [
  {
    path: '',
    component: SimilarPage
  },
  {
  	path: 'overview',
    children: [
    {
    	path: '',
      loadChildren: () => import('../overview/overview.module').then( m => m.OverviewPageModule)
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimilarPageRoutingModule {}

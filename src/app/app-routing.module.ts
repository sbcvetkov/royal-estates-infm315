import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'my-estates',
    pathMatch: 'full'
  },
  {
    path: 'my-estates',
    loadChildren: () => import('./my-estates/my-estates.module').then( m => m.MyEstatesPageModule)
  },
  {
    path: 'locations',
    loadChildren: () => import('./locations/locations.module').then( m => m.LocationsPageModule)
  },
  {
    path: 'estates',
    redirectTo: 'my-estates'
  },
  {
    path: 'estates/:name',
    loadChildren: () => import('./estates/estates.module').then( m => m.EstatesPageModule)
  },
  {
    path: 'estate-home',
    redirectTo: 'my-estates'
  },
  {
    path: 'estate-home/:id',
    loadChildren: () => import('./estate-home/estate-home.module').then( m => m.EstateHomePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

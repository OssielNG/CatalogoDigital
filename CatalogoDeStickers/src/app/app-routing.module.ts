import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowProductosComponent } from './show-productos/show-productos.component';
import { RegistrarProductoComponent } from './registrar-producto/registrar-producto.component';

const routes: Routes = [
  {
  path:"lista-de-productos",component: ShowProductosComponent,
  },
  {
    path:"registrar-producto",component: RegistrarProductoComponent,
  },
  {
    path:"registrar-producto/:productoId",component: RegistrarProductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

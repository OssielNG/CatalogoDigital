import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-show-productos',
  templateUrl: './show-productos.component.html',
  styleUrls: ['./show-productos.component.scss']
})
export class ShowProductosComponent implements OnInit {
  productos: any[] = new Array<any>();
  constructor(public db: AngularFirestore) { }

  ngOnInit() {
    this.productos.length=0;
    this.db.collection('productos').get().subscribe((response)=>{
      response.docs.forEach((item)=>{
        let producto = item.data();
        producto.id=item.id;
        producto.ref=item.ref;
        this.productos.push(producto);
      })
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-registrar-producto',
  templateUrl: './registrar-producto.component.html',
  styleUrls: ['./registrar-producto.component.scss']
})
export class RegistrarProductoComponent implements OnInit {
  formularioProducto: FormGroup;
  porcentajeSubida: number = 0;
  urlImagen: string = '';
  esEditable: boolean = false;
  id: string ='';
    constructor(private fb: FormBuilder,
      private afs: AngularFirestore,
      private spinner: NgxSpinnerService,
      private activeRouter: ActivatedRoute,
      private snackBar: MatSnackBar,
      private storage: AngularFireStorage, )
      { }
  
    ngOnInit() {
      this.formularioProducto=this.fb.group({
        tipoProducto:['',Validators.required],
        titulo:['',Validators.required],
        precioUnidad:['',Validators.required],
        cantidadUnidad:['',Validators.required],
        urlFoto:['',Validators.required],
        
      });
      this.id= this.activeRouter.snapshot.params.productoId;
      if(this.id != undefined){
        this.esEditable = true;
        this.afs.doc<any>('productos'+'/'+this.id).valueChanges().subscribe((producto)=>{
          console.log(producto);
          this.formularioProducto.setValue({
            tipoProducto:producto.tipoProducto,
            titulo:producto.titulo,
            precioUnidad:producto.precioUnidad,
            cantidadUnidad:producto.cantidadUnidad,
            urlFoto:''
          });
          this.urlImagen= producto.urlFoto;
        });
      }
    }
    registrar(){
      this.formularioProducto.value.urlFoto = this.urlImagen;
      let mensaje= '';
      this.spinner.show();
      this.afs.collection('productos').add(this.formularioProducto.value)
      .then((response)=>{
        mensaje= "registro exitoso";
        this.snackBar.open(mensaje,'',{
          duration: 2000,
        });
        console.log("registro exitoso");
        this.spinner.hide();
      }).catch((error)=>{
        mensaje="ocurrio un error X"
        this.snackBar.open(mensaje,'',{
          duration: 2000,
        });
        console.log(error);
        this.spinner.hide();
      });
    }

    subirImagen(event){
      if(event.target.files.length > 0){
        let mensaje= '';
        let nombre = new Date().getTime().toString();
        let file = event.target.files[0];
        let extension = file.name.toString().substring(file.name.toString().lastIndexOf('.'));
        let ruta = 'productos/' + nombre + extension;
        const referencia = this.storage.ref(ruta);
        const tarea = referencia.put(file);
        tarea.then((objeto) =>{
          referencia.getDownloadURL().subscribe((url)=>{
          this.urlImagen = url;
          })
        })
        tarea.percentageChanges().subscribe((porcentaje)=>{
          this.porcentajeSubida = parseInt(porcentaje.toString());
        })
      }
    }


    actualizar(){
      let mensaje= '';
      this.spinner.show();
      this.afs.doc<any>('productos'+'/'+this.id).update(this.formularioProducto.value)
      .then((response)=>{
        mensaje= "registro actualizado exitoso";
        this.snackBar.open(mensaje,'',{
          duration: 2000,
        });
        console.log("registro exitoso");
        this.spinner.hide();
      }).catch((error)=>{
        mensaje="ocurrio un error al actualizar"
        this.snackBar.open(mensaje,'',{
          duration: 2000,
        });
        console.log(error);
        this.spinner.hide();
      });
    }
}

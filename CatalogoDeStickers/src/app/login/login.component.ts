import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formularioLogin:FormGroup
  datosCorrectos: boolean = true;
  mensajeError: String ='';
  constructor(
    private fb: FormBuilder, 
    public afAuth: AngularFireAuth,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit() {
    this.formularioLogin=this.fb.group({
      email:['',Validators.compose([
        Validators.required,Validators.email
       ])],
       password:['',Validators.required]
    });
  }

  login() {
    if(this.formularioLogin.valid){
      this.spinner.show();
      this.datosCorrectos= true;
      this.afAuth.auth.signInWithEmailAndPassword(this.formularioLogin.value.email,this.formularioLogin.value.password)
      .then((usuario)=>{
      console.log(usuario);
      this.spinner.hide();
      }).catch((error)=>{
        this.datosCorrectos=false;
        this.mensajeError= error.message;
        this.snackBar.open(error.message,'',{
          duration: 2000,
        });
        this.spinner.hide();
      })
    }else{
      this.datosCorrectos= false;
      this.snackBar.open('Por favor revisa que los datos esten correctos','',{
        duration: 2000,
      });
    }
  }
  logout() {
    this.afAuth.auth.signOut();
  }

}

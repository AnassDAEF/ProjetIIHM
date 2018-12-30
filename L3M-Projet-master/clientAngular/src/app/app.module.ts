import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CabinetMedicalService } from './cabinet-medical.service';
import { SecretaryComponent } from './secretary/secretary.component';
import { PatientComponent } from './patient/patient.component';
import { InfirmierComponent } from './infirmier/infirmier.component';
import {FormsModule} from "@angular/forms";
import {RouterModule,Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import { MaterielModule } from './material';
import { HomeComponent } from './home/home.component'



@NgModule({
  declarations: [
    AppComponent,
    SecretaryComponent,
    PatientComponent,
    InfirmierComponent,
    HomeComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MaterielModule,
    CommonModule,
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'secretary', component: SecretaryComponent},
    {path: 'infirmier', component: InfirmierComponent},
    {path: 'patient', component: PatientComponent},
    ] ) ],
  providers: [CabinetMedicalService],
  bootstrap: [AppComponent],
  exports: [CommonModule]
})
export class AppModule { }

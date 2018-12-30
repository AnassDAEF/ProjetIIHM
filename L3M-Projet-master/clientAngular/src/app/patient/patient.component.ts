import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CabinetMedicalService} from "../cabinet-medical.service";
import {CabinetInterface} from "../dataInterfaces/cabinet";

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PatientComponent implements OnInit {
  @Input() data;
  private cabinet: CabinetInterface;
  a: boolean;
  constructor(private cs: CabinetMedicalService){
  this.a = false;
  cs.getData('/data/cabinetInfirmier.xml').then(
    cabinet => this.cabinet = cabinet);
  }
  ngOnInit() {
  }
  public Addpatient(nom: string, prenom: string, sexe: string, numeroSecuriteSociale: string, rue: string, codepostal: string, ville: string, numero: string, etage: string, date: string)
  {
    if(nom==="" || prenom==="" || numeroSecuriteSociale==="" || codepostal==="" || ville==="" ){
      alert("veuillez remplir tous les champs obligatoires");
      let e1=document.querySelector("input[name='nom']") as HTMLElement; e1.style.borderColor="red"
      let e2=document.querySelector("input[name='prenom']")as HTMLElement; e2.style.borderColor="red"
      let e3=document.querySelector("input[name='secu']")as HTMLElement; e3.style.borderColor="red"
      let e4=document.querySelector("input[name='postal']")as HTMLElement; e4.style.borderColor="red"
      let e5=document.querySelector("input[name='ville']")as HTMLElement; e5.style.borderColor="red"
    }else {
      this.cs.Addpatient(nom, prenom, sexe, numeroSecuriteSociale, rue, codepostal, ville, numero, etage, date);
      this.a = true;
    }
  }

}

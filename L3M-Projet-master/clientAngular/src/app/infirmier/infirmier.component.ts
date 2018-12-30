import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CabinetMedicalService} from "../cabinet-medical.service";
import {CabinetInterface} from "../dataInterfaces/cabinet";
import {InfirmierInterface} from "../dataInterfaces/nurse";
import {PatientInterface} from "../dataInterfaces/patient";

@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InfirmierComponent implements OnInit {
  @Input() data;
  private cabinet: CabinetInterface;
  nonaffecter: string [];
  infirmies: InfirmierInterface [] ;
  mypatient: PatientInterface [];
  selected: string [] ;
  constructor(private cs: CabinetMedicalService) {
    this.selected=[];
    this.nonaffecter=[];

    cs.getData('/data/cabinetInfirmier.xml').then(
      cabinet => this.cabinet = cabinet);

  }


  ngOnInit() {
  }

  getinfirmiers(): InfirmierInterface[] {
    return this.infirmies = this.cabinet ? this.cabinet.infirmiers : [];
  }
  getinfPatient(idf:string): PatientInterface[] {

    if(typeof idf== null ){
      idf="001"
    }else{
    let inf=this.getinfirmiers();

    inf= inf.filter(e=>e.id==idf);
    this.mypatient=inf[0].patients;}
    return this.mypatient;
  }

  public affectation(numéroSécuritéSociale:string,infirmierId:string){
    this.cs.affectation(numéroSécuritéSociale,infirmierId);
  }
  public desaffectation(numéroSécuritéSociale:string){
    this.cs.desaffectation(numéroSécuritéSociale);
  }
  onClick1(event: any,idp:string) {
    if (idp === 'infirmier'){

    }else {
      this.getinfPatient(idp);
    }


  }

  onClick(event: any) {
    let a = event.target.value.toString();
    if (event.target.checked === true) {
      this.selected.push(a);
    } else {
      this.selected = this.selected.filter( e => e != a )
    }
  }

  onClick3(event: any) {
    let a = event.target.value.toString();
    let e1=document.querySelector("button[name='affect']") as HTMLButtonElement;
    if (event.target.checked === true) {
      this.nonaffecter.push(a);
      e1.disabled=false;
    } else {
      this.nonaffecter = this.nonaffecter.filter( e => e != a );
      if(this.nonaffecter[0]===null){
         e1.disabled=true;
      }
    }
  }

  onClick4(idf:string) {
     if(this.nonaffecter[0]!== 'undefined'){
       this.nonaffecter.forEach(e=>this.affectation(e,idf));
     }
     if(this.selected[0]!== 'undefined'){
       this.selected.forEach(e=>this.desaffectation(e));
     }
    document.location.reload()
  }
}

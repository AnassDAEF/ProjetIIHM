import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CabinetInterface} from "./dataInterfaces/cabinet";
import {Adresse} from "./dataInterfaces/adress";
import {sexeEnum} from "./dataInterfaces/sexe";
import {PatientInterface} from "./dataInterfaces/patient";



@Injectable()
export class CabinetMedicalService {
  private patient: PatientInterface;
  constructor(private http: Http) {
      }
  getAdresseFrom(A :Element):Adresse{
    let node :Element;
    return {
      étage:(node=A.querySelector("étage"))?node.textContent:"",
      rue:A.querySelector("rue").textContent,
      numéro:(node=A.querySelector("numéro"))?node.textContent:"",
      ville:A.querySelector("ville").textContent,
      codePostal:parseInt(A.querySelector("étage")?node.textContent:"",10),
      lat:120,
      lng:130,

    };
  }

  getData(url: string): Promise<CabinetInterface> {

    return this.http.get(url).toPromise().then(res => {
      console.log(url, "=>", res);
      const text = res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/xml");

      const cabinet: CabinetInterface = {
        infirmiers: [],
        patientsNonAffectes: [],
        adresse: this.getAdresseFrom(doc.querySelector("cabinet>adresse"))
      };
      //return cabinet
      console.log(cabinet);
      //les infirmiers
      const infirmiersXML: Element[] = Array.from(
        doc.querySelectorAll("infirmiers>infirmier")
      );

      cabinet.infirmiers = infirmiersXML.map(infirmiersXML => {
        return {
          id: infirmiersXML.getAttribute("id"),
          nom:(infirmiersXML.querySelector("nom")).textContent,
          prenom:(infirmiersXML.querySelector("prénom")).textContent,
          photo:(infirmiersXML.querySelector("photo")).textContent,
          patients: [],
          adresse: this.getAdresseFrom(infirmiersXML.querySelector("adresse"))
        };
      });

      const patientsXML = Array.from(
        doc.querySelectorAll("patients > patient")
      );
      const patients: PatientInterface[] = patientsXML.map( patientXML => {
        return {
          nom: patientXML.querySelector("nom").textContent,
          prenom:(patientXML.querySelector("prénom")).textContent,
          adresse: this.getAdresseFrom(patientXML.querySelector("adresse")),
          numeroSecuriteSociale: patientXML.querySelector("numéro").textContent,
          sexe: (patientXML.querySelector("sexe").textContent==="M")?sexeEnum.M :sexeEnum.F,
        };
      });

// calcul du tableau des affectations

      const affectation = patientsXML.map(patientXML => {
        const idP = patientXML.querySelector('numéro').textContent;
        const patient = patients.find(P => P.numeroSecuriteSociale === idP)
        const intervenant = patientXML.querySelector('visite').getAttribute('intervenant');
        const infirmier = cabinet.infirmiers.find(i => i.id === intervenant);

        return {infirmier: infirmier, patient: patient};
      });
      //puis réaliser les affectations

      affectation.forEach(A => {
          if(A.infirmier){
            A.infirmier.patients.push(A.patient);
          }else {
            cabinet.patientsNonAffectes.push(A.patient);
          }
        }
      );

      console.log(patients);
      console.log(cabinet);
      return cabinet;
    });

  }

  public Addpatient(nom: string, prenom: string, sexe: string, numeroSecuriteSociale: string, rue: string, codepostal: string, ville: string, numero: string, etage: string, date: string) {

    let  se;
    if ( sexe === "M") {
      se = sexeEnum.M;
    }else {se = sexeEnum.F;}

    const adress: Adresse = {
      étage: etage,
      numéro: numero,
      rue: rue,
      codePostal: Number(codepostal),
      ville: ville,
      lat: null,
      lng: null,
    };
    const patient: PatientInterface = {
      prenom: prenom ,
      nom: nom,
      sexe: se,
      numeroSecuriteSociale: numeroSecuriteSociale,
      adresse: adress,
    };

    this.ajouter(patient);
  }

  public ajouter(patient: PatientInterface) {
    this.http.post('/addPatient', {
      patientName: patient.nom,
      patientForname: patient.prenom,
      patientNumber: patient.numeroSecuriteSociale,
      patientSex: patient.sexe,
      patientBirthday: 'AAAA-MM-JJ',
      patientFloor: patient.adresse.étage,
      patientStreetNumber: patient.adresse.numéro,
      patientStreet: patient.adresse.rue,
      patientPostalCode: patient.adresse.codePostal,
      patientCity: patient.adresse.ville
    }).toPromise().then(
      res => console.log(res),
      err => console.error(err)
    );

  }
  public affectation(numéroSécuritéSociale:string,infirmierId:string){
    this.http.post( "/affectation", {
      infirmier: infirmierId,
      patient: numéroSécuritéSociale
    }).toPromise().then(
      res => console.log(res),
      err => console.error(err)
    );
  }
  public desaffectation(numéroSécuritéSociale:string){
    this.http.post( "/affectation", {
      infirmier: "none",
    patient: numéroSécuritéSociale
  }).toPromise().then(
      res => console.log(res),
      err => console.error(err)
    );

  }

  onClick(event: any){
    this
    console.log(event); //you can explore the event object and use the values as per requirement
  }
}


import { Component, NgZone, OnInit } from '@angular/core';
import { TotpClass } from './totp-class.model';
// https://fireflysemantics.medium.com/loading-json-on-stackblitz-with-angular-bf77a1da3f8a
import * as data from './secrets.json';
import totp from 'totp-generator';
// https://zeroesandones.medium.com/how-to-copy-text-to-clipboard-in-angular-e99c0feda501
import { Clipboard } from '@angular/cdk/clipboard';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'TOTP Manager';
  selected = 'Click on a code to copy it to your clipboard...';
  time = '';
  file: any = data;
  totps: TotpClass[]
  validity: number;

  constructor(private clipboard: Clipboard) {}

  // Set code to selection and copy to clipboard
  onSelect(code: string): void {
    this.selected = `Copied code ${code} to clipboard`
    this.clipboard.copy(code);
  }

  getArray(o: TotpClass[]):Array<TotpClass>{
    var a = Array.from(o);

    // Sort alphabetically by label name
    a = a.sort((n1,n2) => {
      if (n1.label > n2.label) {
          return 1;
      }
  
      if (n1.label < n2.label) {
          return -1;
      }
  
      return 0;
  });
    return a;
  }

  ngOnInit(): void {

    this.totps = convertToTotpObjects(this.file)
    this.totps = generateCodes(this.totps);

    setInterval(() => {
      this.totps = generateCodes(this.totps);
    }, 1000);
  }
}


function generateCodes(secrets: TotpClass[]): TotpClass[] {

  var t = new Date().getTime();
  var T = (t / 30);
  // calculate the time left in seconds the TOTP can be used
  var t_left =  Math.floor((30 - ((t/1000) - 30) % 30))

  for (let i = 0; i < secrets.length; i++) {

    secrets[i].code = totp(secrets[i].key);
    secrets[i].validTime = t_left
  }

  return secrets
}

function convertToTotpObjects(o: object): TotpClass[] {

  var s_json = JSON.stringify(o)
  var secrets: TotpClass[] = JSON.parse(s_json)

  return secrets
}

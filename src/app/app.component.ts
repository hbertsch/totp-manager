import { Component, OnInit } from '@angular/core';
import { TotpClass } from './totp-class.model';
// https://fireflysemantics.medium.com/loading-json-on-stackblitz-with-angular-bf77a1da3f8a
// import * as data from './secrets.json';
import totp from 'totp-generator';
// https://zeroesandones.medium.com/how-to-copy-text-to-clipboard-in-angular-e99c0feda501
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TOTP Manager';
  selected = 'Click on a code to copy it to your clipboard...';
  time = '';
  //file: any = data;
  totps: Array<TotpClass>;
  searchResult: Array<TotpClass>;
  validity: number;
  sortOrder: string = 'asc';
  query: string = '';
  selectedFile: File;

  constructor(private clipboard: Clipboard) { }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    var file = this.selectedFile;
    if(file.type != 'application/json')
    {
      console.log("Selected file is not a valid json file. Aborting...");
      return;
    }
    
    var reader = new FileReader();

    reader.onload = (e) => {
      var content = reader.result as string;
      saveConfiguration(content);
      var cfg = loadConfiguration();
      this.totps  = convertToTotpObjectsFromString(cfg);
    }

    reader.readAsText(file);
  }

  search(event: any): void {
    this.query = event.target.value;
  }

  // Set code to selection and copy to clipboard
  onSelect(code: string): void {
    this.selected = `Copied code ${code} to clipboard`
    this.clipboard.copy(code);
  }

  sortUpDown(colName) {
    if (this.sortOrder == 'asc') {
      this.sortDescending(colName);
      this.sortOrder = 'des';
    }
    else {
      this.sortAscending(colName);
      this.sortOrder = 'asc';
    }
  }

  sortAscending(colName) {
    this.totps.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
  }

  sortDescending(colName) {
    this.totps.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
  }

  searchQuery(query: string): Array<TotpClass> {
    return this.totps.filter(x => x.label.toLowerCase().includes(query.toLowerCase()) == true);
  }

  ngOnInit(): void {
    
    var cfg = loadConfiguration();
    this.totps = convertToTotpObjectsFromString(cfg);
    this.totps = generateCodes(this.totps);
    this.sortAscending('label');

    setInterval(() => {
      this.totps = generateCodes(this.totps);
      if (this.query != '') {
        this.searchResult = this.searchQuery(this.query);
      }
      else {
        this.searchResult = this.totps;
      }
    }, 1000);
  }
}

function generateCodes(secrets: Array<TotpClass>): Array<TotpClass> {

  var t = new Date().getTime();
  var T = (t / 30);
  // calculate the time left in seconds the TOTP can be used
  var t_left = Math.floor((30 - ((t / 1000) - 30) % 30))

  for (let i = 0; i < secrets.length; i++) {

    secrets[i].code = totp(secrets[i].key);
    secrets[i].validTime = t_left
  }

  return secrets
}

function convertToTotpObjects(o: object): Array<TotpClass> {

  return convertToTotpObjectsFromString(JSON.stringify(o))
}

function convertToTotpObjectsFromString(jsonString: string): Array<TotpClass> {

  var secrets: Array<TotpClass> = Array.from(JSON.parse(jsonString))
  return secrets
}

function loadConfiguration(): string{
  var cfg = localStorage.getItem('totp-cfg') as string;
  if(typeof(cfg) != 'undefined')
  {
    return cfg;
  }
  else
  {
    return '';
  }
}

function saveConfiguration(cfg: string){
 localStorage.setItem('totp-cfg',cfg);
}
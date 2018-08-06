import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {
  @ViewChild('fusioncharts') fusioncharts;

  width = 600;
  height = 400;
  type = 'pie3d';
  dataFormat = 'json';
  dataSource: any = {};

  chart: any;
  data: any;
  selectOptions: { title: string; subTitle: string; mode: string; };

  amount: number;
  category: string 

  constructor(
    private platform: Platform,
    private alertCtrl: AlertController
  ) {
    this.width = this.platform.width() - 10;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const forDel = document.getElementsByTagName('tspan')
      Array.prototype.slice.call(forDel)[forDel.length-1]['style'].display = "none";
    }, 400);

    this.selectOptions = {
      title: 'Select Category',
      subTitle: '',
      mode: 'md'
    };

    this.chart = {
      "caption": "Spent money",
      "subcaption": "Today",
      "startingangle": "120",
      "showlabels": "0",
      "showlegend": "1",
      "enablemultislicing": "0",
      "slicingdistance": "15",
      "showpercentvalues": "1",
      "showpercentintooltip": "0",
      "plottooltext": "Age group : $label Total visit : $datavalue",
    }

    this.data = [
      {
        "label": "Eat (50)",
        "value": "50"
      },
      {
        "label": "Transport (50)",
        "value": "50"
      },
      {
        "label": "Accounts (10)",
        "value": "10"
      },
      {
        "label": "Еntertainment (10)",
        "value": "10"
      },
      {
        "label": `Other (10)`,
        "value": "11"
      }
    ]

    this.dataSource['chart'] = this.chart
    this.dataSource['data'] = this.data
  }

  add() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: "Тhen the money will not be refunded!",
      buttons: [
        {
          text: 'Disagree',
          cssClass: 'disagree',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Agree',
          cssClass: 'agree',
          handler: () => {
            console.log('Buy clicked');
            this.resetValue()
          }
        }
      ]
    });
    alert.present();
    
  }

  private resetValue(){
    this.category = ''
    this.amount = null
  }
}
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { HomeService, IMoneyValue } from './home.service';
import { Keyboard } from '@ionic-native/keyboard';
import { DataService } from '../../services/data.servicee';
import { first } from 'rxjs/operators';

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
  data: any = [];
  selectOptions: { title: string; subTitle: string; mode: string; };

  amount: number;
  category: string

  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private homeService: HomeService,
    private keyboard: Keyboard,
    private dataService: DataService,
  ) {
    this.width = this.platform.width() - 10;

    this.loadData()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const forDel = document.getElementsByTagName('tspan')
      if (forDel.length - 1 >= 0) {
      Array.prototype.slice.call(forDel)[forDel.length - 1]['style'].display = "none";        
      }
    }, 400);

    this.selectOptions = {
      title: 'Select Category',
      subTitle: '',
      mode: 'md'
    };

    this.chart = {
      "caption": "Spent money",
      "subcaption": "From begin",
      "startingangle": "120",
      "showlabels": "0",
      "showlegend": "1",
      "enablemultislicing": "0",
      "slicingdistance": "15",
      "showpercentvalues": "1",
      "showpercentintooltip": "0",
      "showToolTip": "0"
    }

    this.dataSource['chart'] = this.chart
  }

  async loadData() {
    this.data = []
    const categories = await this.homeService.getAllKeys()
    console.warn(categories);

    for (const category of categories) {
      console.warn(category);
      const categoryVal = await this.homeService.getDataByKey(category.toString())
      const sum = categoryVal.map((c) => c.amount).reduce((a, b) => Number(a) + Number(b));
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      this.data.push({
        label: `${categoryName} (${sum})`,
        value: sum
      })

    }

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
          handler: async () => {
            const categoryData: IMoneyValue[] = await this.homeService.getDataByKey(this.category) || []
            categoryData.push({ amount: this.amount, date: new Date() } as IMoneyValue)
            await this.homeService.setValue(this.category, categoryData);
            try {
              await this.dataService.addData(categoryData, this.category)
              console.warn('success');
            } catch (error) {
              console.warn(error);
              this.alertCtrl.create({
                title: "Somethig went wrong"
              }).present()
            }
            await this.loadData()
            this.resetValue()
          }
        }
      ]
    });
    alert.present();

  }

  async cleardata() {
    await this.homeService.clearAllData()
    this.loadData()
  }

  enter() {
    this.keyboard.close()
  }

  private resetValue() {
    this.category = ''
    this.amount = null
  }

}
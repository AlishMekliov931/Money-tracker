import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  icons = {
    transport: 'ios-car-outline',
    eat: 'ios-basket-outline',
    other: 'ios-add-outline',
    entertainment: 'md-wine',
    accounts: 'md-calculator',
  };
  data: Array<{ type: string, amount: string, icon: string, date: Date }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private homeService: HomeService,
  ) {

    this.loadData()
    // If we navigated to this page, we will have an item available as a nav param

  }

  async  loadData() {
    const allData = await this.homeService.all()
    // Let's populate this page with some filler content for funzies

    this.data = [];
    for (const { type, value } of allData) {
      for (const {amount, date} of value) {
        console.warn(amount, date);
        this.data.push({
          type,
          amount,
          date,
          icon: this.icons[type]
        });
      }
    }

    this.data = this.data.sort((a, b) => a.date > b.date? -1 : 1)
    console.warn(this.data);
  }
}

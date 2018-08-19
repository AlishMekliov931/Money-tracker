import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { Observable } from "../../../node_modules/rxjs/Observable";

export interface IMoneyValue {
    amount: number
    date: Date
}


@Injectable()
export class HomeService {

    constructor(
        private storage: Storage
    ) { }


    getAllKeys(): Promise<String[]> {
        return this.storage.keys()
    }

    clearAllData(): Promise<void> {
        return this.storage.clear()
    }

    getDataByKey(key: string): Promise<IMoneyValue[]> {
        return this.storage.get(key)
    }

    setValue(key: string, value: IMoneyValue[]): Promise<any> {
        return this.storage.set(key, value)
    }

    // getDataToday(key: string): Promise<IMoneyValue[]>{
    //     return
    // }

    async all() {
        const allData = []
         await this.storage.forEach((v, k) => {
             allData.push({type: k, value: v})
        })
        return allData
    }
}
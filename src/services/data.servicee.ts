import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import * as firebase from 'firebase';
 
@Injectable()
export class DataService {
 
  constructor(private db: AngularFireDatabase, private afStorage: AngularFireStorage) { }

  get uid() {
    return localStorage.getItem('uid')
  }
 
  getData() {
    let ref = this.db.list(`/data/${this.uid}`);
 
    return ref.snapshotChanges().map(changes => {
      if (changes[0]) {      
        return changes.map(c => ({ key: c.payload.key, value:c.payload.val() }));
      }
    });
  }

  getDataByType(type) {
    const data = this.db.object(`/data/${this.uid}/${type}`);
    return data.query.once("value")
  }

  addData(data, type){
    const cachedCart = this.db.object(`/data/${this.uid}/${type}`);
    cachedCart.set(data);
  }
 
  uploadToStorage(information): AngularFireUploadTask {
    let newName = `${new Date().getTime()}.txt`;
 
    return this.afStorage.ref(`data/${newName}`).putString(information);
  }
 
  storeInfoToDatabase(metainfo) {
    let toSave = {
      created: new Date(),
      url: 'eeeee',
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType
    }
    return this.db.list('data').push(metainfo);
  }
 
 
  deleteFile(file) {
    let key = file.key;
    let storagePath = file.fullPath;
 
    let ref = this.db.list('data');
 
    ref.remove(key);
    return this.afStorage.ref(storagePath).delete();
  }
}
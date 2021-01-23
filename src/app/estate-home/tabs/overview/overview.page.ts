import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ToastController, Events } from '@ionic/angular';
import * as _ from 'lodash';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {
  estate: any = {};
  savedEstates = [];
  saveEstatesButtonTitle = 'SAVE TO MY ESTATES';

  constructor(
    public storage: Storage,
    public alertController: AlertController,
    public toastController: ToastController,
    public events: Events
  ) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    this.getCurrentEstate();
    await this.getSavedEstates();

    if (this.savedEstates.length > 0) {
      const result = _.find(this.savedEstates, ['id', this.estate.id]);
      if ((result !== undefined) && (result != null)) {
        this.saveEstatesButtonTitle = 'REMOVE FROM SAVED ESTATES';
      }
    }
  }

  onSaveEstatesButtonClick() {
    if (this.saveEstatesButtonTitle === 'SAVE TO MY ESTATES') {
      this.saveEstatesButtonTitle = 'REMOVE FROM SAVED ESTATES';
      this.saveToMyEstates();
    } else {
      this.showConfirm();
    }
  }

  saveToMyEstates() {
    this.savedEstates.push(this.estate);
    this.storage.set('savedEstates', JSON.stringify(this.savedEstates))
      .then(() => {
        this.events.publish('savedEstatesChanged');
      });
  }

  async showConfirm() {
    const alertMss = await this.alertController.create({
      header: 'Confirm Removal',
      message: 'Are you sure you want to remove from saved estates?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          _.remove(this.savedEstates, {
            id: this.estate.id
          });
          this.storage.set('savedEstates', JSON.stringify(this.savedEstates))
            .then(() => {
              this.events.publish('savedEstatesChanged');
            });
          this.showToast('Estate with Ref. No ' + this.estate.refNumber + ' removed');
          this.saveEstatesButtonTitle = 'SAVE TO MY ESTATES';
          this.events.publish('savedEstatesChanged');
        }
      }, {
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary'
      }]
    });

    await alertMss.present();
  }

  async showToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  async getSavedEstates() {
    await this.storage.get('savedEstates').then((val) => {
      if (val != null) {
        this.savedEstates = JSON.parse(val);
      }
    });
  }

  refreshEstate(e) {
    this.storage.get('currentEstate').then((val) => {
      if (val != null) {
        this.estate = JSON.parse(val);
      }
      setTimeout(() => {
        e.target.complete();
      }, 500);
    });
  }

  getCurrentEstate() {
    this.storage.get('currentEstate').then((val) => {
      if (val != null) {
        this.estate = JSON.parse(val);
      }
    });
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import { LoadingController } from '@ionic/angular';
import { DataService } from '../../../api/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-similar',
  templateUrl: './similar.page.html',
  styleUrls: ['./similar.page.scss'],
})
export class SimilarPage implements OnInit, OnDestroy {
  promise;
  estate: any = {};
  city = '';
  allLocationEstates: any = [];
  locationEstates: any = [];
  filterValue = 'House';
  toggleValue = false;
  isFilterDisabled = !this.toggleValue;
  regionValue = 'all';

  constructor(
    public service: DataService,
    public storage: Storage,
    public loadingController: LoadingController,
    public router: Router
  ) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    this.showLoading();
    await this.storage.get('currentEstate').then((val) => {
      if (val != null) {
        this.estate = JSON.parse(val);
        const addressArr = this.estate.address.split(' ');
        this.city = addressArr[addressArr.length - 1];
      }
    });
    this.promise = this.service.getLocationEstates(this.city)
      .subscribe({
        next: locationEstates => {
          this.allLocationEstates = JSON.parse(JSON.stringify(locationEstates));
          this.locationEstates = JSON.parse(JSON.stringify(locationEstates));
          this.loadingController.dismiss();
        }
      });
  }

  onToggleChange() {
    this.isFilterDisabled = this.toggleValue;
    this.toggleValue = !this.toggleValue;

    this.filterData();
  }

  onFilterChange(ev) {
    this.filterValue = ev.target.value;

    this.filterData();
  }

  onViewClick(id: string) {
    console.log(id);
    this.router.navigate(['/estate-home', id]);
  }

  onRegionChange() {
    if (this.regionValue === 'all') {
      this.regionValue = 'region';
    } else {
      this.regionValue = 'all';
    }

    this.filterData();
  }

  filterData() {
    const that = this;
    const data = [];

    if (that.regionValue === 'region') {
      that.allLocationEstates.forEach((e, i) => {
        if (that.estate.region === e.region) {
          data.push(Object.assign({}, e));
        }
      });
    } else {
      that.allLocationEstates.forEach((e, i) => {
        data.push(Object.assign({}, e));
      });
    }
    console.log(data);

    if (that.toggleValue) {
      data.forEach((e, i) => {
        data[i].estates = _.filter(e.estates, { type: that.filterValue });
      });
    }

    this.locationEstates = data;
  }

  ngOnDestroy() {
    this.promise.unsubscribe();
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading Location Estates'
    });
    await loading.present();
  }
}

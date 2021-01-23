import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-my-estates',
  templateUrl: './my-estates.page.html',
  styleUrls: ['./my-estates.page.scss'],
})
export class MyEstatesPage implements OnInit {
  savedEstates: any = [];
  constructor(
    public storage: Storage,
    public router: Router
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.getSavedEstates();
  }

  onViewClick(id: string) {
    this.router.navigate(['/estate-home', id]);
  }

  async getSavedEstates() {
    await this.storage.get('savedEstates').then((val) => {
      if (val != null) {
        this.savedEstates = JSON.parse(val);
      }
    });
  }
}

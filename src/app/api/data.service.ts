import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseURL = 'https://royal-estates-app-f43a0.firebaseio.com/';

  constructor(private http: HttpClient) { }

  getLocations(): Observable<any> {
    return this.http.get<any>(this.baseURL + 'locations.json').pipe(
      catchError(this.handleError)
    );
  }

  getLocationEstates(name): Observable<any> {
    return this.http.get<any>(this.baseURL + 'locations-data.json')
      .pipe(
        map(response => {
          let data = [];

          Object.keys(response).forEach(key => {
            if (response[key].location.name === name) {
              let items = response[key].estates;
              items = _.chain(items).groupBy('region').toPairs()
                .map(currentData => {
                  return _.zipObject(['region', 'estates'], currentData);
                }).value();

              data = items;
            }
          });

          return data;
        }),
        catchError(this.handleError)
      );
  }

  getEstate(id): Observable<any> {
    return this.http.get<any>(this.baseURL + 'locations-data.json')
      .pipe(
        map(response => {
          let data = {};

          Object.keys(response).forEach(key => {
            Object.keys(response[key].estates).forEach(estateKey => {
              const estate = response[key].estates[estateKey];

              if (estate.id === parseInt(id, 10)) {
                data = estate;
              }
            });
          });

          return data;
        }),
        catchError(this.handleError)
      );
  }

  handleError(err: HttpErrorResponse) {
    console.error(err);
    return Observable.throw(err);
  }
}

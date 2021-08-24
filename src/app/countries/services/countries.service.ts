import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountrySmall, Country } from '../interfaces/countries.interface';
import { Observable, of, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _baseUrl: string = 'https://restcountries.eu/rest/v2';

  private _regions: string[] = [
    'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'
  ]

  get regions(): string[] {
    return [ ... this._regions];
  }

  constructor( private http:HttpClient ) { }

  getCountriesByRegion( region: string):Observable<CountrySmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=alpha3Code;name`;
    return this.http.get<CountrySmall[]>(url);
  }

  getFrontiersByCode( code: string ): Observable<Country | null> {
    
    if(!code){
      return of(null);
    }

    const url: string = `${this._baseUrl}/alpha/${code}`;
    return this.http.get<Country>(url);
  }

  getFrontiersByCodeSmall( code: string ): Observable<CountrySmall> {
    const url: string = `${this._baseUrl}/alpha/${code}?fields=name;alpha3Code`;
    return this.http.get<CountrySmall>(url);
  }


  getCountriesByCode(borders: string[]):Observable<CountrySmall[]> {
    if(!borders){
      return of([]);
    }

    const requests: Observable<CountrySmall>[] = [];

    borders.map( code => {
      const req = this.getFrontiersByCodeSmall(code);
      requests.push(req);
    })

    return combineLatest( requests );



  }
}

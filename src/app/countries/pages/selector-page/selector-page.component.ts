import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';

import { CountriesService } from '../../services/countries.service';
import { CountrySmall, Country } from '../../interfaces/countries.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: []
})
export class SelectorPageComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    region: [ '', Validators.required ],
    country: [ '', Validators.required ],
    frontier: [ '', Validators.required ]
    // frontier: [ {value: '', disabled: true}, Validators.required ]
  });

  regions: string[] = [];
  countries: CountrySmall[] = [];
  // frontiers: string[] = [];
  frontiers: CountrySmall[] = [];
  loading:boolean = false;
  // Fill Selectors

  constructor( private fb:FormBuilder, 
               private countriesSrv: CountriesService) { }

  ngOnInit(): void {
    this.regions = this.countriesSrv.regions;

    // this.myForm.get('region')?.valueChanges
    // .subscribe( region => {
    //   console.log(`region`, region);
    //   this.countriesSrv.getCountriesByRegion(region)
    //   .subscribe( countries=> {
    //     this.countries = countries;
    //     console.log(`this.countries`, this.countries);
    //   })
    // });

    // convert with switchMap
    this.myForm.get('region')?.valueChanges
    .pipe(
      tap( ( _ ) => {
        this.myForm.get('country')?.reset('');
        this.myForm.get('frontier')?.disable();
        this.loading = true;
      }), //launch secondary effect
      switchMap(region => this.countriesSrv.getCountriesByRegion(region))
     )
    .subscribe( (countries) => {
      this.countries = countries;
      this.loading = false;
    })


    this.myForm.get('country')?.valueChanges
    .pipe(
      tap(( _ ) => {
        this.frontiers = [];
        this.myForm.get('frontier')?.reset('');
        this.myForm.get('frontier')?.enable();
        this.loading = true;
      }),
      switchMap( code => this.countriesSrv.getFrontiersByCode(code) ),
      switchMap( country => this.countriesSrv.getCountriesByCode(country?.borders!) )
    )
    .subscribe( (frontiers) => {
      console.log(`countries`, frontiers);
      this.frontiers = frontiers;
      this.loading = false;
    })
  }

  save(){
    console.log(`myForm`, this.myForm.value);
  }

}

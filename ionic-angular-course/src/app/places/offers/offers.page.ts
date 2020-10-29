import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  loadedOffers: Place[];
  isLoading = false;
  placesSubs: Subscription;

  constructor( private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    this.placesSubs  = this.placesService.places.subscribe(places => {
      this.loadedOffers = places;
    });
    // this.loadedOffers = this.placesService.places;
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }
  ngOnDestroy()  {
    if  (this.placesSubs) {
      this.placesSubs.unsubscribe();
    }
  }



  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers','edit', offerId]);
    console.log('Editing Item', offerId);
  }

}

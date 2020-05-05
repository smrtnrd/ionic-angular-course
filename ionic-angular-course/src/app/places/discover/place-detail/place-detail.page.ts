import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  discoverPlace: Place;

  constructor(
    // private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      console.log(paramMap);
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.discoverPlace = this.placesService.getPlace(paramMap.get('placeId'));
    }); // listen the changes on the url
   }

  onBookPlace() {
    // this.router.navigateByUrl("/places/tabs/discover");
    // navigate takes an array you should use "navigateByUrl"
    // this.navCtrl.pop();
    // pop() show the privious page on the stack
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.modalCtrl
      .create({component: CreateBookingComponent, componentProps: {selectedPlace: this.discoverPlace}})
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm'){
          console.log('BOOKED');
        }
      });

  }

}

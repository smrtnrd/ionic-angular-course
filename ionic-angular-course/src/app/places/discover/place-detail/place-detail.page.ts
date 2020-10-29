import { BookingService } from './../../../bookings/booking.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
} from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  discoverPlace: Place;
  private placesSub: Subscription;
  constructor(
    // private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private laodingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      console.log(paramMap);
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placesSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe((place) => {
          this.discoverPlace = place;
        });
    }); // listen the changes on the url
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onBookPlace() {
    // this.router.navigateByUrl("/places/tabs/discover");
    // navigate takes an array you should use "navigateByUrl"
    // this.navCtrl.pop();
    // pop() show the previous page on the stack
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: {
          selectedPlace: this.discoverPlace,
          selectedMode: mode,
        }, // forward information to the new object
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          this.laodingCtrl
          .create({ message: 'Booking place ...'})
          .then( loandingEl => {
            loandingEl.present();
            const data = resultData.data.bookingData;
            this.bookingService.addBooking(
            this.discoverPlace.id,
            this.discoverPlace.title,
            this.discoverPlace.imageUrl,
            data.firstName,
            data.lastName,
            data.guestNumber,
            data.startDate,
            data.endDate
          )
          .subscribe(() => {
            loandingEl.dismiss();
          });
          });
          // console.log('BOOKED');
        }
      });
  }
}

import { BookingService } from './booking.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  isLoading = false;
  loadedBookings: Booking[];
  bookingSubs: Subscription;

  constructor(private bookingService: BookingService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.bookingSubs = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(){
    if (this.bookingSubs) {
      this.bookingSubs.unsubscribe();
    }
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    this.loadingCtrl.create({message: 'Cancelling ...'}).then(loadingEl =>{
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });

    slidingEl.close();
    // cancel booking -> delete page
  }

}

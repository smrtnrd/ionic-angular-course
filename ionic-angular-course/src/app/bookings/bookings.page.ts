import { BookingService } from './booking.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Booking } from './booking.model';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  bookingSubs: Subscription;

  constructor(private bookingService: BookingService) { }

  ngOnInit() {
    this.bookingSubs = this.bookingService.bookings.subscribe(bookings =>{
      this.loadedBookings = bookings;
    });
  }

  ngOnDestroy(){
    if (this.bookingSubs) {
      this.bookingSubs.unsubscribe();
    }
  }

  onCancelBooking(offerId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    // cancel booking -> delete page
  }

}

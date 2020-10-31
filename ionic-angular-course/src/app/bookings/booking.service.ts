import { AuthService } from './../auth/auth.service';
import { Booking } from './booking.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, delay, tap, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  fetchBookings() { // fetch booking by user
    return this.http
      .get<{ [key: string]: BookingData }>(
        `https://ionic-angular-course-c7a6c.firebaseio.com/booked-places.json?orderBy="userId"&equalTo="${
          this.authService.userId
        }"`
      )
      .pipe(
        map((bookingData) => {
          const bookings = [];
          for (const key in bookingData) {
            if (bookingData.hasOwnProperty(key)) {
              bookings.push(
                new Booking(
                  key,
                  bookingData[key].placeId,
                  bookingData[key].userId,
                  bookingData[key].placeTitle,
                  bookingData[key].placeImage,
                  bookingData[key].firstName,
                  bookingData[key].lastName,
                  bookingData[key].guestNumber,
                  new Date(bookingData[key].bookedFrom),
                  new Date(bookingData[key].bookedTo)
                )
              );
            }
          }
          return bookings;
        }),
        tap((bookings) => {
          this._bookings.next(bookings);
        })
      );
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );

    return this.http
      .post<{ name: string }>(
        'https://ionic-angular-course-c7a6c.firebaseio.com/booked-places.json',
        { ...newBooking, id: null }
      )
      .pipe(
        switchMap((resData) => {
          // return data from the server
          generatedId = resData.name; // set firebase name as id of booking
          return this.bookings; // return bookings to be use in the pipe  -> tap()
        }),
        take(1),
        delay(1000),
        tap((bookings) => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }

  cancelBooking(bookingId: string) {
    return this.http.delete(`https://ionic-angular-course-c7a6c.firebaseio.com/booked-places/${bookingId}.json`)
    .pipe(
      switchMap(() => {
        return this.bookings;
      }),
      take(1),
      tap((bookings) => {
        setTimeout(() => {
          this._bookings.next(bookings.filter((b) => b.id !== bookingId)); // filter out the bookingid  that  we don't want
        }, 1000);
      })
    );
  }
}

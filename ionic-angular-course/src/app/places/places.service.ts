import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})

export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);
  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.http
    .get<{[key: string]: PlaceData }>('https://ionic-angular-course-c7a6c.firebaseio.com/offered-places.json')
    .pipe(map( resData => {
      const places = [];
      for (const key in resData) {
        if(resData.hasOwnProperty(key)) {
          places.push(
            new Place(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].userId
            )
          );
        }
      }
      return places;
    }),
    tap(places => {
      this._places.next(places);
    })
    );
  }

  // map return non observable data
  // switchmap return observable data

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) }; // {...} return a clone of the object requested
      })
    );
  }

  editPlace(id: string, title: string, description: string) {
    /* return this.places.pipe(take(1), map(places => {
      const place = places.find((p) => p.id === id);
      place.title = title;
      place.description = description;
      console.log('editPlace', place);
      return place;
    })); */

    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        setTimeout(() => {
          const place = places.find((p) => p.id === id);
          place.title = title;
          place.description = description;
          console.log('editPlace', place);
          return place;
        }, 1000);
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      tap((places) => {
        // the idea here is to modify the Place object in our list of places
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    // imageUrl: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://ottawa2016aesatema.files.wordpress.com/2015/09/chateau-laurier-ottawa.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.http
      .post<{name: string}>(
        'https://ionic-angular-course-c7a6c.firebaseio.com/offered-places.json',
        {
          ...newPlace,
          id: null,
        }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      ); // add .json  required  by firebase
    /*  return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        // we use tap instead of subscribe because we returning the element de
        // take the current array of places
        setTimeout(() => {
          this._places.next(places.concat(newPlace));
          // emit the new array of places with the place that I added
        }, 1000); // add a timer  to mimic server conncection
      })
    ); */
    // this.places.push(newPlace);
  }
}


// [
//   new Place(
//     'p1',
//     'Chateau Laurier',
//     'Le Fairmont Château Laurier est un hôtel cinq étoiles de grande renommée situé au cœur du centre-ville d\'Ottawa',
//     'https://ottawa2016aesatema.files.wordpress.com/2015/09/chateau-laurier-ottawa.jpg',
//     300,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p2',
//     'Ottawa Jail Hostel',
//     'Located in downtown Ottawa, the HI Ottawa Jail Hostel is within easy walking distance of Parliament Hill, the Byward Market and all the major downtown attractions.',
//     'https://res.cloudinary.com/hostelling-internation/image/upload/t_hostel_carousel/f_auto,q_auto/v1557521382/nzzomycdvyg3ixrmmokw.jpg',
//     78,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p3',
//     'The Westin Ottawa',
//     'No matter your reason for visiting Ontario, Canada, whether business or leisure, The Westin Ottawa is dedicated to making your stay in downtown Ottawa',
//     'https://postmediaottawacitizen2.files.wordpress.com/2017/01/the-westin-ottawa-gave-its-customers-this-picture-as-a-thank.jpeg?quality=100&strip=all&w=564',
//     198.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
// ]
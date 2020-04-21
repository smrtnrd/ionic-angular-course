import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})

export class PlacesService {

  private _places: Place[] =  [
    new Place(
      'p1',
      'Chateau Laurier',
      'Le Fairmont Château Laurier est un hôtel cinq étoiles de grande renommée situé au cœur du centre-ville d\'Ottawa',
      'https://ottawa2016aesatema.files.wordpress.com/2015/09/chateau-laurier-ottawa.jpg',
      300
    ),
    new Place(
      'p2',
      'Ottawa Jail Hostel',
      'Located in downtown Ottawa, the HI Ottawa Jail Hostel is within easy walking distance of Parliament Hill, the Byward Market and all the major downtown attractions.',
      'https://res.cloudinary.com/hostelling-internation/image/upload/t_hostel_carousel/f_auto,q_auto/v1557521382/nzzomycdvyg3ixrmmokw.jpg',
      78
    ),
    new Place(
      'p3',
      'The Westin Ottawa',
      'No matter your reason for visiting Ontario, Canada, whether business or leisure, The Westin Ottawa is dedicated to making your stay in downtown Ottawa',
      'https://postmediaottawacitizen2.files.wordpress.com/2017/01/the-westin-ottawa-gave-its-customers-this-picture-as-a-thank.jpeg?quality=100&strip=all&w=564',
      198.99
    )
  ];

  get places() {
    return [...this._places];

  }
  constructor() { }

  getPlace(id: string){
    return {...this.places.find(p => p.id === id)}; // {...} return a clone of the object requested
  }
}


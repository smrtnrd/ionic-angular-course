import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailPageRoutingModule } from './place-detail-routing.module';

import { PlaceDetailPage } from './place-detail.page';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceDetailPageRoutingModule /* ,
    RouterModule.forChild(routes) */
  ],
  declarations: [PlaceDetailPage, CreateBookingComponent], // I will use the component modal in the place detail page
  entryComponents: [CreateBookingComponent]
})
export class PlaceDetailPageModule {}

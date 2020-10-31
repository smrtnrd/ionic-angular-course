import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../../place.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  placeId: string;
  form: FormGroup;
  isLoading = false;
  private placesSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
    private laodingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placesSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(
          (place) => {
            // get the data from the specific id
            this.place = place;
            this.form = new FormGroup({
              // Reactive Form
              title: new FormControl(this.place.title, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              description: new FormControl(this.place.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)],
              }),
            });
            this.isLoading = false;
            console.log('2 Editing Item: ', paramMap.get('placeId'));
          },
          (error) => {
            console.log(error);
            this.alertCtrl.create({
              header: 'an error occured',
              message: 'Place could not be fetched. Please try again later',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => {
                    this.router.navigate(['places/tabs/offers']);
                  },
                },
              ],
            }).then(alertEl => {
              alertEl.present();
            });
          }
        );
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.laodingCtrl
      .create({
        message: 'Updating place  ...',
      })
      .then((loadingEl) => {
        loadingEl.present(); // start the waiting animation
        this.placesService
          .updatePlace(
            this.place.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            console.log(this.form);
            loadingEl.dismiss(); // close the animation
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
}

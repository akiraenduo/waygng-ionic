import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';
import { UserProvider } from '../../providers/user/userProvider';
import { HomePage } from '../home/home';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: User;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userProvider: UserProvider,
              public afAuth: AngularFireAuth, 
              public photoLibrary: PhotoLibrary,
              public toastCtrl: ToastController,
              public platform: Platform,) {

      const authSubscribe = this.afAuth.authState.subscribe((auth) => {
      if(auth){
        this.user = new User(auth.uid,auth.email,"",auth.displayName,auth.photoURL);
        authSubscribe.unsubscribe(); 
      }
    });
  }

  ionViewDidLoad() {

    

  }

  tryRequestAuthorization() {
    
        this.platform.ready().then(() => {
          this.photoLibrary.requestAuthorization({read: true})
            .then(() => {
              this.navCtrl.pop();
            })
            .catch((err) => {
              let toast = this.toastCtrl.create({
                message: `requestAuthorization error: ${err}`,
                duration: 6000,
              });
              toast.present();
            });
        });
    
      }

  changePhoto(){
    let newPhotoUrl;
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: library => {
          library.forEach(function(libraryItem) {
            console.log(libraryItem.id);          // ID of the photo
            console.log(libraryItem.photoURL);    // Cross-platform access to photo
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            console.log(libraryItem.fileName);
            console.log(libraryItem.width);
            console.log(libraryItem.height);
            console.log(libraryItem.creationDate);
            console.log(libraryItem.latitude);
            console.log(libraryItem.longitude);
            console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used

            newPhotoUrl = libraryItem.photoURL;

          });
          if(newPhotoUrl){
            this.user.picture = newPhotoUrl;
            this.userProvider.updateUser(this.user);
          }
          
          
        },
        error: err => { console.log('could not get photos'); },
        complete: () => { console.log('done getting photos'); }
      });

    })
    .catch(err => console.log('permissions weren\'t granted'));
  }

  logout() {
    this.navCtrl.setRoot(HomePage); 
    this.userProvider.logout();
  }

}

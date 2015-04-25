// collection defined both on client and server
Photos = new Mongo.Collection("photos");

if (Meteor.isClient) {
  // configure accounts UI to have username instead of email
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  // return a sorted database query to be displayed in the body
  Template.body.helpers({
    photos: function () {
      return Photos.find({}, {sort: {createdAt: -1}});
    },

    shareData: function() {
      return {
        photos: this.data,
        author: Meteor.users.findOne(this.authorId)
      }
    }
  });

  // capture a click event for the like button
  Template.photoCard.events({
    "click .like": function (event) {
      event.preventDefault();

      Photos.update(this._id, {
        $addToSet: {
          likedBy: Meteor.userId()
        }
      });
    },
  /*  
    "click .delete": function (event) {
      event.preventDefault();

      Photos.remove(this._id);
    }
    */
  });

  // have a temporary variable for the photo about to be submitted
  Template.postPhoto.helpers({
    unsubmittedPhoto: function () {
      return Session.get("unsubmittedPhoto");
    }
  });

  Template.postPhoto.events({
    // capture the event for submitting the photo
    "submit form": function (event) {
      var form = event.target;
      var caption = form.caption.value;

      Photos.insert({
        caption: caption,
        data: Session.get("unsubmittedPhoto"),
        createdAt: new Date(),
        username: Meteor.user().username,
        likedBy: [] 
      });

      $('#postPhotoModal').modal('hide'); 
      Session.set("unsubmittedPhoto", null);
      form.caption.value = "";

      return false;
    },

  });
    // capture the event for taking a photo to be submitted
  
  Template.takePhotoBtn.events({

    "click .take-photo": function () {
      MeteorCamera.getPicture({
        width: 400,
        height: 300,
        quality: 100
      }, function (error, data) {
        $('#postPhotoModal').modal('show'); 
        Session.set("unsubmittedPhoto", data);
      });

      return false;
    }
  });  
    // login
  
  /*Template.loginBtn.events({

    "click .login-btn": function () {
      MeteorCamera.getPicture({
        width: 400,
        height: 300,
        quality: 100
      }, function (error, data) {
        $('#postPhotoModal').modal('show'); 
        Session.set("unsubmittedPhoto", data);
      });

      //return false;
       alert('fuck');
       $('#loginFn').show();
    }
  });*/  
  ShareIt.configure({
    sites: {                // nested object for extra configurations
        'facebook': {
            'appId': '909281092465491',   // use sharer.php when it's null, otherwise use share dialog
        },
        'twitter': {},
        'googleplus': {},
        'pinterest': {}
    },
    classes: "large btn", // string (default: 'large btn')
                          // The classes that will be placed on the sharing buttons, bootstrap by default.
    iconOnly: true,      // boolean (default: false)
                          // Don't put text on the sharing buttons
    applyColors: true,     // boolean (default: true)
                          // apply classes to inherit each social networks background color
    faSize: '',            // font awesome size
    faClass: 'square'       // font awesome classes like square
  });


}

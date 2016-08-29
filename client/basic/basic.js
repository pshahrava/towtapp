Orders = new Meteor.Collection('orders', {connection: null});

Schemas.step1 = new SimpleSchema({
  violation: {
    type: String,
    optional: true,
    autoform: {
      type: "select",
      options: function () {
        return [
          {label: "Parked in bus lane", value: "Parked in bus lane"},
          {label: "Street cleaning", value: "Street cleaning"},
          {label: "Disabled parking", value: "Disabled parking"},
          {label: "Parked during rush hour", value: "Parked during rush hour"},
          {label: "Within 15 feet of the fire hydrant", value: "Within 15 feet of the fire hydrant"},
          {label: "Residential permit parking", value: "Residential permit parking"},
          {label: "Blocking driveway or fire lane", value: "Blocking driveway or fire lane"},
          {label: "No city sticker", value: "No city sticker"},
          {label: "Parked in alley", value: "Parked in alley"}

        ];
      }
    }
  }
});
Schemas.step2 = new SimpleSchema({
  Location: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "text"
      }
    }
  }
});

Schemas.step3 = new SimpleSchema({
  licensePlateNumber: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "text"
      }
    }
  },
  LicensePlateState: {
    type: String,
    optional: true,
    autoform: {
      type: "select",
      options: function () {
        return [
          {label: "Illinois", value: "Illinois"},
          {label: "Indiana", value: "Indiana"},
          {label: "Wisconsin", value: "Wisconsin"}
        ];
      }
    }
  },
  MakeModelYear: {
    type: String,
    label: "Make Model Year",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "text"
      }
    }
  }
});

Schemas.step4 = new SimpleSchema({
  PhotoEvidence: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "fileUpload",
        collection: "Images"
      }
    }
  }
});

// Schemas.paymentInformation = new SimpleSchema({
//   paymentMethod: {
//     type: String,
//     label: 'Payment method',
//     allowedValues: ['credit-card', 'bank-transfer'],
//     autoform: {
//       options: [{
//         label: 'Credit card',
//         value: 'credit-card'
//       }, {
//         label: 'Bank transfer',
//         value: 'bank-transfer'
//       }]
//     }
//   },
//   acceptTerms: {
//     type: Boolean,
//     label: 'I accept the terms and conditions.',
//     autoform: {
//       label: false
//     },
//     autoValue: function() {
//       if (this.isSet && this.value !== true) {
//         this.unset();
//       }
//     }
//   }
// });

Orders.attachSchema([
  Schemas.step1,
  Schemas.step2,
  Schemas.step3,
  Schemas.step4
]);

Template.basic.helpers({
  steps: function() {
    return [{
      id: 'step1',
      title: 'Choose a violation',
      schema: Schemas.step1
    },
    {
      id: 'step2',
      title: 'Location',
      schema: Schemas.step2
    },
    {
      id: 'step3',
      title: 'Vehicle description',
      schema: Schemas.step3
    },
    {
      id: 'step4',
      title: 'Photo evidence',
      schema: Schemas.step4,
      onSubmit: function(data, wizard) {
        var self = this;
        Orders.insert(_.extend(wizard.mergedData(), data), function(err, id) {
          if (err) {
            self.done();
          } else {
            Router.go('viewLead', {
              _id: id
            });
          }
        });
      }
    }];
  }
});

Wizard.useRouter('iron:router');

Router.route('/basic/:step?', {
  name: 'basic',
  onBeforeAction: function() {
    if (!this.params.step) {
      this.redirect('basic', {
        step: 'step1'
      });
    } else {
      this.next();
    }
  }
});

Router.route('/orders/:_id', {
  name: 'viewLead',
  template: 'viewLead',
  data: function() {
    return Orders.findOne(this.params._id);
  }
});

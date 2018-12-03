// Get Credit Card function
function getCreditCardType(number) {
  var cardDetails = creditCardType(number);
  var cardType = false;
  if (cardDetails.length == 1) {
    cardType = cardDetails[0].type;
  }
  return cardType;
}

// Accepted Credit Card
function acceptedCreditCardType(number) {
  var cardType = getCreditCardType(number);
  var accepted = false;
  if (cardType) {
    var acceptedCC = ["visa", "mastercard", "american-express", "discover"];
    if (acceptedCC.indexOf(cardType) !== -1) {
      accepted = true;
    }
  }
  return accepted;
}

// Credit card warning/icon logic
$("#paymetric-card-number").keyup(function(){
  var number = $("#paymetric-card-number").val().replace(/\s/g,'');
  if (number.length >= 4) {
    if (!acceptedCreditCardType(number)) {
      $('.credit-card-icons i').removeClass('active');
      cc_type_warning.show();
    } else {
      var cardType = getCreditCardType(number);
      $('.credit-card-icons i').removeClass('active');
      $('.credit-card-icons i.'+cardType).addClass('active');
      cc_type_warning.hide();
    }
  } else {
    $('.credit-card-icons i').removeClass('active');
    cc_type_warning.hide();
  }
});

// Validate email function
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Validate function
function validateForm(section_slugs, disabled_button_id) {
  var invalid_ids = [];
  var invalid = false;
  var disabled_button = $('#' + disabled_button_id);
  var warning_message = $('#' + disabled_button_id + '_warning');
  for (var i = 0; i < section_slugs.length; i++) {
    if (invalid) {
      // break;
    }
    var section_slug = section_slugs[i];

    if (section_slug == 'shipping_method') {
      // if ($('#shipping_method input:checked').length != 1) {
      if (!$('input.shipping_method').length) {
        var input_id = 'shipping_method';
        invalid_ids.push(input_id);
        invalid = true;
      }
    } else {
      if (section_slug == 'payment') {
        var validation_fields = $('#' + section_slug + '_section input');
      } else {
        // var validation_fields = $('#' + section_slug + '_section p.validate-required input');
        var validation_fields = $('#' + section_slug + '_section p.validate-required input, #' + section_slug + '_section p.validate-required select');
      }
      for (var j = 0; j < validation_fields.length; j++) {
        var input_value = validation_fields[j].value;
        var input_id = validation_fields[j].id;
        var input_length = validation_fields[j].value.length;
        var input_type = validation_fields[j].type;
        if (input_value == '' && input_type !== 'password') {
          invalid_ids.push(input_id);
          invalid = true;
        } else if (input_type == 'email' && !validateEmail(input_value)) {
          invalid_ids.push(input_id);
          invalid = true;
        } else if (input_id == 'billing_phone' && input_value.length < 10) {
          // invalid_ids.push(input_id);
          // invalid = true;
        }
        else if ( input_id == 'paymetric-card-number' && ( input_value.replace(/\D/g, '').length < 14 || input_value.replace(/\D/g, '').length > 19 || !acceptedCreditCardType(input_value.replace(/\D/g, '')) ) ) {
          invalid_ids.push(input_id);
          invalid = true;
        } else if (input_id == 'paymetric-card-expiry') {
          var expiration = input_value.replace(/\D/g, '');
          if (expiration.length == 4) {
            var year = expiration.toString().substring(2, 4);
            var month = expiration.toString().substring(0, 2);
            var today = new Date();
            var year_sub_str = today.getFullYear().toString().substring(0, 2);
            var expiration_date = new Date(year_sub_str+year, month);
            if (today > expiration_date) {
              invalid_ids.push(input_id);
              invalid = true;
            } else if (parseInt(month) < 1 || parseInt(month) > 12) {
              invalid_ids.push(input_id);
              invalid = true;
            }
          } else {
            invalid_ids.push(input_id);
            invalid = true;
          }
        } else if (input_id == 'paymetric-card-cvc' && (input_length < 3 || input_length > 4)) {
          invalid_ids.push(input_id);
          invalid = true;
        } else if (input_type == 'password') {
          if (($('#createaccount').is(":checked") && input_value == '')) {
            invalid_ids.push(input_id);
            invalid = true;
          }
          //password strength
          // else if (input_value !== '') {
          //   if ( !$('.woocommerce-password-strength').hasClass('strong') && !$('.woocommerce-password-strength').hasClass('good') ) {
          //     invalid_ids.push(input_id);
          //     invalid = true;
          //   }
          // }
        }
      }
    }
  }
  // validate-required woocommerce-invalid woocommerce-invalid-required-field
  // validate-required woocommerce-validated

  // disabled_button.prop("disabled",invalid);
  if (invalid) {
    disabled_button.addClass("msa-disabled");
  } else {
    disabled_button.removeClass("msa-disabled");
    warning_message.hide();
  }
  // console.log('invalid_ids: ', invalid_ids);
  return invalid_ids;
}

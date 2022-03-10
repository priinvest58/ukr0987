(function ($, window, Drupal, drupalSettings) {

    'use strict';

    window.unicef_datalayers = [];
    var _this;
    var variables_set;

    Drupal.behaviors.unicef_datalayers_v2 = {
        //Default vars
        getDefaults: function () {
            //Window globals that apply to all forms
            window.unicef_datalayers.donation_type = '';
            window.unicef_datalayers.donation_type_label = '';
            window.unicef_datalayers.donation_amount = String($('.vertical-tabs-active-tab').next().find('input:checked').val());
            window.unicef_datalayers.currency_code = $('input[name="donation_amounts[currency_code]"]').val();
            window.unicef_datalayers.donor_type = '';
            window.unicef_datalayers.donation_iterval = '12';
            window.unicef_datalayers.other_amount = false;
            window.unicef_datalayers.step_integer = 1;
            window.unicef_datalayers.payment_method = '';
        },
        //Attach Drupal script - page on ready
        attach: function (context, settings) {
            //Hack to get around stupid Drupal attach on multiple contexts
            var element_type = $(context).prop('nodeName');
            var allowed_contexts = ['#document', 'FORM'];
            if (!allowed_contexts.includes(element_type)) {
                return;
            }
            //setup vars once as Drupal runs this script on every request including ajax
            if (typeof variables_set === "undefined") {
                _this = this;
                _this.getDefaults();
                variables_set = true;
            }
            //Get JSON attributes on each page load
            window.unicef_datalayers.json_attributes = $('.donation-form-json-attributes').data('json');

            //Run script once per donation form
            //We need to use context with a low level child element in order for once to function correctly
            //We then traverse back up the DOM to find our form element
            $('.donate-form-wrapper', context).once('unicef_datalayers').each(function () {
                var $donation_form = $(this).closest('form');
                var step_integer = window.unicef_datalayers.json_attributes.step_integer;
                if (step_integer === 0) {
                    _this.userEvents();
                }
                if (step_integer === 1) {
                    _this.checkoutEvents('2', 'Personal Information', $donation_form);
                }
                if (step_integer === 2) {
                    _this.checkoutEvents('3', 'Payment Method', $donation_form);
                }
                _this.donationAmountEvents($donation_form, context);
                _this.buttonClickEvents($donation_form);
                _this.paymentStepEvents($donation_form);
            });
        },
        userEvents: function () {
            var data = {
                newsletterSubscriber: '',    // true if the user agrees to receive communication via email
                userCountry: window.unicef_datalayers.json_attributes.x_geo_country || window.unicef_datalayers.json_attributes.country, // user country
                userLanguage: window.unicef_datalayers.json_attributes.browser_language, // user language
                //internalTraffic: '', // true or false
                sessionId: window.unicef_datalayers.json_attributes.session_id,
                userAgent: window.unicef_datalayers.json_attributes.user_agent,
                userRegion: window.unicef_datalayers.json_attributes.field_geographic_region,
                event: 'userDetails'
            }
            _this.dataLayerPush(data);
        },
        donationAmountEvents: function ($donation_form, context) {
            var $amount_el = $donation_form.find('*[data-donation-type].form-radio');
            // Tab load and clicks
            if ($(context).prop('nodeName') === '#document') {
                _this.productImpressions('pageload', $donation_form, false);
            }
            $donation_form.find('a[data-toggle="tab"]').on('click', function (e) {
                _this.productImpressions($(this), $donation_form, true);
            });
            // Amount click
            $($amount_el).on('click', function (e) {
                _this.productClick(e, $donation_form);
            });
        },
        buttonClickEvents: function ($donation_form) {
            var $next_btn_el = $donation_form.find('button.donate-form-next-btn');
            // Next button click
            $($next_btn_el).on('click', function (e) {
                var step_key = $(this).attr('data-step-key');
                // Event key clicks
                if (step_key === 'donation_amount') {
                    _this.donationStart($donation_form);
                    _this.addToCart($donation_form);
                }
                if (step_key === 'personal_details') {
                    _this.checkErrors($donation_form);
                }
            });
        },
        paymentStepEvents: function ($donation_form) {
            // Payment processing and Thank you / error pages
            var $success_element = $('#thank-you-wrapper.payment-success');
            if ($success_element.length) {
                if (!$success_element.hasClass('processed')) {
                    $success_element.addClass('processed');
                    _this.paymentSuccess($donation_form);
                }
            }
            var $failure_element = $('#thank-you-wrapper.payment-failed');
            if ($failure_element.length) {
                if (!$failure_element.hasClass('processed')) {
                    $failure_element.addClass('processed');
                    _this.paymentFailure($donation_form);
                }
            }
        },
        productImpressions: function ($el, $donation_form, send_data) {
            var tab = '';
            if ($el === 'pageload') {
                tab = $($donation_form).find('.vertical-tab-button.active a[data-toggle]');
            } else {
                tab = $el;
            }
            //Return if we have no tabs
            if (tab.length === 0) {
                return;
            }
            window.unicef_datalayers.donation_type = $(tab).attr('data-donation-type');
            window.unicef_datalayers.donation_type_label = _this.mappingValues('donation_type', window.unicef_datalayers.donation_type);
            if (window.unicef_datalayers.donation_type === 'one-time') {
                window.unicef_datalayers.donation_interval = '1';
            } else {
                window.unicef_datalayers.donation_interval = '12';
            }
            if (send_data === true) {
                var data = {
                    event: 'gaEvent',
                    eventCategory: 'Form Click',
                    eventAction: 'Tab',
                    eventLabel: window.unicef_datalayers.donation_type_label // or 'Give Once' if the Give Once tab is clicked
                }
                _this.dataLayerPush(data);
            }
        },
        productClick: function (e, $donation_form) {
            var $element = $(e.target);
            var amount = parseInt($element.val());
            if (!isNaN(amount)) {
                window.unicef_datalayers.donation_amount = String($element.val());
            } else {
                window.unicef_datalayers.donation_amount = 'Other';
            }
            var data = {
                event: 'gaEvent',
                eventCategory: 'Form Click',
                eventAction: 'Donation Amount',
                eventLabel: window.unicef_datalayers.currency_code + ' - ' + window.unicef_datalayers.donation_amount // currency and chosen amount ( or 'USD - 40', 'USD - 30', 'USD - 80', etc. )
            }
            _this.dataLayerPush(data);
        },
        donationStart: function ($donation_form) {
            window.unicef_datalayers.donor_type = _this.mappingValues('field_meta_campaign_type', window.unicef_datalayers.json_attributes.field_meta_campaign_type);
            var $selected_radio = $($donation_form).find('.vertical-tabs-pane.active input:checked');
            var $child = $selected_radio.attr('data-child');
            window.unicef_datalayers.other_amount = false;
            if (typeof $child !== "undefined") {
                window.unicef_datalayers.other_amount = true;
                var $child_el = $donation_form.find('input[data-sku="' + $child + '"]');
                window.unicef_datalayers.donation_amount = $child_el.val().length > 0 ? $child_el.val() : "0.00";
            }
            _this.donationEvents($donation_form, 'Donation Start');
        },
        addToCart: function ($donation_form) {
            var data = {
                event: 'addToCart',
                ecommerce: {
                    currencyCode: window.unicef_datalayers.currency_code, // currency code should go here
                    add: {                                // 'add' actionFieldObject measures.
                        products: [{                        //  adding a product to a shopping cart.
                            name: 'Donation', // actual product name, not URL with parameters
                            id: window.unicef_datalayers.json_attributes.entity_id, // internal nodeID should go here, not currency
                            price: window.unicef_datalayers.donation_amount, // or other selected
                            brand: 'UNICEF',
                            category: window.unicef_datalayers.donation_type_label, // or One time Donation" I "Monthly Donation I Upgrade
                            quantity: 1
                        }]
                    }
                }
            }
            _this.dataLayerPush(data);
        },
        paymentProcessing: function ($donation_form) {
            _this.checkoutEvents('4', 'Payment Processing', $donation_form);
        },
        paymentSuccess: function ($donation_form) {
            var data = {
                event: 'EECpurchase',
                ecommerce: {
                    purchase: {
                        actionField: {
                            id: window.unicef_datalayers.json_attributes.order_id,      // transaction id
                            affiliation: 'UNICEF Global',
                            revenue: window.unicef_datalayers.donation_amount
                        },
                        products: [
                            {
                                name: 'Donation', // actual product name, not URL
                                id: window.unicef_datalayers.json_attributes.entity_id, // nodeID should go here
                                price: window.unicef_datalayers.donation_amount,
                                brand: 'UNICEF',
                                category: window.unicef_datalayers.donation_type_label, // or One time Donation" I "Monthly Donation I Upgrade
                                quantity: 1
                            }
                        ]
                    },
                    donationType: window.unicef_datalayers.donation_type_label,  // donation type i.e. One time Donation I Monthly Donation I Upgrade
                    donationPurpose: window.unicef_datalayers.json_attributes.field_meta_campaign_theme,  // donation purpose i.e. Covid I Yemen I Emergency...
                    donorType: window.unicef_datalayers.donor_type,  // donor type i.e. Individual | Corporate | Organization
                    donationStep: 'Success',
                    donationDuration: window.unicef_datalayers.donation_interval,  // '1' if one-time, '12' if monthly or upgrade
                    donationAmount: window.unicef_datalayers.donation_amount,  // chosen previously amount
                    orderID: window.unicef_datalayers.json_attributes.order_id, // this should map to the drupalID or drupal_order_number (Stripe) and should be available from step 1
                    customerID: window.unicef_datalayers.json_attributes.customer_id, // this should map Stripe's customer ID and should be available after the user fills their email address
                    paymentType: window.unicef_datalayers.payment_method, // or Bank Transfer
                    transactionID: window.unicef_datalayers.json_attributes.charge_id // this should map Stripe's charge ID and should be available once the transaction completes
                }
            }
            _this.dataLayerPush(data);
        },
        paymentFailure: function ($donation_form) {
            var message = window.unicef_datalayers.json_attributes.transaction_exception;
            var data = {
                'eventCategory': 'Donations',
                'eventAction': 'Donation Submit',
                'eventLabel': 'Failed',
                'donationType': window.unicef_datalayers.donation_type_label,  // donation type i.e. One time Donation I Monthly Donation I Upgrade
                'donationPurpose': window.unicef_datalayers.json_attributes.field_meta_campaign_theme,  // donation purpose i.e. Covid I Yemen I Emergency...
                'donorType': window.unicef_datalayers.donor_type,  // donor type i.e. Individual | Corporate | Organization
                'donationDuration': window.unicef_datalayers.donation_interval,  // '1' if one-time, '12' if monthly or upgrade
                'donationAmount': window.unicef_datalayers.donation_amount,  // chosen previously amount
                'orderID': window.unicef_datalayers.json_attributes.order_id, // this should map to the drupalID or drupal_order_number
                'customerID': window.unicef_datalayers.json_attributes.customer_id, // this should map Stripe's customer ID and should be available after the user fills their  email address
                'paymentType': window.unicef_datalayers.payment_method, // or Bank Transfer
                'transactionID': window.unicef_datalayers.json_attributes.charge_id, // this should map Stripe's charge ID and should be available once the transaction completes
                'errorMessage': message,
                'event': 'gaEvent'
            }
            _this.dataLayerPush(data);
        },
        donationEvents: function ($donation_form, event_action) {
            _this.setPaymentMethod($donation_form);
            var data = {
                event: 'gaEvent',
                eventCategory: 'Donations',
                eventAction: event_action,
                donationAmount: window.unicef_datalayers.donation_amount, // e.g 50, 80, 130
                donationType: window.unicef_datalayers.donation_type_label, // e.g One time Donation I Monthly Donation I Upgrade
                donorType: window.unicef_datalayers.donor_type, // e.g Private Person, Company
                userRegion: window.unicef_datalayers.json_attributes.field_geographic_region, // e.g if it's Saudi Arabia or Kuweit then the userRegion = MENA; If it's Brazil or Argentina or Chile then  userRegion = LAC.
                otherAmount: window.unicef_datalayers.other_amount, // e.g true, false
                eventLabel: 'Successful',
                errorMessage: ''
            }
            var errors = _this.getErrors($donation_form);
            if (errors.length > 0) {
                data['eventLabel'] = 'Unsuccessful';
                data['errorMessage'] = errors;
                _this.errorEvents(errors);
            }
            _this.dataLayerPush(data);
        },
        errorEvents: function (errors) {
            var data = {
                event: 'gaEvent',
                eventCategory: 'Error',
                eventAction: 'Form Error',
                eventLabel: window.unicef_datalayers.donation_type_label, // here should be passed page subcategory value
                errorMessage: errors
            }
            _this.dataLayerPush(data);
            data = {
                event: 'errorMessage',
                errorMessage: errors, // First Name field is required, Last name ...
                donationAmount: window.unicef_datalayers.donation_amount, // donation amount i.e. "10" | "20" | "30"
                donationType: window.unicef_datalayers.donation_type_label  // One time Donation I Monthly Donation I Upgrade
            }
            if (window.unicef_datalayers.payment_method !== '') {
                data['paymentType'] = window.unicef_datalayers.payment_method; // either Credit Card or Bank Transfer
            }
            _this.dataLayerPush(data);
        },
        checkoutEvents: function (step_integer, step_key, $donation_form) {
            _this.setPaymentMethod($donation_form);
            var data = {
                event: 'EECcheckout',
                ecommerce: {
                    checkout: {
                        actionField: {'step': step_integer, 'option': step_key},
                        products: [
                            {
                                name: 'Donation', // actual product name, not URL
                                id: window.unicef_datalayers.json_attributes.entity_id, // nodeID should go here
                                price: window.unicef_datalayers.donation_amount,
                                brand: 'UNICEF',
                                category: window.unicef_datalayers.donation_type_label, // or One time Donation" I "Monthly Donation I Upgrade
                                quantity: 1
                            }
                        ]
                    },
                    donationType: window.unicef_datalayers.donation_type_label,  // donation type i.e. One time Donation I Monthly Donation I Upgrade
                    donationPurpose: window.unicef_datalayers.json_attributes.field_meta_campaign_theme,  // donation purpose i.e. Covid I Yemen I Emergency...
                    donorType: window.unicef_datalayers.donor_type,  // donor type i.e. Individual | Corporate | Organization
                    donationStep: step_key,
                    donationDuration: window.unicef_datalayers.donation_interval,  // '1' if one-time, '12' if monthly or upgrade
                    donationAmount: window.unicef_datalayers.donation_amount,  // chosen previously amount
                    orderID: window.unicef_datalayers.json_attributes.order_id, // this should map to the drupalID or drupal_order_number (Stripe) and should be available from step 1

                }
            }
            _this.dataLayerPush(data);
        },
        setPaymentMethod: function ($donation_form) {
            //Payment method type
            var payment_method = $donation_form.find('input[name="payment_processor_selection[plugin_id]"]');
            if (payment_method.length > 0) {
                window.unicef_datalayers.payment_method = _this.mappingValues('payment_method', payment_method.val());
            }
        },
        mappingValues: function (key, value) {
            var mappings = {
                'field_meta_campaign_type': {
                    'Default': 'Individual',
                    'Corporate': 'Company',
                    'Emergency': 'Emergency',
                },
                'donation_type': {
                    'one-time': 'One time Donation',
                    'monthly': 'Monthly Donation',
                    'upgrade': 'Upgrade',
                },
                'donation_step': {
                    'donation_amount': 'Donation Start',
                    'personal_details': 'Personal Information',
                    'payment_processor': 'Payment Method',
                    'thank_you': 'Donation Submit'
                },
                'payment_method': {
                    'stripe_elements_payment_intent': 'Credit Card',
                }
            }
            return mappings[key][value];
        },
        checkErrors: function ($donation_form) {
            var errors = _this.getErrors($donation_form);
            if (errors.length > 0) {
                _this.errorEvents(errors);
            }
        },
        getStripeErrors: function ($donation_form) {
            var error_messages = '';
            var $stripe_elements = $donation_form.find('.commerce-donation-stripe-elements');
            if ($stripe_elements.length > 0) {
                if ($stripe_elements.find('.outcome .error.visible').length) {
                    var error_text = $stripe_elements.find('.outcome .error.visible').text();
                    var $error_elements = $stripe_elements.find('.StripeElement--invalid');
                    error_messages = error_text + ":";
                    var iterator = 1;
                    $error_elements.each(function () {
                        error_messages = error_messages + $(this).attr('id');
                        if (iterator !== $error_elements.length) {
                            error_messages = error_messages + ","
                        }
                        iterator++;
                    });
                }
            }
            return error_messages;
        },
        getErrors: function ($donation_form) {
            var error_messages = _this.getStripeErrors($donation_form);
            if (typeof window.unicef_clientside_validation.form_errors !== "undefined") {
                var errors = window.unicef_clientside_validation.form_errors;
                if (errors.length) {
                    var iterator = 1;
                    for (let error of errors) {
                        error_messages = error_messages + error.element_name + ":" + error.element_error;
                        if (iterator !== errors.length) {
                            error_messages = error_messages + ","
                        }
                        iterator++;
                    }
                }
            }
            return error_messages;
        },
        //DL push and logging function
        dataLayerPush: function (data) {
            $(document).consoleLogger(data);
            dataLayer.push(data);
        }
    };
})(jQuery, window, Drupal, drupalSettings);
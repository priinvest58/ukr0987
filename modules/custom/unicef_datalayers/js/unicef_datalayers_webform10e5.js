(function ($, window, Drupal, drupalSettings) {

    'use strict';

    Drupal.AjaxCommands.prototype.datalayerpush = function (ajax, response, status) {
        $(document).consoleLogger(response);
        dataLayer.push(response.data);
    };

})(jQuery, window, Drupal, drupalSettings);

(function ($, window, Drupal, drupalSettings) {

    'use strict';

    window.unicef_datalayers = [];
    var _this;
    var variables_set;

    Drupal.behaviors.unicef_datalayers = {
        //Default vars
        getDefaults: function () {
            //Window globals that apply to all forms
            if ($('.page-wrapper').hasClass('embed')) {
                window.unicef_datalayers.page_type = '(embed)';
            } else {
                window.unicef_datalayers.page_type = '(home)';
            }
            window.unicef_datalayers.onetime_prods = [];
            window.unicef_datalayers.monthly_prods = [];
            window.unicef_datalayers.monthly_donation_category = 'Monthly_donate';
            window.unicef_datalayers.monthly_donation_list = 'Donate monthly' + unicef_datalayers.page_type;
            window.unicef_datalayers.onetime_donation_category = 'Once_donate';
            window.unicef_datalayers.onetime_donation_list = 'Donate once' + unicef_datalayers.page_type;
            window.unicef_datalayers.upgrade_donation_category = 'Upgrade_donate';
            window.unicef_datalayers.upgrade_donation_list = 'Upgrade' + unicef_datalayers.page_type;
            window.unicef_datalayers.page_name = window.location.href;
            window.unicef_datalayers.currency_code = $('input[name="donation_amounts[currency_code]"]').val();
            window.unicef_datalayers.country_name = '';
            window.unicef_datalayers.form_iterator = 0;
            window.unicef_datalayers.skus = [];
            window.unicef_datalayers.selected_index = 0;
            window.unicef_datalayers.selected_price = parseInt($('.vertical-tabs-active-tab').next().find('input:checked').val());
            window.unicef_datalayers.selected_sku = window.unicef_datalayers.currency_code + window.unicef_datalayers.selected_price;
            window.unicef_datalayers.form_dimension = '';
            window.unicef_datalayers.checkout_step = 1;
            window.unicef_datalayers.donation_type = '';
            window.unicef_datalayers.other_amount = false;
            window.unicef_datalayers.selected_donation_category = '';
            window.unicef_datalayers.selected_donation_list = '';
            window.unicef_datalayers.donation_form_id = undefined;
        },
        //Attach Drupal script - page on ready
        attach: function (context, settings) {

            //setup vars once as Drupal runs this script on every request including ajax
            if (typeof variables_set === 'undefined') {
                _this = this;
                _this.getDefaults();
                _this.debug = true;
                variables_set = true;
            }
            //Get JSON attributes on each page load
            window.unicef_datalayers.json_attributes = $('.donation-form-json-attributes').data('json');
            //Run script once per donation form
            $('.block-donation-form-block > form', context).once('unicef_datalayers').each(function () {
                var $donation_form = $(this);
                //3.3.2. Errors in form - see stepone.php for more info
                //3.4. Custom Dimensions - see unicef_datalayers event subscriber for more info
                //4.1. Product Impressions and 4.1.1. Tracking codes for product impressions
                //Add datalayers for active tabs on load or when tabs are clicked on
                //_this.productImpressions('pageload', $donation_form);
                $($donation_form).on('shown.bs.tab', function (e) {
                    _this.productImpressions(e, $donation_form);
                });
                //4.2. Product clicks
                $($donation_form).find('#donation-amounts-wrapper div[data-drupal-selector="edit-one-time"] .form-radio').on('click', function (e) {
                    _this.productClicksOneTime(this, $donation_form);
                });
                $($donation_form).find('#donation-amounts-wrapper div[data-drupal-selector="edit-monthly"] .form-radio').on('click', function (e) {
                    _this.productClicksMonthly(this, $donation_form);
                });
                $($donation_form).find('#donation-amounts-wrapper div[data-drupal-selector="edit-upgrade"] .form-radio').on('click', function (e) {
                    _this.productClicksUpgrade(this, $donation_form);
                });
            });

            //Run script once per page load - not AJAX load
            //These data layers objects are not related to the donation form
            $(document, context).once('unicef_datalayers').each(function () {
                //Record page meta
                //_this.pageMeta();
                //section 3.1. Country Selection
                $('.form-item-country .select-wrapper select.form-select', context).once('unicef_datalayers').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
                    _this.countrySelect(e);
                });
                //section 3.2. Language Selection
                $('.form-item-lang-dropdown-select .select-wrapper select.form-select', context).once('unicef_datalayers').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
                    _this.languageSelect(e);
                });
                //section 3.3.1. Outbound Links
                $('a', context).on('click', function (e) {
                    var a = new RegExp('/' + window.location.host + '/');
                    if (e.target.getAttribute('href') !== null && !a.test(e.target.getAttribute('href'))) {
                        _this.outboundLinkClick(e);
                    }
                });
            });
            //4.4. Checkout Steps
            $('.block-donation-form-block .step_donation_amount button.btn-next').once('unicef_datalayers').on('click', function (e) {
                var $donation_form = $(e.target).closest('form');
                //4.3. Add To Cart
                _this.addToCart(e, $donation_form);
                _this.donationStart(e, $donation_form);
                _this.storeDonationData(e, $donation_form);
            });
            //4.4. Checkout Steps
            //Get the checkout step
            //@todo - figure out why a standard click event is attached multiple times and refine this code
            $('.block-donation-form-block > form').each(function () {
                var checkout_step = $(this).find('input[name="step_integer"]').val();
                var once_step = $(this).attr('id') + '_unicef_datalayers_' + checkout_step;
                $(this).find('button.btn-next').once(once_step).on('click', function (e) {
                    var $donation_form = $(e.target).closest('form');
                    //4.3. Add To Cart
                    _this.stepCounter(e, $donation_form);
                    //Analytics 360 - donation events
                    _this.donationFunnel(e, $donation_form);
                    //Track which donation form the user is interacting with
                    window.unicef_datalayers.donation_form_id = $donation_form.attr('id');
                    if (typeof window.unicef_datalayers.donation_form_id !== 'undefined') {
                        var json = {
                            'donation_form_id': window.unicef_datalayers.donation_form_id
                        };
                        _this.appendDonationData(json);
                    }
                    if (typeof window.unicef_datalayers.json_attributes.order_country !== 'undefined') {
                        var json = {
                            'country_name': window.unicef_datalayers.json_attributes.order_country
                        };
                        _this.appendDonationData(json);
                    }
                    //Append data to localstorage for later reference
                    //This could be reworked to capture all fields and append but PII will be stored
                    var locality = $donation_form.find('input.locality').val();
                    if (typeof locality !== 'undefined') {
                        var json = {
                            'locality': locality
                        };
                        _this.appendDonationData(json);
                    }
                });
            });
            //Donation submit
            /*$('.block-donation-form-block .step_payment_processor .btn.commerce-donation-payment-redirect, .block-donation-form-block .step_payment_processor .btn.single-payment-button').once('unicef_datalayers').on('click', function (e) {
              var $donation_form = $(e.target).closest('form');
              //Analytics 360 - donation submit
              _this.donationSubmit(e, $donation_form);
            });*/
            //4.5. Purchase
            if ($('#thank-you-wrapper.payment-success').length) {
                _this.extractDonationData();
                if (typeof window.unicef_datalayers.donation_form_id !== 'undefined') {
                    var $form = $('#' + window.unicef_datalayers.donation_form_id);
                    var $payment_success_el = $form.find('#thank-you-wrapper.payment-success');
                    if (!$payment_success_el.hasClass('processed')) {
                        $payment_success_el.addClass('processed');
                        var message = undefined;
                        _this.donationSubmit('Successful', message);
                        _this.trackTransaction(context);
                        _this.donationTransaction();
                    }
                }
            }
            //4.5.2. Purchase Errors
            if ($('#thank-you-wrapper.payment-failed').length) {
                _this.extractDonationData();
                if (typeof window.unicef_datalayers.donation_form_id !== 'undefined') {
                    var $form = $('#' + window.unicef_datalayers.donation_form_id);
                    var $payment_failed_el = $form.find('#thank-you-wrapper.payment-failed');
                    if (!$payment_failed_el.hasClass('processed')) {
                        $payment_failed_el.addClass('processed');
                        var message = window.unicef_datalayers.json_attributes.transaction_exception;
                        _this.donationSubmit('Unsuccessful', message);
                        _this.trackPurchaseError(context);
                    }
                }
            }
        },
        //Analytics 360
        pageMeta: function () {
            var data = {
                event: "Page Meta", //please do not change
                fullPageReferrer: document.referrer, // Referrer with full parameters
                originalPageUrl: window.unicef_datalayers.page_name, // URL with all parameters
                language: drupalSettings.path.currentLanguage, // e.g. en
            };
            _this.dataLayerPush(data);
        },
        donationFunnel: function (e, $donation_form) {
            window.unicef_datalayers.checkout_step = $($donation_form).find('input[name="step_integer"]').val();

            //Get button and check if it's a payment button
            var $button = $(e.target);
            var checkout_option;
            if ($button.attr('data-unicef-plugin-id')) {
                checkout_option = $button.attr('data-unicef-plugin-id');
            } else {
                checkout_option = undefined;
            }

            var data = {
                event: "EECcheckout",
                ecommerce: {
                    currencyCode: window.unicef_datalayers.currency_code, // please use local currency
                    checkout: {
                        actionField: {step: window.unicef_datalayers.checkout_step, option: checkout_option},
                        products: [
                            {
                                name: window.unicef_datalayers.json_attributes.node_url, // e.g. "One-time donation"| "Monthly donation"
                                id: window.unicef_datalayers.json_attributes.entity_id, // e.g. "12345"
                                price: window.unicef_datalayers.selected_price, // e.g. "300.00"
                                category: window.unicef_datalayers.selected_donation_category, // e.g. "Donation"
                                variant: window.unicef_datalayers.json_attributes.field_meta_campaign_title, // e.g. "Yemen Crisis",
                                quantity: "1" // e.g. 1
                            }
                        ]
                    }
                }
            };
            _this.dataLayerPush(data);
        },
        donationStart: function (e, $donation_form) {
            var $selected_window = $($donation_form).find('div.vertical-tabs-pane.active fieldset');
            if ($($selected_window).hasClass('one-time')) {
                window.unicef_datalayers.donation_type = 'Single';
                window.unicef_datalayers.selected_donation_category = window.unicef_datalayers.onetime_donation_category;
                window.unicef_datalayers.selected_donation_list = window.unicef_datalayers.onetime_donation_list;
            } else if ($($selected_window).hasClass('monthly')) {
                window.unicef_datalayers.donation_type = 'Monthly';
                window.unicef_datalayers.selected_donation_category = window.unicef_datalayers.monthly_donation_category;
                window.unicef_datalayers.selected_donation_list = window.unicef_datalayers.monthly_donation_list;
            } else if ($($selected_window).hasClass('upgrade')) {
                window.unicef_datalayers.donation_type = 'Upgrade';
                window.unicef_datalayers.selected_donation_category = window.unicef_datalayers.upgrade_donation_category;
                window.unicef_datalayers.selected_donation_list = window.unicef_datalayers.upgrade_donation_list;
            }

            var $selected_radio = $($donation_form).find('.vertical-tabs-pane.active input:checked');
            window.unicef_datalayers.selected_price = parseInt($selected_radio.val());
            if ($selected_radio.hasClass('other')) {
                if (window.unicef_datalayers.donation_type === 'Single') {
                    window.unicef_datalayers.selected_price = parseInt($($donation_form).find('[data-sku="one-time-other"]').val());
                    window.unicef_datalayers.other_amount = true;
                } else if (window.unicef_datalayers.donation_type === 'Monthly') {
                    window.unicef_datalayers.selected_price = parseInt($($donation_form).find('[data-sku="monthly-other"]').val());
                    window.unicef_datalayers.other_amount = true;
                } else if (window.unicef_datalayers.donation_type === 'Upgrade') {
                    window.unicef_datalayers.selected_price = parseInt($($donation_form).find('[data-sku="upgrade-other"]').val());
                    window.unicef_datalayers.other_amount = true;
                }
            } else {
                window.unicef_datalayers.other_amount = false;
            }

            //Setup vars for function enclosure to be used after ajax complete
            var event_label;
            var event_value;
            var error_message;
            var ajax_complete_triggered = false;

            //Wait for next button click ajax to complete before triggering DL event
            $(document).ajaxComplete(function (event, request, settings) {
                if (ajax_complete_triggered === false) {
                    if (typeof drupalSettings.unicef_datalayers !== 'undefined') {
                        if (drupalSettings.unicef_datalayers.error_messages !== '') {
                            var error_messages = "";
                            $.each(drupalSettings.unicef_datalayers.error_messages, function (index, value) {
                                error_messages = error_messages + index + ": " + value;
                            });
                            event_label = 'Unsuccessful';
                            event_value = undefined;
                            error_message = error_messages;
                        } else {
                            event_label = 'Successful';
                            event_value = undefined;
                            error_message = undefined;
                        }
                    }

                    var data = {
                        event: "gaEvent",
                        eventCategory: "Donations",
                        eventAction: "Donation Start",
                        eventLabel: event_label, // e.g. "Successful"
                        eventValue: event_value,
                        errorMessage: error_message, // e.g "Blank field"
                        donationAmount: window.unicef_datalayers.selected_price, // e.g "50", "80", "130"
                        paymentType: undefined, // e.g "Credit card", "PayPal"
                        donationType: window.unicef_datalayers.donation_type, // e.g "Single" | "Monthly"
                        otherAmount: window.unicef_datalayers.other_amount, // e.g "true", "false"
                    };
                    _this.dataLayerPush(data);
                }
                ajax_complete_triggered = true;
            });
        },
        donationSubmit: function (order_status, message) {
            var data = {
                event: "gaEvent",
                eventCategory: "Donations",
                eventAction: "Donation Submit",
                eventLabel: order_status, // e.g. "Successful"
                eventValue: undefined,
                errorMessage: message, // e.g "Blank field"
                donationAmount: window.unicef_datalayers.selected_price, // e.g "50", "80", "130"
                donationType: window.unicef_datalayers.selected_donation_category, // e.g "Single" | "Monthly"
                donatorType: undefined, // e.g "Private Person", "Company"
                userRegion: window.unicef_datalayers.locality, // e.g "Barcelona", "Lugo" etc.
                otherAmount: window.unicef_datalayers.other_amount // e.g "true", "false"
            };
            _this.dataLayerPush(data);
        },
        donationTransaction: function () {
            var donation_amount_net = window.unicef_datalayers.json_attributes.order_amount;
            if (typeof window.unicef_datalayers.json_attributes.order_fees !== 'undefined') {
                donation_amount_net = window.unicef_datalayers.json_attributes.order_amount - window.unicef_datalayers.json_attributes.order_fees;
            }

            var data = {
                event: "EECpurchase",
                donationType: window.unicef_datalayers.donation_type, // e.g. "Regular Donation"| "One-time Donation"
                donationPurpose: window.unicef_datalayers.json_attributes.field_meta_campaign_theme, // e.g. "Covid" | "Yemen" etc.
                donatorType: undefined, // e.g. "Individual" | "Corporate" | "Organization"
                donatorCategory: undefined, // e.g. "School" | "Sports club" If this information is not available, please use javascript undefined
                paymentType: window.unicef_datalayers.json_attributes.order_payment_method, // e.g. "Credit card", "bank transfer" etc.
                transactionId: window.unicef_datalayers.json_attributes.order_id,
                donationAmount: donation_amount_net,
                transactionGrossValue: window.unicef_datalayers.json_attributes.order_amount,
                ecommerce: {
                    currencyCode: window.unicef_datalayers.currency_code, // please use local currency
                    purchase: {
                        actionField: {
                            id: window.unicef_datalayers.json_attributes.order_id, // e.g. "12345"
                            affiliation: window.unicef_datalayers.json_attributes.order_country,
                            revenue: donation_amount_net, // e.g. "300.00"
                            tax: undefined, // e.g. "0.00"
                            coupon: undefined // e.g. "unicef2020"
                        },
                        products: [
                            {
                                name: window.unicef_datalayers.json_attributes.node_url, // e.g. "One-time donation"| "Monthly donation"
                                id: window.unicef_datalayers.json_attributes.entity_id, // e.g. "12345"
                                price: window.unicef_datalayers.selected_price, // e.g. "300.00"
                                brand: "UNICEF", // e.g. "UNICEF"
                                category: window.unicef_datalayers.selected_donation_category, // e.g. "Donation"
                                variant: window.unicef_datalayers.json_attributes.field_meta_campaign_title, // e.g. "Yemen Crisis",
                                quantity: "1", // e.g. 1,
                                coupon: undefined // e.g. "unicef2020"
                            },
                            // , {additional products}
                        ]
                    }
                }
            };
            _this.dataLayerPush(data);
        },
        //End Analytics 360
        stepCounter: function (e, $donation_form) {
            window.unicef_datalayers.form_dimension = _this.getFormDimension($donation_form);
            window.unicef_datalayers.checkout_step = $(e.target).closest('form').find('input[name="step_integer"]').val();
            var data = {
                'prods': [{
                    'name': window.unicef_datalayers.page_name,
                    'id': window.unicef_datalayers.currency_code,
                    'price': window.unicef_datalayers.selected_price,
                    'category': window.unicef_datalayers.selected_donation_category,
                    'position': window.unicef_datalayers.selected_index,
                    'quantity': 1,
                    'dimension4': window.unicef_datalayers.form_dimension
                }],
                'step': window.unicef_datalayers.checkout_step,
                'event': 'checkoutView'
            };
            _this.dataLayerPush(data);
        },
        //section 3.1. Country Selection
        countrySelect: function (e) {
            var selected = $(e.currentTarget).val();
            var data = {
                'event': 'trackEvent',
                'eventCategory': 'Header',
                'eventAction': 'Country Selection',
                'eventLabel': selected
            };
            _this.dataLayerPush(data);
        },
        //section 3.2. Language Selection
        languageSelect: function (e) {
            var selected = $(e.currentTarget).val();
            var data = {
                'event': 'trackEvent',
                'eventCategory': 'Header',
                'eventAction': 'Language Selection',
                'eventLabel': selected
            };
            _this.dataLayerPush(data);
        },
        //section 3.3.1. Outbound Links
        outboundLinkClick: function (e) {
            var event_label = $(e.target).text().split(' ').join('_');
            //console.log(event_label);
            //var link_href = e.target.getAttribute('href');
            var data = {
                'event': 'TrackEvent',
                'eventCategory': 'Outbound_links',
                'eventAction': 'Click',
                'eventLabel': event_label
                //'eventCallback': function () {
                //   window.location = link_href;
                // }
            };
            _this.dataLayerPush(data);
        },
        getFormDimension: function ($donation_form) {
            //Custom dimension for donation form
            if ($($donation_form).parents(".page_top.container").length === 1) {
                window.unicef_datalayers.form_dimension = 'Top Section Donate Form';
            } else {
                window.unicef_datalayers.form_iterator++;
                window.unicef_datalayers.form_dimension = 'Content Section Donate Form ' + window.unicef_datalayers.form_iterator;
            }
            return window.unicef_datalayers.form_dimension;
        },
        //4.1. Product Impressions and 4.1.1. Tracking codes for product impressions
        //Add datalayers for active tabs on load or when tabs are clicked on
        productImpressions: function (e, $donation_form) {
            var tab = $(e.target);
            if (e === 'pageload') {
                tab = $($donation_form).find('.vertical-tab-button.active a');
            }
            var tab_anchor = $(tab).attr('href');
            window.unicef_datalayers.form_dimension = _this.getFormDimension($donation_form);
            window.unicef_datalayers.onetime_prods = [];
            window.unicef_datalayers.monthly_prods = [];
            window.unicef_datalayers.upgrade_prods = [];
            //This check if the tab is active
            if (tab.parent().hasClass('active')) {
                //console.log('the tab with the content id ' + tab_anchor + ' is visible');
                if ($(tab).attr('href').indexOf('one-time') !== -1) {
                    //console.log('one-time');
                    $(tab).addClass('one-time');
                } else if ($(tab).attr('href').indexOf('monthly') !== -1) {
                    //console.log('monthly');
                    $(tab).addClass('monthly');
                } else if ($(tab).attr('href').indexOf('upgrade') !== -1) {
                    $(tab).addClass('upgrade');
                }

                var iterator = 0;
                var iterator_price = 0;
                var iterator_sku = '';

                if (tab.hasClass('one-time')) {
                    if ($($donation_form).find('.block-donation-form-block.donation-type-active-one-time')) {
                        $($donation_form).find(tab_anchor + '.tab-pane.active input:radio').each(function (key, value) {

                            iterator_sku = window.unicef_datalayers.currency_code + $(this).val();
                            iterator_price = parseInt($(this).val());
                            if (isNaN(iterator_price)) {
                                iterator_price = 0;
                            }
                            window.unicef_datalayers.skus.push(iterator_sku);
                            var product = {
                                'name': window.unicef_datalayers.page_name,
                                'id': window.unicef_datalayers.currency_code,
                                'price': iterator_price,
                                'category': window.unicef_datalayers.onetime_donation_category,
                                'list': window.unicef_datalayers.onetime_donation_list,
                                'position': iterator,
                                'dimension4': window.unicef_datalayers.form_dimension
                            };
                            window.unicef_datalayers.onetime_prods.push(product);
                            iterator++;
                        });
                        var data = {
                            'prods': window.unicef_datalayers.onetime_prods,
                            'event': 'trackProdImp'
                        };
                        _this.dataLayerPush(data);
                    }

                } else if (tab.hasClass('monthly')) {

                    if ($($donation_form).find('.block-donation-form-block.donation-type-active-monthly')) {
                        iterator = 0;

                        $($donation_form).find(tab_anchor + '.tab-pane.active input:radio').each(function (key, value) {
                            iterator_sku = window.unicef_datalayers.currency_code + $(this).val();
                            iterator_price = parseInt($(this).val());
                            if (isNaN(iterator_price)) {
                                iterator_price = 0;
                            }
                            window.unicef_datalayers.skus.push(iterator_sku);
                            var product = {
                                'name': window.unicef_datalayers.page_name,
                                'id': window.unicef_datalayers.currency_code,
                                'price': iterator_price,
                                'category': window.unicef_datalayers.monthly_donation_category,
                                'list': window.unicef_datalayers.monthly_donation_list,
                                'position': iterator,
                                'dimension4': window.unicef_datalayers.form_dimension
                            };
                            window.unicef_datalayers.monthly_prods.push(product);
                            iterator++;
                        });
                        var data = {
                            'prods': window.unicef_datalayers.monthly_prods,
                            'event': 'trackProdImp'
                        };
                        _this.dataLayerPush(data);
                    }

                } else if (tab.hasClass('upgrade')) {

                    if ($($donation_form).find('.block-donation-form-block.donation-type-active-upgrade')) {
                        iterator = 0;

                        $($donation_form).find(tab_anchor + '.tab-pane.active input:radio').each(function (key, value) {
                            iterator_sku = window.unicef_datalayers.currency_code + $(this).val();
                            iterator_price = parseInt($(this).val());
                            if (isNaN(iterator_price)) {
                                iterator_price = 0;
                            }
                            window.unicef_datalayers.skus.push(iterator_sku);
                            var product = {
                                'name': window.unicef_datalayers.page_name,
                                'id': window.unicef_datalayers.currency_code,
                                'price': iterator_price,
                                'category': window.unicef_datalayers.upgrade_donation_category,
                                'list': window.unicef_datalayers.upgrade_donation_list,
                                'position': iterator,
                                'dimension4': window.unicef_datalayers.form_dimension
                            };
                            window.unicef_datalayers.upgrade_prods.push(product);
                            iterator++;
                        });
                        var data = {
                            'prods': window.unicef_datalayers.upgrade_prods,
                            'event': 'trackProdImp'
                        };
                        _this.dataLayerPush(data);
                    }
                }
            } else {
                //console.log('the tab with the content id ' + contentId + ' is NOT visible');
            }
        },
        //4.2. Product clicks
        productClicksOneTime: function (element, $donation_form) {
            window.unicef_datalayers.selected_sku = window.unicef_datalayers.currency_code + $(element).val();
            if ($(element).val().match(/\d+/g)) {
                window.unicef_datalayers.selected_price = parseFloat($(element).val()).toFixed(2);
            } else {
                window.unicef_datalayers.selected_price = 0;
            }
            window.unicef_datalayers.selected_index = $($donation_form).find('#donation-amounts-wrapper div[data-drupal-selector="edit-one-time"] .form-radio').index(element);
            window.unicef_datalayers.form_dimension = _this.getFormDimension($donation_form);

            var data = {
                'actionField': {
                    'list': window.unicef_datalayers.onetime_donation_list
                },
                'prods': [{
                    'name': window.unicef_datalayers.page_name,
                    'id': window.unicef_datalayers.currency_code,
                    'price': window.unicef_datalayers.selected_price,
                    'category': window.unicef_datalayers.onetime_donation_category,
                    'list': window.unicef_datalayers.onetime_donation_list,
                    'position': window.unicef_datalayers.selected_index,
                    'dimension4': window.unicef_datalayers.form_dimension
                }],
                'event': 'trackClickProd'
            };
            _this.dataLayerPush(data);
        },
        //4.2. Product clicks
        productClicksMonthly: function (element, $donation_form) {
            window.unicef_datalayers.selected_sku = window.unicef_datalayers.currency_code + $(element).val();
            if ($(element).val().match(/\d+/g)) {
                window.unicef_datalayers.selected_price = parseFloat($(element).val()).toFixed(2);
            } else {
                window.unicef_datalayers.selected_price = 0;
            }
            window.unicef_datalayers.selected_index = $($donation_form).find('#donation-amounts-wrapper div[data-drupal-selector="edit-monthly"] .form-radio').index(element);
            window.unicef_datalayers.form_dimension = _this.getFormDimension($donation_form);

            var data = {
                'actionField': {
                    'list': window.unicef_datalayers.monthly_donation_list
                },
                'prods': [{
                    'name': window.unicef_datalayers.page_name,
                    'id': window.unicef_datalayers.currency_code,
                    'price': window.unicef_datalayers.selected_price,
                    'category': window.unicef_datalayers.monthly_donation_category,
                    'list': window.unicef_datalayers.monthly_donation_list,
                    'position': window.unicef_datalayers.selected_index,
                    'dimension4': window.unicef_datalayers.form_dimension
                }],
                'event': 'trackClickProd'
            };
            _this.dataLayerPush(data);
        },
        productClicksUpgrade: function (element, $donation_form) {
            window.unicef_datalayers.selected_sku = window.unicef_datalayers.currency_code + $(element).val();
            if ($(element).val().match(/\d+/g)) {
                window.unicef_datalayers.selected_price = parseFloat($(element).val()).toFixed(2);
            } else {
                window.unicef_datalayers.selected_price = 0;
            }
            window.unicef_datalayers.selected_index = $($donation_form).find('#donation-amounts-wrapper div[data-drupal-selector="edit-upgrade"] .form-radio').index(element);
            window.unicef_datalayers.form_dimension = _this.getFormDimension($donation_form);

            var data = {
                'actionField': {
                    'list': window.unicef_datalayers.upgrade_donation_list
                },
                'prods': [{
                    'name': window.unicef_datalayers.page_name,
                    'id': window.unicef_datalayers.currency_code,
                    'price': window.unicef_datalayers.selected_price,
                    'category': window.unicef_datalayers.upgrade_donation_category,
                    'list': window.unicef_datalayers.upgrade_donation_list,
                    'position': window.unicef_datalayers.selected_index,
                    'dimension4': window.unicef_datalayers.form_dimension
                }],
                'event': 'trackClickProd'
            };
            _this.dataLayerPush(data);
        },
        //4.3. Add To Cart
        addToCart: function (e, $donation_form) {
            if ($(e.target).hasClass('clicked')) {
                return;
            }
            window.unicef_datalayers.form_dimension = _this.getFormDimension($donation_form);

            var $selected_window = $($donation_form).find('div.vertical-tabs-pane.active fieldset');
            if ($($selected_window).hasClass('one-time')) {
                window.unicef_datalayers.donation_type = 'Single';
                window.unicef_datalayers.selected_donation_category = window.unicef_datalayers.onetime_donation_category;
                window.unicef_datalayers.selected_donation_list = window.unicef_datalayers.onetime_donation_list;
            } else if ($($selected_window).hasClass('monthly')) {
                window.unicef_datalayers.donation_type = 'Monthly';
                window.unicef_datalayers.selected_donation_category = window.unicef_datalayers.monthly_donation_category;
                window.unicef_datalayers.selected_donation_list = window.unicef_datalayers.monthly_donation_list;
            } else if ($($selected_window).hasClass('upgrade')) {
                window.unicef_datalayers.donation_type = 'Upgrade';
                window.unicef_datalayers.selected_donation_category = window.unicef_datalayers.upgrade_donation_category;
                window.unicef_datalayers.selected_donation_list = window.unicef_datalayers.upgrade_donation_list;
            }

            var $selected_radio = $($donation_form).find('.vertical-tabs-pane.active input:checked');
            window.unicef_datalayers.selected_price = parseInt($selected_radio.val());
            if ($selected_radio.hasClass('other')) {
                if (window.unicef_datalayers.donation_type === 'Single') {
                    window.unicef_datalayers.selected_price = parseInt($($donation_form).find('[data-sku="one-time-other"]').val());
                } else if (window.unicef_datalayers.donation_type === 'Monthly') {
                    window.unicef_datalayers.selected_price = parseInt($($donation_form).find('[data-sku="monthly-other"]').val());
                } else if (window.unicef_datalayers.donation_type === 'Upgrade') {
                    window.unicef_datalayers.selected_price = parseInt($($donation_form).find('[data-sku="upgrade-other"]').val());
                }
            }

            var data = {
                'prods': [{
                    'name': window.unicef_datalayers.page_name,
                    'id': window.unicef_datalayers.currency_code,
                    'price': window.unicef_datalayers.selected_price,
                    'category': window.unicef_datalayers.selected_donation_category,
                    'list': window.unicef_datalayers.selected_donation_list,
                    'position': window.unicef_datalayers.selected_index,
                    'quantity': 1,
                    'dimension4': window.unicef_datalayers.form_dimension
                }],
                'event': 'trackaddtocart'
            };
            _this.dataLayerPush(data);
            $(e.target).addClass('clicked');
        },
        extractDonationData: function () {
            var local_data = localStorage.getItem('unicef_datalayers_donation_data');
            if (local_data !== null) {
                if (typeof window.unicef_datalayers === 'undefined') {
                    window.unicef_datalayers = [];
                }
                var donation_data = JSON.parse(localStorage.getItem('unicef_datalayers_donation_data'));
                $.each(donation_data.unicef_datalayers, function (i, item) {
                    window.unicef_datalayers[i] = item;
                });
            }
        },
        appendDonationData: function (json) {
            var local_data = localStorage.getItem('unicef_datalayers_donation_data');
            if (local_data !== null) {
                var donation_data = JSON.parse(localStorage.getItem('unicef_datalayers_donation_data'));
                $.extend(donation_data.unicef_datalayers, json);
                localStorage.setItem('unicef_datalayers_donation_data', JSON.stringify(donation_data));
            }
        },
        storeDonationData: function (e, $donation_form) {
            var donation_data = {
                'unicef_datalayers': {
                    'country_code': window.unicef_datalayers.currency_code,
                    'selected_price': window.unicef_datalayers.selected_price,
                    'page_name': window.unicef_datalayers.page_name,
                    'currency_code': window.unicef_datalayers.currency_code,
                    'selected_donation_category': window.unicef_datalayers.selected_donation_category,
                    'selected_index': window.unicef_datalayers.selected_index,
                    'form_dimension': window.unicef_datalayers.form_dimension,
                    'campaign_type': window.unicef_datalayers.json_attributes.field_meta_campaign_type,
                    'other_amount': window.unicef_datalayers.other_amount,
                    'donation_type': window.unicef_datalayers.donation_type
                },
            };
            localStorage.setItem('unicef_datalayers_donation_data', JSON.stringify(donation_data));
        },
        getDonationCategory: function () {
            return window.unicef_datalayers.selected_donation_category;
        },
        getDonationType: function () {
            return window.unicef_datalayers.donation_type;
        },
        getDonationList: function () {
            return window.unicef_datalayers.selected_donation_list;
        },
        //4.4. Checkout Steps
        checkoutSteps: function (e, $donation_form) {
            window.unicef_datalayers.checkout_step = $(e.target).closest('form').find('input[name="step_integer"]').val();
            $donation_form = $(e.target).closest('form');
            window.unicef_datalayers.form_dimension = _this.getFormDimension($donation_form);
            var data = {
                'prods': [{
                    'name': window.unicef_datalayers.page_name,
                    'id': window.unicef_datalayers.currency_code,
                    'price': window.unicef_datalayers.selected_price,
                    'category': window.unicef_datalayers.selected_donation_category,
                    'position': window.unicef_datalayers.selected_index,
                    'quantity': 1,
                    'dimension4': window.unicef_datalayers.form_dimension
                }],
                'step': window.unicef_datalayers.checkout_step,
                'event': 'checkoutView'
            };
            _this.dataLayerPush(data);
        },
        //4.5. Purchase
        trackTransaction: function (context) {
            var order_id = $('input[name="order_number"]').val();
            var data = {
                'purchs': {
                    'id': order_id,
                    'revenue': window.unicef_datalayers.selected_price,
                    'affiliation': window.unicef_datalayers.country_name
                },
                'prods': [{
                    'name': window.unicef_datalayers.page_name,
                    'id': window.unicef_datalayers.currency_code,
                    'price': window.unicef_datalayers.selected_price,
                    'category': window.unicef_datalayers.selected_donation_category,
                    'position': window.unicef_datalayers.selected_index,
                    'quantity': 1,
                    'dimension4': window.unicef_datalayers.form_dimension
                }],
                'event': 'trackTransaction'
            };
            _this.dataLayerPush(data);
        },
        //4.5.2. Purchase Errors
        trackPurchaseError: function (context) {
            dataLayer.push({
                'event': 'trackEvent',
                'eventCategory': 'Purchase_error',
                'eventAction': 'error',
                'eventLabel': 'Donation_failed'
            });
        },
        //DL push and logging function
        dataLayerPush: function (data) {
            $(document).consoleLogger(data);
            dataLayer.push(data);
        }
    };
})(jQuery, window, Drupal, drupalSettings);


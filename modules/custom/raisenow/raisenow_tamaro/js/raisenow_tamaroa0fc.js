/**
 * @file
 * Commerce Donation RaiseNow Tamaro JS.
 */

(function ($, window, Drupal, drupalSettings) {

  'use strict';

  // Creates a plugin for the RaiseNow widget
  $.fn.addRaiseNowWidget = function (settings) {
    if (typeof settings !== "undefined" && this.length && !$(".tamaro-widget", this).length) {
      $.holdReady(true);
      $.getScript(settings.source, function () {
        window.rnw.tamaro.runWidget('.rnw-widget-container', settings.options).then(function(api) {
          api.paymentForm.setPaymentType(drupalSettings.raiseNowTamaro.options.defaultPaymentType);
          window.rnapi = api;
        });
        //FORM SUBMIT BUG - clicking any button element submit parent form
        //Subscribe to render event and add type attr to buttons
        window.rnw.tamaro.events.afterRender.subscribe(function(event) {
          //event contains data.api details for manipulation but ready event is required to make sure afterRender actually fires after render!
          $( '.rnw-widget-container .widget-content' ).ready(function() {
            var $spam = $(this).find('.footer-info .main .text');
            $spam.hide();
            var $buttons = $(this).find('button');
            $buttons.each(function() {
              //$(this).attr('type', 'button');
              $(this).on('click', function(){
                $(this.form).attr('data-rn-button-click', 'true');
              });
            });
          });
        });
        //END FORM SUBMIT BUG
        $.holdReady(false);
      });
    }
  };

  /**
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the behavior for RaiseNow processing.
   */
  Drupal.behaviors.commerceDonationRaiseNowTamaro = {
    attach: function (context, settings) {
      $('.rnw-widget-container', context).once('raiseNowWidgetContainer').each(function (e) {
        $('.rnw-widget-container').addRaiseNowWidget(drupalSettings.raiseNowTamaro);
      });
      $('.rnw-widget-container .debug button, .rnw-widget-container .debug span').on('click' ,function (e) {
        e.preventDefault();
      });
      //FORM SUBMIT BUG - clicking any button element submit parent form
      $('.unicef-ajax-multistep-donation-form form').on('submit', function (e) {
        if($(this).attr('data-rn-button-click') === "true"){
          return false;
        }
      });
      $('.unicef-ajax-multistep-donation-form form button.js-form-submit').on('click', function(){
        $(this.form).attr('data-rn-button-click', 'false');
      });
      //END FORM SUBMIT BUG
    }
  };

})(jQuery, window, Drupal, drupalSettings);

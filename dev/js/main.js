jQuery( document ).ready(function( $ ) {

	// Remove the 300ms click delays on browsers with touch UIs
	FastClick.attach( document.body );

	// Detect the device of the visitor
	if( Modernizr.mq('only screen and (min-width: 1200px)') ) {
		device = 'desktop';
	} else
	if( Modernizr.mq('only screen and (min-width: 992px)') ) {
		device = 'tablet';
	}

	// CODE HERE

});
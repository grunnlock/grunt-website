// Get the name of events firing at the end of CSS animations
var transitionsEndEventsNames = {
	'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
};

var transitionsEndEventsName = transitionsEndEventsNames[ Modernizr.prefixed( 'transition' ) ];

// Variable used to detect the visitor device
var device = 'mobile';
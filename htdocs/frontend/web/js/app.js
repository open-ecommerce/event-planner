//get the click event for the view publisher agents
$(".viewProfileInfo").on('click', function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    $('#modal-profile').modal('show')
            .find('#modalProfileContent')
            //.load($(this).attr('value') + '?id=' + $('#book-rights_owner_id').val());
            .load($(this).attr('value'));
});


/*
 * Copyright (c) 2014 Mike King (@micjamking)
 *
 * jQuery Succinct plugin
 * Version 1.1.0 (October 2014)
 *
 * Licensed under the MIT License
 */

 /*global jQuery*/
(function($) {
	'use strict';

	$.fn.succinct = function(options) {

		var settings = $.extend({
				size: 240,
				omission: '...',
				ignore: true
			}, options);

		return this.each(function() {

			var textDefault,
				textTruncated,
				elements = $(this),
				regex    = /[!-\/:-@\[-`{-~]$/,
				init     = function() {
					elements.each(function() {
						textDefault = $(this).html();

						if (textDefault.length > settings.size) {
							textTruncated = $.trim(textDefault)
											.substring(0, settings.size)
											.split(' ')
											.slice(0, -1)
											.join(' ');

							if (settings.ignore) {
								textTruncated = textTruncated.replace(regex, '');
							}

							$(this).html(textTruncated + settings.omission);
						}
					});
				};
			init();
		});
	};
})(jQuery);


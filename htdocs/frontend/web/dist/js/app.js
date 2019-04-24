/**
 * Yii JavaScript module.
 *
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */

/**
 * yii is the root module for all Yii JavaScript modules.
 * It implements a mechanism of organizing JavaScript code in modules through the function "yii.initModule()".
 *
 * Each module should be named as "x.y.z", where "x" stands for the root module (for the Yii core code, this is "yii").
 *
 * A module may be structured as follows:
 *
 * ```javascript
 * window.yii.sample = (function($) {
 *     var pub = {
 *         // whether this module is currently active. If false, init() will not be called for this module
 *         // it will also not be called for all its child modules. If this property is undefined, it means true.
 *         isActive: true,
 *         init: function() {
 *             // ... module initialization code goes here ...
 *         },
 *
 *         // ... other public functions and properties go here ...
 *     };
 *
 *     // ... private functions and properties go here ...
 *
 *     return pub;
 * })(window.jQuery);
 * ```
 *
 * Using this structure, you can define public and private functions/properties for a module.
 * Private functions/properties are only visible within the module, while public functions/properties
 * may be accessed outside of the module. For example, you can access "yii.sample.isActive".
 *
 * You must call "yii.initModule()" once for the root module of all your modules.
 */
window.yii = (function ($) {
    var pub = {
        /**
         * List of JS or CSS URLs that can be loaded multiple times via AJAX requests.
         * Each item may be represented as either an absolute URL or a relative one.
         * Each item may contain a wildcard matching character `*`, that means one or more
         * any characters on the position. For example:
         *  - `/css/*.css` will match any file ending with `.css` in the `css` directory of the current web site
         *  - `http*://cdn.example.com/*` will match any files on domain `cdn.example.com`, loaded with HTTP or HTTPS
         *  - `/js/myCustomScript.js?realm=*` will match file `/js/myCustomScript.js` with defined `realm` parameter
         */
        reloadableScripts: [],
        /**
         * The selector for clickable elements that need to support confirmation and form submission.
         */
        clickableSelector: 'a, button, input[type="submit"], input[type="button"], input[type="reset"], ' +
            'input[type="image"]',
        /**
         * The selector for changeable elements that need to support confirmation and form submission.
         */
        changeableSelector: 'select, input, textarea',

        /**
         * @return string|undefined the CSRF parameter name. Undefined is returned if CSRF validation is not enabled.
         */
        getCsrfParam: function () {
            return $('meta[name=csrf-param]').attr('content');
        },

        /**
         * @return string|undefined the CSRF token. Undefined is returned if CSRF validation is not enabled.
         */
        getCsrfToken: function () {
            return $('meta[name=csrf-token]').attr('content');
        },

        /**
         * Sets the CSRF token in the meta elements.
         * This method is provided so that you can update the CSRF token with the latest one you obtain from the server.
         * @param name the CSRF token name
         * @param value the CSRF token value
         */
        setCsrfToken: function (name, value) {
            $('meta[name=csrf-param]').attr('content', name);
            $('meta[name=csrf-token]').attr('content', value);
        },

        /**
         * Updates all form CSRF input fields with the latest CSRF token.
         * This method is provided to avoid cached forms containing outdated CSRF tokens.
         */
        refreshCsrfToken: function () {
            var token = pub.getCsrfToken();
            if (token) {
                $('form input[name="' + pub.getCsrfParam() + '"]').val(token);
            }
        },

        /**
         * Displays a confirmation dialog.
         * The default implementation simply displays a js confirmation dialog.
         * You may override this by setting `yii.confirm`.
         * @param message the confirmation message.
         * @param ok a callback to be called when the user confirms the message
         * @param cancel a callback to be called when the user cancels the confirmation
         */
        confirm: function (message, ok, cancel) {
            if (window.confirm(message)) {
                !ok || ok();
            } else {
                !cancel || cancel();
            }
        },

        /**
         * Handles the action triggered by user.
         * This method recognizes the `data-method` attribute of the element. If the attribute exists,
         * the method will submit the form containing this element. If there is no containing form, a form
         * will be created and submitted using the method given by this attribute value (e.g. "post", "put").
         * For hyperlinks, the form action will take the value of the "href" attribute of the link.
         * For other elements, either the containing form action or the current page URL will be used
         * as the form action URL.
         *
         * If the `data-method` attribute is not defined, the `href` attribute (if any) of the element
         * will be assigned to `window.location`.
         *
         * Starting from version 2.0.3, the `data-params` attribute is also recognized when you specify
         * `data-method`. The value of `data-params` should be a JSON representation of the data (name-value pairs)
         * that should be submitted as hidden inputs. For example, you may use the following code to generate
         * such a link:
         *
         * ```php
         * use yii\helpers\Html;
         * use yii\helpers\Json;
         *
         * echo Html::a('submit', ['site/foobar'], [
         *     'data' => [
         *         'method' => 'post',
         *         'params' => [
         *             'name1' => 'value1',
         *             'name2' => 'value2',
         *         ],
         *     ],
         * ]);
         * ```
         *
         * @param $e the jQuery representation of the element
         * @param event Related event
         */
        handleAction: function ($e, event) {
            var $form = $e.attr('data-form') ? $('#' + $e.attr('data-form')) : $e.closest('form'),
                method = !$e.data('method') && $form ? $form.attr('method') : $e.data('method'),
                action = $e.attr('href'),
                isValidAction = action && action !== '#',
                params = $e.data('params'),
                areValidParams = params && $.isPlainObject(params),
                pjax = $e.data('pjax'),
                usePjax = pjax !== undefined && pjax !== 0 && $.support.pjax,
                pjaxContainer,
                pjaxOptions = {},
                conflictParams = ['submit', 'reset', 'elements', 'length', 'name', 'acceptCharset',
                    'action', 'enctype', 'method', 'target'];

            // Forms and their child elements should not use input names or ids that conflict with properties of a form,
            // such as submit, length, or method.
            $.each(conflictParams, function (index, param) {
                if (areValidParams && params.hasOwnProperty(param)) {
                    console.error("Parameter name '" + param + "' conflicts with a same named form property. " +
                        "Please use another name.");
                }
            });

            if (usePjax) {
                pjaxContainer = $e.data('pjax-container');
                if (pjaxContainer === undefined || !pjaxContainer.length) {
                    pjaxContainer = $e.closest('[data-pjax-container]').attr('id')
                        ? ('#' + $e.closest('[data-pjax-container]').attr('id'))
                        : '';
                }
                if (!pjaxContainer.length) {
                    pjaxContainer = 'body';
                }
                pjaxOptions = {
                    container: pjaxContainer,
                    push: !!$e.data('pjax-push-state'),
                    replace: !!$e.data('pjax-replace-state'),
                    scrollTo: $e.data('pjax-scrollto'),
                    pushRedirect: $e.data('pjax-push-redirect'),
                    replaceRedirect: $e.data('pjax-replace-redirect'),
                    skipOuterContainers: $e.data('pjax-skip-outer-containers'),
                    timeout: $e.data('pjax-timeout'),
                    originalEvent: event,
                    originalTarget: $e
                };
            }

            if (method === undefined) {
                if (isValidAction) {
                    usePjax ? $.pjax.click(event, pjaxOptions) : window.location.assign(action);
                } else if ($e.is(':submit') && $form.length) {
                    if (usePjax) {
                        $form.on('submit', function (e) {
                            $.pjax.submit(e, pjaxOptions);
                        });
                    }
                    $form.trigger('submit');
                }
                return;
            }

            var oldMethod,
                oldAction,
                newForm = !$form.length;
            if (!newForm) {
                oldMethod = $form.attr('method');
                $form.attr('method', method);
                if (isValidAction) {
                    oldAction = $form.attr('action');
                    $form.attr('action', action);
                }
            } else {
                if (!isValidAction) {
                    action = pub.getCurrentUrl();
                }
                $form = $('<form/>', {method: method, action: action});
                var target = $e.attr('target');
                if (target) {
                    $form.attr('target', target);
                }
                if (!/(get|post)/i.test(method)) {
                    $form.append($('<input/>', {name: '_method', value: method, type: 'hidden'}));
                    method = 'post';
                    $form.attr('method', method);
                }
                if (/post/i.test(method)) {
                    var csrfParam = pub.getCsrfParam();
                    if (csrfParam) {
                        $form.append($('<input/>', {name: csrfParam, value: pub.getCsrfToken(), type: 'hidden'}));
                    }
                }
                $form.hide().appendTo('body');
            }

            var activeFormData = $form.data('yiiActiveForm');
            if (activeFormData) {
                // Remember the element triggered the form submission. This is used by yii.activeForm.js.
                activeFormData.submitObject = $e;
            }

            if (areValidParams) {
                $.each(params, function (name, value) {
                    $form.append($('<input/>').attr({name: name, value: value, type: 'hidden'}));
                });
            }

            if (usePjax) {
                $form.on('submit', function (e) {
                    $.pjax.submit(e, pjaxOptions);
                });
            }

            $form.trigger('submit');

            $.when($form.data('yiiSubmitFinalizePromise')).done(function () {
                if (newForm) {
                    $form.remove();
                    return;
                }

                if (oldAction !== undefined) {
                    $form.attr('action', oldAction);
                }
                $form.attr('method', oldMethod);

                if (areValidParams) {
                    $.each(params, function (name) {
                        $('input[name="' + name + '"]', $form).remove();
                    });
                }
            });
        },

        getQueryParams: function (url) {
            var pos = url.indexOf('?');
            if (pos < 0) {
                return {};
            }

            var pairs = $.grep(url.substring(pos + 1).split('#')[0].split('&'), function (value) {
                return value !== '';
            });
            var params = {};

            for (var i = 0, len = pairs.length; i < len; i++) {
                var pair = pairs[i].split('=');
                var name = decodeURIComponent(pair[0].replace(/\+/g, '%20'));
                var value = decodeURIComponent(pair[1].replace(/\+/g, '%20'));
                if (!name.length) {
                    continue;
                }
                if (params[name] === undefined) {
                    params[name] = value || '';
                } else {
                    if (!$.isArray(params[name])) {
                        params[name] = [params[name]];
                    }
                    params[name].push(value || '');
                }
            }

            return params;
        },

        initModule: function (module) {
            if (module.isActive !== undefined && !module.isActive) {
                return;
            }
            if ($.isFunction(module.init)) {
                module.init();
            }
            $.each(module, function () {
                if ($.isPlainObject(this)) {
                    pub.initModule(this);
                }
            });
        },

        init: function () {
            initCsrfHandler();
            initRedirectHandler();
            initAssetFilters();
            initDataMethods();
        },

        /**
         * Returns the URL of the current page without params and trailing slash. Separated and made public for testing.
         * @returns {string}
         */
        getBaseCurrentUrl: function () {
            return window.location.protocol + '//' + window.location.host;
        },

        /**
         * Returns the URL of the current page. Used for testing, you can always call `window.location.href` manually
         * instead.
         * @returns {string}
         */
        getCurrentUrl: function () {
            return window.location.href;
        }
    };

    function initCsrfHandler() {
        // automatically send CSRF token for all AJAX requests
        $.ajaxPrefilter(function (options, originalOptions, xhr) {
            if (!options.crossDomain && pub.getCsrfParam()) {
                xhr.setRequestHeader('X-CSRF-Token', pub.getCsrfToken());
            }
        });
        pub.refreshCsrfToken();
    }

    function initRedirectHandler() {
        // handle AJAX redirection
        $(document).ajaxComplete(function (event, xhr) {
            var url = xhr && xhr.getResponseHeader('X-Redirect');
            if (url) {
                window.location.assign(url);
            }
        });
    }

    function initAssetFilters() {
        /**
         * Used for storing loaded scripts and information about loading each script if it's in the process of loading.
         * A single script can have one of the following values:
         *
         * - `undefined` - script was not loaded at all before or was loaded with error last time.
         * - `true` (boolean) -  script was successfully loaded.
         * - object - script is currently loading.
         *
         * In case of a value being an object the properties are:
         * - `xhrList` - represents a queue of XHR requests sent to the same URL (related with this script) in the same
         * small period of time.
         * - `xhrDone` - boolean, acts like a locking mechanism. When one of the XHR requests in the queue is
         * successfully completed, it will abort the rest of concurrent requests to the same URL until cleanup is done
         * to prevent possible errors and race conditions.
         * @type {{}}
         */
        var loadedScripts = {};

        $('script[src]').each(function () {
            var url = getAbsoluteUrl(this.src);
            loadedScripts[url] = true;
        });

        $.ajaxPrefilter('script', function (options, originalOptions, xhr) {
            if (options.dataType == 'jsonp') {
                return;
            }

            var url = getAbsoluteUrl(options.url),
                forbiddenRepeatedLoad = loadedScripts[url] === true && !isReloadableAsset(url),
                cleanupRunning = loadedScripts[url] !== undefined && loadedScripts[url]['xhrDone'] === true;

            if (forbiddenRepeatedLoad || cleanupRunning) {
                xhr.abort();
                return;
            }

            if (loadedScripts[url] === undefined || loadedScripts[url] === true) {
                loadedScripts[url] = {
                    xhrList: [],
                    xhrDone: false
                };
            }

            xhr.done(function (data, textStatus, jqXHR) {
                // If multiple requests were successfully loaded, perform cleanup only once
                if (loadedScripts[jqXHR.yiiUrl]['xhrDone'] === true) {
                    return;
                }

                loadedScripts[jqXHR.yiiUrl]['xhrDone'] = true;

                for (var i = 0, len = loadedScripts[jqXHR.yiiUrl]['xhrList'].length; i < len; i++) {
                    var singleXhr = loadedScripts[jqXHR.yiiUrl]['xhrList'][i];
                    if (singleXhr && singleXhr.readyState !== XMLHttpRequest.DONE) {
                        singleXhr.abort();
                    }
                }

                loadedScripts[jqXHR.yiiUrl] = true;
            }).fail(function (jqXHR, textStatus) {
                if (textStatus === 'abort') {
                    return;
                }

                delete loadedScripts[jqXHR.yiiUrl]['xhrList'][jqXHR.yiiIndex];

                var allFailed = true;
                for (var i = 0, len = loadedScripts[jqXHR.yiiUrl]['xhrList'].length; i < len; i++) {
                    if (loadedScripts[jqXHR.yiiUrl]['xhrList'][i]) {
                        allFailed = false;
                    }
                }

                if (allFailed) {
                    delete loadedScripts[jqXHR.yiiUrl];
                }
            });
            // Use prefix for custom XHR properties to avoid possible conflicts with existing properties
            xhr.yiiIndex = loadedScripts[url]['xhrList'].length;
            xhr.yiiUrl = url;

            loadedScripts[url]['xhrList'][xhr.yiiIndex] = xhr;
        });

        $(document).ajaxComplete(function () {
            var styleSheets = [];
            $('link[rel=stylesheet]').each(function () {
                var url = getAbsoluteUrl(this.href);
                if (isReloadableAsset(url)) {
                    return;
                }

                $.inArray(url, styleSheets) === -1 ? styleSheets.push(url) : $(this).remove();
            });
        });
    }

    function initDataMethods() {
        var handler = function (event) {
            var $this = $(this),
                method = $this.data('method'),
                message = $this.data('confirm'),
                form = $this.data('form');

            if (method === undefined && message === undefined && form === undefined) {
                return true;
            }

            if (message !== undefined && message !== false && message !== '') {
                $.proxy(pub.confirm, this)(message, function () {
                    pub.handleAction($this, event);
                });
            } else {
                pub.handleAction($this, event);
            }
            event.stopImmediatePropagation();
            return false;
        };

        // handle data-confirm and data-method for clickable and changeable elements
        $(document).on('click.yii', pub.clickableSelector, handler)
            .on('change.yii', pub.changeableSelector, handler);
    }

    function isReloadableAsset(url) {
        for (var i = 0; i < pub.reloadableScripts.length; i++) {
            var rule = getAbsoluteUrl(pub.reloadableScripts[i]);
            var match = new RegExp("^" + escapeRegExp(rule).split('\\*').join('.+') + "$").test(url);
            if (match === true) {
                return true;
            }
        }

        return false;
    }

    // http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    /**
     * Returns absolute URL based on the given URL
     * @param {string} url Initial URL
     * @returns {string}
     */
    function getAbsoluteUrl(url) {
        return url.charAt(0) === '/' ? pub.getBaseCurrentUrl() + url : url;
    }

    return pub;
})(window.jQuery);

window.jQuery(function () {
    window.yii.initModule(window.yii);
});

/**
 * Yii validation module.
 *
 * This JavaScript module provides the validation methods for the built-in validators.
 *
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */

yii.validation = (function ($) {
    var pub = {
        isEmpty: function (value) {
            return value === null || value === undefined || ($.isArray(value) && value.length === 0) || value === '';
        },

        addMessage: function (messages, message, value) {
            messages.push(message.replace(/\{value\}/g, value));
        },

        required: function (value, messages, options) {
            var valid = false;
            if (options.requiredValue === undefined) {
                var isString = typeof value == 'string' || value instanceof String;
                if (options.strict && value !== undefined || !options.strict && !pub.isEmpty(isString ? $.trim(value) : value)) {
                    valid = true;
                }
            } else if (!options.strict && value == options.requiredValue || options.strict && value === options.requiredValue) {
                valid = true;
            }

            if (!valid) {
                pub.addMessage(messages, options.message, value);
            }
        },

        // "boolean" is a reserved keyword in older versions of ES so it's quoted for IE < 9 support
        'boolean': function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }
            var valid = !options.strict && (value == options.trueValue || value == options.falseValue)
                || options.strict && (value === options.trueValue || value === options.falseValue);

            if (!valid) {
                pub.addMessage(messages, options.message, value);
            }
        },

        string: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (typeof value !== 'string') {
                pub.addMessage(messages, options.message, value);
                return;
            }

            if (options.is !== undefined && value.length != options.is) {
                pub.addMessage(messages, options.notEqual, value);
                return;
            }
            if (options.min !== undefined && value.length < options.min) {
                pub.addMessage(messages, options.tooShort, value);
            }
            if (options.max !== undefined && value.length > options.max) {
                pub.addMessage(messages, options.tooLong, value);
            }
        },

        file: function (attribute, messages, options) {
            var files = getUploadedFiles(attribute, messages, options);
            $.each(files, function (i, file) {
                validateFile(file, messages, options);
            });
        },

        image: function (attribute, messages, options, deferredList) {
            var files = getUploadedFiles(attribute, messages, options);
            $.each(files, function (i, file) {
                validateFile(file, messages, options);

                // Skip image validation if FileReader API is not available
                if (typeof FileReader === "undefined") {
                    return;
                }

                var deferred = $.Deferred();
                pub.validateImage(file, messages, options, deferred, new FileReader(), new Image());
                deferredList.push(deferred);
            });
        },

        validateImage: function (file, messages, options, deferred, fileReader, image) {
            image.onload = function() {
                validateImageSize(file, image, messages, options);
                deferred.resolve();
            };

            image.onerror = function () {
                messages.push(options.notImage.replace(/\{file\}/g, file.name));
                deferred.resolve();
            };

            fileReader.onload = function () {
                image.src = this.result;
            };

            // Resolve deferred if there was error while reading data
            fileReader.onerror = function () {
                deferred.resolve();
            };

            fileReader.readAsDataURL(file);
        },

        number: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (typeof value === 'string' && !options.pattern.test(value)) {
                pub.addMessage(messages, options.message, value);
                return;
            }

            if (options.min !== undefined && value < options.min) {
                pub.addMessage(messages, options.tooSmall, value);
            }
            if (options.max !== undefined && value > options.max) {
                pub.addMessage(messages, options.tooBig, value);
            }
        },

        range: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (!options.allowArray && $.isArray(value)) {
                pub.addMessage(messages, options.message, value);
                return;
            }

            var inArray = true;

            $.each($.isArray(value) ? value : [value], function (i, v) {
                if ($.inArray(v, options.range) == -1) {
                    inArray = false;
                    return false;
                } else {
                    return true;
                }
            });

            if (options.not === undefined) {
                options.not = false;
            }

            if (options.not === inArray) {
                pub.addMessage(messages, options.message, value);
            }
        },

        regularExpression: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (!options.not && !options.pattern.test(value) || options.not && options.pattern.test(value)) {
                pub.addMessage(messages, options.message, value);
            }
        },

        email: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            var valid = true,
                regexp = /^((?:"?([^"]*)"?\s)?)(?:\s+)?(?:(<?)((.+)@([^>]+))(>?))$/,
                matches = regexp.exec(value);

            if (matches === null) {
                valid = false;
            } else {
                var localPart = matches[5],
                    domain = matches[6];

                if (options.enableIDN) {
                    localPart = punycode.toASCII(localPart);
                    domain = punycode.toASCII(domain);

                    value = matches[1] + matches[3] + localPart + '@' + domain + matches[7];
                }

                if (localPart.length > 64) {
                    valid = false;
                } else if ((localPart + '@' + domain).length > 254) {
                    valid = false;
                } else {
                    valid = options.pattern.test(value) || (options.allowName && options.fullPattern.test(value));
                }
            }

            if (!valid) {
                pub.addMessage(messages, options.message, value);
            }
        },

        url: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (options.defaultScheme && !/:\/\//.test(value)) {
                value = options.defaultScheme + '://' + value;
            }

            var valid = true;

            if (options.enableIDN) {
                var matches = /^([^:]+):\/\/([^\/]+)(.*)$/.exec(value);
                if (matches === null) {
                    valid = false;
                } else {
                    value = matches[1] + '://' + punycode.toASCII(matches[2]) + matches[3];
                }
            }

            if (!valid || !options.pattern.test(value)) {
                pub.addMessage(messages, options.message, value);
            }
        },

        trim: function ($form, attribute, options, value) {
            var $input = $form.find(attribute.input);
            if ($input.is(':checkbox, :radio')) {
                return value;
            }

            value = $input.val();
            if (!options.skipOnEmpty || !pub.isEmpty(value)) {
                value = $.trim(value);
                $input.val(value);
            }

            return value;
        },

        captcha: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            // CAPTCHA may be updated via AJAX and the updated hash is stored in body data
            var hash = $('body').data(options.hashKey);
            hash = hash == null ? options.hash : hash[options.caseSensitive ? 0 : 1];
            var v = options.caseSensitive ? value : value.toLowerCase();
            for (var i = v.length - 1, h = 0; i >= 0; --i) {
                h += v.charCodeAt(i);
            }
            if (h != hash) {
                pub.addMessage(messages, options.message, value);
            }
        },

        compare: function (value, messages, options, $form) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            var compareValue,
                valid = true;
            if (options.compareAttribute === undefined) {
                compareValue = options.compareValue;
            } else {
                var $target = $('#' + options.compareAttribute);
                if (!$target.length) {
                    $target = $form.find('[name="' + options.compareAttributeName + '"]');
                }
                compareValue = $target.val();
            }

            if (options.type === 'number') {
                value = value ? parseFloat(value) : 0;
                compareValue = compareValue ? parseFloat(compareValue) : 0;
            }
            switch (options.operator) {
                case '==':
                    valid = value == compareValue;
                    break;
                case '===':
                    valid = value === compareValue;
                    break;
                case '!=':
                    valid = value != compareValue;
                    break;
                case '!==':
                    valid = value !== compareValue;
                    break;
                case '>':
                    valid = value > compareValue;
                    break;
                case '>=':
                    valid = value >= compareValue;
                    break;
                case '<':
                    valid = value < compareValue;
                    break;
                case '<=':
                    valid = value <= compareValue;
                    break;
                default:
                    valid = false;
                    break;
            }

            if (!valid) {
                pub.addMessage(messages, options.message, value);
            }
        },

        ip: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            var negation = null,
                cidr = null,
                matches = new RegExp(options.ipParsePattern).exec(value);
            if (matches) {
                negation = matches[1] || null;
                value = matches[2];
                cidr = matches[4] || null;
            }

            if (options.subnet === true && cidr === null) {
                pub.addMessage(messages, options.messages.noSubnet, value);
                return;
            }
            if (options.subnet === false && cidr !== null) {
                pub.addMessage(messages, options.messages.hasSubnet, value);
                return;
            }
            if (options.negation === false && negation !== null) {
                pub.addMessage(messages, options.messages.message, value);
                return;
            }

            var ipVersion = value.indexOf(':') === -1 ? 4 : 6;
            if (ipVersion == 6) {
                if (!(new RegExp(options.ipv6Pattern)).test(value)) {
                    pub.addMessage(messages, options.messages.message, value);
                }
                if (!options.ipv6) {
                    pub.addMessage(messages, options.messages.ipv6NotAllowed, value);
                }
            } else {
                if (!(new RegExp(options.ipv4Pattern)).test(value)) {
                    pub.addMessage(messages, options.messages.message, value);
                }
                if (!options.ipv4) {
                    pub.addMessage(messages, options.messages.ipv4NotAllowed, value);
                }
            }
        }
    };

    function getUploadedFiles(attribute, messages, options) {
        // Skip validation if File API is not available
        if (typeof File === "undefined") {
            return [];
        }

        var fileInput = $(attribute.input, attribute.$form).get(0);

        // Skip validation if file input does not exist
        // (in case file inputs are added dynamically and no file input has been added to the form)
        if (typeof fileInput === "undefined") {
            return [];
        }

        var files = fileInput.files;
        if (!files) {
            messages.push(options.message);
            return [];
        }

        if (files.length === 0) {
            if (!options.skipOnEmpty) {
                messages.push(options.uploadRequired);
            }

            return [];
        }

        if (options.maxFiles && options.maxFiles < files.length) {
            messages.push(options.tooMany);
            return [];
        }

        return files;
    }

    function validateFile(file, messages, options) {
        if (options.extensions && options.extensions.length > 0) {
            var index = file.name.lastIndexOf('.');
            var ext = !~index ? '' : file.name.substr(index + 1, file.name.length).toLowerCase();

            if (!~options.extensions.indexOf(ext)) {
                messages.push(options.wrongExtension.replace(/\{file\}/g, file.name));
            }
        }

        if (options.mimeTypes && options.mimeTypes.length > 0) {
            if (!validateMimeType(options.mimeTypes, file.type)) {
                messages.push(options.wrongMimeType.replace(/\{file\}/g, file.name));
            }
        }

        if (options.maxSize && options.maxSize < file.size) {
            messages.push(options.tooBig.replace(/\{file\}/g, file.name));
        }

        if (options.minSize && options.minSize > file.size) {
            messages.push(options.tooSmall.replace(/\{file\}/g, file.name));
        }
    }

    function validateMimeType(mimeTypes, fileType) {
        for (var i = 0, len = mimeTypes.length; i < len; i++) {
            if (new RegExp(mimeTypes[i]).test(fileType)) {
                return true;
            }
        }

        return false;
    }

    function validateImageSize(file, image, messages, options) {
        if (options.minWidth && image.width < options.minWidth) {
            messages.push(options.underWidth.replace(/\{file\}/g, file.name));
        }

        if (options.maxWidth && image.width > options.maxWidth) {
            messages.push(options.overWidth.replace(/\{file\}/g, file.name));
        }

        if (options.minHeight && image.height < options.minHeight) {
            messages.push(options.underHeight.replace(/\{file\}/g, file.name));
        }

        if (options.maxHeight && image.height > options.maxHeight) {
            messages.push(options.overHeight.replace(/\{file\}/g, file.name));
        }
    }

    return pub;
})(jQuery);

/**
 * Yii form widget.
 *
 * This is the JavaScript widget used by the yii\widgets\ActiveForm widget.
 *
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
(function ($) {

    $.fn.yiiActiveForm = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.yiiActiveForm');
            return false;
        }
    };

    var events = {
        /**
         * beforeValidate event is triggered before validating the whole form.
         * The signature of the event handler should be:
         *     function (event, messages, deferreds)
         * where
         *  - event: an Event object.
         *  - messages: an associative array with keys being attribute IDs and values being error message arrays
         *    for the corresponding attributes.
         *  - deferreds: an array of Deferred objects. You can use deferreds.add(callback) to add a new deferred validation.
         *
         * If the handler returns a boolean false, it will stop further form validation after this event. And as
         * a result, afterValidate event will not be triggered.
         */
        beforeValidate: 'beforeValidate',
        /**
         * afterValidate event is triggered after validating the whole form.
         * The signature of the event handler should be:
         *     function (event, messages, errorAttributes)
         * where
         *  - event: an Event object.
         *  - messages: an associative array with keys being attribute IDs and values being error message arrays
         *    for the corresponding attributes.
         *  - errorAttributes: an array of attributes that have validation errors. Please refer to attributeDefaults for the structure of this parameter.
         */
        afterValidate: 'afterValidate',
        /**
         * beforeValidateAttribute event is triggered before validating an attribute.
         * The signature of the event handler should be:
         *     function (event, attribute, messages, deferreds)
         * where
         *  - event: an Event object.
         *  - attribute: the attribute to be validated. Please refer to attributeDefaults for the structure of this parameter.
         *  - messages: an array to which you can add validation error messages for the specified attribute.
         *  - deferreds: an array of Deferred objects. You can use deferreds.add(callback) to add a new deferred validation.
         *
         * If the handler returns a boolean false, it will stop further validation of the specified attribute.
         * And as a result, afterValidateAttribute event will not be triggered.
         */
        beforeValidateAttribute: 'beforeValidateAttribute',
        /**
         * afterValidateAttribute event is triggered after validating the whole form and each attribute.
         * The signature of the event handler should be:
         *     function (event, attribute, messages)
         * where
         *  - event: an Event object.
         *  - attribute: the attribute being validated. Please refer to attributeDefaults for the structure of this parameter.
         *  - messages: an array to which you can add additional validation error messages for the specified attribute.
         */
        afterValidateAttribute: 'afterValidateAttribute',
        /**
         * beforeSubmit event is triggered before submitting the form after all validations have passed.
         * The signature of the event handler should be:
         *     function (event)
         * where event is an Event object.
         *
         * If the handler returns a boolean false, it will stop form submission.
         */
        beforeSubmit: 'beforeSubmit',
        /**
         * ajaxBeforeSend event is triggered before sending an AJAX request for AJAX-based validation.
         * The signature of the event handler should be:
         *     function (event, jqXHR, settings)
         * where
         *  - event: an Event object.
         *  - jqXHR: a jqXHR object
         *  - settings: the settings for the AJAX request
         */
        ajaxBeforeSend: 'ajaxBeforeSend',
        /**
         * ajaxComplete event is triggered after completing an AJAX request for AJAX-based validation.
         * The signature of the event handler should be:
         *     function (event, jqXHR, textStatus)
         * where
         *  - event: an Event object.
         *  - jqXHR: a jqXHR object
         *  - textStatus: the status of the request ("success", "notmodified", "error", "timeout", "abort", or "parsererror").
         */
        ajaxComplete: 'ajaxComplete',
        /**
         * afterInit event is triggered after yii activeForm init.
         * The signature of the event handler should be:
         *     function (event)
         * where
         *  - event: an Event object.
         */
        afterInit: 'afterInit'
    };

    // NOTE: If you change any of these defaults, make sure you update yii\widgets\ActiveForm::getClientOptions() as well
    var defaults = {
        // whether to encode the error summary
        encodeErrorSummary: true,
        // the jQuery selector for the error summary
        errorSummary: '.error-summary',
        // whether to perform validation before submitting the form.
        validateOnSubmit: true,
        // the container CSS class representing the corresponding attribute has validation error
        errorCssClass: 'has-error',
        // the container CSS class representing the corresponding attribute passes validation
        successCssClass: 'has-success',
        // the container CSS class representing the corresponding attribute is being validated
        validatingCssClass: 'validating',
        // the GET parameter name indicating an AJAX-based validation
        ajaxParam: 'ajax',
        // the type of data that you're expecting back from the server
        ajaxDataType: 'json',
        // the URL for performing AJAX-based validation. If not set, it will use the the form's action
        validationUrl: undefined,
        // whether to scroll to first visible error after validation.
        scrollToError: true,
        // offset in pixels that should be added when scrolling to the first error.
        scrollToErrorOffset: 0,
        // where to add validation class: container or input
        validationStateOn: 'container'
    };

    // NOTE: If you change any of these defaults, make sure you update yii\widgets\ActiveField::getClientOptions() as well
    var attributeDefaults = {
        // a unique ID identifying an attribute (e.g. "loginform-username") in a form
        id: undefined,
        // attribute name or expression (e.g. "[0]content" for tabular input)
        name: undefined,
        // the jQuery selector of the container of the input field
        container: undefined,
        // the jQuery selector of the input field under the context of the form
        input: undefined,
        // the jQuery selector of the error tag under the context of the container
        error: '.help-block',
        // whether to encode the error
        encodeError: true,
        // whether to perform validation when a change is detected on the input
        validateOnChange: true,
        // whether to perform validation when the input loses focus
        validateOnBlur: true,
        // whether to perform validation when the user is typing.
        validateOnType: false,
        // number of milliseconds that the validation should be delayed when a user is typing in the input field.
        validationDelay: 500,
        // whether to enable AJAX-based validation.
        enableAjaxValidation: false,
        // function (attribute, value, messages, deferred, $form), the client-side validation function.
        validate: undefined,
        // status of the input field, 0: empty, not entered before, 1: validated, 2: pending validation, 3: validating
        status: 0,
        // whether the validation is cancelled by beforeValidateAttribute event handler
        cancelled: false,
        // the value of the input
        value: undefined,
        // whether to update aria-invalid attribute after validation
        updateAriaInvalid: true
    };


    var submitDefer;

    var setSubmitFinalizeDefer = function($form) {
        submitDefer = $.Deferred();
        $form.data('yiiSubmitFinalizePromise', submitDefer.promise());
    };

    // finalize yii.js $form.submit
    var submitFinalize = function($form) {
        if(submitDefer) {
            submitDefer.resolve();
            submitDefer = undefined;
            $form.removeData('yiiSubmitFinalizePromise');
        }
    };


    var methods = {
        init: function (attributes, options) {
            return this.each(function () {
                var $form = $(this);
                if ($form.data('yiiActiveForm')) {
                    return;
                }

                var settings = $.extend({}, defaults, options || {});
                if (settings.validationUrl === undefined) {
                    settings.validationUrl = $form.attr('action');
                }

                $.each(attributes, function (i) {
                    attributes[i] = $.extend({value: getValue($form, this)}, attributeDefaults, this);
                    watchAttribute($form, attributes[i]);
                });

                $form.data('yiiActiveForm', {
                    settings: settings,
                    attributes: attributes,
                    submitting: false,
                    validated: false,
                    options: getFormOptions($form)
                });

                /**
                 * Clean up error status when the form is reset.
                 * Note that $form.on('reset', ...) does work because the "reset" event does not bubble on IE.
                 */
                $form.on('reset.yiiActiveForm', methods.resetForm);

                if (settings.validateOnSubmit) {
                    $form.on('mouseup.yiiActiveForm keyup.yiiActiveForm', ':submit', function () {
                        $form.data('yiiActiveForm').submitObject = $(this);
                    });
                    $form.on('submit.yiiActiveForm', methods.submitForm);
                }
                var event = $.Event(events.afterInit);
                $form.trigger(event);
            });
        },

        // add a new attribute to the form dynamically.
        // please refer to attributeDefaults for the structure of attribute
        add: function (attribute) {
            var $form = $(this);
            attribute = $.extend({value: getValue($form, attribute)}, attributeDefaults, attribute);
            $form.data('yiiActiveForm').attributes.push(attribute);
            watchAttribute($form, attribute);
        },

        // remove the attribute with the specified ID from the form
        remove: function (id) {
            var $form = $(this),
                attributes = $form.data('yiiActiveForm').attributes,
                index = -1,
                attribute = undefined;
            $.each(attributes, function (i) {
                if (attributes[i]['id'] == id) {
                    index = i;
                    attribute = attributes[i];
                    return false;
                }
            });
            if (index >= 0) {
                attributes.splice(index, 1);
                unwatchAttribute($form, attribute);
            }

            return attribute;
        },

        // manually trigger the validation of the attribute with the specified ID
        validateAttribute: function (id) {
            var attribute = methods.find.call(this, id);
            if (attribute != undefined) {
                validateAttribute($(this), attribute, true);
            }
        },

        // find an attribute config based on the specified attribute ID
        find: function (id) {
            var attributes = $(this).data('yiiActiveForm').attributes,
                result = undefined;
            $.each(attributes, function (i) {
                if (attributes[i]['id'] == id) {
                    result = attributes[i];
                    return false;
                }
            });
            return result;
        },

        destroy: function () {
            return this.each(function () {
                $(this).off('.yiiActiveForm');
                $(this).removeData('yiiActiveForm');
            });
        },

        data: function () {
            return this.data('yiiActiveForm');
        },

        // validate all applicable inputs in the form
        validate: function (forceValidate) {
            if (forceValidate) {
                $(this).data('yiiActiveForm').submitting = true;
            }

            var $form = $(this),
                data = $form.data('yiiActiveForm'),
                needAjaxValidation = false,
                messages = {},
                deferreds = deferredArray(),
                submitting = data.submitting;

            if (submitting) {
                var event = $.Event(events.beforeValidate);
                $form.trigger(event, [messages, deferreds]);

                if (event.result === false) {
                    data.submitting = false;
                    submitFinalize($form);
                    return;
                }
            }

            // client-side validation
            $.each(data.attributes, function () {
                this.$form = $form;
                var $input = findInput($form, this);

                if ($input.is(":disabled")) {
                    return true;
                }
                // pass SELECT without options
                if ($input.length && $input[0].tagName.toLowerCase() === 'select') {
                    if (!$input[0].options.length) {
                        return true;
                    } else if (($input[0].options.length === 1) && ($input[0].options[0].value === '')) {
                        return true;
                    }
                }
                this.cancelled = false;
                // perform validation only if the form is being submitted or if an attribute is pending validation
                if (data.submitting || this.status === 2 || this.status === 3) {
                    var msg = messages[this.id];
                    if (msg === undefined) {
                        msg = [];
                        messages[this.id] = msg;
                    }

                    var event = $.Event(events.beforeValidateAttribute);
                    $form.trigger(event, [this, msg, deferreds]);
                    if (event.result !== false) {
                        if (this.validate) {
                            this.validate(this, getValue($form, this), msg, deferreds, $form);
                        }
                        if (this.enableAjaxValidation) {
                            needAjaxValidation = true;
                        }
                    } else {
                        this.cancelled = true;
                    }
                }
            });

            // ajax validation
            $.when.apply(this, deferreds).always(function() {
                // Remove empty message arrays
                for (var i in messages) {
                    if (0 === messages[i].length) {
                        delete messages[i];
                    }
                }
                if (needAjaxValidation && ($.isEmptyObject(messages) || data.submitting)) {
                    var $button = data.submitObject,
                        extData = '&' + data.settings.ajaxParam + '=' + $form.attr('id');
                    if ($button && $button.length && $button.attr('name')) {
                        extData += '&' + $button.attr('name') + '=' + $button.attr('value');
                    }
                    $.ajax({
                        url: data.settings.validationUrl,
                        type: $form.attr('method'),
                        data: $form.serialize() + extData,
                        dataType: data.settings.ajaxDataType,
                        complete: function (jqXHR, textStatus) {
                            $form.trigger(events.ajaxComplete, [jqXHR, textStatus]);
                        },
                        beforeSend: function (jqXHR, settings) {
                            $form.trigger(events.ajaxBeforeSend, [jqXHR, settings]);
                        },
                        success: function (msgs) {
                            if (msgs !== null && typeof msgs === 'object') {
                                $.each(data.attributes, function () {
                                    if (!this.enableAjaxValidation || this.cancelled) {
                                        delete msgs[this.id];
                                    }
                                });
                                updateInputs($form, $.extend(messages, msgs), submitting);
                            } else {
                                updateInputs($form, messages, submitting);
                            }
                        },
                        error: function () {
                            data.submitting = false;
                            submitFinalize($form);
                        }
                    });
                } else if (data.submitting) {
                    // delay callback so that the form can be submitted without problem
                    window.setTimeout(function () {
                        updateInputs($form, messages, submitting);
                    }, 200);
                } else {
                    updateInputs($form, messages, submitting);
                }
            });
        },

        submitForm: function () {
            var $form = $(this),
                data = $form.data('yiiActiveForm');
            if (data.validated) {
                // Second submit's call (from validate/updateInputs)
                data.submitting = false;
                var event = $.Event(events.beforeSubmit);
                $form.trigger(event);
                if (event.result === false) {
                    data.validated = false;
                    submitFinalize($form);
                    return false;
                }
                updateHiddenButton($form);
                return true;   // continue submitting the form since validation passes
            } else {
                // First submit's call (from yii.js/handleAction) - execute validating
                setSubmitFinalizeDefer($form);

                if (data.settings.timer !== undefined) {
                    clearTimeout(data.settings.timer);
                }
                data.submitting = true;
                methods.validate.call($form);
                return false;
            }
        },

        resetForm: function () {
            var $form = $(this);
            var data = $form.data('yiiActiveForm');
            // Because we bind directly to a form reset event instead of a reset button (that may not exist),
            // when this function is executed form input values have not been reset yet.
            // Therefore we do the actual reset work through setTimeout.
            window.setTimeout(function () {
                $.each(data.attributes, function () {
                    // Without setTimeout() we would get the input values that are not reset yet.
                    this.value = getValue($form, this);
                    this.status = 0;
                    var $container = $form.find(this.container),
                        $input = findInput($form, this),
                        $errorElement = data.settings.validationStateOn === 'input' ? $input : $container;

                    $errorElement.removeClass(
                        data.settings.validatingCssClass + ' ' +
                            data.settings.errorCssClass + ' ' +
                            data.settings.successCssClass
                    );
                    $container.find(this.error).html('');
                });
                $form.find(data.settings.errorSummary).hide().find('ul').html('');
            }, 1);
        },

        /**
         * Updates error messages, input containers, and optionally summary as well.
         * If an attribute is missing from messages, it is considered valid.
         * @param messages array the validation error messages, indexed by attribute IDs
         * @param summary whether to update summary as well.
         */
        updateMessages: function (messages, summary) {
            var $form = $(this);
            var data = $form.data('yiiActiveForm');
            $.each(data.attributes, function () {
                updateInput($form, this, messages);
            });
            if (summary) {
                updateSummary($form, messages);
            }
        },

        /**
         * Updates error messages and input container of a single attribute.
         * If messages is empty, the attribute is considered valid.
         * @param id attribute ID
         * @param messages array with error messages
         */
        updateAttribute: function(id, messages) {
            var attribute = methods.find.call(this, id);
            if (attribute != undefined) {
                var msg = {};
                msg[id] = messages;
                updateInput($(this), attribute, msg);
            }
        }
    };

    var watchAttribute = function ($form, attribute) {
        var $input = findInput($form, attribute);
        if (attribute.validateOnChange) {
            $input.on('change.yiiActiveForm', function () {
                validateAttribute($form, attribute, false);
            });
        }
        if (attribute.validateOnBlur) {
            $input.on('blur.yiiActiveForm', function () {
                if (attribute.status == 0 || attribute.status == 1) {
                    validateAttribute($form, attribute, true);
                }
            });
        }
        if (attribute.validateOnType) {
            $input.on('keyup.yiiActiveForm', function (e) {
                if ($.inArray(e.which, [16, 17, 18, 37, 38, 39, 40]) !== -1 ) {
                    return;
                }
                if (attribute.value !== getValue($form, attribute)) {
                    validateAttribute($form, attribute, false, attribute.validationDelay);
                }
            });
        }
    };

    var unwatchAttribute = function ($form, attribute) {
        findInput($form, attribute).off('.yiiActiveForm');
    };

    var validateAttribute = function ($form, attribute, forceValidate, validationDelay) {
        var data = $form.data('yiiActiveForm');

        if (forceValidate) {
            attribute.status = 2;
        }
        $.each(data.attributes, function () {
            if (this.value !== getValue($form, this)) {
                this.status = 2;
                forceValidate = true;
            }
        });
        if (!forceValidate) {
            return;
        }

        if (data.settings.timer !== undefined) {
            clearTimeout(data.settings.timer);
        }
        data.settings.timer = window.setTimeout(function () {
            if (data.submitting || $form.is(':hidden')) {
                return;
            }
            $.each(data.attributes, function () {
                if (this.status === 2) {
                    this.status = 3;
                    $form.find(this.container).addClass(data.settings.validatingCssClass);
                }
            });
            methods.validate.call($form);
        }, validationDelay ? validationDelay : 200);
    };

    /**
     * Returns an array prototype with a shortcut method for adding a new deferred.
     * The context of the callback will be the deferred object so it can be resolved like ```this.resolve()```
     * @returns Array
     */
    var deferredArray = function () {
        var array = [];
        array.add = function(callback) {
            this.push(new $.Deferred(callback));
        };
        return array;
    };

    var buttonOptions = ['action', 'target', 'method', 'enctype'];

    /**
     * Returns current form options
     * @param $form
     * @returns object Object with button of form options
     */
    var getFormOptions = function ($form) {
        var attributes = {};
        for (var i = 0; i < buttonOptions.length; i++) {
            attributes[buttonOptions[i]] = $form.attr(buttonOptions[i]);
        }

        return attributes;
    };

    /**
     * Applies temporary form options related to submit button
     * @param $form the form jQuery object
     * @param $button the button jQuery object
     */
    var applyButtonOptions = function ($form, $button) {
        for (var i = 0; i < buttonOptions.length; i++) {
            var value = $button.attr('form' + buttonOptions[i]);
            if (value) {
                $form.attr(buttonOptions[i], value);
            }
        }
    };

    /**
     * Restores original form options
     * @param $form the form jQuery object
     */
    var restoreButtonOptions = function ($form) {
        var data = $form.data('yiiActiveForm');

        for (var i = 0; i < buttonOptions.length; i++) {
            $form.attr(buttonOptions[i], data.options[buttonOptions[i]] || null);
        }
    };

    /**
     * Updates the error messages and the input containers for all applicable attributes
     * @param $form the form jQuery object
     * @param messages array the validation error messages
     * @param submitting whether this method is called after validation triggered by form submission
     */
    var updateInputs = function ($form, messages, submitting) {
        var data = $form.data('yiiActiveForm');

        if (data === undefined) {
            return false;
        }

        if (submitting) {
            var errorAttributes = [];
            var $input = findInput($form, this);
            $.each(data.attributes, function () {
                if (!$input.is(":disabled") && !this.cancelled && updateInput($form, this, messages)) {
                    errorAttributes.push(this);
                }
            });

            $form.trigger(events.afterValidate, [messages, errorAttributes]);

            updateSummary($form, messages);

            if (errorAttributes.length) {
                if (data.settings.scrollToError) {
                    var top = $form.find($.map(errorAttributes, function(attribute) {
                        return attribute.input;
                    }).join(',')).first().closest(':visible').offset().top - data.settings.scrollToErrorOffset;
                    if (top < 0) {
                        top = 0;
                    } else if (top > $(document).height()) {
                        top = $(document).height();
                    }
                    var wtop = $(window).scrollTop();
                    if (top < wtop || top > wtop + $(window).height()) {
                        $(window).scrollTop(top);
                    }
                }
                data.submitting = false;
            } else {
                data.validated = true;
                if (data.submitObject) {
                    applyButtonOptions($form, data.submitObject);
                }
                $form.submit();
                if (data.submitObject) {
                    restoreButtonOptions($form);
                }
            }
        } else {
            $.each(data.attributes, function () {
                if (!this.cancelled && (this.status === 2 || this.status === 3)) {
                    updateInput($form, this, messages);
                }
            });
        }
        submitFinalize($form);
    };

    /**
     * Updates hidden field that represents clicked submit button.
     * @param $form the form jQuery object.
     */
    var updateHiddenButton = function ($form) {
        var data = $form.data('yiiActiveForm');
        var $button = data.submitObject || $form.find(':submit:first');
        // TODO: if the submission is caused by "change" event, it will not work
        if ($button.length && $button.attr('type') == 'submit' && $button.attr('name')) {
            // simulate button input value
            var $hiddenButton = $('input[type="hidden"][name="' + $button.attr('name') + '"]', $form);
            if (!$hiddenButton.length) {
                $('<input>').attr({
                    type: 'hidden',
                    name: $button.attr('name'),
                    value: $button.attr('value')
                }).appendTo($form);
            } else {
                $hiddenButton.attr('value', $button.attr('value'));
            }
        }
    };

    /**
     * Updates the error message and the input container for a particular attribute.
     * @param $form the form jQuery object
     * @param attribute object the configuration for a particular attribute.
     * @param messages array the validation error messages
     * @return boolean whether there is a validation error for the specified attribute
     */
    var updateInput = function ($form, attribute, messages) {
        var data = $form.data('yiiActiveForm'),
            $input = findInput($form, attribute),
            hasError = false;

        if (!$.isArray(messages[attribute.id])) {
            messages[attribute.id] = [];
        }

        attribute.status = 1;
        if ($input.length) {
            hasError = messages[attribute.id].length > 0;
            var $container = $form.find(attribute.container);
            var $error = $container.find(attribute.error);
            updateAriaInvalid($form, attribute, hasError);

            var $errorElement = data.settings.validationStateOn === 'input' ? $input : $container;

            if (hasError) {
                if (attribute.encodeError) {
                    $error.text(messages[attribute.id][0]);
                } else {
                    $error.html(messages[attribute.id][0]);
                }
                $errorElement.removeClass(data.settings.validatingCssClass + ' ' + data.settings.successCssClass)
                    .addClass(data.settings.errorCssClass);
            } else {
                $error.empty();
                $errorElement.removeClass(data.settings.validatingCssClass + ' ' + data.settings.errorCssClass + ' ')
                    .addClass(data.settings.successCssClass);
            }
            attribute.value = getValue($form, attribute);
        }

        $form.trigger(events.afterValidateAttribute, [attribute, messages[attribute.id]]);

        return hasError;
    };

    /**
     * Updates the error summary.
     * @param $form the form jQuery object
     * @param messages array the validation error messages
     */
    var updateSummary = function ($form, messages) {
        var data = $form.data('yiiActiveForm'),
            $summary = $form.find(data.settings.errorSummary),
            $ul = $summary.find('ul').empty();

        if ($summary.length && messages) {
            $.each(data.attributes, function () {
                if ($.isArray(messages[this.id]) && messages[this.id].length) {
                    var error = $('<li/>');
                    if (data.settings.encodeErrorSummary) {
                        error.text(messages[this.id][0]);
                    } else {
                        error.html(messages[this.id][0]);
                    }
                    $ul.append(error);
                }
            });
            $summary.toggle($ul.find('li').length > 0);
        }
    };

    var getValue = function ($form, attribute) {
        var $input = findInput($form, attribute);
        var type = $input.attr('type');
        if (type === 'checkbox' || type === 'radio') {
            var $realInput = $input.filter(':checked');
            if (!$realInput.length) {
                $realInput = $form.find('input[type=hidden][name="' + $input.attr('name') + '"]');
            }

            return $realInput.val();
        } else {
            return $input.val();
        }
    };

    var findInput = function ($form, attribute) {
        var $input = $form.find(attribute.input);
        if ($input.length && $input[0].tagName.toLowerCase() === 'div') {
            // checkbox list or radio list
            return $input.find('input');
        } else {
            return $input;
        }
    };

    var updateAriaInvalid = function ($form, attribute, hasError) {
        if (attribute.updateAriaInvalid) {
            $form.find(attribute.input).attr('aria-invalid', hasError ? 'true' : 'false');
        }
    }
})(window.jQuery);

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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInlpaS5qcyIsInlpaS52YWxpZGF0aW9uLmpzIiwieWlpLmFjdGl2ZUZvcm0uanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcmhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL2NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMXlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBZaWkgSmF2YVNjcmlwdCBtb2R1bGUuXG4gKlxuICogQGxpbmsgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL1xuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMDggWWlpIFNvZnR3YXJlIExMQ1xuICogQGxpY2Vuc2UgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL2xpY2Vuc2UvXG4gKiBAYXV0aG9yIFFpYW5nIFh1ZSA8cWlhbmcueHVlQGdtYWlsLmNvbT5cbiAqIEBzaW5jZSAyLjBcbiAqL1xuXG4vKipcbiAqIHlpaSBpcyB0aGUgcm9vdCBtb2R1bGUgZm9yIGFsbCBZaWkgSmF2YVNjcmlwdCBtb2R1bGVzLlxuICogSXQgaW1wbGVtZW50cyBhIG1lY2hhbmlzbSBvZiBvcmdhbml6aW5nIEphdmFTY3JpcHQgY29kZSBpbiBtb2R1bGVzIHRocm91Z2ggdGhlIGZ1bmN0aW9uIFwieWlpLmluaXRNb2R1bGUoKVwiLlxuICpcbiAqIEVhY2ggbW9kdWxlIHNob3VsZCBiZSBuYW1lZCBhcyBcIngueS56XCIsIHdoZXJlIFwieFwiIHN0YW5kcyBmb3IgdGhlIHJvb3QgbW9kdWxlIChmb3IgdGhlIFlpaSBjb3JlIGNvZGUsIHRoaXMgaXMgXCJ5aWlcIikuXG4gKlxuICogQSBtb2R1bGUgbWF5IGJlIHN0cnVjdHVyZWQgYXMgZm9sbG93czpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiB3aW5kb3cueWlpLnNhbXBsZSA9IChmdW5jdGlvbigkKSB7XG4gKiAgICAgdmFyIHB1YiA9IHtcbiAqICAgICAgICAgLy8gd2hldGhlciB0aGlzIG1vZHVsZSBpcyBjdXJyZW50bHkgYWN0aXZlLiBJZiBmYWxzZSwgaW5pdCgpIHdpbGwgbm90IGJlIGNhbGxlZCBmb3IgdGhpcyBtb2R1bGVcbiAqICAgICAgICAgLy8gaXQgd2lsbCBhbHNvIG5vdCBiZSBjYWxsZWQgZm9yIGFsbCBpdHMgY2hpbGQgbW9kdWxlcy4gSWYgdGhpcyBwcm9wZXJ0eSBpcyB1bmRlZmluZWQsIGl0IG1lYW5zIHRydWUuXG4gKiAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICogICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAqICAgICAgICAgICAgIC8vIC4uLiBtb2R1bGUgaW5pdGlhbGl6YXRpb24gY29kZSBnb2VzIGhlcmUgLi4uXG4gKiAgICAgICAgIH0sXG4gKlxuICogICAgICAgICAvLyAuLi4gb3RoZXIgcHVibGljIGZ1bmN0aW9ucyBhbmQgcHJvcGVydGllcyBnbyBoZXJlIC4uLlxuICogICAgIH07XG4gKlxuICogICAgIC8vIC4uLiBwcml2YXRlIGZ1bmN0aW9ucyBhbmQgcHJvcGVydGllcyBnbyBoZXJlIC4uLlxuICpcbiAqICAgICByZXR1cm4gcHViO1xuICogfSkod2luZG93LmpRdWVyeSk7XG4gKiBgYGBcbiAqXG4gKiBVc2luZyB0aGlzIHN0cnVjdHVyZSwgeW91IGNhbiBkZWZpbmUgcHVibGljIGFuZCBwcml2YXRlIGZ1bmN0aW9ucy9wcm9wZXJ0aWVzIGZvciBhIG1vZHVsZS5cbiAqIFByaXZhdGUgZnVuY3Rpb25zL3Byb3BlcnRpZXMgYXJlIG9ubHkgdmlzaWJsZSB3aXRoaW4gdGhlIG1vZHVsZSwgd2hpbGUgcHVibGljIGZ1bmN0aW9ucy9wcm9wZXJ0aWVzXG4gKiBtYXkgYmUgYWNjZXNzZWQgb3V0c2lkZSBvZiB0aGUgbW9kdWxlLiBGb3IgZXhhbXBsZSwgeW91IGNhbiBhY2Nlc3MgXCJ5aWkuc2FtcGxlLmlzQWN0aXZlXCIuXG4gKlxuICogWW91IG11c3QgY2FsbCBcInlpaS5pbml0TW9kdWxlKClcIiBvbmNlIGZvciB0aGUgcm9vdCBtb2R1bGUgb2YgYWxsIHlvdXIgbW9kdWxlcy5cbiAqL1xud2luZG93LnlpaSA9IChmdW5jdGlvbiAoJCkge1xuICAgIHZhciBwdWIgPSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMaXN0IG9mIEpTIG9yIENTUyBVUkxzIHRoYXQgY2FuIGJlIGxvYWRlZCBtdWx0aXBsZSB0aW1lcyB2aWEgQUpBWCByZXF1ZXN0cy5cbiAgICAgICAgICogRWFjaCBpdGVtIG1heSBiZSByZXByZXNlbnRlZCBhcyBlaXRoZXIgYW4gYWJzb2x1dGUgVVJMIG9yIGEgcmVsYXRpdmUgb25lLlxuICAgICAgICAgKiBFYWNoIGl0ZW0gbWF5IGNvbnRhaW4gYSB3aWxkY2FyZCBtYXRjaGluZyBjaGFyYWN0ZXIgYCpgLCB0aGF0IG1lYW5zIG9uZSBvciBtb3JlXG4gICAgICAgICAqIGFueSBjaGFyYWN0ZXJzIG9uIHRoZSBwb3NpdGlvbi4gRm9yIGV4YW1wbGU6XG4gICAgICAgICAqICAtIGAvY3NzLyouY3NzYCB3aWxsIG1hdGNoIGFueSBmaWxlIGVuZGluZyB3aXRoIGAuY3NzYCBpbiB0aGUgYGNzc2AgZGlyZWN0b3J5IG9mIHRoZSBjdXJyZW50IHdlYiBzaXRlXG4gICAgICAgICAqICAtIGBodHRwKjovL2Nkbi5leGFtcGxlLmNvbS8qYCB3aWxsIG1hdGNoIGFueSBmaWxlcyBvbiBkb21haW4gYGNkbi5leGFtcGxlLmNvbWAsIGxvYWRlZCB3aXRoIEhUVFAgb3IgSFRUUFNcbiAgICAgICAgICogIC0gYC9qcy9teUN1c3RvbVNjcmlwdC5qcz9yZWFsbT0qYCB3aWxsIG1hdGNoIGZpbGUgYC9qcy9teUN1c3RvbVNjcmlwdC5qc2Agd2l0aCBkZWZpbmVkIGByZWFsbWAgcGFyYW1ldGVyXG4gICAgICAgICAqL1xuICAgICAgICByZWxvYWRhYmxlU2NyaXB0czogW10sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2VsZWN0b3IgZm9yIGNsaWNrYWJsZSBlbGVtZW50cyB0aGF0IG5lZWQgdG8gc3VwcG9ydCBjb25maXJtYXRpb24gYW5kIGZvcm0gc3VibWlzc2lvbi5cbiAgICAgICAgICovXG4gICAgICAgIGNsaWNrYWJsZVNlbGVjdG9yOiAnYSwgYnV0dG9uLCBpbnB1dFt0eXBlPVwic3VibWl0XCJdLCBpbnB1dFt0eXBlPVwiYnV0dG9uXCJdLCBpbnB1dFt0eXBlPVwicmVzZXRcIl0sICcgK1xuICAgICAgICAgICAgJ2lucHV0W3R5cGU9XCJpbWFnZVwiXScsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2VsZWN0b3IgZm9yIGNoYW5nZWFibGUgZWxlbWVudHMgdGhhdCBuZWVkIHRvIHN1cHBvcnQgY29uZmlybWF0aW9uIGFuZCBmb3JtIHN1Ym1pc3Npb24uXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VhYmxlU2VsZWN0b3I6ICdzZWxlY3QsIGlucHV0LCB0ZXh0YXJlYScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4gc3RyaW5nfHVuZGVmaW5lZCB0aGUgQ1NSRiBwYXJhbWV0ZXIgbmFtZS4gVW5kZWZpbmVkIGlzIHJldHVybmVkIGlmIENTUkYgdmFsaWRhdGlvbiBpcyBub3QgZW5hYmxlZC5cbiAgICAgICAgICovXG4gICAgICAgIGdldENzcmZQYXJhbTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoJ21ldGFbbmFtZT1jc3JmLXBhcmFtXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiBzdHJpbmd8dW5kZWZpbmVkIHRoZSBDU1JGIHRva2VuLiBVbmRlZmluZWQgaXMgcmV0dXJuZWQgaWYgQ1NSRiB2YWxpZGF0aW9uIGlzIG5vdCBlbmFibGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q3NyZlRva2VuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJCgnbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuYXR0cignY29udGVudCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBDU1JGIHRva2VuIGluIHRoZSBtZXRhIGVsZW1lbnRzLlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyBwcm92aWRlZCBzbyB0aGF0IHlvdSBjYW4gdXBkYXRlIHRoZSBDU1JGIHRva2VuIHdpdGggdGhlIGxhdGVzdCBvbmUgeW91IG9idGFpbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAqIEBwYXJhbSBuYW1lIHRoZSBDU1JGIHRva2VuIG5hbWVcbiAgICAgICAgICogQHBhcmFtIHZhbHVlIHRoZSBDU1JGIHRva2VuIHZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICBzZXRDc3JmVG9rZW46IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgJCgnbWV0YVtuYW1lPWNzcmYtcGFyYW1dJykuYXR0cignY29udGVudCcsIG5hbWUpO1xuICAgICAgICAgICAgJCgnbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuYXR0cignY29udGVudCcsIHZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyBhbGwgZm9ybSBDU1JGIGlucHV0IGZpZWxkcyB3aXRoIHRoZSBsYXRlc3QgQ1NSRiB0b2tlbi5cbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgcHJvdmlkZWQgdG8gYXZvaWQgY2FjaGVkIGZvcm1zIGNvbnRhaW5pbmcgb3V0ZGF0ZWQgQ1NSRiB0b2tlbnMuXG4gICAgICAgICAqL1xuICAgICAgICByZWZyZXNoQ3NyZlRva2VuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBwdWIuZ2V0Q3NyZlRva2VuKCk7XG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAkKCdmb3JtIGlucHV0W25hbWU9XCInICsgcHViLmdldENzcmZQYXJhbSgpICsgJ1wiXScpLnZhbCh0b2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc3BsYXlzIGEgY29uZmlybWF0aW9uIGRpYWxvZy5cbiAgICAgICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gc2ltcGx5IGRpc3BsYXlzIGEganMgY29uZmlybWF0aW9uIGRpYWxvZy5cbiAgICAgICAgICogWW91IG1heSBvdmVycmlkZSB0aGlzIGJ5IHNldHRpbmcgYHlpaS5jb25maXJtYC5cbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIGNvbmZpcm1hdGlvbiBtZXNzYWdlLlxuICAgICAgICAgKiBAcGFyYW0gb2sgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBjb25maXJtcyB0aGUgbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gY2FuY2VsIGEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIHVzZXIgY2FuY2VscyB0aGUgY29uZmlybWF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBjb25maXJtOiBmdW5jdGlvbiAobWVzc2FnZSwgb2ssIGNhbmNlbCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKSB7XG4gICAgICAgICAgICAgICAgIW9rIHx8IG9rKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICFjYW5jZWwgfHwgY2FuY2VsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGFjdGlvbiB0cmlnZ2VyZWQgYnkgdXNlci5cbiAgICAgICAgICogVGhpcyBtZXRob2QgcmVjb2duaXplcyB0aGUgYGRhdGEtbWV0aG9kYCBhdHRyaWJ1dGUgb2YgdGhlIGVsZW1lbnQuIElmIHRoZSBhdHRyaWJ1dGUgZXhpc3RzLFxuICAgICAgICAgKiB0aGUgbWV0aG9kIHdpbGwgc3VibWl0IHRoZSBmb3JtIGNvbnRhaW5pbmcgdGhpcyBlbGVtZW50LiBJZiB0aGVyZSBpcyBubyBjb250YWluaW5nIGZvcm0sIGEgZm9ybVxuICAgICAgICAgKiB3aWxsIGJlIGNyZWF0ZWQgYW5kIHN1Ym1pdHRlZCB1c2luZyB0aGUgbWV0aG9kIGdpdmVuIGJ5IHRoaXMgYXR0cmlidXRlIHZhbHVlIChlLmcuIFwicG9zdFwiLCBcInB1dFwiKS5cbiAgICAgICAgICogRm9yIGh5cGVybGlua3MsIHRoZSBmb3JtIGFjdGlvbiB3aWxsIHRha2UgdGhlIHZhbHVlIG9mIHRoZSBcImhyZWZcIiBhdHRyaWJ1dGUgb2YgdGhlIGxpbmsuXG4gICAgICAgICAqIEZvciBvdGhlciBlbGVtZW50cywgZWl0aGVyIHRoZSBjb250YWluaW5nIGZvcm0gYWN0aW9uIG9yIHRoZSBjdXJyZW50IHBhZ2UgVVJMIHdpbGwgYmUgdXNlZFxuICAgICAgICAgKiBhcyB0aGUgZm9ybSBhY3Rpb24gVVJMLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgYGRhdGEtbWV0aG9kYCBhdHRyaWJ1dGUgaXMgbm90IGRlZmluZWQsIHRoZSBgaHJlZmAgYXR0cmlidXRlIChpZiBhbnkpIG9mIHRoZSBlbGVtZW50XG4gICAgICAgICAqIHdpbGwgYmUgYXNzaWduZWQgdG8gYHdpbmRvdy5sb2NhdGlvbmAuXG4gICAgICAgICAqXG4gICAgICAgICAqIFN0YXJ0aW5nIGZyb20gdmVyc2lvbiAyLjAuMywgdGhlIGBkYXRhLXBhcmFtc2AgYXR0cmlidXRlIGlzIGFsc28gcmVjb2duaXplZCB3aGVuIHlvdSBzcGVjaWZ5XG4gICAgICAgICAqIGBkYXRhLW1ldGhvZGAuIFRoZSB2YWx1ZSBvZiBgZGF0YS1wYXJhbXNgIHNob3VsZCBiZSBhIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGRhdGEgKG5hbWUtdmFsdWUgcGFpcnMpXG4gICAgICAgICAqIHRoYXQgc2hvdWxkIGJlIHN1Ym1pdHRlZCBhcyBoaWRkZW4gaW5wdXRzLiBGb3IgZXhhbXBsZSwgeW91IG1heSB1c2UgdGhlIGZvbGxvd2luZyBjb2RlIHRvIGdlbmVyYXRlXG4gICAgICAgICAqIHN1Y2ggYSBsaW5rOlxuICAgICAgICAgKlxuICAgICAgICAgKiBgYGBwaHBcbiAgICAgICAgICogdXNlIHlpaVxcaGVscGVyc1xcSHRtbDtcbiAgICAgICAgICogdXNlIHlpaVxcaGVscGVyc1xcSnNvbjtcbiAgICAgICAgICpcbiAgICAgICAgICogZWNobyBIdG1sOjphKCdzdWJtaXQnLCBbJ3NpdGUvZm9vYmFyJ10sIFtcbiAgICAgICAgICogICAgICdkYXRhJyA9PiBbXG4gICAgICAgICAqICAgICAgICAgJ21ldGhvZCcgPT4gJ3Bvc3QnLFxuICAgICAgICAgKiAgICAgICAgICdwYXJhbXMnID0+IFtcbiAgICAgICAgICogICAgICAgICAgICAgJ25hbWUxJyA9PiAndmFsdWUxJyxcbiAgICAgICAgICogICAgICAgICAgICAgJ25hbWUyJyA9PiAndmFsdWUyJyxcbiAgICAgICAgICogICAgICAgICBdLFxuICAgICAgICAgKiAgICAgXSxcbiAgICAgICAgICogXSk7XG4gICAgICAgICAqIGBgYFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gJGUgdGhlIGpRdWVyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQgUmVsYXRlZCBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgaGFuZGxlQWN0aW9uOiBmdW5jdGlvbiAoJGUsIGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkZS5hdHRyKCdkYXRhLWZvcm0nKSA/ICQoJyMnICsgJGUuYXR0cignZGF0YS1mb3JtJykpIDogJGUuY2xvc2VzdCgnZm9ybScpLFxuICAgICAgICAgICAgICAgIG1ldGhvZCA9ICEkZS5kYXRhKCdtZXRob2QnKSAmJiAkZm9ybSA/ICRmb3JtLmF0dHIoJ21ldGhvZCcpIDogJGUuZGF0YSgnbWV0aG9kJyksXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gJGUuYXR0cignaHJlZicpLFxuICAgICAgICAgICAgICAgIGlzVmFsaWRBY3Rpb24gPSBhY3Rpb24gJiYgYWN0aW9uICE9PSAnIycsXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gJGUuZGF0YSgncGFyYW1zJyksXG4gICAgICAgICAgICAgICAgYXJlVmFsaWRQYXJhbXMgPSBwYXJhbXMgJiYgJC5pc1BsYWluT2JqZWN0KHBhcmFtcyksXG4gICAgICAgICAgICAgICAgcGpheCA9ICRlLmRhdGEoJ3BqYXgnKSxcbiAgICAgICAgICAgICAgICB1c2VQamF4ID0gcGpheCAhPT0gdW5kZWZpbmVkICYmIHBqYXggIT09IDAgJiYgJC5zdXBwb3J0LnBqYXgsXG4gICAgICAgICAgICAgICAgcGpheENvbnRhaW5lcixcbiAgICAgICAgICAgICAgICBwamF4T3B0aW9ucyA9IHt9LFxuICAgICAgICAgICAgICAgIGNvbmZsaWN0UGFyYW1zID0gWydzdWJtaXQnLCAncmVzZXQnLCAnZWxlbWVudHMnLCAnbGVuZ3RoJywgJ25hbWUnLCAnYWNjZXB0Q2hhcnNldCcsXG4gICAgICAgICAgICAgICAgICAgICdhY3Rpb24nLCAnZW5jdHlwZScsICdtZXRob2QnLCAndGFyZ2V0J107XG5cbiAgICAgICAgICAgIC8vIEZvcm1zIGFuZCB0aGVpciBjaGlsZCBlbGVtZW50cyBzaG91bGQgbm90IHVzZSBpbnB1dCBuYW1lcyBvciBpZHMgdGhhdCBjb25mbGljdCB3aXRoIHByb3BlcnRpZXMgb2YgYSBmb3JtLFxuICAgICAgICAgICAgLy8gc3VjaCBhcyBzdWJtaXQsIGxlbmd0aCwgb3IgbWV0aG9kLlxuICAgICAgICAgICAgJC5lYWNoKGNvbmZsaWN0UGFyYW1zLCBmdW5jdGlvbiAoaW5kZXgsIHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZVZhbGlkUGFyYW1zICYmIHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShwYXJhbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlBhcmFtZXRlciBuYW1lICdcIiArIHBhcmFtICsgXCInIGNvbmZsaWN0cyB3aXRoIGEgc2FtZSBuYW1lZCBmb3JtIHByb3BlcnR5LiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlBsZWFzZSB1c2UgYW5vdGhlciBuYW1lLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHVzZVBqYXgpIHtcbiAgICAgICAgICAgICAgICBwamF4Q29udGFpbmVyID0gJGUuZGF0YSgncGpheC1jb250YWluZXInKTtcbiAgICAgICAgICAgICAgICBpZiAocGpheENvbnRhaW5lciA9PT0gdW5kZWZpbmVkIHx8ICFwamF4Q29udGFpbmVyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBwamF4Q29udGFpbmVyID0gJGUuY2xvc2VzdCgnW2RhdGEtcGpheC1jb250YWluZXJdJykuYXR0cignaWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyAoJyMnICsgJGUuY2xvc2VzdCgnW2RhdGEtcGpheC1jb250YWluZXJdJykuYXR0cignaWQnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghcGpheENvbnRhaW5lci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcGpheENvbnRhaW5lciA9ICdib2R5JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGpheE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogcGpheENvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgcHVzaDogISEkZS5kYXRhKCdwamF4LXB1c2gtc3RhdGUnKSxcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZTogISEkZS5kYXRhKCdwamF4LXJlcGxhY2Utc3RhdGUnKSxcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG86ICRlLmRhdGEoJ3BqYXgtc2Nyb2xsdG8nKSxcbiAgICAgICAgICAgICAgICAgICAgcHVzaFJlZGlyZWN0OiAkZS5kYXRhKCdwamF4LXB1c2gtcmVkaXJlY3QnKSxcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZVJlZGlyZWN0OiAkZS5kYXRhKCdwamF4LXJlcGxhY2UtcmVkaXJlY3QnKSxcbiAgICAgICAgICAgICAgICAgICAgc2tpcE91dGVyQ29udGFpbmVyczogJGUuZGF0YSgncGpheC1za2lwLW91dGVyLWNvbnRhaW5lcnMnKSxcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dDogJGUuZGF0YSgncGpheC10aW1lb3V0JyksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFRhcmdldDogJGVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZEFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB1c2VQamF4ID8gJC5wamF4LmNsaWNrKGV2ZW50LCBwamF4T3B0aW9ucykgOiB3aW5kb3cubG9jYXRpb24uYXNzaWduKGFjdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkZS5pcygnOnN1Ym1pdCcpICYmICRmb3JtLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodXNlUGpheCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5wamF4LnN1Ym1pdChlLCBwamF4T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKCdzdWJtaXQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgb2xkTWV0aG9kLFxuICAgICAgICAgICAgICAgIG9sZEFjdGlvbixcbiAgICAgICAgICAgICAgICBuZXdGb3JtID0gISRmb3JtLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICghbmV3Rm9ybSkge1xuICAgICAgICAgICAgICAgIG9sZE1ldGhvZCA9ICRmb3JtLmF0dHIoJ21ldGhvZCcpO1xuICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ21ldGhvZCcsIG1ldGhvZCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzVmFsaWRBY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgb2xkQWN0aW9uID0gJGZvcm0uYXR0cignYWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ2FjdGlvbicsIGFjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWRBY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gcHViLmdldEN1cnJlbnRVcmwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGZvcm0gPSAkKCc8Zm9ybS8+Jywge21ldGhvZDogbWV0aG9kLCBhY3Rpb246IGFjdGlvbn0pO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkZS5hdHRyKCd0YXJnZXQnKTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ3RhcmdldCcsIHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghLyhnZXR8cG9zdCkvaS50ZXN0KG1ldGhvZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXBwZW5kKCQoJzxpbnB1dC8+Jywge25hbWU6ICdfbWV0aG9kJywgdmFsdWU6IG1ldGhvZCwgdHlwZTogJ2hpZGRlbid9KSk7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZCA9ICdwb3N0JztcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXR0cignbWV0aG9kJywgbWV0aG9kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKC9wb3N0L2kudGVzdChtZXRob2QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjc3JmUGFyYW0gPSBwdWIuZ2V0Q3NyZlBhcmFtKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3JmUGFyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZCgkKCc8aW5wdXQvPicsIHtuYW1lOiBjc3JmUGFyYW0sIHZhbHVlOiBwdWIuZ2V0Q3NyZlRva2VuKCksIHR5cGU6ICdoaWRkZW4nfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRmb3JtLmhpZGUoKS5hcHBlbmRUbygnYm9keScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWN0aXZlRm9ybURhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlRm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1lbWJlciB0aGUgZWxlbWVudCB0cmlnZ2VyZWQgdGhlIGZvcm0gc3VibWlzc2lvbi4gVGhpcyBpcyB1c2VkIGJ5IHlpaS5hY3RpdmVGb3JtLmpzLlxuICAgICAgICAgICAgICAgIGFjdGl2ZUZvcm1EYXRhLnN1Ym1pdE9iamVjdCA9ICRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYXJlVmFsaWRQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAkLmVhY2gocGFyYW1zLCBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXBwZW5kKCQoJzxpbnB1dC8+JykuYXR0cih7bmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlLCB0eXBlOiAnaGlkZGVuJ30pKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHVzZVBqYXgpIHtcbiAgICAgICAgICAgICAgICAkZm9ybS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5wamF4LnN1Ym1pdChlLCBwamF4T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAkLndoZW4oJGZvcm0uZGF0YSgneWlpU3VibWl0RmluYWxpemVQcm9taXNlJykpLmRvbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChuZXdGb3JtKSB7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9sZEFjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ2FjdGlvbicsIG9sZEFjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ21ldGhvZCcsIG9sZE1ldGhvZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYXJlVmFsaWRQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHBhcmFtcywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCInICsgbmFtZSArICdcIl0nLCAkZm9ybSkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFF1ZXJ5UGFyYW1zOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICB2YXIgcG9zID0gdXJsLmluZGV4T2YoJz8nKTtcbiAgICAgICAgICAgIGlmIChwb3MgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFpcnMgPSAkLmdyZXAodXJsLnN1YnN0cmluZyhwb3MgKyAxKS5zcGxpdCgnIycpWzBdLnNwbGl0KCcmJyksIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gJyc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7fTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaXIgPSBwYWlyc1tpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMF0ucmVwbGFjZSgvXFwrL2csICclMjAnKSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0ucmVwbGFjZSgvXFwrL2csICclMjAnKSk7XG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtc1tuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtc1tuYW1lXSA9IHZhbHVlIHx8ICcnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghJC5pc0FycmF5KHBhcmFtc1tuYW1lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1tuYW1lXSA9IFtwYXJhbXNbbmFtZV1dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtc1tuYW1lXS5wdXNoKHZhbHVlIHx8ICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdE1vZHVsZTogZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICAgICAgaWYgKG1vZHVsZS5pc0FjdGl2ZSAhPT0gdW5kZWZpbmVkICYmICFtb2R1bGUuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG1vZHVsZS5pbml0KSkge1xuICAgICAgICAgICAgICAgIG1vZHVsZS5pbml0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkLmVhY2gobW9kdWxlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdCh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuaW5pdE1vZHVsZSh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbml0Q3NyZkhhbmRsZXIoKTtcbiAgICAgICAgICAgIGluaXRSZWRpcmVjdEhhbmRsZXIoKTtcbiAgICAgICAgICAgIGluaXRBc3NldEZpbHRlcnMoKTtcbiAgICAgICAgICAgIGluaXREYXRhTWV0aG9kcygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBVUkwgb2YgdGhlIGN1cnJlbnQgcGFnZSB3aXRob3V0IHBhcmFtcyBhbmQgdHJhaWxpbmcgc2xhc2guIFNlcGFyYXRlZCBhbmQgbWFkZSBwdWJsaWMgZm9yIHRlc3RpbmcuXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRCYXNlQ3VycmVudFVybDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgVVJMIG9mIHRoZSBjdXJyZW50IHBhZ2UuIFVzZWQgZm9yIHRlc3RpbmcsIHlvdSBjYW4gYWx3YXlzIGNhbGwgYHdpbmRvdy5sb2NhdGlvbi5ocmVmYCBtYW51YWxseVxuICAgICAgICAgKiBpbnN0ZWFkLlxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q3VycmVudFVybDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRDc3JmSGFuZGxlcigpIHtcbiAgICAgICAgLy8gYXV0b21hdGljYWxseSBzZW5kIENTUkYgdG9rZW4gZm9yIGFsbCBBSkFYIHJlcXVlc3RzXG4gICAgICAgICQuYWpheFByZWZpbHRlcihmdW5jdGlvbiAob3B0aW9ucywgb3JpZ2luYWxPcHRpb25zLCB4aHIpIHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5jcm9zc0RvbWFpbiAmJiBwdWIuZ2V0Q3NyZlBhcmFtKCkpIHtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignWC1DU1JGLVRva2VuJywgcHViLmdldENzcmZUb2tlbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHB1Yi5yZWZyZXNoQ3NyZlRva2VuKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdFJlZGlyZWN0SGFuZGxlcigpIHtcbiAgICAgICAgLy8gaGFuZGxlIEFKQVggcmVkaXJlY3Rpb25cbiAgICAgICAgJChkb2N1bWVudCkuYWpheENvbXBsZXRlKGZ1bmN0aW9uIChldmVudCwgeGhyKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0geGhyICYmIHhoci5nZXRSZXNwb25zZUhlYWRlcignWC1SZWRpcmVjdCcpO1xuICAgICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24odXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdEFzc2V0RmlsdGVycygpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVzZWQgZm9yIHN0b3JpbmcgbG9hZGVkIHNjcmlwdHMgYW5kIGluZm9ybWF0aW9uIGFib3V0IGxvYWRpbmcgZWFjaCBzY3JpcHQgaWYgaXQncyBpbiB0aGUgcHJvY2VzcyBvZiBsb2FkaW5nLlxuICAgICAgICAgKiBBIHNpbmdsZSBzY3JpcHQgY2FuIGhhdmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICAgICAgICAgKlxuICAgICAgICAgKiAtIGB1bmRlZmluZWRgIC0gc2NyaXB0IHdhcyBub3QgbG9hZGVkIGF0IGFsbCBiZWZvcmUgb3Igd2FzIGxvYWRlZCB3aXRoIGVycm9yIGxhc3QgdGltZS5cbiAgICAgICAgICogLSBgdHJ1ZWAgKGJvb2xlYW4pIC0gIHNjcmlwdCB3YXMgc3VjY2Vzc2Z1bGx5IGxvYWRlZC5cbiAgICAgICAgICogLSBvYmplY3QgLSBzY3JpcHQgaXMgY3VycmVudGx5IGxvYWRpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEluIGNhc2Ugb2YgYSB2YWx1ZSBiZWluZyBhbiBvYmplY3QgdGhlIHByb3BlcnRpZXMgYXJlOlxuICAgICAgICAgKiAtIGB4aHJMaXN0YCAtIHJlcHJlc2VudHMgYSBxdWV1ZSBvZiBYSFIgcmVxdWVzdHMgc2VudCB0byB0aGUgc2FtZSBVUkwgKHJlbGF0ZWQgd2l0aCB0aGlzIHNjcmlwdCkgaW4gdGhlIHNhbWVcbiAgICAgICAgICogc21hbGwgcGVyaW9kIG9mIHRpbWUuXG4gICAgICAgICAqIC0gYHhockRvbmVgIC0gYm9vbGVhbiwgYWN0cyBsaWtlIGEgbG9ja2luZyBtZWNoYW5pc20uIFdoZW4gb25lIG9mIHRoZSBYSFIgcmVxdWVzdHMgaW4gdGhlIHF1ZXVlIGlzXG4gICAgICAgICAqIHN1Y2Nlc3NmdWxseSBjb21wbGV0ZWQsIGl0IHdpbGwgYWJvcnQgdGhlIHJlc3Qgb2YgY29uY3VycmVudCByZXF1ZXN0cyB0byB0aGUgc2FtZSBVUkwgdW50aWwgY2xlYW51cCBpcyBkb25lXG4gICAgICAgICAqIHRvIHByZXZlbnQgcG9zc2libGUgZXJyb3JzIGFuZCByYWNlIGNvbmRpdGlvbnMuXG4gICAgICAgICAqIEB0eXBlIHt7fX1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBsb2FkZWRTY3JpcHRzID0ge307XG5cbiAgICAgICAgJCgnc2NyaXB0W3NyY10nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBnZXRBYnNvbHV0ZVVybCh0aGlzLnNyYyk7XG4gICAgICAgICAgICBsb2FkZWRTY3JpcHRzW3VybF0gPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkLmFqYXhQcmVmaWx0ZXIoJ3NjcmlwdCcsIGZ1bmN0aW9uIChvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMsIHhocikge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGF0YVR5cGUgPT0gJ2pzb25wJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHVybCA9IGdldEFic29sdXRlVXJsKG9wdGlvbnMudXJsKSxcbiAgICAgICAgICAgICAgICBmb3JiaWRkZW5SZXBlYXRlZExvYWQgPSBsb2FkZWRTY3JpcHRzW3VybF0gPT09IHRydWUgJiYgIWlzUmVsb2FkYWJsZUFzc2V0KHVybCksXG4gICAgICAgICAgICAgICAgY2xlYW51cFJ1bm5pbmcgPSBsb2FkZWRTY3JpcHRzW3VybF0gIT09IHVuZGVmaW5lZCAmJiBsb2FkZWRTY3JpcHRzW3VybF1bJ3hockRvbmUnXSA9PT0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKGZvcmJpZGRlblJlcGVhdGVkTG9hZCB8fCBjbGVhbnVwUnVubmluZykge1xuICAgICAgICAgICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxvYWRlZFNjcmlwdHNbdXJsXSA9PT0gdW5kZWZpbmVkIHx8IGxvYWRlZFNjcmlwdHNbdXJsXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGxvYWRlZFNjcmlwdHNbdXJsXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgeGhyTGlzdDogW10sXG4gICAgICAgICAgICAgICAgICAgIHhockRvbmU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyLmRvbmUoZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgbXVsdGlwbGUgcmVxdWVzdHMgd2VyZSBzdWNjZXNzZnVsbHkgbG9hZGVkLCBwZXJmb3JtIGNsZWFudXAgb25seSBvbmNlXG4gICAgICAgICAgICAgICAgaWYgKGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXVsneGhyRG9uZSddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF1bJ3hockRvbmUnXSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbG9hZGVkU2NyaXB0c1tqcVhIUi55aWlVcmxdWyd4aHJMaXN0J10ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNpbmdsZVhociA9IGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXVsneGhyTGlzdCddW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2luZ2xlWGhyICYmIHNpbmdsZVhoci5yZWFkeVN0YXRlICE9PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaW5nbGVYaHIuYWJvcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXSA9IHRydWU7XG4gICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cykge1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0U3RhdHVzID09PSAnYWJvcnQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgbG9hZGVkU2NyaXB0c1tqcVhIUi55aWlVcmxdWyd4aHJMaXN0J11banFYSFIueWlpSW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgdmFyIGFsbEZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXVsneGhyTGlzdCddLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF1bJ3hockxpc3QnXVtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsRmFpbGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYWxsRmFpbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBVc2UgcHJlZml4IGZvciBjdXN0b20gWEhSIHByb3BlcnRpZXMgdG8gYXZvaWQgcG9zc2libGUgY29uZmxpY3RzIHdpdGggZXhpc3RpbmcgcHJvcGVydGllc1xuICAgICAgICAgICAgeGhyLnlpaUluZGV4ID0gbG9hZGVkU2NyaXB0c1t1cmxdWyd4aHJMaXN0J10ubGVuZ3RoO1xuICAgICAgICAgICAgeGhyLnlpaVVybCA9IHVybDtcblxuICAgICAgICAgICAgbG9hZGVkU2NyaXB0c1t1cmxdWyd4aHJMaXN0J11beGhyLnlpaUluZGV4XSA9IHhocjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkuYWpheENvbXBsZXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzdHlsZVNoZWV0cyA9IFtdO1xuICAgICAgICAgICAgJCgnbGlua1tyZWw9c3R5bGVzaGVldF0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gZ2V0QWJzb2x1dGVVcmwodGhpcy5ocmVmKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNSZWxvYWRhYmxlQXNzZXQodXJsKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJC5pbkFycmF5KHVybCwgc3R5bGVTaGVldHMpID09PSAtMSA/IHN0eWxlU2hlZXRzLnB1c2godXJsKSA6ICQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdERhdGFNZXRob2RzKCkge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBtZXRob2QgPSAkdGhpcy5kYXRhKCdtZXRob2QnKSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gJHRoaXMuZGF0YSgnY29uZmlybScpLFxuICAgICAgICAgICAgICAgIGZvcm0gPSAkdGhpcy5kYXRhKCdmb3JtJyk7XG5cbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCAmJiBtZXNzYWdlID09PSB1bmRlZmluZWQgJiYgZm9ybSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZXNzYWdlICE9PSB1bmRlZmluZWQgJiYgbWVzc2FnZSAhPT0gZmFsc2UgJiYgbWVzc2FnZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAkLnByb3h5KHB1Yi5jb25maXJtLCB0aGlzKShtZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1Yi5oYW5kbGVBY3Rpb24oJHRoaXMsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHViLmhhbmRsZUFjdGlvbigkdGhpcywgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gaGFuZGxlIGRhdGEtY29uZmlybSBhbmQgZGF0YS1tZXRob2QgZm9yIGNsaWNrYWJsZSBhbmQgY2hhbmdlYWJsZSBlbGVtZW50c1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2sueWlpJywgcHViLmNsaWNrYWJsZVNlbGVjdG9yLCBoYW5kbGVyKVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UueWlpJywgcHViLmNoYW5nZWFibGVTZWxlY3RvciwgaGFuZGxlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNSZWxvYWRhYmxlQXNzZXQodXJsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHViLnJlbG9hZGFibGVTY3JpcHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcnVsZSA9IGdldEFic29sdXRlVXJsKHB1Yi5yZWxvYWRhYmxlU2NyaXB0c1tpXSk7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBuZXcgUmVnRXhwKFwiXlwiICsgZXNjYXBlUmVnRXhwKHJ1bGUpLnNwbGl0KCdcXFxcKicpLmpvaW4oJy4rJykgKyBcIiRcIikudGVzdCh1cmwpO1xuICAgICAgICAgICAgaWYgKG1hdGNoID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNDQ2MTcwL2VzY2FwZS1zdHJpbmctZm9yLXVzZS1pbi1qYXZhc2NyaXB0LXJlZ2V4XG4gICAgZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFic29sdXRlIFVSTCBiYXNlZCBvbiB0aGUgZ2l2ZW4gVVJMXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBJbml0aWFsIFVSTFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QWJzb2x1dGVVcmwodXJsKSB7XG4gICAgICAgIHJldHVybiB1cmwuY2hhckF0KDApID09PSAnLycgPyBwdWIuZ2V0QmFzZUN1cnJlbnRVcmwoKSArIHVybCA6IHVybDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHViO1xufSkod2luZG93LmpRdWVyeSk7XG5cbndpbmRvdy5qUXVlcnkoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy55aWkuaW5pdE1vZHVsZSh3aW5kb3cueWlpKTtcbn0pO1xuIiwiLyoqXG4gKiBZaWkgdmFsaWRhdGlvbiBtb2R1bGUuXG4gKlxuICogVGhpcyBKYXZhU2NyaXB0IG1vZHVsZSBwcm92aWRlcyB0aGUgdmFsaWRhdGlvbiBtZXRob2RzIGZvciB0aGUgYnVpbHQtaW4gdmFsaWRhdG9ycy5cbiAqXG4gKiBAbGluayBodHRwOi8vd3d3LnlpaWZyYW1ld29yay5jb20vXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAwOCBZaWkgU29mdHdhcmUgTExDXG4gKiBAbGljZW5zZSBodHRwOi8vd3d3LnlpaWZyYW1ld29yay5jb20vbGljZW5zZS9cbiAqIEBhdXRob3IgUWlhbmcgWHVlIDxxaWFuZy54dWVAZ21haWwuY29tPlxuICogQHNpbmNlIDIuMFxuICovXG5cbnlpaS52YWxpZGF0aW9uID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIHB1YiA9IHtcbiAgICAgICAgaXNFbXB0eTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCAoJC5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHx8IHZhbHVlID09PSAnJztcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRNZXNzYWdlOiBmdW5jdGlvbiAobWVzc2FnZXMsIG1lc3NhZ2UsIHZhbHVlKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG1lc3NhZ2UucmVwbGFjZSgvXFx7dmFsdWVcXH0vZywgdmFsdWUpKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXF1aXJlZDogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5yZXF1aXJlZFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXNTdHJpbmcgPSB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc3RyaWN0ICYmIHZhbHVlICE9PSB1bmRlZmluZWQgfHwgIW9wdGlvbnMuc3RyaWN0ICYmICFwdWIuaXNFbXB0eShpc1N0cmluZyA/ICQudHJpbSh2YWx1ZSkgOiB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMuc3RyaWN0ICYmIHZhbHVlID09IG9wdGlvbnMucmVxdWlyZWRWYWx1ZSB8fCBvcHRpb25zLnN0cmljdCAmJiB2YWx1ZSA9PT0gb3B0aW9ucy5yZXF1aXJlZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFwiYm9vbGVhblwiIGlzIGEgcmVzZXJ2ZWQga2V5d29yZCBpbiBvbGRlciB2ZXJzaW9ucyBvZiBFUyBzbyBpdCdzIHF1b3RlZCBmb3IgSUUgPCA5IHN1cHBvcnRcbiAgICAgICAgJ2Jvb2xlYW4nOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsaWQgPSAhb3B0aW9ucy5zdHJpY3QgJiYgKHZhbHVlID09IG9wdGlvbnMudHJ1ZVZhbHVlIHx8IHZhbHVlID09IG9wdGlvbnMuZmFsc2VWYWx1ZSlcbiAgICAgICAgICAgICAgICB8fCBvcHRpb25zLnN0cmljdCAmJiAodmFsdWUgPT09IG9wdGlvbnMudHJ1ZVZhbHVlIHx8IHZhbHVlID09PSBvcHRpb25zLmZhbHNlVmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0cmluZzogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmlzICE9PSB1bmRlZmluZWQgJiYgdmFsdWUubGVuZ3RoICE9IG9wdGlvbnMuaXMpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5ub3RFcXVhbCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1pbiAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLmxlbmd0aCA8IG9wdGlvbnMubWluKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMudG9vU2hvcnQsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1heCAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLmxlbmd0aCA+IG9wdGlvbnMubWF4KSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMudG9vTG9uZywgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGZpbGU6IGZ1bmN0aW9uIChhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgZmlsZXMgPSBnZXRVcGxvYWRlZEZpbGVzKGF0dHJpYnV0ZSwgbWVzc2FnZXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgJC5lYWNoKGZpbGVzLCBmdW5jdGlvbiAoaSwgZmlsZSkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlRmlsZShmaWxlLCBtZXNzYWdlcywgb3B0aW9ucyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbWFnZTogZnVuY3Rpb24gKGF0dHJpYnV0ZSwgbWVzc2FnZXMsIG9wdGlvbnMsIGRlZmVycmVkTGlzdCkge1xuICAgICAgICAgICAgdmFyIGZpbGVzID0gZ2V0VXBsb2FkZWRGaWxlcyhhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBvcHRpb25zKTtcbiAgICAgICAgICAgICQuZWFjaChmaWxlcywgZnVuY3Rpb24gKGksIGZpbGUpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUZpbGUoZmlsZSwgbWVzc2FnZXMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2tpcCBpbWFnZSB2YWxpZGF0aW9uIGlmIEZpbGVSZWFkZXIgQVBJIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEZpbGVSZWFkZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgICAgICAgICBwdWIudmFsaWRhdGVJbWFnZShmaWxlLCBtZXNzYWdlcywgb3B0aW9ucywgZGVmZXJyZWQsIG5ldyBGaWxlUmVhZGVyKCksIG5ldyBJbWFnZSgpKTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZExpc3QucHVzaChkZWZlcnJlZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWxpZGF0ZUltYWdlOiBmdW5jdGlvbiAoZmlsZSwgbWVzc2FnZXMsIG9wdGlvbnMsIGRlZmVycmVkLCBmaWxlUmVhZGVyLCBpbWFnZSkge1xuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGVJbWFnZVNpemUoZmlsZSwgaW1hZ2UsIG1lc3NhZ2VzLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpbWFnZS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy5ub3RJbWFnZS5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IHRoaXMucmVzdWx0O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gUmVzb2x2ZSBkZWZlcnJlZCBpZiB0aGVyZSB3YXMgZXJyb3Igd2hpbGUgcmVhZGluZyBkYXRhXG4gICAgICAgICAgICBmaWxlUmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG51bWJlcjogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAhb3B0aW9ucy5wYXR0ZXJuLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWluICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgPCBvcHRpb25zLm1pbikge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLnRvb1NtYWxsLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5tYXggIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSA+IG9wdGlvbnMubWF4KSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMudG9vQmlnLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmFuZ2U6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93QXJyYXkgJiYgJC5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbkFycmF5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgJC5lYWNoKCQuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV0sIGZ1bmN0aW9uIChpLCB2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh2LCBvcHRpb25zLnJhbmdlKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbkFycmF5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubm90ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLm5vdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ub3QgPT09IGluQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVndWxhckV4cHJlc3Npb246IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFvcHRpb25zLm5vdCAmJiAhb3B0aW9ucy5wYXR0ZXJuLnRlc3QodmFsdWUpIHx8IG9wdGlvbnMubm90ICYmIG9wdGlvbnMucGF0dGVybi50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBlbWFpbDogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsaWQgPSB0cnVlLFxuICAgICAgICAgICAgICAgIHJlZ2V4cCA9IC9eKCg/OlwiPyhbXlwiXSopXCI/XFxzKT8pKD86XFxzKyk/KD86KDw/KSgoLispQChbXj5dKykpKD4/KSkkLyxcbiAgICAgICAgICAgICAgICBtYXRjaGVzID0gcmVnZXhwLmV4ZWModmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAobWF0Y2hlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBsb2NhbFBhcnQgPSBtYXRjaGVzWzVdLFxuICAgICAgICAgICAgICAgICAgICBkb21haW4gPSBtYXRjaGVzWzZdO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlSUROKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsUGFydCA9IHB1bnljb2RlLnRvQVNDSUkobG9jYWxQYXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluID0gcHVueWNvZGUudG9BU0NJSShkb21haW4pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbWF0Y2hlc1sxXSArIG1hdGNoZXNbM10gKyBsb2NhbFBhcnQgKyAnQCcgKyBkb21haW4gKyBtYXRjaGVzWzddO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsb2NhbFBhcnQubGVuZ3RoID4gNjQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChsb2NhbFBhcnQgKyAnQCcgKyBkb21haW4pLmxlbmd0aCA+IDI1NCkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gb3B0aW9ucy5wYXR0ZXJuLnRlc3QodmFsdWUpIHx8IChvcHRpb25zLmFsbG93TmFtZSAmJiBvcHRpb25zLmZ1bGxQYXR0ZXJuLnRlc3QodmFsdWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXJsOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRlZmF1bHRTY2hlbWUgJiYgIS86XFwvXFwvLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gb3B0aW9ucy5kZWZhdWx0U2NoZW1lICsgJzovLycgKyB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHZhbGlkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlSUROKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSAvXihbXjpdKyk6XFwvXFwvKFteXFwvXSspKC4qKSQvLmV4ZWModmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRjaGVzWzFdICsgJzovLycgKyBwdW55Y29kZS50b0FTQ0lJKG1hdGNoZXNbMl0pICsgbWF0Y2hlc1szXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQgfHwgIW9wdGlvbnMucGF0dGVybi50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB0cmltOiBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSwgb3B0aW9ucywgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkZm9ybS5maW5kKGF0dHJpYnV0ZS5pbnB1dCk7XG4gICAgICAgICAgICBpZiAoJGlucHV0LmlzKCc6Y2hlY2tib3gsIDpyYWRpbycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZSA9ICRpbnB1dC52YWwoKTtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5za2lwT25FbXB0eSB8fCAhcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAkLnRyaW0odmFsdWUpO1xuICAgICAgICAgICAgICAgICRpbnB1dC52YWwodmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FwdGNoYTogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDQVBUQ0hBIG1heSBiZSB1cGRhdGVkIHZpYSBBSkFYIGFuZCB0aGUgdXBkYXRlZCBoYXNoIGlzIHN0b3JlZCBpbiBib2R5IGRhdGFcbiAgICAgICAgICAgIHZhciBoYXNoID0gJCgnYm9keScpLmRhdGEob3B0aW9ucy5oYXNoS2V5KTtcbiAgICAgICAgICAgIGhhc2ggPSBoYXNoID09IG51bGwgPyBvcHRpb25zLmhhc2ggOiBoYXNoW29wdGlvbnMuY2FzZVNlbnNpdGl2ZSA/IDAgOiAxXTtcbiAgICAgICAgICAgIHZhciB2ID0gb3B0aW9ucy5jYXNlU2Vuc2l0aXZlID8gdmFsdWUgOiB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHYubGVuZ3RoIC0gMSwgaCA9IDA7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICAgICAgaCArPSB2LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaCAhPSBoYXNoKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbXBhcmU6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMsICRmb3JtKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjb21wYXJlVmFsdWUsXG4gICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29tcGFyZUF0dHJpYnV0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29tcGFyZVZhbHVlID0gb3B0aW9ucy5jb21wYXJlVmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciAkdGFyZ2V0ID0gJCgnIycgKyBvcHRpb25zLmNvbXBhcmVBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIGlmICghJHRhcmdldC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRhcmdldCA9ICRmb3JtLmZpbmQoJ1tuYW1lPVwiJyArIG9wdGlvbnMuY29tcGFyZUF0dHJpYnV0ZU5hbWUgKyAnXCJdJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbXBhcmVWYWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA/IHBhcnNlRmxvYXQodmFsdWUpIDogMDtcbiAgICAgICAgICAgICAgICBjb21wYXJlVmFsdWUgPSBjb21wYXJlVmFsdWUgPyBwYXJzZUZsb2F0KGNvbXBhcmVWYWx1ZSkgOiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoIChvcHRpb25zLm9wZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlID09IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT09JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA9PT0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICchPSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgIT0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICchPT0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlICE9PSBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJz4nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlID4gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICc+PSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgPj0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA8IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPD0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlIDw9IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXA6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5lZ2F0aW9uID0gbnVsbCxcbiAgICAgICAgICAgICAgICBjaWRyID0gbnVsbCxcbiAgICAgICAgICAgICAgICBtYXRjaGVzID0gbmV3IFJlZ0V4cChvcHRpb25zLmlwUGFyc2VQYXR0ZXJuKS5leGVjKHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgbmVnYXRpb24gPSBtYXRjaGVzWzFdIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRjaGVzWzJdO1xuICAgICAgICAgICAgICAgIGNpZHIgPSBtYXRjaGVzWzRdIHx8IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnN1Ym5ldCA9PT0gdHJ1ZSAmJiBjaWRyID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMubm9TdWJuZXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zdWJuZXQgPT09IGZhbHNlICYmIGNpZHIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5oYXNTdWJuZXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5uZWdhdGlvbiA9PT0gZmFsc2UgJiYgbmVnYXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaXBWZXJzaW9uID0gdmFsdWUuaW5kZXhPZignOicpID09PSAtMSA/IDQgOiA2O1xuICAgICAgICAgICAgaWYgKGlwVmVyc2lvbiA9PSA2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChvcHRpb25zLmlwdjZQYXR0ZXJuKSkudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaXB2Nikge1xuICAgICAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5pcHY2Tm90QWxsb3dlZCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChvcHRpb25zLmlwdjRQYXR0ZXJuKSkudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaXB2NCkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5pcHY0Tm90QWxsb3dlZCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRVcGxvYWRlZEZpbGVzKGF0dHJpYnV0ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gU2tpcCB2YWxpZGF0aW9uIGlmIEZpbGUgQVBJIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgICAgaWYgKHR5cGVvZiBGaWxlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZUlucHV0ID0gJChhdHRyaWJ1dGUuaW5wdXQsIGF0dHJpYnV0ZS4kZm9ybSkuZ2V0KDApO1xuXG4gICAgICAgIC8vIFNraXAgdmFsaWRhdGlvbiBpZiBmaWxlIGlucHV0IGRvZXMgbm90IGV4aXN0XG4gICAgICAgIC8vIChpbiBjYXNlIGZpbGUgaW5wdXRzIGFyZSBhZGRlZCBkeW5hbWljYWxseSBhbmQgbm8gZmlsZSBpbnB1dCBoYXMgYmVlbiBhZGRlZCB0byB0aGUgZm9ybSlcbiAgICAgICAgaWYgKHR5cGVvZiBmaWxlSW5wdXQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWxlcyA9IGZpbGVJbnB1dC5maWxlcztcbiAgICAgICAgaWYgKCFmaWxlcykge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLm1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLnNraXBPbkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnVwbG9hZFJlcXVpcmVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4RmlsZXMgJiYgb3B0aW9ucy5tYXhGaWxlcyA8IGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnRvb01hbnkpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlRmlsZShmaWxlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5leHRlbnNpb25zICYmIG9wdGlvbnMuZXh0ZW5zaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBmaWxlLm5hbWUubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgICAgICAgIHZhciBleHQgPSAhfmluZGV4ID8gJycgOiBmaWxlLm5hbWUuc3Vic3RyKGluZGV4ICsgMSwgZmlsZS5uYW1lLmxlbmd0aCkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgaWYgKCF+b3B0aW9ucy5leHRlbnNpb25zLmluZGV4T2YoZXh0KSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy53cm9uZ0V4dGVuc2lvbi5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWltZVR5cGVzICYmIG9wdGlvbnMubWltZVR5cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICghdmFsaWRhdGVNaW1lVHlwZShvcHRpb25zLm1pbWVUeXBlcywgZmlsZS50eXBlKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy53cm9uZ01pbWVUeXBlLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5tYXhTaXplICYmIG9wdGlvbnMubWF4U2l6ZSA8IGZpbGUuc2l6ZSkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnRvb0JpZy5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWluU2l6ZSAmJiBvcHRpb25zLm1pblNpemUgPiBmaWxlLnNpemUpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy50b29TbWFsbC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVNaW1lVHlwZShtaW1lVHlwZXMsIGZpbGVUeXBlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtaW1lVHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChuZXcgUmVnRXhwKG1pbWVUeXBlc1tpXSkudGVzdChmaWxlVHlwZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZUltYWdlU2l6ZShmaWxlLCBpbWFnZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMubWluV2lkdGggJiYgaW1hZ2Uud2lkdGggPCBvcHRpb25zLm1pbldpZHRoKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudW5kZXJXaWR0aC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4V2lkdGggJiYgaW1hZ2Uud2lkdGggPiBvcHRpb25zLm1heFdpZHRoKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMub3ZlcldpZHRoLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5taW5IZWlnaHQgJiYgaW1hZ2UuaGVpZ2h0IDwgb3B0aW9ucy5taW5IZWlnaHQpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy51bmRlckhlaWdodC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4SGVpZ2h0ICYmIGltYWdlLmhlaWdodCA+IG9wdGlvbnMubWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMub3ZlckhlaWdodC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHB1Yjtcbn0pKGpRdWVyeSk7XG4iLCIvKipcbiAqIFlpaSBmb3JtIHdpZGdldC5cbiAqXG4gKiBUaGlzIGlzIHRoZSBKYXZhU2NyaXB0IHdpZGdldCB1c2VkIGJ5IHRoZSB5aWlcXHdpZGdldHNcXEFjdGl2ZUZvcm0gd2lkZ2V0LlxuICpcbiAqIEBsaW5rIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDA4IFlpaSBTb2Z0d2FyZSBMTENcbiAqIEBsaWNlbnNlIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9saWNlbnNlL1xuICogQGF1dGhvciBRaWFuZyBYdWUgPHFpYW5nLnh1ZUBnbWFpbC5jb20+XG4gKiBAc2luY2UgMi4wXG4gKi9cbihmdW5jdGlvbiAoJCkge1xuXG4gICAgJC5mbi55aWlBY3RpdmVGb3JtID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICBpZiAobWV0aG9kc1ttZXRob2RdKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kc1ttZXRob2RdLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdvYmplY3QnIHx8ICFtZXRob2QpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2RzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQuZXJyb3IoJ01ldGhvZCAnICsgbWV0aG9kICsgJyBkb2VzIG5vdCBleGlzdCBvbiBqUXVlcnkueWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBldmVudHMgPSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBiZWZvcmVWYWxpZGF0ZSBldmVudCBpcyB0cmlnZ2VyZWQgYmVmb3JlIHZhbGlkYXRpbmcgdGhlIHdob2xlIGZvcm0uXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBtZXNzYWdlcywgZGVmZXJyZWRzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBtZXNzYWdlczogYW4gYXNzb2NpYXRpdmUgYXJyYXkgd2l0aCBrZXlzIGJlaW5nIGF0dHJpYnV0ZSBJRHMgYW5kIHZhbHVlcyBiZWluZyBlcnJvciBtZXNzYWdlIGFycmF5c1xuICAgICAgICAgKiAgICBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgYXR0cmlidXRlcy5cbiAgICAgICAgICogIC0gZGVmZXJyZWRzOiBhbiBhcnJheSBvZiBEZWZlcnJlZCBvYmplY3RzLiBZb3UgY2FuIHVzZSBkZWZlcnJlZHMuYWRkKGNhbGxiYWNrKSB0byBhZGQgYSBuZXcgZGVmZXJyZWQgdmFsaWRhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIGhhbmRsZXIgcmV0dXJucyBhIGJvb2xlYW4gZmFsc2UsIGl0IHdpbGwgc3RvcCBmdXJ0aGVyIGZvcm0gdmFsaWRhdGlvbiBhZnRlciB0aGlzIGV2ZW50LiBBbmQgYXNcbiAgICAgICAgICogYSByZXN1bHQsIGFmdGVyVmFsaWRhdGUgZXZlbnQgd2lsbCBub3QgYmUgdHJpZ2dlcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgYmVmb3JlVmFsaWRhdGU6ICdiZWZvcmVWYWxpZGF0ZScsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhZnRlclZhbGlkYXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBhZnRlciB2YWxpZGF0aW5nIHRoZSB3aG9sZSBmb3JtLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudCwgbWVzc2FnZXMsIGVycm9yQXR0cmlidXRlcylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0gbWVzc2FnZXM6IGFuIGFzc29jaWF0aXZlIGFycmF5IHdpdGgga2V5cyBiZWluZyBhdHRyaWJ1dGUgSURzIGFuZCB2YWx1ZXMgYmVpbmcgZXJyb3IgbWVzc2FnZSBhcnJheXNcbiAgICAgICAgICogICAgZm9yIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZXMuXG4gICAgICAgICAqICAtIGVycm9yQXR0cmlidXRlczogYW4gYXJyYXkgb2YgYXR0cmlidXRlcyB0aGF0IGhhdmUgdmFsaWRhdGlvbiBlcnJvcnMuIFBsZWFzZSByZWZlciB0byBhdHRyaWJ1dGVEZWZhdWx0cyBmb3IgdGhlIHN0cnVjdHVyZSBvZiB0aGlzIHBhcmFtZXRlci5cbiAgICAgICAgICovXG4gICAgICAgIGFmdGVyVmFsaWRhdGU6ICdhZnRlclZhbGlkYXRlJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGJlZm9yZVZhbGlkYXRlQXR0cmlidXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBiZWZvcmUgdmFsaWRhdGluZyBhbiBhdHRyaWJ1dGUuXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBkZWZlcnJlZHMpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIGF0dHJpYnV0ZTogdGhlIGF0dHJpYnV0ZSB0byBiZSB2YWxpZGF0ZWQuIFBsZWFzZSByZWZlciB0byBhdHRyaWJ1dGVEZWZhdWx0cyBmb3IgdGhlIHN0cnVjdHVyZSBvZiB0aGlzIHBhcmFtZXRlci5cbiAgICAgICAgICogIC0gbWVzc2FnZXM6IGFuIGFycmF5IHRvIHdoaWNoIHlvdSBjYW4gYWRkIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMgZm9yIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlLlxuICAgICAgICAgKiAgLSBkZWZlcnJlZHM6IGFuIGFycmF5IG9mIERlZmVycmVkIG9iamVjdHMuIFlvdSBjYW4gdXNlIGRlZmVycmVkcy5hZGQoY2FsbGJhY2spIHRvIGFkZCBhIG5ldyBkZWZlcnJlZCB2YWxpZGF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgaGFuZGxlciByZXR1cm5zIGEgYm9vbGVhbiBmYWxzZSwgaXQgd2lsbCBzdG9wIGZ1cnRoZXIgdmFsaWRhdGlvbiBvZiB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZS5cbiAgICAgICAgICogQW5kIGFzIGEgcmVzdWx0LCBhZnRlclZhbGlkYXRlQXR0cmlidXRlIGV2ZW50IHdpbGwgbm90IGJlIHRyaWdnZXJlZC5cbiAgICAgICAgICovXG4gICAgICAgIGJlZm9yZVZhbGlkYXRlQXR0cmlidXRlOiAnYmVmb3JlVmFsaWRhdGVBdHRyaWJ1dGUnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYWZ0ZXJWYWxpZGF0ZUF0dHJpYnV0ZSBldmVudCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgdmFsaWRhdGluZyB0aGUgd2hvbGUgZm9ybSBhbmQgZWFjaCBhdHRyaWJ1dGUuXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBhdHRyaWJ1dGUsIG1lc3NhZ2VzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBhdHRyaWJ1dGU6IHRoZSBhdHRyaWJ1dGUgYmVpbmcgdmFsaWRhdGVkLiBQbGVhc2UgcmVmZXIgdG8gYXR0cmlidXRlRGVmYXVsdHMgZm9yIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBwYXJhbWV0ZXIuXG4gICAgICAgICAqICAtIG1lc3NhZ2VzOiBhbiBhcnJheSB0byB3aGljaCB5b3UgY2FuIGFkZCBhZGRpdGlvbmFsIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMgZm9yIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlLlxuICAgICAgICAgKi9cbiAgICAgICAgYWZ0ZXJWYWxpZGF0ZUF0dHJpYnV0ZTogJ2FmdGVyVmFsaWRhdGVBdHRyaWJ1dGUnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYmVmb3JlU3VibWl0IGV2ZW50IGlzIHRyaWdnZXJlZCBiZWZvcmUgc3VibWl0dGluZyB0aGUgZm9ybSBhZnRlciBhbGwgdmFsaWRhdGlvbnMgaGF2ZSBwYXNzZWQuXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50KVxuICAgICAgICAgKiB3aGVyZSBldmVudCBpcyBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBoYW5kbGVyIHJldHVybnMgYSBib29sZWFuIGZhbHNlLCBpdCB3aWxsIHN0b3AgZm9ybSBzdWJtaXNzaW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgYmVmb3JlU3VibWl0OiAnYmVmb3JlU3VibWl0JyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFqYXhCZWZvcmVTZW5kIGV2ZW50IGlzIHRyaWdnZXJlZCBiZWZvcmUgc2VuZGluZyBhbiBBSkFYIHJlcXVlc3QgZm9yIEFKQVgtYmFzZWQgdmFsaWRhdGlvbi5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQsIGpxWEhSLCBzZXR0aW5ncylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0ganFYSFI6IGEganFYSFIgb2JqZWN0XG4gICAgICAgICAqICAtIHNldHRpbmdzOiB0aGUgc2V0dGluZ3MgZm9yIHRoZSBBSkFYIHJlcXVlc3RcbiAgICAgICAgICovXG4gICAgICAgIGFqYXhCZWZvcmVTZW5kOiAnYWpheEJlZm9yZVNlbmQnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYWpheENvbXBsZXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBhZnRlciBjb21wbGV0aW5nIGFuIEFKQVggcmVxdWVzdCBmb3IgQUpBWC1iYXNlZCB2YWxpZGF0aW9uLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudCwganFYSFIsIHRleHRTdGF0dXMpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIGpxWEhSOiBhIGpxWEhSIG9iamVjdFxuICAgICAgICAgKiAgLSB0ZXh0U3RhdHVzOiB0aGUgc3RhdHVzIG9mIHRoZSByZXF1ZXN0IChcInN1Y2Nlc3NcIiwgXCJub3Rtb2RpZmllZFwiLCBcImVycm9yXCIsIFwidGltZW91dFwiLCBcImFib3J0XCIsIG9yIFwicGFyc2VyZXJyb3JcIikuXG4gICAgICAgICAqL1xuICAgICAgICBhamF4Q29tcGxldGU6ICdhamF4Q29tcGxldGUnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYWZ0ZXJJbml0IGV2ZW50IGlzIHRyaWdnZXJlZCBhZnRlciB5aWkgYWN0aXZlRm9ybSBpbml0LlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudClcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGFmdGVySW5pdDogJ2FmdGVySW5pdCdcbiAgICB9O1xuXG4gICAgLy8gTk9URTogSWYgeW91IGNoYW5nZSBhbnkgb2YgdGhlc2UgZGVmYXVsdHMsIG1ha2Ugc3VyZSB5b3UgdXBkYXRlIHlpaVxcd2lkZ2V0c1xcQWN0aXZlRm9ybTo6Z2V0Q2xpZW50T3B0aW9ucygpIGFzIHdlbGxcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIC8vIHdoZXRoZXIgdG8gZW5jb2RlIHRoZSBlcnJvciBzdW1tYXJ5XG4gICAgICAgIGVuY29kZUVycm9yU3VtbWFyeTogdHJ1ZSxcbiAgICAgICAgLy8gdGhlIGpRdWVyeSBzZWxlY3RvciBmb3IgdGhlIGVycm9yIHN1bW1hcnlcbiAgICAgICAgZXJyb3JTdW1tYXJ5OiAnLmVycm9yLXN1bW1hcnknLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiBiZWZvcmUgc3VibWl0dGluZyB0aGUgZm9ybS5cbiAgICAgICAgdmFsaWRhdGVPblN1Ym1pdDogdHJ1ZSxcbiAgICAgICAgLy8gdGhlIGNvbnRhaW5lciBDU1MgY2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZSBoYXMgdmFsaWRhdGlvbiBlcnJvclxuICAgICAgICBlcnJvckNzc0NsYXNzOiAnaGFzLWVycm9yJyxcbiAgICAgICAgLy8gdGhlIGNvbnRhaW5lciBDU1MgY2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZSBwYXNzZXMgdmFsaWRhdGlvblxuICAgICAgICBzdWNjZXNzQ3NzQ2xhc3M6ICdoYXMtc3VjY2VzcycsXG4gICAgICAgIC8vIHRoZSBjb250YWluZXIgQ1NTIGNsYXNzIHJlcHJlc2VudGluZyB0aGUgY29ycmVzcG9uZGluZyBhdHRyaWJ1dGUgaXMgYmVpbmcgdmFsaWRhdGVkXG4gICAgICAgIHZhbGlkYXRpbmdDc3NDbGFzczogJ3ZhbGlkYXRpbmcnLFxuICAgICAgICAvLyB0aGUgR0VUIHBhcmFtZXRlciBuYW1lIGluZGljYXRpbmcgYW4gQUpBWC1iYXNlZCB2YWxpZGF0aW9uXG4gICAgICAgIGFqYXhQYXJhbTogJ2FqYXgnLFxuICAgICAgICAvLyB0aGUgdHlwZSBvZiBkYXRhIHRoYXQgeW91J3JlIGV4cGVjdGluZyBiYWNrIGZyb20gdGhlIHNlcnZlclxuICAgICAgICBhamF4RGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgLy8gdGhlIFVSTCBmb3IgcGVyZm9ybWluZyBBSkFYLWJhc2VkIHZhbGlkYXRpb24uIElmIG5vdCBzZXQsIGl0IHdpbGwgdXNlIHRoZSB0aGUgZm9ybSdzIGFjdGlvblxuICAgICAgICB2YWxpZGF0aW9uVXJsOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gc2Nyb2xsIHRvIGZpcnN0IHZpc2libGUgZXJyb3IgYWZ0ZXIgdmFsaWRhdGlvbi5cbiAgICAgICAgc2Nyb2xsVG9FcnJvcjogdHJ1ZSxcbiAgICAgICAgLy8gb2Zmc2V0IGluIHBpeGVscyB0aGF0IHNob3VsZCBiZSBhZGRlZCB3aGVuIHNjcm9sbGluZyB0byB0aGUgZmlyc3QgZXJyb3IuXG4gICAgICAgIHNjcm9sbFRvRXJyb3JPZmZzZXQ6IDAsXG4gICAgICAgIC8vIHdoZXJlIHRvIGFkZCB2YWxpZGF0aW9uIGNsYXNzOiBjb250YWluZXIgb3IgaW5wdXRcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlT246ICdjb250YWluZXInXG4gICAgfTtcblxuICAgIC8vIE5PVEU6IElmIHlvdSBjaGFuZ2UgYW55IG9mIHRoZXNlIGRlZmF1bHRzLCBtYWtlIHN1cmUgeW91IHVwZGF0ZSB5aWlcXHdpZGdldHNcXEFjdGl2ZUZpZWxkOjpnZXRDbGllbnRPcHRpb25zKCkgYXMgd2VsbFxuICAgIHZhciBhdHRyaWJ1dGVEZWZhdWx0cyA9IHtcbiAgICAgICAgLy8gYSB1bmlxdWUgSUQgaWRlbnRpZnlpbmcgYW4gYXR0cmlidXRlIChlLmcuIFwibG9naW5mb3JtLXVzZXJuYW1lXCIpIGluIGEgZm9ybVxuICAgICAgICBpZDogdW5kZWZpbmVkLFxuICAgICAgICAvLyBhdHRyaWJ1dGUgbmFtZSBvciBleHByZXNzaW9uIChlLmcuIFwiWzBdY29udGVudFwiIGZvciB0YWJ1bGFyIGlucHV0KVxuICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIHRoZSBqUXVlcnkgc2VsZWN0b3Igb2YgdGhlIGNvbnRhaW5lciBvZiB0aGUgaW5wdXQgZmllbGRcbiAgICAgICAgY29udGFpbmVyOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIHRoZSBqUXVlcnkgc2VsZWN0b3Igb2YgdGhlIGlucHV0IGZpZWxkIHVuZGVyIHRoZSBjb250ZXh0IG9mIHRoZSBmb3JtXG4gICAgICAgIGlucHV0OiB1bmRlZmluZWQsXG4gICAgICAgIC8vIHRoZSBqUXVlcnkgc2VsZWN0b3Igb2YgdGhlIGVycm9yIHRhZyB1bmRlciB0aGUgY29udGV4dCBvZiB0aGUgY29udGFpbmVyXG4gICAgICAgIGVycm9yOiAnLmhlbHAtYmxvY2snLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIGVuY29kZSB0aGUgZXJyb3JcbiAgICAgICAgZW5jb2RlRXJyb3I6IHRydWUsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gcGVyZm9ybSB2YWxpZGF0aW9uIHdoZW4gYSBjaGFuZ2UgaXMgZGV0ZWN0ZWQgb24gdGhlIGlucHV0XG4gICAgICAgIHZhbGlkYXRlT25DaGFuZ2U6IHRydWUsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gcGVyZm9ybSB2YWxpZGF0aW9uIHdoZW4gdGhlIGlucHV0IGxvc2VzIGZvY3VzXG4gICAgICAgIHZhbGlkYXRlT25CbHVyOiB0cnVlLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiB3aGVuIHRoZSB1c2VyIGlzIHR5cGluZy5cbiAgICAgICAgdmFsaWRhdGVPblR5cGU6IGZhbHNlLFxuICAgICAgICAvLyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgdGhlIHZhbGlkYXRpb24gc2hvdWxkIGJlIGRlbGF5ZWQgd2hlbiBhIHVzZXIgaXMgdHlwaW5nIGluIHRoZSBpbnB1dCBmaWVsZC5cbiAgICAgICAgdmFsaWRhdGlvbkRlbGF5OiA1MDAsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gZW5hYmxlIEFKQVgtYmFzZWQgdmFsaWRhdGlvbi5cbiAgICAgICAgZW5hYmxlQWpheFZhbGlkYXRpb246IGZhbHNlLFxuICAgICAgICAvLyBmdW5jdGlvbiAoYXR0cmlidXRlLCB2YWx1ZSwgbWVzc2FnZXMsIGRlZmVycmVkLCAkZm9ybSksIHRoZSBjbGllbnQtc2lkZSB2YWxpZGF0aW9uIGZ1bmN0aW9uLlxuICAgICAgICB2YWxpZGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICAvLyBzdGF0dXMgb2YgdGhlIGlucHV0IGZpZWxkLCAwOiBlbXB0eSwgbm90IGVudGVyZWQgYmVmb3JlLCAxOiB2YWxpZGF0ZWQsIDI6IHBlbmRpbmcgdmFsaWRhdGlvbiwgMzogdmFsaWRhdGluZ1xuICAgICAgICBzdGF0dXM6IDAsXG4gICAgICAgIC8vIHdoZXRoZXIgdGhlIHZhbGlkYXRpb24gaXMgY2FuY2VsbGVkIGJ5IGJlZm9yZVZhbGlkYXRlQXR0cmlidXRlIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgY2FuY2VsbGVkOiBmYWxzZSxcbiAgICAgICAgLy8gdGhlIHZhbHVlIG9mIHRoZSBpbnB1dFxuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHVwZGF0ZSBhcmlhLWludmFsaWQgYXR0cmlidXRlIGFmdGVyIHZhbGlkYXRpb25cbiAgICAgICAgdXBkYXRlQXJpYUludmFsaWQ6IHRydWVcbiAgICB9O1xuXG5cbiAgICB2YXIgc3VibWl0RGVmZXI7XG5cbiAgICB2YXIgc2V0U3VibWl0RmluYWxpemVEZWZlciA9IGZ1bmN0aW9uKCRmb3JtKSB7XG4gICAgICAgIHN1Ym1pdERlZmVyID0gJC5EZWZlcnJlZCgpO1xuICAgICAgICAkZm9ybS5kYXRhKCd5aWlTdWJtaXRGaW5hbGl6ZVByb21pc2UnLCBzdWJtaXREZWZlci5wcm9taXNlKCkpO1xuICAgIH07XG5cbiAgICAvLyBmaW5hbGl6ZSB5aWkuanMgJGZvcm0uc3VibWl0XG4gICAgdmFyIHN1Ym1pdEZpbmFsaXplID0gZnVuY3Rpb24oJGZvcm0pIHtcbiAgICAgICAgaWYoc3VibWl0RGVmZXIpIHtcbiAgICAgICAgICAgIHN1Ym1pdERlZmVyLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHN1Ym1pdERlZmVyID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgJGZvcm0ucmVtb3ZlRGF0YSgneWlpU3VibWl0RmluYWxpemVQcm9taXNlJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICB2YXIgbWV0aG9kcyA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKCRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zIHx8IHt9KTtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MudmFsaWRhdGlvblVybCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnZhbGlkYXRpb25VcmwgPSAkZm9ybS5hdHRyKCdhY3Rpb24nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkLmVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlc1tpXSA9ICQuZXh0ZW5kKHt2YWx1ZTogZ2V0VmFsdWUoJGZvcm0sIHRoaXMpfSwgYXR0cmlidXRlRGVmYXVsdHMsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB3YXRjaEF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlc1tpXSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJywge1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogc2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdHRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBnZXRGb3JtT3B0aW9ucygkZm9ybSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIENsZWFuIHVwIGVycm9yIHN0YXR1cyB3aGVuIHRoZSBmb3JtIGlzIHJlc2V0LlxuICAgICAgICAgICAgICAgICAqIE5vdGUgdGhhdCAkZm9ybS5vbigncmVzZXQnLCAuLi4pIGRvZXMgd29yayBiZWNhdXNlIHRoZSBcInJlc2V0XCIgZXZlbnQgZG9lcyBub3QgYnViYmxlIG9uIElFLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICRmb3JtLm9uKCdyZXNldC55aWlBY3RpdmVGb3JtJywgbWV0aG9kcy5yZXNldEZvcm0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZhbGlkYXRlT25TdWJtaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0ub24oJ21vdXNldXAueWlpQWN0aXZlRm9ybSBrZXl1cC55aWlBY3RpdmVGb3JtJywgJzpzdWJtaXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuc3VibWl0T2JqZWN0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQueWlpQWN0aXZlRm9ybScsIG1ldGhvZHMuc3VibWl0Rm9ybSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmFmdGVySW5pdCk7XG4gICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBhZGQgYSBuZXcgYXR0cmlidXRlIHRvIHRoZSBmb3JtIGR5bmFtaWNhbGx5LlxuICAgICAgICAvLyBwbGVhc2UgcmVmZXIgdG8gYXR0cmlidXRlRGVmYXVsdHMgZm9yIHRoZSBzdHJ1Y3R1cmUgb2YgYXR0cmlidXRlXG4gICAgICAgIGFkZDogZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGF0dHJpYnV0ZSA9ICQuZXh0ZW5kKHt2YWx1ZTogZ2V0VmFsdWUoJGZvcm0sIGF0dHJpYnV0ZSl9LCBhdHRyaWJ1dGVEZWZhdWx0cywgYXR0cmlidXRlKTtcbiAgICAgICAgICAgICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgICAgIHdhdGNoQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHJlbW92ZSB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBJRCBmcm9tIHRoZSBmb3JtXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzW2ldWydpZCddID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlID0gYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgdW53YXRjaEF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBtYW51YWxseSB0cmlnZ2VyIHRoZSB2YWxpZGF0aW9uIG9mIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgc3BlY2lmaWVkIElEXG4gICAgICAgIHZhbGlkYXRlQXR0cmlidXRlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBtZXRob2RzLmZpbmQuY2FsbCh0aGlzLCBpZCk7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlQXR0cmlidXRlKCQodGhpcyksIGF0dHJpYnV0ZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gZmluZCBhbiBhdHRyaWJ1dGUgY29uZmlnIGJhc2VkIG9uIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlIElEXG4gICAgICAgIGZpbmQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSAkKHRoaXMpLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKS5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzW2ldWydpZCddID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5vZmYoJy55aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVEYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gdmFsaWRhdGUgYWxsIGFwcGxpY2FibGUgaW5wdXRzIGluIHRoZSBmb3JtXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAoZm9yY2VWYWxpZGF0ZSkge1xuICAgICAgICAgICAgaWYgKGZvcmNlVmFsaWRhdGUpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKS5zdWJtaXR0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpLFxuICAgICAgICAgICAgICAgIG5lZWRBamF4VmFsaWRhdGlvbiA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzID0ge30sXG4gICAgICAgICAgICAgICAgZGVmZXJyZWRzID0gZGVmZXJyZWRBcnJheSgpLFxuICAgICAgICAgICAgICAgIHN1Ym1pdHRpbmcgPSBkYXRhLnN1Ym1pdHRpbmc7XG5cbiAgICAgICAgICAgIGlmIChzdWJtaXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gJC5FdmVudChldmVudHMuYmVmb3JlVmFsaWRhdGUpO1xuICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnQsIFttZXNzYWdlcywgZGVmZXJyZWRzXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQucmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnN1Ym1pdHRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjbGllbnQtc2lkZSB2YWxpZGF0aW9uXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZm9ybSA9ICRmb3JtO1xuICAgICAgICAgICAgICAgIHZhciAkaW5wdXQgPSBmaW5kSW5wdXQoJGZvcm0sIHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRpbnB1dC5pcyhcIjpkaXNhYmxlZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gcGFzcyBTRUxFQ1Qgd2l0aG91dCBvcHRpb25zXG4gICAgICAgICAgICAgICAgaWYgKCRpbnB1dC5sZW5ndGggJiYgJGlucHV0WzBdLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkaW5wdXRbMF0ub3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCgkaW5wdXRbMF0ub3B0aW9ucy5sZW5ndGggPT09IDEpICYmICgkaW5wdXRbMF0ub3B0aW9uc1swXS52YWx1ZSA9PT0gJycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIHBlcmZvcm0gdmFsaWRhdGlvbiBvbmx5IGlmIHRoZSBmb3JtIGlzIGJlaW5nIHN1Ym1pdHRlZCBvciBpZiBhbiBhdHRyaWJ1dGUgaXMgcGVuZGluZyB2YWxpZGF0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VibWl0dGluZyB8fCB0aGlzLnN0YXR1cyA9PT0gMiB8fCB0aGlzLnN0YXR1cyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbXNnID0gbWVzc2FnZXNbdGhpcy5pZF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChtc2cgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXNnID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlc1t0aGlzLmlkXSA9IG1zZztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmJlZm9yZVZhbGlkYXRlQXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudCwgW3RoaXMsIG1zZywgZGVmZXJyZWRzXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5yZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YWxpZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsaWRhdGUodGhpcywgZ2V0VmFsdWUoJGZvcm0sIHRoaXMpLCBtc2csIGRlZmVycmVkcywgJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZW5hYmxlQWpheFZhbGlkYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZWVkQWpheFZhbGlkYXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGFqYXggdmFsaWRhdGlvblxuICAgICAgICAgICAgJC53aGVuLmFwcGx5KHRoaXMsIGRlZmVycmVkcykuYWx3YXlzKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBlbXB0eSBtZXNzYWdlIGFycmF5c1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbWVzc2FnZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDAgPT09IG1lc3NhZ2VzW2ldLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG1lc3NhZ2VzW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZWVkQWpheFZhbGlkYXRpb24gJiYgKCQuaXNFbXB0eU9iamVjdChtZXNzYWdlcykgfHwgZGF0YS5zdWJtaXR0aW5nKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJGJ1dHRvbiA9IGRhdGEuc3VibWl0T2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXh0RGF0YSA9ICcmJyArIGRhdGEuc2V0dGluZ3MuYWpheFBhcmFtICsgJz0nICsgJGZvcm0uYXR0cignaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRidXR0b24gJiYgJGJ1dHRvbi5sZW5ndGggJiYgJGJ1dHRvbi5hdHRyKCduYW1lJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dERhdGEgKz0gJyYnICsgJGJ1dHRvbi5hdHRyKCduYW1lJykgKyAnPScgKyAkYnV0dG9uLmF0dHIoJ3ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogZGF0YS5zZXR0aW5ncy52YWxpZGF0aW9uVXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJGZvcm0uYXR0cignbWV0aG9kJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAkZm9ybS5zZXJpYWxpemUoKSArIGV4dERhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogZGF0YS5zZXR0aW5ncy5hamF4RGF0YVR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudHMuYWpheENvbXBsZXRlLCBbanFYSFIsIHRleHRTdGF0dXNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoanFYSFIsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudHMuYWpheEJlZm9yZVNlbmQsIFtqcVhIUiwgc2V0dGluZ3NdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobXNncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2dzICE9PSBudWxsICYmIHR5cGVvZiBtc2dzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZW5hYmxlQWpheFZhbGlkYXRpb24gfHwgdGhpcy5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbXNnc1t0aGlzLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0cygkZm9ybSwgJC5leHRlbmQobWVzc2FnZXMsIG1zZ3MpLCBzdWJtaXR0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVJbnB1dHMoJGZvcm0sIG1lc3NhZ2VzLCBzdWJtaXR0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnN1Ym1pdHRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJtaXRGaW5hbGl6ZSgkZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5zdWJtaXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlbGF5IGNhbGxiYWNrIHNvIHRoYXQgdGhlIGZvcm0gY2FuIGJlIHN1Ym1pdHRlZCB3aXRob3V0IHByb2JsZW1cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5wdXRzKCRmb3JtLCBtZXNzYWdlcywgc3VibWl0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5wdXRzKCRmb3JtLCBtZXNzYWdlcywgc3VibWl0dGluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3VibWl0Rm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgaWYgKGRhdGEudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gU2Vjb25kIHN1Ym1pdCdzIGNhbGwgKGZyb20gdmFsaWRhdGUvdXBkYXRlSW5wdXRzKVxuICAgICAgICAgICAgICAgIGRhdGEuc3VibWl0dGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmJlZm9yZVN1Ym1pdCk7XG4gICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS52YWxpZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVwZGF0ZUhpZGRlbkJ1dHRvbigkZm9ybSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7ICAgLy8gY29udGludWUgc3VibWl0dGluZyB0aGUgZm9ybSBzaW5jZSB2YWxpZGF0aW9uIHBhc3Nlc1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBzdWJtaXQncyBjYWxsIChmcm9tIHlpaS5qcy9oYW5kbGVBY3Rpb24pIC0gZXhlY3V0ZSB2YWxpZGF0aW5nXG4gICAgICAgICAgICAgICAgc2V0U3VibWl0RmluYWxpemVEZWZlcigkZm9ybSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zZXR0aW5ncy50aW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChkYXRhLnNldHRpbmdzLnRpbWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBtZXRob2RzLnZhbGlkYXRlLmNhbGwoJGZvcm0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZXNldEZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgIC8vIEJlY2F1c2Ugd2UgYmluZCBkaXJlY3RseSB0byBhIGZvcm0gcmVzZXQgZXZlbnQgaW5zdGVhZCBvZiBhIHJlc2V0IGJ1dHRvbiAodGhhdCBtYXkgbm90IGV4aXN0KSxcbiAgICAgICAgICAgIC8vIHdoZW4gdGhpcyBmdW5jdGlvbiBpcyBleGVjdXRlZCBmb3JtIGlucHV0IHZhbHVlcyBoYXZlIG5vdCBiZWVuIHJlc2V0IHlldC5cbiAgICAgICAgICAgIC8vIFRoZXJlZm9yZSB3ZSBkbyB0aGUgYWN0dWFsIHJlc2V0IHdvcmsgdGhyb3VnaCBzZXRUaW1lb3V0LlxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2l0aG91dCBzZXRUaW1lb3V0KCkgd2Ugd291bGQgZ2V0IHRoZSBpbnB1dCB2YWx1ZXMgdGhhdCBhcmUgbm90IHJlc2V0IHlldC5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IGdldFZhbHVlKCRmb3JtLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgJGNvbnRhaW5lciA9ICRmb3JtLmZpbmQodGhpcy5jb250YWluZXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJGlucHV0ID0gZmluZElucHV0KCRmb3JtLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICRlcnJvckVsZW1lbnQgPSBkYXRhLnNldHRpbmdzLnZhbGlkYXRpb25TdGF0ZU9uID09PSAnaW5wdXQnID8gJGlucHV0IDogJGNvbnRhaW5lcjtcblxuICAgICAgICAgICAgICAgICAgICAkZXJyb3JFbGVtZW50LnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MgKyAnICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc2V0dGluZ3MuZXJyb3JDc3NDbGFzcyArICcgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zZXR0aW5ncy5zdWNjZXNzQ3NzQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKHRoaXMuZXJyb3IpLmh0bWwoJycpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRmb3JtLmZpbmQoZGF0YS5zZXR0aW5ncy5lcnJvclN1bW1hcnkpLmhpZGUoKS5maW5kKCd1bCcpLmh0bWwoJycpO1xuICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZXMgZXJyb3IgbWVzc2FnZXMsIGlucHV0IGNvbnRhaW5lcnMsIGFuZCBvcHRpb25hbGx5IHN1bW1hcnkgYXMgd2VsbC5cbiAgICAgICAgICogSWYgYW4gYXR0cmlidXRlIGlzIG1pc3NpbmcgZnJvbSBtZXNzYWdlcywgaXQgaXMgY29uc2lkZXJlZCB2YWxpZC5cbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHRoZSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzLCBpbmRleGVkIGJ5IGF0dHJpYnV0ZSBJRHNcbiAgICAgICAgICogQHBhcmFtIHN1bW1hcnkgd2hldGhlciB0byB1cGRhdGUgc3VtbWFyeSBhcyB3ZWxsLlxuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlTWVzc2FnZXM6IGZ1bmN0aW9uIChtZXNzYWdlcywgc3VtbWFyeSkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0KCRmb3JtLCB0aGlzLCBtZXNzYWdlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChzdW1tYXJ5KSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlU3VtbWFyeSgkZm9ybSwgbWVzc2FnZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIGVycm9yIG1lc3NhZ2VzIGFuZCBpbnB1dCBjb250YWluZXIgb2YgYSBzaW5nbGUgYXR0cmlidXRlLlxuICAgICAgICAgKiBJZiBtZXNzYWdlcyBpcyBlbXB0eSwgdGhlIGF0dHJpYnV0ZSBpcyBjb25zaWRlcmVkIHZhbGlkLlxuICAgICAgICAgKiBAcGFyYW0gaWQgYXR0cmlidXRlIElEXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlcyBhcnJheSB3aXRoIGVycm9yIG1lc3NhZ2VzXG4gICAgICAgICAqL1xuICAgICAgICB1cGRhdGVBdHRyaWJ1dGU6IGZ1bmN0aW9uKGlkLCBtZXNzYWdlcykge1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IG1ldGhvZHMuZmluZC5jYWxsKHRoaXMsIGlkKTtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1zZyA9IHt9O1xuICAgICAgICAgICAgICAgIG1zZ1tpZF0gPSBtZXNzYWdlcztcbiAgICAgICAgICAgICAgICB1cGRhdGVJbnB1dCgkKHRoaXMpLCBhdHRyaWJ1dGUsIG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHdhdGNoQXR0cmlidXRlID0gZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUpIHtcbiAgICAgICAgdmFyICRpbnB1dCA9IGZpbmRJbnB1dCgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWxpZGF0ZU9uQ2hhbmdlKSB7XG4gICAgICAgICAgICAkaW5wdXQub24oJ2NoYW5nZS55aWlBY3RpdmVGb3JtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGUudmFsaWRhdGVPbkJsdXIpIHtcbiAgICAgICAgICAgICRpbnB1dC5vbignYmx1ci55aWlBY3RpdmVGb3JtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuc3RhdHVzID09IDAgfHwgYXR0cmlidXRlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGUudmFsaWRhdGVPblR5cGUpIHtcbiAgICAgICAgICAgICRpbnB1dC5vbigna2V5dXAueWlpQWN0aXZlRm9ybScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShlLndoaWNoLCBbMTYsIDE3LCAxOCwgMzcsIDM4LCAzOSwgNDBdKSAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSAhPT0gZ2V0VmFsdWUoJGZvcm0sIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVBdHRyaWJ1dGUoJGZvcm0sIGF0dHJpYnV0ZSwgZmFsc2UsIGF0dHJpYnV0ZS52YWxpZGF0aW9uRGVsYXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciB1bndhdGNoQXR0cmlidXRlID0gZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUpIHtcbiAgICAgICAgZmluZElucHV0KCRmb3JtLCBhdHRyaWJ1dGUpLm9mZignLnlpaUFjdGl2ZUZvcm0nKTtcbiAgICB9O1xuXG4gICAgdmFyIHZhbGlkYXRlQXR0cmlidXRlID0gZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUsIGZvcmNlVmFsaWRhdGUsIHZhbGlkYXRpb25EZWxheSkge1xuICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcblxuICAgICAgICBpZiAoZm9yY2VWYWxpZGF0ZSkge1xuICAgICAgICAgICAgYXR0cmlidXRlLnN0YXR1cyA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgIT09IGdldFZhbHVlKCRmb3JtLCB0aGlzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gMjtcbiAgICAgICAgICAgICAgICBmb3JjZVZhbGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghZm9yY2VWYWxpZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3MudGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGRhdGEuc2V0dGluZ3MudGltZXIpO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEuc2V0dGluZ3MudGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdWJtaXR0aW5nIHx8ICRmb3JtLmlzKCc6aGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gMztcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uZmluZCh0aGlzLmNvbnRhaW5lcikuYWRkQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWV0aG9kcy52YWxpZGF0ZS5jYWxsKCRmb3JtKTtcbiAgICAgICAgfSwgdmFsaWRhdGlvbkRlbGF5ID8gdmFsaWRhdGlvbkRlbGF5IDogMjAwKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBwcm90b3R5cGUgd2l0aCBhIHNob3J0Y3V0IG1ldGhvZCBmb3IgYWRkaW5nIGEgbmV3IGRlZmVycmVkLlxuICAgICAqIFRoZSBjb250ZXh0IG9mIHRoZSBjYWxsYmFjayB3aWxsIGJlIHRoZSBkZWZlcnJlZCBvYmplY3Qgc28gaXQgY2FuIGJlIHJlc29sdmVkIGxpa2UgYGBgdGhpcy5yZXNvbHZlKClgYGBcbiAgICAgKiBAcmV0dXJucyBBcnJheVxuICAgICAqL1xuICAgIHZhciBkZWZlcnJlZEFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgYXJyYXkuYWRkID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMucHVzaChuZXcgJC5EZWZlcnJlZChjYWxsYmFjaykpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfTtcblxuICAgIHZhciBidXR0b25PcHRpb25zID0gWydhY3Rpb24nLCAndGFyZ2V0JywgJ21ldGhvZCcsICdlbmN0eXBlJ107XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGN1cnJlbnQgZm9ybSBvcHRpb25zXG4gICAgICogQHBhcmFtICRmb3JtXG4gICAgICogQHJldHVybnMgb2JqZWN0IE9iamVjdCB3aXRoIGJ1dHRvbiBvZiBmb3JtIG9wdGlvbnNcbiAgICAgKi9cbiAgICB2YXIgZ2V0Rm9ybU9wdGlvbnMgPSBmdW5jdGlvbiAoJGZvcm0pIHtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidXR0b25PcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzW2J1dHRvbk9wdGlvbnNbaV1dID0gJGZvcm0uYXR0cihidXR0b25PcHRpb25zW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIHRlbXBvcmFyeSBmb3JtIG9wdGlvbnMgcmVsYXRlZCB0byBzdWJtaXQgYnV0dG9uXG4gICAgICogQHBhcmFtICRmb3JtIHRoZSBmb3JtIGpRdWVyeSBvYmplY3RcbiAgICAgKiBAcGFyYW0gJGJ1dHRvbiB0aGUgYnV0dG9uIGpRdWVyeSBvYmplY3RcbiAgICAgKi9cbiAgICB2YXIgYXBwbHlCdXR0b25PcHRpb25zID0gZnVuY3Rpb24gKCRmb3JtLCAkYnV0dG9uKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnV0dG9uT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gJGJ1dHRvbi5hdHRyKCdmb3JtJyArIGJ1dHRvbk9wdGlvbnNbaV0pO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgJGZvcm0uYXR0cihidXR0b25PcHRpb25zW2ldLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzdG9yZXMgb3JpZ2luYWwgZm9ybSBvcHRpb25zXG4gICAgICogQHBhcmFtICRmb3JtIHRoZSBmb3JtIGpRdWVyeSBvYmplY3RcbiAgICAgKi9cbiAgICB2YXIgcmVzdG9yZUJ1dHRvbk9wdGlvbnMgPSBmdW5jdGlvbiAoJGZvcm0pIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidXR0b25PcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkZm9ybS5hdHRyKGJ1dHRvbk9wdGlvbnNbaV0sIGRhdGEub3B0aW9uc1tidXR0b25PcHRpb25zW2ldXSB8fCBudWxsKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBlcnJvciBtZXNzYWdlcyBhbmQgdGhlIGlucHV0IGNvbnRhaW5lcnMgZm9yIGFsbCBhcHBsaWNhYmxlIGF0dHJpYnV0ZXNcbiAgICAgKiBAcGFyYW0gJGZvcm0gdGhlIGZvcm0galF1ZXJ5IG9iamVjdFxuICAgICAqIEBwYXJhbSBtZXNzYWdlcyBhcnJheSB0aGUgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlc1xuICAgICAqIEBwYXJhbSBzdWJtaXR0aW5nIHdoZXRoZXIgdGhpcyBtZXRob2QgaXMgY2FsbGVkIGFmdGVyIHZhbGlkYXRpb24gdHJpZ2dlcmVkIGJ5IGZvcm0gc3VibWlzc2lvblxuICAgICAqL1xuICAgIHZhciB1cGRhdGVJbnB1dHMgPSBmdW5jdGlvbiAoJGZvcm0sIG1lc3NhZ2VzLCBzdWJtaXR0aW5nKSB7XG4gICAgICAgIHZhciBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuXG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdWJtaXR0aW5nKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JBdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICB2YXIgJGlucHV0ID0gZmluZElucHV0KCRmb3JtLCB0aGlzKTtcbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoISRpbnB1dC5pcyhcIjpkaXNhYmxlZFwiKSAmJiAhdGhpcy5jYW5jZWxsZWQgJiYgdXBkYXRlSW5wdXQoJGZvcm0sIHRoaXMsIG1lc3NhZ2VzKSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckF0dHJpYnV0ZXMucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudHMuYWZ0ZXJWYWxpZGF0ZSwgW21lc3NhZ2VzLCBlcnJvckF0dHJpYnV0ZXNdKTtcblxuICAgICAgICAgICAgdXBkYXRlU3VtbWFyeSgkZm9ybSwgbWVzc2FnZXMpO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3JBdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnNldHRpbmdzLnNjcm9sbFRvRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvcCA9ICRmb3JtLmZpbmQoJC5tYXAoZXJyb3JBdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGUuaW5wdXQ7XG4gICAgICAgICAgICAgICAgICAgIH0pLmpvaW4oJywnKSkuZmlyc3QoKS5jbG9zZXN0KCc6dmlzaWJsZScpLm9mZnNldCgpLnRvcCAtIGRhdGEuc2V0dGluZ3Muc2Nyb2xsVG9FcnJvck9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvcCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodG9wID4gJChkb2N1bWVudCkuaGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA9ICQoZG9jdW1lbnQpLmhlaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciB3dG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9wIDwgd3RvcCB8fCB0b3AgPiB3dG9wICsgJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKHRvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWJtaXRPYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlCdXR0b25PcHRpb25zKCRmb3JtLCBkYXRhLnN1Ym1pdE9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRmb3JtLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Ym1pdE9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZXN0b3JlQnV0dG9uT3B0aW9ucygkZm9ybSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jYW5jZWxsZWQgJiYgKHRoaXMuc3RhdHVzID09PSAyIHx8IHRoaXMuc3RhdHVzID09PSAzKSkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVJbnB1dCgkZm9ybSwgdGhpcywgbWVzc2FnZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHN1Ym1pdEZpbmFsaXplKCRmb3JtKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBoaWRkZW4gZmllbGQgdGhhdCByZXByZXNlbnRzIGNsaWNrZWQgc3VibWl0IGJ1dHRvbi5cbiAgICAgKiBAcGFyYW0gJGZvcm0gdGhlIGZvcm0galF1ZXJ5IG9iamVjdC5cbiAgICAgKi9cbiAgICB2YXIgdXBkYXRlSGlkZGVuQnV0dG9uID0gZnVuY3Rpb24gKCRmb3JtKSB7XG4gICAgICAgIHZhciBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICB2YXIgJGJ1dHRvbiA9IGRhdGEuc3VibWl0T2JqZWN0IHx8ICRmb3JtLmZpbmQoJzpzdWJtaXQ6Zmlyc3QnKTtcbiAgICAgICAgLy8gVE9ETzogaWYgdGhlIHN1Ym1pc3Npb24gaXMgY2F1c2VkIGJ5IFwiY2hhbmdlXCIgZXZlbnQsIGl0IHdpbGwgbm90IHdvcmtcbiAgICAgICAgaWYgKCRidXR0b24ubGVuZ3RoICYmICRidXR0b24uYXR0cigndHlwZScpID09ICdzdWJtaXQnICYmICRidXR0b24uYXR0cignbmFtZScpKSB7XG4gICAgICAgICAgICAvLyBzaW11bGF0ZSBidXR0b24gaW5wdXQgdmFsdWVcbiAgICAgICAgICAgIHZhciAkaGlkZGVuQnV0dG9uID0gJCgnaW5wdXRbdHlwZT1cImhpZGRlblwiXVtuYW1lPVwiJyArICRidXR0b24uYXR0cignbmFtZScpICsgJ1wiXScsICRmb3JtKTtcbiAgICAgICAgICAgIGlmICghJGhpZGRlbkJ1dHRvbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkKCc8aW5wdXQ+JykuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAkYnV0dG9uLmF0dHIoJ25hbWUnKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICRidXR0b24uYXR0cigndmFsdWUnKVxuICAgICAgICAgICAgICAgIH0pLmFwcGVuZFRvKCRmb3JtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkJ1dHRvbi5hdHRyKCd2YWx1ZScsICRidXR0b24uYXR0cigndmFsdWUnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgZXJyb3IgbWVzc2FnZSBhbmQgdGhlIGlucHV0IGNvbnRhaW5lciBmb3IgYSBwYXJ0aWN1bGFyIGF0dHJpYnV0ZS5cbiAgICAgKiBAcGFyYW0gJGZvcm0gdGhlIGZvcm0galF1ZXJ5IG9iamVjdFxuICAgICAqIEBwYXJhbSBhdHRyaWJ1dGUgb2JqZWN0IHRoZSBjb25maWd1cmF0aW9uIGZvciBhIHBhcnRpY3VsYXIgYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSBtZXNzYWdlcyBhcnJheSB0aGUgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlc1xuICAgICAqIEByZXR1cm4gYm9vbGVhbiB3aGV0aGVyIHRoZXJlIGlzIGEgdmFsaWRhdGlvbiBlcnJvciBmb3IgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGVcbiAgICAgKi9cbiAgICB2YXIgdXBkYXRlSW5wdXQgPSBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSwgbWVzc2FnZXMpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyksXG4gICAgICAgICAgICAkaW5wdXQgPSBmaW5kSW5wdXQoJGZvcm0sIGF0dHJpYnV0ZSksXG4gICAgICAgICAgICBoYXNFcnJvciA9IGZhbHNlO1xuXG4gICAgICAgIGlmICghJC5pc0FycmF5KG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF0pKSB7XG4gICAgICAgICAgICBtZXNzYWdlc1thdHRyaWJ1dGUuaWRdID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBhdHRyaWJ1dGUuc3RhdHVzID0gMTtcbiAgICAgICAgaWYgKCRpbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGhhc0Vycm9yID0gbWVzc2FnZXNbYXR0cmlidXRlLmlkXS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgdmFyICRjb250YWluZXIgPSAkZm9ybS5maW5kKGF0dHJpYnV0ZS5jb250YWluZXIpO1xuICAgICAgICAgICAgdmFyICRlcnJvciA9ICRjb250YWluZXIuZmluZChhdHRyaWJ1dGUuZXJyb3IpO1xuICAgICAgICAgICAgdXBkYXRlQXJpYUludmFsaWQoJGZvcm0sIGF0dHJpYnV0ZSwgaGFzRXJyb3IpO1xuXG4gICAgICAgICAgICB2YXIgJGVycm9yRWxlbWVudCA9IGRhdGEuc2V0dGluZ3MudmFsaWRhdGlvblN0YXRlT24gPT09ICdpbnB1dCcgPyAkaW5wdXQgOiAkY29udGFpbmVyO1xuXG4gICAgICAgICAgICBpZiAoaGFzRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLmVuY29kZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICRlcnJvci50ZXh0KG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF1bMF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRlcnJvci5odG1sKG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF1bMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkZXJyb3JFbGVtZW50LnJlbW92ZUNsYXNzKGRhdGEuc2V0dGluZ3MudmFsaWRhdGluZ0Nzc0NsYXNzICsgJyAnICsgZGF0YS5zZXR0aW5ncy5zdWNjZXNzQ3NzQ2xhc3MpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhkYXRhLnNldHRpbmdzLmVycm9yQ3NzQ2xhc3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkZXJyb3IuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAkZXJyb3JFbGVtZW50LnJlbW92ZUNsYXNzKGRhdGEuc2V0dGluZ3MudmFsaWRhdGluZ0Nzc0NsYXNzICsgJyAnICsgZGF0YS5zZXR0aW5ncy5lcnJvckNzc0NsYXNzICsgJyAnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoZGF0YS5zZXR0aW5ncy5zdWNjZXNzQ3NzQ2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXR0cmlidXRlLnZhbHVlID0gZ2V0VmFsdWUoJGZvcm0sIGF0dHJpYnV0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hZnRlclZhbGlkYXRlQXR0cmlidXRlLCBbYXR0cmlidXRlLCBtZXNzYWdlc1thdHRyaWJ1dGUuaWRdXSk7XG5cbiAgICAgICAgcmV0dXJuIGhhc0Vycm9yO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBlcnJvciBzdW1tYXJ5LlxuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0XG4gICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHRoZSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzXG4gICAgICovXG4gICAgdmFyIHVwZGF0ZVN1bW1hcnkgPSBmdW5jdGlvbiAoJGZvcm0sIG1lc3NhZ2VzKSB7XG4gICAgICAgIHZhciBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpLFxuICAgICAgICAgICAgJHN1bW1hcnkgPSAkZm9ybS5maW5kKGRhdGEuc2V0dGluZ3MuZXJyb3JTdW1tYXJ5KSxcbiAgICAgICAgICAgICR1bCA9ICRzdW1tYXJ5LmZpbmQoJ3VsJykuZW1wdHkoKTtcblxuICAgICAgICBpZiAoJHN1bW1hcnkubGVuZ3RoICYmIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNBcnJheShtZXNzYWdlc1t0aGlzLmlkXSkgJiYgbWVzc2FnZXNbdGhpcy5pZF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9ICQoJzxsaS8+Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNldHRpbmdzLmVuY29kZUVycm9yU3VtbWFyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IudGV4dChtZXNzYWdlc1t0aGlzLmlkXVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvci5odG1sKG1lc3NhZ2VzW3RoaXMuaWRdWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkdWwuYXBwZW5kKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzdW1tYXJ5LnRvZ2dsZSgkdWwuZmluZCgnbGknKS5sZW5ndGggPiAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0VmFsdWUgPSBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSkge1xuICAgICAgICB2YXIgJGlucHV0ID0gZmluZElucHV0KCRmb3JtLCBhdHRyaWJ1dGUpO1xuICAgICAgICB2YXIgdHlwZSA9ICRpbnB1dC5hdHRyKCd0eXBlJyk7XG4gICAgICAgIGlmICh0eXBlID09PSAnY2hlY2tib3gnIHx8IHR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgICAgIHZhciAkcmVhbElucHV0ID0gJGlucHV0LmZpbHRlcignOmNoZWNrZWQnKTtcbiAgICAgICAgICAgIGlmICghJHJlYWxJbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkcmVhbElucHV0ID0gJGZvcm0uZmluZCgnaW5wdXRbdHlwZT1oaWRkZW5dW25hbWU9XCInICsgJGlucHV0LmF0dHIoJ25hbWUnKSArICdcIl0nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRyZWFsSW5wdXQudmFsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0LnZhbCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBmaW5kSW5wdXQgPSBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSkge1xuICAgICAgICB2YXIgJGlucHV0ID0gJGZvcm0uZmluZChhdHRyaWJ1dGUuaW5wdXQpO1xuICAgICAgICBpZiAoJGlucHV0Lmxlbmd0aCAmJiAkaW5wdXRbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZGl2Jykge1xuICAgICAgICAgICAgLy8gY2hlY2tib3ggbGlzdCBvciByYWRpbyBsaXN0XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0LmZpbmQoJ2lucHV0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciB1cGRhdGVBcmlhSW52YWxpZCA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlLCBoYXNFcnJvcikge1xuICAgICAgICBpZiAoYXR0cmlidXRlLnVwZGF0ZUFyaWFJbnZhbGlkKSB7XG4gICAgICAgICAgICAkZm9ybS5maW5kKGF0dHJpYnV0ZS5pbnB1dCkuYXR0cignYXJpYS1pbnZhbGlkJywgaGFzRXJyb3IgPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgICAgICAgfVxuICAgIH1cbn0pKHdpbmRvdy5qUXVlcnkpO1xuIiwiLy9nZXQgdGhlIGNsaWNrIGV2ZW50IGZvciB0aGUgdmlldyBwdWJsaXNoZXIgYWdlbnRzXG4kKFwiLnZpZXdQcm9maWxlSW5mb1wiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAkKCcjbW9kYWwtcHJvZmlsZScpLm1vZGFsKCdzaG93JylcbiAgICAgICAgICAgIC5maW5kKCcjbW9kYWxQcm9maWxlQ29udGVudCcpXG4gICAgICAgICAgICAvLy5sb2FkKCQodGhpcykuYXR0cigndmFsdWUnKSArICc/aWQ9JyArICQoJyNib29rLXJpZ2h0c19vd25lcl9pZCcpLnZhbCgpKTtcbiAgICAgICAgICAgIC5sb2FkKCQodGhpcykuYXR0cigndmFsdWUnKSk7XG59KTtcblxuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IE1pa2UgS2luZyAoQG1pY2phbWtpbmcpXG4gKlxuICogalF1ZXJ5IFN1Y2NpbmN0IHBsdWdpblxuICogVmVyc2lvbiAxLjEuMCAoT2N0b2JlciAyMDE0KVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxuICovXG5cbiAvKmdsb2JhbCBqUXVlcnkqL1xuKGZ1bmN0aW9uKCQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdCQuZm4uc3VjY2luY3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cblx0XHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7XG5cdFx0XHRcdHNpemU6IDI0MCxcblx0XHRcdFx0b21pc3Npb246ICcuLi4nLFxuXHRcdFx0XHRpZ25vcmU6IHRydWVcblx0XHRcdH0sIG9wdGlvbnMpO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIHRleHREZWZhdWx0LFxuXHRcdFx0XHR0ZXh0VHJ1bmNhdGVkLFxuXHRcdFx0XHRlbGVtZW50cyA9ICQodGhpcyksXG5cdFx0XHRcdHJlZ2V4ICAgID0gL1shLVxcLzotQFxcWy1gey1+XSQvLFxuXHRcdFx0XHRpbml0ICAgICA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0ZXh0RGVmYXVsdCA9ICQodGhpcykuaHRtbCgpO1xuXG5cdFx0XHRcdFx0XHRpZiAodGV4dERlZmF1bHQubGVuZ3RoID4gc2V0dGluZ3Muc2l6ZSkge1xuXHRcdFx0XHRcdFx0XHR0ZXh0VHJ1bmNhdGVkID0gJC50cmltKHRleHREZWZhdWx0KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5zdWJzdHJpbmcoMCwgc2V0dGluZ3Muc2l6ZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuc3BsaXQoJyAnKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5zbGljZSgwLCAtMSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuam9pbignICcpO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChzZXR0aW5ncy5pZ25vcmUpIHtcblx0XHRcdFx0XHRcdFx0XHR0ZXh0VHJ1bmNhdGVkID0gdGV4dFRydW5jYXRlZC5yZXBsYWNlKHJlZ2V4LCAnJyk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLmh0bWwodGV4dFRydW5jYXRlZCArIHNldHRpbmdzLm9taXNzaW9uKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdGluaXQoKTtcblx0XHR9KTtcblx0fTtcbn0pKGpRdWVyeSk7XG5cbiJdfQ==

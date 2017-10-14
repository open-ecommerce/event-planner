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
                pjaxOptions = {};

            if (usePjax) {
                pjaxContainer = $e.data('pjax-container') || $e.closest('[data-pjax-container]');
                if (!pjaxContainer.length) {
                    pjaxContainer = $('body');
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

            $.when($form.data('yiiSubmitFinalizePromise')).then(function () {
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

            if (message !== undefined) {
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

        trim: function ($form, attribute, options) {
            var $input = $form.find(attribute.input);
            var value = $input.val();
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

        compare: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            var compareValue,
                valid = true;
            if (options.compareAttribute === undefined) {
                compareValue = options.compareValue;
            } else {
                compareValue = $('#' + options.compareAttribute).val();
            }

            if (options.type === 'number') {
                value = parseFloat(value);
                compareValue = parseFloat(compareValue);
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

        var files = $(attribute.input, attribute.$form).get(0).files;
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
        scrollToErrorOffset: 0
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
                $form.bind('reset.yiiActiveForm', methods.resetForm);

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
                $(this).unbind('.yiiActiveForm');
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
                submitting = data.submitting && !forceValidate;

            if (data.submitting) {
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
                if (!$(this.input).is(":disabled")) {
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
                    setTimeout(function () {
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
            setTimeout(function () {
                $.each(data.attributes, function () {
                    // Without setTimeout() we would get the input values that are not reset yet.
                    this.value = getValue($form, this);
                    this.status = 0;
                    var $container = $form.find(this.container);
                    $container.removeClass(
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
        data.settings.timer = setTimeout(function () {
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
            $.each(data.attributes, function () {
                if (!$(this.input).is(":disabled") && !this.cancelled && updateInput($form, this, messages)) {
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
        $form.trigger(events.afterValidateAttribute, [attribute, messages[attribute.id]]);

        attribute.status = 1;
        if ($input.length) {
            hasError = messages[attribute.id].length > 0;
            var $container = $form.find(attribute.container);
            var $error = $container.find(attribute.error);
            updateAriaInvalid($form, attribute, hasError);
            if (hasError) {
                if (attribute.encodeError) {
                    $error.text(messages[attribute.id][0]);
                } else {
                    $error.html(messages[attribute.id][0]);
                }
                $container.removeClass(data.settings.validatingCssClass + ' ' + data.settings.successCssClass)
                    .addClass(data.settings.errorCssClass);
            } else {
                $error.empty();
                $container.removeClass(data.settings.validatingCssClass + ' ' + data.settings.errorCssClass + ' ')
                    .addClass(data.settings.successCssClass);
            }
            attribute.value = getValue($form, attribute);
        }
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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInlpaS5qcyIsInlpaS52YWxpZGF0aW9uLmpzIiwieWlpLmFjdGl2ZUZvcm0uanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNseEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFlpaSBKYXZhU2NyaXB0IG1vZHVsZS5cbiAqXG4gKiBAbGluayBodHRwOi8vd3d3LnlpaWZyYW1ld29yay5jb20vXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAwOCBZaWkgU29mdHdhcmUgTExDXG4gKiBAbGljZW5zZSBodHRwOi8vd3d3LnlpaWZyYW1ld29yay5jb20vbGljZW5zZS9cbiAqIEBhdXRob3IgUWlhbmcgWHVlIDxxaWFuZy54dWVAZ21haWwuY29tPlxuICogQHNpbmNlIDIuMFxuICovXG5cbi8qKlxuICogeWlpIGlzIHRoZSByb290IG1vZHVsZSBmb3IgYWxsIFlpaSBKYXZhU2NyaXB0IG1vZHVsZXMuXG4gKiBJdCBpbXBsZW1lbnRzIGEgbWVjaGFuaXNtIG9mIG9yZ2FuaXppbmcgSmF2YVNjcmlwdCBjb2RlIGluIG1vZHVsZXMgdGhyb3VnaCB0aGUgZnVuY3Rpb24gXCJ5aWkuaW5pdE1vZHVsZSgpXCIuXG4gKlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGJlIG5hbWVkIGFzIFwieC55LnpcIiwgd2hlcmUgXCJ4XCIgc3RhbmRzIGZvciB0aGUgcm9vdCBtb2R1bGUgKGZvciB0aGUgWWlpIGNvcmUgY29kZSwgdGhpcyBpcyBcInlpaVwiKS5cbiAqXG4gKiBBIG1vZHVsZSBtYXkgYmUgc3RydWN0dXJlZCBhcyBmb2xsb3dzOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHdpbmRvdy55aWkuc2FtcGxlID0gKGZ1bmN0aW9uKCQpIHtcbiAqICAgICB2YXIgcHViID0ge1xuICogICAgICAgICAvLyB3aGV0aGVyIHRoaXMgbW9kdWxlIGlzIGN1cnJlbnRseSBhY3RpdmUuIElmIGZhbHNlLCBpbml0KCkgd2lsbCBub3QgYmUgY2FsbGVkIGZvciB0aGlzIG1vZHVsZVxuICogICAgICAgICAvLyBpdCB3aWxsIGFsc28gbm90IGJlIGNhbGxlZCBmb3IgYWxsIGl0cyBjaGlsZCBtb2R1bGVzLiBJZiB0aGlzIHByb3BlcnR5IGlzIHVuZGVmaW5lZCwgaXQgbWVhbnMgdHJ1ZS5cbiAqICAgICAgICAgaXNBY3RpdmU6IHRydWUsXG4gKiAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICogICAgICAgICAgICAgLy8gLi4uIG1vZHVsZSBpbml0aWFsaXphdGlvbiBjb2RlIGdvZXMgaGVyZSAuLi5cbiAqICAgICAgICAgfSxcbiAqXG4gKiAgICAgICAgIC8vIC4uLiBvdGhlciBwdWJsaWMgZnVuY3Rpb25zIGFuZCBwcm9wZXJ0aWVzIGdvIGhlcmUgLi4uXG4gKiAgICAgfTtcbiAqXG4gKiAgICAgLy8gLi4uIHByaXZhdGUgZnVuY3Rpb25zIGFuZCBwcm9wZXJ0aWVzIGdvIGhlcmUgLi4uXG4gKlxuICogICAgIHJldHVybiBwdWI7XG4gKiB9KSh3aW5kb3cualF1ZXJ5KTtcbiAqIGBgYFxuICpcbiAqIFVzaW5nIHRoaXMgc3RydWN0dXJlLCB5b3UgY2FuIGRlZmluZSBwdWJsaWMgYW5kIHByaXZhdGUgZnVuY3Rpb25zL3Byb3BlcnRpZXMgZm9yIGEgbW9kdWxlLlxuICogUHJpdmF0ZSBmdW5jdGlvbnMvcHJvcGVydGllcyBhcmUgb25seSB2aXNpYmxlIHdpdGhpbiB0aGUgbW9kdWxlLCB3aGlsZSBwdWJsaWMgZnVuY3Rpb25zL3Byb3BlcnRpZXNcbiAqIG1heSBiZSBhY2Nlc3NlZCBvdXRzaWRlIG9mIHRoZSBtb2R1bGUuIEZvciBleGFtcGxlLCB5b3UgY2FuIGFjY2VzcyBcInlpaS5zYW1wbGUuaXNBY3RpdmVcIi5cbiAqXG4gKiBZb3UgbXVzdCBjYWxsIFwieWlpLmluaXRNb2R1bGUoKVwiIG9uY2UgZm9yIHRoZSByb290IG1vZHVsZSBvZiBhbGwgeW91ciBtb2R1bGVzLlxuICovXG53aW5kb3cueWlpID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIHB1YiA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIExpc3Qgb2YgSlMgb3IgQ1NTIFVSTHMgdGhhdCBjYW4gYmUgbG9hZGVkIG11bHRpcGxlIHRpbWVzIHZpYSBBSkFYIHJlcXVlc3RzLlxuICAgICAgICAgKiBFYWNoIGl0ZW0gbWF5IGJlIHJlcHJlc2VudGVkIGFzIGVpdGhlciBhbiBhYnNvbHV0ZSBVUkwgb3IgYSByZWxhdGl2ZSBvbmUuXG4gICAgICAgICAqIEVhY2ggaXRlbSBtYXkgY29udGFpbiBhIHdpbGRjYXJkIG1hdGNoaW5nIGNoYXJhY3RlciBgKmAsIHRoYXQgbWVhbnMgb25lIG9yIG1vcmVcbiAgICAgICAgICogYW55IGNoYXJhY3RlcnMgb24gdGhlIHBvc2l0aW9uLiBGb3IgZXhhbXBsZTpcbiAgICAgICAgICogIC0gYC9jc3MvKi5jc3NgIHdpbGwgbWF0Y2ggYW55IGZpbGUgZW5kaW5nIHdpdGggYC5jc3NgIGluIHRoZSBgY3NzYCBkaXJlY3Rvcnkgb2YgdGhlIGN1cnJlbnQgd2ViIHNpdGVcbiAgICAgICAgICogIC0gYGh0dHAqOi8vY2RuLmV4YW1wbGUuY29tLypgIHdpbGwgbWF0Y2ggYW55IGZpbGVzIG9uIGRvbWFpbiBgY2RuLmV4YW1wbGUuY29tYCwgbG9hZGVkIHdpdGggSFRUUCBvciBIVFRQU1xuICAgICAgICAgKiAgLSBgL2pzL215Q3VzdG9tU2NyaXB0LmpzP3JlYWxtPSpgIHdpbGwgbWF0Y2ggZmlsZSBgL2pzL215Q3VzdG9tU2NyaXB0LmpzYCB3aXRoIGRlZmluZWQgYHJlYWxtYCBwYXJhbWV0ZXJcbiAgICAgICAgICovXG4gICAgICAgIHJlbG9hZGFibGVTY3JpcHRzOiBbXSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzZWxlY3RvciBmb3IgY2xpY2thYmxlIGVsZW1lbnRzIHRoYXQgbmVlZCB0byBzdXBwb3J0IGNvbmZpcm1hdGlvbiBhbmQgZm9ybSBzdWJtaXNzaW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgY2xpY2thYmxlU2VsZWN0b3I6ICdhLCBidXR0b24sIGlucHV0W3R5cGU9XCJzdWJtaXRcIl0sIGlucHV0W3R5cGU9XCJidXR0b25cIl0sIGlucHV0W3R5cGU9XCJyZXNldFwiXSwgJyArXG4gICAgICAgICdpbnB1dFt0eXBlPVwiaW1hZ2VcIl0nLFxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNlbGVjdG9yIGZvciBjaGFuZ2VhYmxlIGVsZW1lbnRzIHRoYXQgbmVlZCB0byBzdXBwb3J0IGNvbmZpcm1hdGlvbiBhbmQgZm9ybSBzdWJtaXNzaW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgY2hhbmdlYWJsZVNlbGVjdG9yOiAnc2VsZWN0LCBpbnB1dCwgdGV4dGFyZWEnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHN0cmluZ3x1bmRlZmluZWQgdGhlIENTUkYgcGFyYW1ldGVyIG5hbWUuIFVuZGVmaW5lZCBpcyByZXR1cm5lZCBpZiBDU1JGIHZhbGlkYXRpb24gaXMgbm90IGVuYWJsZWQuXG4gICAgICAgICAqL1xuICAgICAgICBnZXRDc3JmUGFyYW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKCdtZXRhW25hbWU9Y3NyZi1wYXJhbV0nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4gc3RyaW5nfHVuZGVmaW5lZCB0aGUgQ1NSRiB0b2tlbi4gVW5kZWZpbmVkIGlzIHJldHVybmVkIGlmIENTUkYgdmFsaWRhdGlvbiBpcyBub3QgZW5hYmxlZC5cbiAgICAgICAgICovXG4gICAgICAgIGdldENzcmZUb2tlbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoJ21ldGFbbmFtZT1jc3JmLXRva2VuXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgQ1NSRiB0b2tlbiBpbiB0aGUgbWV0YSBlbGVtZW50cy5cbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgcHJvdmlkZWQgc28gdGhhdCB5b3UgY2FuIHVwZGF0ZSB0aGUgQ1NSRiB0b2tlbiB3aXRoIHRoZSBsYXRlc3Qgb25lIHlvdSBvYnRhaW4gZnJvbSB0aGUgc2VydmVyLlxuICAgICAgICAgKiBAcGFyYW0gbmFtZSB0aGUgQ1NSRiB0b2tlbiBuYW1lXG4gICAgICAgICAqIEBwYXJhbSB2YWx1ZSB0aGUgQ1NSRiB0b2tlbiB2YWx1ZVxuICAgICAgICAgKi9cbiAgICAgICAgc2V0Q3NyZlRva2VuOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgICQoJ21ldGFbbmFtZT1jc3JmLXBhcmFtXScpLmF0dHIoJ2NvbnRlbnQnLCBuYW1lKTtcbiAgICAgICAgICAgICQoJ21ldGFbbmFtZT1jc3JmLXRva2VuXScpLmF0dHIoJ2NvbnRlbnQnLCB2YWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZXMgYWxsIGZvcm0gQ1NSRiBpbnB1dCBmaWVsZHMgd2l0aCB0aGUgbGF0ZXN0IENTUkYgdG9rZW4uXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIHByb3ZpZGVkIHRvIGF2b2lkIGNhY2hlZCBmb3JtcyBjb250YWluaW5nIG91dGRhdGVkIENTUkYgdG9rZW5zLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVmcmVzaENzcmZUb2tlbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRva2VuID0gcHViLmdldENzcmZUb2tlbigpO1xuICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgJCgnZm9ybSBpbnB1dFtuYW1lPVwiJyArIHB1Yi5nZXRDc3JmUGFyYW0oKSArICdcIl0nKS52YWwodG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEaXNwbGF5cyBhIGNvbmZpcm1hdGlvbiBkaWFsb2cuXG4gICAgICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIHNpbXBseSBkaXNwbGF5cyBhIGpzIGNvbmZpcm1hdGlvbiBkaWFsb2cuXG4gICAgICAgICAqIFlvdSBtYXkgb3ZlcnJpZGUgdGhpcyBieSBzZXR0aW5nIGB5aWkuY29uZmlybWAuXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlIHRoZSBjb25maXJtYXRpb24gbWVzc2FnZS5cbiAgICAgICAgICogQHBhcmFtIG9rIGEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIHVzZXIgY29uZmlybXMgdGhlIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIGNhbmNlbCBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNhbmNlbHMgdGhlIGNvbmZpcm1hdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgY29uZmlybTogZnVuY3Rpb24gKG1lc3NhZ2UsIG9rLCBjYW5jZWwpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuY29uZmlybShtZXNzYWdlKSkge1xuICAgICAgICAgICAgICAgICFvayB8fCBvaygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAhY2FuY2VsIHx8IGNhbmNlbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBhY3Rpb24gdHJpZ2dlcmVkIGJ5IHVzZXIuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIHJlY29nbml6ZXMgdGhlIGBkYXRhLW1ldGhvZGAgYXR0cmlidXRlIG9mIHRoZSBlbGVtZW50LiBJZiB0aGUgYXR0cmlidXRlIGV4aXN0cyxcbiAgICAgICAgICogdGhlIG1ldGhvZCB3aWxsIHN1Ym1pdCB0aGUgZm9ybSBjb250YWluaW5nIHRoaXMgZWxlbWVudC4gSWYgdGhlcmUgaXMgbm8gY29udGFpbmluZyBmb3JtLCBhIGZvcm1cbiAgICAgICAgICogd2lsbCBiZSBjcmVhdGVkIGFuZCBzdWJtaXR0ZWQgdXNpbmcgdGhlIG1ldGhvZCBnaXZlbiBieSB0aGlzIGF0dHJpYnV0ZSB2YWx1ZSAoZS5nLiBcInBvc3RcIiwgXCJwdXRcIikuXG4gICAgICAgICAqIEZvciBoeXBlcmxpbmtzLCB0aGUgZm9ybSBhY3Rpb24gd2lsbCB0YWtlIHRoZSB2YWx1ZSBvZiB0aGUgXCJocmVmXCIgYXR0cmlidXRlIG9mIHRoZSBsaW5rLlxuICAgICAgICAgKiBGb3Igb3RoZXIgZWxlbWVudHMsIGVpdGhlciB0aGUgY29udGFpbmluZyBmb3JtIGFjdGlvbiBvciB0aGUgY3VycmVudCBwYWdlIFVSTCB3aWxsIGJlIHVzZWRcbiAgICAgICAgICogYXMgdGhlIGZvcm0gYWN0aW9uIFVSTC5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIGBkYXRhLW1ldGhvZGAgYXR0cmlidXRlIGlzIG5vdCBkZWZpbmVkLCB0aGUgYGhyZWZgIGF0dHJpYnV0ZSAoaWYgYW55KSBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgKiB3aWxsIGJlIGFzc2lnbmVkIHRvIGB3aW5kb3cubG9jYXRpb25gLlxuICAgICAgICAgKlxuICAgICAgICAgKiBTdGFydGluZyBmcm9tIHZlcnNpb24gMi4wLjMsIHRoZSBgZGF0YS1wYXJhbXNgIGF0dHJpYnV0ZSBpcyBhbHNvIHJlY29nbml6ZWQgd2hlbiB5b3Ugc3BlY2lmeVxuICAgICAgICAgKiBgZGF0YS1tZXRob2RgLiBUaGUgdmFsdWUgb2YgYGRhdGEtcGFyYW1zYCBzaG91bGQgYmUgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkYXRhIChuYW1lLXZhbHVlIHBhaXJzKVxuICAgICAgICAgKiB0aGF0IHNob3VsZCBiZSBzdWJtaXR0ZWQgYXMgaGlkZGVuIGlucHV0cy4gRm9yIGV4YW1wbGUsIHlvdSBtYXkgdXNlIHRoZSBmb2xsb3dpbmcgY29kZSB0byBnZW5lcmF0ZVxuICAgICAgICAgKiBzdWNoIGEgbGluazpcbiAgICAgICAgICpcbiAgICAgICAgICogYGBgcGhwXG4gICAgICAgICAqIHVzZSB5aWlcXGhlbHBlcnNcXEh0bWw7XG4gICAgICAgICAqIHVzZSB5aWlcXGhlbHBlcnNcXEpzb247XG4gICAgICAgICAqXG4gICAgICAgICAqIGVjaG8gSHRtbDo6YSgnc3VibWl0JywgWydzaXRlL2Zvb2JhciddLCBbXG4gICAgICAgICAqICAgICAnZGF0YScgPT4gW1xuICAgICAgICAgKiAgICAgICAgICdtZXRob2QnID0+ICdwb3N0JyxcbiAgICAgICAgICogICAgICAgICAncGFyYW1zJyA9PiBbXG4gICAgICAgICAqICAgICAgICAgICAgICduYW1lMScgPT4gJ3ZhbHVlMScsXG4gICAgICAgICAqICAgICAgICAgICAgICduYW1lMicgPT4gJ3ZhbHVlMicsXG4gICAgICAgICAqICAgICAgICAgXSxcbiAgICAgICAgICogICAgIF0sXG4gICAgICAgICAqIF0pO1xuICAgICAgICAgKiBgYGBcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICRlIHRoZSBqUXVlcnkgcmVwcmVzZW50YXRpb24gb2YgdGhlIGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IFJlbGF0ZWQgZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGhhbmRsZUFjdGlvbjogZnVuY3Rpb24gKCRlLCBldmVudCkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJGUuYXR0cignZGF0YS1mb3JtJykgPyAkKCcjJyArICRlLmF0dHIoJ2RhdGEtZm9ybScpKSA6ICRlLmNsb3Nlc3QoJ2Zvcm0nKSxcbiAgICAgICAgICAgICAgICBtZXRob2QgPSAhJGUuZGF0YSgnbWV0aG9kJykgJiYgJGZvcm0gPyAkZm9ybS5hdHRyKCdtZXRob2QnKSA6ICRlLmRhdGEoJ21ldGhvZCcpLFxuICAgICAgICAgICAgICAgIGFjdGlvbiA9ICRlLmF0dHIoJ2hyZWYnKSxcbiAgICAgICAgICAgICAgICBpc1ZhbGlkQWN0aW9uID0gYWN0aW9uICYmIGFjdGlvbiAhPT0gJyMnLFxuICAgICAgICAgICAgICAgIHBhcmFtcyA9ICRlLmRhdGEoJ3BhcmFtcycpLFxuICAgICAgICAgICAgICAgIGFyZVZhbGlkUGFyYW1zID0gcGFyYW1zICYmICQuaXNQbGFpbk9iamVjdChwYXJhbXMpLFxuICAgICAgICAgICAgICAgIHBqYXggPSAkZS5kYXRhKCdwamF4JyksXG4gICAgICAgICAgICAgICAgdXNlUGpheCA9IHBqYXggIT09IHVuZGVmaW5lZCAmJiBwamF4ICE9PSAwICYmICQuc3VwcG9ydC5wamF4LFxuICAgICAgICAgICAgICAgIHBqYXhDb250YWluZXIsXG4gICAgICAgICAgICAgICAgcGpheE9wdGlvbnMgPSB7fTtcblxuICAgICAgICAgICAgaWYgKHVzZVBqYXgpIHtcbiAgICAgICAgICAgICAgICBwamF4Q29udGFpbmVyID0gJGUuZGF0YSgncGpheC1jb250YWluZXInKSB8fCAkZS5jbG9zZXN0KCdbZGF0YS1wamF4LWNvbnRhaW5lcl0nKTtcbiAgICAgICAgICAgICAgICBpZiAoIXBqYXhDb250YWluZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBqYXhDb250YWluZXIgPSAkKCdib2R5Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBqYXhPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6IHBqYXhDb250YWluZXIsXG4gICAgICAgICAgICAgICAgICAgIHB1c2g6ICEhJGUuZGF0YSgncGpheC1wdXNoLXN0YXRlJyksXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2U6ICEhJGUuZGF0YSgncGpheC1yZXBsYWNlLXN0YXRlJyksXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvOiAkZS5kYXRhKCdwamF4LXNjcm9sbHRvJyksXG4gICAgICAgICAgICAgICAgICAgIHB1c2hSZWRpcmVjdDogJGUuZGF0YSgncGpheC1wdXNoLXJlZGlyZWN0JyksXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VSZWRpcmVjdDogJGUuZGF0YSgncGpheC1yZXBsYWNlLXJlZGlyZWN0JyksXG4gICAgICAgICAgICAgICAgICAgIHNraXBPdXRlckNvbnRhaW5lcnM6ICRlLmRhdGEoJ3BqYXgtc2tpcC1vdXRlci1jb250YWluZXJzJyksXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6ICRlLmRhdGEoJ3BqYXgtdGltZW91dCcpLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxUYXJnZXQ6ICRlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzVmFsaWRBY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlUGpheCA/ICQucGpheC5jbGljayhldmVudCwgcGpheE9wdGlvbnMpIDogd2luZG93LmxvY2F0aW9uLmFzc2lnbihhY3Rpb24pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJGUuaXMoJzpzdWJtaXQnKSAmJiAkZm9ybS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZVBqYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQucGpheC5zdWJtaXQoZSwgcGpheE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcignc3VibWl0Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG9sZE1ldGhvZCxcbiAgICAgICAgICAgICAgICBvbGRBY3Rpb24sXG4gICAgICAgICAgICAgICAgbmV3Rm9ybSA9ICEkZm9ybS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoIW5ld0Zvcm0pIHtcbiAgICAgICAgICAgICAgICBvbGRNZXRob2QgPSAkZm9ybS5hdHRyKCdtZXRob2QnKTtcbiAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCdtZXRob2QnLCBtZXRob2QpO1xuICAgICAgICAgICAgICAgIGlmIChpc1ZhbGlkQWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIG9sZEFjdGlvbiA9ICRmb3JtLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCdhY3Rpb24nLCBhY3Rpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkQWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IHB1Yi5nZXRDdXJyZW50VXJsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRmb3JtID0gJCgnPGZvcm0vPicsIHttZXRob2Q6IG1ldGhvZCwgYWN0aW9uOiBhY3Rpb259KTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJGUuYXR0cigndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCd0YXJnZXQnLCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIS8oZ2V0fHBvc3QpL2kudGVzdChtZXRob2QpKSB7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZCgkKCc8aW5wdXQvPicsIHtuYW1lOiAnX21ldGhvZCcsIHZhbHVlOiBtZXRob2QsIHR5cGU6ICdoaWRkZW4nfSkpO1xuICAgICAgICAgICAgICAgICAgICBtZXRob2QgPSAncG9zdCc7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ21ldGhvZCcsIG1ldGhvZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgvcG9zdC9pLnRlc3QobWV0aG9kKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3NyZlBhcmFtID0gcHViLmdldENzcmZQYXJhbSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3NyZlBhcmFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJCgnPGlucHV0Lz4nLCB7bmFtZTogY3NyZlBhcmFtLCB2YWx1ZTogcHViLmdldENzcmZUb2tlbigpLCB0eXBlOiAnaGlkZGVuJ30pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkZm9ybS5oaWRlKCkuYXBwZW5kVG8oJ2JvZHknKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFjdGl2ZUZvcm1EYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgaWYgKGFjdGl2ZUZvcm1EYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtZW1iZXIgdGhlIGVsZW1lbnQgdHJpZ2dlcmVkIHRoZSBmb3JtIHN1Ym1pc3Npb24uIFRoaXMgaXMgdXNlZCBieSB5aWkuYWN0aXZlRm9ybS5qcy5cbiAgICAgICAgICAgICAgICBhY3RpdmVGb3JtRGF0YS5zdWJtaXRPYmplY3QgPSAkZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFyZVZhbGlkUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgJC5lYWNoKHBhcmFtcywgZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZCgkKCc8aW5wdXQvPicpLmF0dHIoe25hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZSwgdHlwZTogJ2hpZGRlbid9KSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh1c2VQamF4KSB7XG4gICAgICAgICAgICAgICAgJGZvcm0ub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICQucGpheC5zdWJtaXQoZSwgcGpheE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkZm9ybS50cmlnZ2VyKCdzdWJtaXQnKTtcblxuICAgICAgICAgICAgJC53aGVuKCRmb3JtLmRhdGEoJ3lpaVN1Ym1pdEZpbmFsaXplUHJvbWlzZScpKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3Rm9ybSkge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvbGRBY3Rpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCdhY3Rpb24nLCBvbGRBY3Rpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCdtZXRob2QnLCBvbGRNZXRob2QpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFyZVZhbGlkUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChwYXJhbXMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiJyArIG5hbWUgKyAnXCJdJywgJGZvcm0pLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRRdWVyeVBhcmFtczogZnVuY3Rpb24gKHVybCkge1xuICAgICAgICAgICAgdmFyIHBvcyA9IHVybC5pbmRleE9mKCc/Jyk7XG4gICAgICAgICAgICBpZiAocG9zIDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBhaXJzID0gJC5ncmVwKHVybC5zdWJzdHJpbmcocG9zICsgMSkuc3BsaXQoJyMnKVswXS5zcGxpdCgnJicpLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09ICcnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0ge307XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYWlycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBwYWlyID0gcGFpcnNbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzBdLnJlcGxhY2UoL1xcKy9nLCAnJTIwJykpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzFdLnJlcGxhY2UoL1xcKy9nLCAnJTIwJykpO1xuICAgICAgICAgICAgICAgIGlmICghbmFtZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwYXJhbXNbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXNbbmFtZV0gPSB2YWx1ZSB8fCAnJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISQuaXNBcnJheShwYXJhbXNbbmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNbbmFtZV0gPSBbcGFyYW1zW25hbWVdXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXJhbXNbbmFtZV0ucHVzaCh2YWx1ZSB8fCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0TW9kdWxlOiBmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgICAgICBpZiAobW9kdWxlLmlzQWN0aXZlICE9PSB1bmRlZmluZWQgJiYgIW1vZHVsZS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24obW9kdWxlLmluaXQpKSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlLmluaXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQuZWFjaChtb2R1bGUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1Yi5pbml0TW9kdWxlKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGluaXRDc3JmSGFuZGxlcigpO1xuICAgICAgICAgICAgaW5pdFJlZGlyZWN0SGFuZGxlcigpO1xuICAgICAgICAgICAgaW5pdEFzc2V0RmlsdGVycygpO1xuICAgICAgICAgICAgaW5pdERhdGFNZXRob2RzKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIFVSTCBvZiB0aGUgY3VycmVudCBwYWdlIHdpdGhvdXQgcGFyYW1zIGFuZCB0cmFpbGluZyBzbGFzaC4gU2VwYXJhdGVkIGFuZCBtYWRlIHB1YmxpYyBmb3IgdGVzdGluZy5cbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldEJhc2VDdXJyZW50VXJsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBVUkwgb2YgdGhlIGN1cnJlbnQgcGFnZS4gVXNlZCBmb3IgdGVzdGluZywgeW91IGNhbiBhbHdheXMgY2FsbCBgd2luZG93LmxvY2F0aW9uLmhyZWZgIG1hbnVhbGx5XG4gICAgICAgICAqIGluc3RlYWQuXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRDdXJyZW50VXJsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdENzcmZIYW5kbGVyKCkge1xuICAgICAgICAvLyBhdXRvbWF0aWNhbGx5IHNlbmQgQ1NSRiB0b2tlbiBmb3IgYWxsIEFKQVggcmVxdWVzdHNcbiAgICAgICAgJC5hamF4UHJlZmlsdGVyKGZ1bmN0aW9uIChvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMsIHhocikge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmNyb3NzRG9tYWluICYmIHB1Yi5nZXRDc3JmUGFyYW0oKSkge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLUNTUkYtVG9rZW4nLCBwdWIuZ2V0Q3NyZlRva2VuKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcHViLnJlZnJlc2hDc3JmVG9rZW4oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0UmVkaXJlY3RIYW5kbGVyKCkge1xuICAgICAgICAvLyBoYW5kbGUgQUpBWCByZWRpcmVjdGlvblxuICAgICAgICAkKGRvY3VtZW50KS5hamF4Q29tcGxldGUoZnVuY3Rpb24gKGV2ZW50LCB4aHIpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSB4aHIgJiYgeGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLVJlZGlyZWN0Jyk7XG4gICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0QXNzZXRGaWx0ZXJzKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVXNlZCBmb3Igc3RvcmluZyBsb2FkZWQgc2NyaXB0cyBhbmQgaW5mb3JtYXRpb24gYWJvdXQgbG9hZGluZyBlYWNoIHNjcmlwdCBpZiBpdCdzIGluIHRoZSBwcm9jZXNzIG9mIGxvYWRpbmcuXG4gICAgICAgICAqIEEgc2luZ2xlIHNjcmlwdCBjYW4gaGF2ZSBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXM6XG4gICAgICAgICAqXG4gICAgICAgICAqIC0gYHVuZGVmaW5lZGAgLSBzY3JpcHQgd2FzIG5vdCBsb2FkZWQgYXQgYWxsIGJlZm9yZSBvciB3YXMgbG9hZGVkIHdpdGggZXJyb3IgbGFzdCB0aW1lLlxuICAgICAgICAgKiAtIGB0cnVlYCAoYm9vbGVhbikgLSAgc2NyaXB0IHdhcyBzdWNjZXNzZnVsbHkgbG9hZGVkLlxuICAgICAgICAgKiAtIG9iamVjdCAtIHNjcmlwdCBpcyBjdXJyZW50bHkgbG9hZGluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogSW4gY2FzZSBvZiBhIHZhbHVlIGJlaW5nIGFuIG9iamVjdCB0aGUgcHJvcGVydGllcyBhcmU6XG4gICAgICAgICAqIC0gYHhockxpc3RgIC0gcmVwcmVzZW50cyBhIHF1ZXVlIG9mIFhIUiByZXF1ZXN0cyBzZW50IHRvIHRoZSBzYW1lIFVSTCAocmVsYXRlZCB3aXRoIHRoaXMgc2NyaXB0KSBpbiB0aGUgc2FtZVxuICAgICAgICAgKiBzbWFsbCBwZXJpb2Qgb2YgdGltZS5cbiAgICAgICAgICogLSBgeGhyRG9uZWAgLSBib29sZWFuLCBhY3RzIGxpa2UgYSBsb2NraW5nIG1lY2hhbmlzbS4gV2hlbiBvbmUgb2YgdGhlIFhIUiByZXF1ZXN0cyBpbiB0aGUgcXVldWUgaXNcbiAgICAgICAgICogc3VjY2Vzc2Z1bGx5IGNvbXBsZXRlZCwgaXQgd2lsbCBhYm9ydCB0aGUgcmVzdCBvZiBjb25jdXJyZW50IHJlcXVlc3RzIHRvIHRoZSBzYW1lIFVSTCB1bnRpbCBjbGVhbnVwIGlzIGRvbmVcbiAgICAgICAgICogdG8gcHJldmVudCBwb3NzaWJsZSBlcnJvcnMgYW5kIHJhY2UgY29uZGl0aW9ucy5cbiAgICAgICAgICogQHR5cGUge3t9fVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGxvYWRlZFNjcmlwdHMgPSB7fTtcblxuICAgICAgICAkKCdzY3JpcHRbc3JjXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVybCA9IGdldEFic29sdXRlVXJsKHRoaXMuc3JjKTtcbiAgICAgICAgICAgIGxvYWRlZFNjcmlwdHNbdXJsXSA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQuYWpheFByZWZpbHRlcignc2NyaXB0JywgZnVuY3Rpb24gKG9wdGlvbnMsIG9yaWdpbmFsT3B0aW9ucywgeGhyKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kYXRhVHlwZSA9PSAnanNvbnAnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdXJsID0gZ2V0QWJzb2x1dGVVcmwob3B0aW9ucy51cmwpLFxuICAgICAgICAgICAgICAgIGZvcmJpZGRlblJlcGVhdGVkTG9hZCA9IGxvYWRlZFNjcmlwdHNbdXJsXSA9PT0gdHJ1ZSAmJiAhaXNSZWxvYWRhYmxlQXNzZXQodXJsKSxcbiAgICAgICAgICAgICAgICBjbGVhbnVwUnVubmluZyA9IGxvYWRlZFNjcmlwdHNbdXJsXSAhPT0gdW5kZWZpbmVkICYmIGxvYWRlZFNjcmlwdHNbdXJsXVsneGhyRG9uZSddID09PSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAoZm9yYmlkZGVuUmVwZWF0ZWRMb2FkIHx8IGNsZWFudXBSdW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobG9hZGVkU2NyaXB0c1t1cmxdID09PSB1bmRlZmluZWQgfHwgbG9hZGVkU2NyaXB0c1t1cmxdID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgbG9hZGVkU2NyaXB0c1t1cmxdID0ge1xuICAgICAgICAgICAgICAgICAgICB4aHJMaXN0OiBbXSxcbiAgICAgICAgICAgICAgICAgICAgeGhyRG9uZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4aHIuZG9uZShmdW5jdGlvbiAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBtdWx0aXBsZSByZXF1ZXN0cyB3ZXJlIHN1Y2Nlc3NmdWxseSBsb2FkZWQsIHBlcmZvcm0gY2xlYW51cCBvbmx5IG9uY2VcbiAgICAgICAgICAgICAgICBpZiAobG9hZGVkU2NyaXB0c1tqcVhIUi55aWlVcmxdWyd4aHJEb25lJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXVsneGhyRG9uZSddID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF1bJ3hockxpc3QnXS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2luZ2xlWGhyID0gbG9hZGVkU2NyaXB0c1tqcVhIUi55aWlVcmxdWyd4aHJMaXN0J11baV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaW5nbGVYaHIgJiYgc2luZ2xlWGhyLnJlYWR5U3RhdGUgIT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZVhoci5hYm9ydCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbG9hZGVkU2NyaXB0c1tqcVhIUi55aWlVcmxdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRleHRTdGF0dXMgPT09ICdhYm9ydCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF1bJ3hockxpc3QnXVtqcVhIUi55aWlJbmRleF07XG5cbiAgICAgICAgICAgICAgICB2YXIgYWxsRmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbG9hZGVkU2NyaXB0c1tqcVhIUi55aWlVcmxdWyd4aHJMaXN0J10ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXVsneGhyTGlzdCddW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxGYWlsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChhbGxGYWlsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIFVzZSBwcmVmaXggZm9yIGN1c3RvbSBYSFIgcHJvcGVydGllcyB0byBhdm9pZCBwb3NzaWJsZSBjb25mbGljdHMgd2l0aCBleGlzdGluZyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICB4aHIueWlpSW5kZXggPSBsb2FkZWRTY3JpcHRzW3VybF1bJ3hockxpc3QnXS5sZW5ndGg7XG4gICAgICAgICAgICB4aHIueWlpVXJsID0gdXJsO1xuXG4gICAgICAgICAgICBsb2FkZWRTY3JpcHRzW3VybF1bJ3hockxpc3QnXVt4aHIueWlpSW5kZXhdID0geGhyO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5hamF4Q29tcGxldGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHN0eWxlU2hlZXRzID0gW107XG4gICAgICAgICAgICAkKCdsaW5rW3JlbD1zdHlsZXNoZWV0XScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciB1cmwgPSBnZXRBYnNvbHV0ZVVybCh0aGlzLmhyZWYpO1xuICAgICAgICAgICAgICAgIGlmIChpc1JlbG9hZGFibGVBc3NldCh1cmwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkLmluQXJyYXkodXJsLCBzdHlsZVNoZWV0cykgPT09IC0xID8gc3R5bGVTaGVldHMucHVzaCh1cmwpIDogJCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0RGF0YU1ldGhvZHMoKSB7XG4gICAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIG1ldGhvZCA9ICR0aGlzLmRhdGEoJ21ldGhvZCcpLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSAkdGhpcy5kYXRhKCdjb25maXJtJyksXG4gICAgICAgICAgICAgICAgZm9ybSA9ICR0aGlzLmRhdGEoJ2Zvcm0nKTtcblxuICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkICYmIG1lc3NhZ2UgPT09IHVuZGVmaW5lZCAmJiBmb3JtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1lc3NhZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICQucHJveHkocHViLmNvbmZpcm0sIHRoaXMpKG1lc3NhZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmhhbmRsZUFjdGlvbigkdGhpcywgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwdWIuaGFuZGxlQWN0aW9uKCR0aGlzLCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBoYW5kbGUgZGF0YS1jb25maXJtIGFuZCBkYXRhLW1ldGhvZCBmb3IgY2xpY2thYmxlIGFuZCBjaGFuZ2VhYmxlIGVsZW1lbnRzXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljay55aWknLCBwdWIuY2xpY2thYmxlU2VsZWN0b3IsIGhhbmRsZXIpXG4gICAgICAgICAgICAub24oJ2NoYW5nZS55aWknLCBwdWIuY2hhbmdlYWJsZVNlbGVjdG9yLCBoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1JlbG9hZGFibGVBc3NldCh1cmwpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwdWIucmVsb2FkYWJsZVNjcmlwdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBydWxlID0gZ2V0QWJzb2x1dGVVcmwocHViLnJlbG9hZGFibGVTY3JpcHRzW2ldKTtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IG5ldyBSZWdFeHAoXCJeXCIgKyBlc2NhcGVSZWdFeHAocnVsZSkuc3BsaXQoJ1xcXFwqJykuam9pbignLisnKSArIFwiJFwiKS50ZXN0KHVybCk7XG4gICAgICAgICAgICBpZiAobWF0Y2ggPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM0NDYxNzAvZXNjYXBlLXN0cmluZy1mb3ItdXNlLWluLWphdmFzY3JpcHQtcmVnZXhcbiAgICBmdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYWJzb2x1dGUgVVJMIGJhc2VkIG9uIHRoZSBnaXZlbiBVUkxcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIEluaXRpYWwgVVJMXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRBYnNvbHV0ZVVybCh1cmwpIHtcbiAgICAgICAgcmV0dXJuIHVybC5jaGFyQXQoMCkgPT09ICcvJyA/IHB1Yi5nZXRCYXNlQ3VycmVudFVybCgpICsgdXJsIDogdXJsO1xuICAgIH1cblxuICAgIHJldHVybiBwdWI7XG59KSh3aW5kb3cualF1ZXJ5KTtcblxud2luZG93LmpRdWVyeShmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LnlpaS5pbml0TW9kdWxlKHdpbmRvdy55aWkpO1xufSk7XG4iLCIvKipcbiAqIFlpaSB2YWxpZGF0aW9uIG1vZHVsZS5cbiAqXG4gKiBUaGlzIEphdmFTY3JpcHQgbW9kdWxlIHByb3ZpZGVzIHRoZSB2YWxpZGF0aW9uIG1ldGhvZHMgZm9yIHRoZSBidWlsdC1pbiB2YWxpZGF0b3JzLlxuICpcbiAqIEBsaW5rIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDA4IFlpaSBTb2Z0d2FyZSBMTENcbiAqIEBsaWNlbnNlIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9saWNlbnNlL1xuICogQGF1dGhvciBRaWFuZyBYdWUgPHFpYW5nLnh1ZUBnbWFpbC5jb20+XG4gKiBAc2luY2UgMi4wXG4gKi9cblxueWlpLnZhbGlkYXRpb24gPSAoZnVuY3Rpb24gKCQpIHtcbiAgICB2YXIgcHViID0ge1xuICAgICAgICBpc0VtcHR5OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8ICgkLmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkgfHwgdmFsdWUgPT09ICcnO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZE1lc3NhZ2U6IGZ1bmN0aW9uIChtZXNzYWdlcywgbWVzc2FnZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gobWVzc2FnZS5yZXBsYWNlKC9cXHt2YWx1ZVxcfS9nLCB2YWx1ZSkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlcXVpcmVkOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJlcXVpcmVkVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciBpc1N0cmluZyA9IHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZztcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zdHJpY3QgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCB8fCAhb3B0aW9ucy5zdHJpY3QgJiYgIXB1Yi5pc0VtcHR5KGlzU3RyaW5nID8gJC50cmltKHZhbHVlKSA6IHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghb3B0aW9ucy5zdHJpY3QgJiYgdmFsdWUgPT0gb3B0aW9ucy5yZXF1aXJlZFZhbHVlIHx8IG9wdGlvbnMuc3RyaWN0ICYmIHZhbHVlID09PSBvcHRpb25zLnJlcXVpcmVkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gXCJib29sZWFuXCIgaXMgYSByZXNlcnZlZCBrZXl3b3JkIGluIG9sZGVyIHZlcnNpb25zIG9mIEVTIHNvIGl0J3MgcXVvdGVkIGZvciBJRSA8IDkgc3VwcG9ydFxuICAgICAgICAnYm9vbGVhbic6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWxpZCA9ICFvcHRpb25zLnN0cmljdCAmJiAodmFsdWUgPT0gb3B0aW9ucy50cnVlVmFsdWUgfHwgdmFsdWUgPT0gb3B0aW9ucy5mYWxzZVZhbHVlKVxuICAgICAgICAgICAgICAgIHx8IG9wdGlvbnMuc3RyaWN0ICYmICh2YWx1ZSA9PT0gb3B0aW9ucy50cnVlVmFsdWUgfHwgdmFsdWUgPT09IG9wdGlvbnMuZmFsc2VWYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RyaW5nOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaXMgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZS5sZW5ndGggIT0gb3B0aW9ucy5pcykge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm5vdEVxdWFsLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWluICE9PSB1bmRlZmluZWQgJiYgdmFsdWUubGVuZ3RoIDwgb3B0aW9ucy5taW4pIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy50b29TaG9ydCwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWF4ICE9PSB1bmRlZmluZWQgJiYgdmFsdWUubGVuZ3RoID4gb3B0aW9ucy5tYXgpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy50b29Mb25nLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmlsZTogZnVuY3Rpb24gKGF0dHJpYnV0ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBmaWxlcyA9IGdldFVwbG9hZGVkRmlsZXMoYXR0cmlidXRlLCBtZXNzYWdlcywgb3B0aW9ucyk7XG4gICAgICAgICAgICAkLmVhY2goZmlsZXMsIGZ1bmN0aW9uIChpLCBmaWxlKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGVGaWxlKGZpbGUsIG1lc3NhZ2VzLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGltYWdlOiBmdW5jdGlvbiAoYXR0cmlidXRlLCBtZXNzYWdlcywgb3B0aW9ucywgZGVmZXJyZWRMaXN0KSB7XG4gICAgICAgICAgICB2YXIgZmlsZXMgPSBnZXRVcGxvYWRlZEZpbGVzKGF0dHJpYnV0ZSwgbWVzc2FnZXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgJC5lYWNoKGZpbGVzLCBmdW5jdGlvbiAoaSwgZmlsZSkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlRmlsZShmaWxlLCBtZXNzYWdlcywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAvLyBTa2lwIGltYWdlIHZhbGlkYXRpb24gaWYgRmlsZVJlYWRlciBBUEkgaXMgbm90IGF2YWlsYWJsZVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgRmlsZVJlYWRlciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xuICAgICAgICAgICAgICAgIHB1Yi52YWxpZGF0ZUltYWdlKGZpbGUsIG1lc3NhZ2VzLCBvcHRpb25zLCBkZWZlcnJlZCwgbmV3IEZpbGVSZWFkZXIoKSwgbmV3IEltYWdlKCkpO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkTGlzdC5wdXNoKGRlZmVycmVkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbGlkYXRlSW1hZ2U6IGZ1bmN0aW9uIChmaWxlLCBtZXNzYWdlcywgb3B0aW9ucywgZGVmZXJyZWQsIGZpbGVSZWFkZXIsIGltYWdlKSB7XG4gICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUltYWdlU2l6ZShmaWxlLCBpbWFnZSwgbWVzc2FnZXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGltYWdlLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLm5vdEltYWdlLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gdGhpcy5yZXN1bHQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBSZXNvbHZlIGRlZmVycmVkIGlmIHRoZXJlIHdhcyBlcnJvciB3aGlsZSByZWFkaW5nIGRhdGFcbiAgICAgICAgICAgIGZpbGVSZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbnVtYmVyOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmICFvcHRpb25zLnBhdHRlcm4udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5taW4gIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSA8IG9wdGlvbnMubWluKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMudG9vU21hbGwsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1heCAhPT0gdW5kZWZpbmVkICYmIHZhbHVlID4gb3B0aW9ucy5tYXgpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy50b29CaWcsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByYW5nZTogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dBcnJheSAmJiAkLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluQXJyYXkgPSB0cnVlO1xuXG4gICAgICAgICAgICAkLmVhY2goJC5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXSwgZnVuY3Rpb24gKGksIHYpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KHYsIG9wdGlvbnMucmFuZ2UpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGluQXJyYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ub3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubm90ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm5vdCA9PT0gaW5BcnJheSkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZWd1bGFyRXhwcmVzc2lvbjogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMubm90ICYmICFvcHRpb25zLnBhdHRlcm4udGVzdCh2YWx1ZSkgfHwgb3B0aW9ucy5ub3QgJiYgb3B0aW9ucy5wYXR0ZXJuLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGVtYWlsOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWxpZCA9IHRydWUsXG4gICAgICAgICAgICAgICAgcmVnZXhwID0gL14oKD86XCI/KFteXCJdKilcIj9cXHMpPykoPzpcXHMrKT8oPzooPD8pKCguKylAKFtePl0rKSkoPj8pKSQvLFxuICAgICAgICAgICAgICAgIG1hdGNoZXMgPSByZWdleHAuZXhlYyh2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2FsUGFydCA9IG1hdGNoZXNbNV0sXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbiA9IG1hdGNoZXNbNl07XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5lbmFibGVJRE4pIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxQYXJ0ID0gcHVueWNvZGUudG9BU0NJSShsb2NhbFBhcnQpO1xuICAgICAgICAgICAgICAgICAgICBkb21haW4gPSBwdW55Y29kZS50b0FTQ0lJKGRvbWFpbik7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRjaGVzWzFdICsgbWF0Y2hlc1szXSArIGxvY2FsUGFydCArICdAJyArIGRvbWFpbiArIG1hdGNoZXNbN107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsUGFydC5sZW5ndGggPiA2NCkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGxvY2FsUGFydCArICdAJyArIGRvbWFpbikubGVuZ3RoID4gMjU0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBvcHRpb25zLnBhdHRlcm4udGVzdCh2YWx1ZSkgfHwgKG9wdGlvbnMuYWxsb3dOYW1lICYmIG9wdGlvbnMuZnVsbFBhdHRlcm4udGVzdCh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWxpZCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB1cmw6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGVmYXVsdFNjaGVtZSAmJiAhLzpcXC9cXC8vLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBvcHRpb25zLmRlZmF1bHRTY2hlbWUgKyAnOi8vJyArIHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsaWQgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5lbmFibGVJRE4pIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IC9eKFteOl0rKTpcXC9cXC8oW15cXC9dKykoLiopJC8uZXhlYyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG1hdGNoZXNbMV0gKyAnOi8vJyArIHB1bnljb2RlLnRvQVNDSUkobWF0Y2hlc1syXSkgKyBtYXRjaGVzWzNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWxpZCB8fCAhb3B0aW9ucy5wYXR0ZXJuLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRyaW06IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgJGlucHV0ID0gJGZvcm0uZmluZChhdHRyaWJ1dGUuaW5wdXQpO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gJGlucHV0LnZhbCgpO1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLnNraXBPbkVtcHR5IHx8ICFwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICQudHJpbSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgJGlucHV0LnZhbCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FwdGNoYTogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDQVBUQ0hBIG1heSBiZSB1cGRhdGVkIHZpYSBBSkFYIGFuZCB0aGUgdXBkYXRlZCBoYXNoIGlzIHN0b3JlZCBpbiBib2R5IGRhdGFcbiAgICAgICAgICAgIHZhciBoYXNoID0gJCgnYm9keScpLmRhdGEob3B0aW9ucy5oYXNoS2V5KTtcbiAgICAgICAgICAgIGhhc2ggPSBoYXNoID09IG51bGwgPyBvcHRpb25zLmhhc2ggOiBoYXNoW29wdGlvbnMuY2FzZVNlbnNpdGl2ZSA/IDAgOiAxXTtcbiAgICAgICAgICAgIHZhciB2ID0gb3B0aW9ucy5jYXNlU2Vuc2l0aXZlID8gdmFsdWUgOiB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHYubGVuZ3RoIC0gMSwgaCA9IDA7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICAgICAgaCArPSB2LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaCAhPSBoYXNoKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbXBhcmU6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNvbXBhcmVWYWx1ZSxcbiAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb21wYXJlQXR0cmlidXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb21wYXJlVmFsdWUgPSBvcHRpb25zLmNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tcGFyZVZhbHVlID0gJCgnIycgKyBvcHRpb25zLmNvbXBhcmVBdHRyaWJ1dGUpLnZhbCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy50eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgY29tcGFyZVZhbHVlID0gcGFyc2VGbG9hdChjb21wYXJlVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoIChvcHRpb25zLm9wZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlID09IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT09JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA9PT0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICchPSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgIT0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICchPT0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlICE9PSBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJz4nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlID4gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICc+PSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgPj0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA8IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPD0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlIDw9IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXA6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5lZ2F0aW9uID0gbnVsbCxcbiAgICAgICAgICAgICAgICBjaWRyID0gbnVsbCxcbiAgICAgICAgICAgICAgICBtYXRjaGVzID0gbmV3IFJlZ0V4cChvcHRpb25zLmlwUGFyc2VQYXR0ZXJuKS5leGVjKHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgbmVnYXRpb24gPSBtYXRjaGVzWzFdIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRjaGVzWzJdO1xuICAgICAgICAgICAgICAgIGNpZHIgPSBtYXRjaGVzWzRdIHx8IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnN1Ym5ldCA9PT0gdHJ1ZSAmJiBjaWRyID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMubm9TdWJuZXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zdWJuZXQgPT09IGZhbHNlICYmIGNpZHIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5oYXNTdWJuZXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5uZWdhdGlvbiA9PT0gZmFsc2UgJiYgbmVnYXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaXBWZXJzaW9uID0gdmFsdWUuaW5kZXhPZignOicpID09PSAtMSA/IDQgOiA2O1xuICAgICAgICAgICAgaWYgKGlwVmVyc2lvbiA9PSA2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChvcHRpb25zLmlwdjZQYXR0ZXJuKSkudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaXB2Nikge1xuICAgICAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5pcHY2Tm90QWxsb3dlZCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChvcHRpb25zLmlwdjRQYXR0ZXJuKSkudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaXB2NCkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5pcHY0Tm90QWxsb3dlZCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRVcGxvYWRlZEZpbGVzKGF0dHJpYnV0ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gU2tpcCB2YWxpZGF0aW9uIGlmIEZpbGUgQVBJIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgICAgaWYgKHR5cGVvZiBGaWxlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZXMgPSAkKGF0dHJpYnV0ZS5pbnB1dCwgYXR0cmlidXRlLiRmb3JtKS5nZXQoMCkuZmlsZXM7XG4gICAgICAgIGlmICghZmlsZXMpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy5tZXNzYWdlKTtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5za2lwT25FbXB0eSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy51cGxvYWRSZXF1aXJlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5tYXhGaWxlcyAmJiBvcHRpb25zLm1heEZpbGVzIDwgZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudG9vTWFueSk7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVGaWxlKGZpbGUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmV4dGVuc2lvbnMgJiYgb3B0aW9ucy5leHRlbnNpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGZpbGUubmFtZS5sYXN0SW5kZXhPZignLicpO1xuICAgICAgICAgICAgdmFyIGV4dCA9ICF+aW5kZXggPyAnJyA6IGZpbGUubmFtZS5zdWJzdHIoaW5kZXggKyAxLCBmaWxlLm5hbWUubGVuZ3RoKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBpZiAoIX5vcHRpb25zLmV4dGVuc2lvbnMuaW5kZXhPZihleHQpKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLndyb25nRXh0ZW5zaW9uLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5taW1lVHlwZXMgJiYgb3B0aW9ucy5taW1lVHlwZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKCF2YWxpZGF0ZU1pbWVUeXBlKG9wdGlvbnMubWltZVR5cGVzLCBmaWxlLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLndyb25nTWltZVR5cGUucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm1heFNpemUgJiYgb3B0aW9ucy5tYXhTaXplIDwgZmlsZS5zaXplKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudG9vQmlnLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5taW5TaXplICYmIG9wdGlvbnMubWluU2l6ZSA+IGZpbGUuc2l6ZSkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnRvb1NtYWxsLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZU1pbWVUeXBlKG1pbWVUeXBlcywgZmlsZVR5cGUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1pbWVUeXBlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKG5ldyBSZWdFeHAobWltZVR5cGVzW2ldKS50ZXN0KGZpbGVUeXBlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlSW1hZ2VTaXplKGZpbGUsIGltYWdlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5taW5XaWR0aCAmJiBpbWFnZS53aWR0aCA8IG9wdGlvbnMubWluV2lkdGgpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy51bmRlcldpZHRoLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5tYXhXaWR0aCAmJiBpbWFnZS53aWR0aCA+IG9wdGlvbnMubWF4V2lkdGgpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy5vdmVyV2lkdGgucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm1pbkhlaWdodCAmJiBpbWFnZS5oZWlnaHQgPCBvcHRpb25zLm1pbkhlaWdodCkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnVuZGVySGVpZ2h0LnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5tYXhIZWlnaHQgJiYgaW1hZ2UuaGVpZ2h0ID4gb3B0aW9ucy5tYXhIZWlnaHQpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy5vdmVySGVpZ2h0LnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHViO1xufSkoalF1ZXJ5KTtcbiIsIi8qKlxuICogWWlpIGZvcm0gd2lkZ2V0LlxuICpcbiAqIFRoaXMgaXMgdGhlIEphdmFTY3JpcHQgd2lkZ2V0IHVzZWQgYnkgdGhlIHlpaVxcd2lkZ2V0c1xcQWN0aXZlRm9ybSB3aWRnZXQuXG4gKlxuICogQGxpbmsgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL1xuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMDggWWlpIFNvZnR3YXJlIExMQ1xuICogQGxpY2Vuc2UgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL2xpY2Vuc2UvXG4gKiBAYXV0aG9yIFFpYW5nIFh1ZSA8cWlhbmcueHVlQGdtYWlsLmNvbT5cbiAqIEBzaW5jZSAyLjBcbiAqL1xuKGZ1bmN0aW9uICgkKSB7XG5cbiAgICAkLmZuLnlpaUFjdGl2ZUZvcm0gPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICAgIGlmIChtZXRob2RzW21ldGhvZF0pIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2RzW21ldGhvZF0uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ29iamVjdCcgfHwgIW1ldGhvZCkge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZHMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJC5lcnJvcignTWV0aG9kICcgKyBtZXRob2QgKyAnIGRvZXMgbm90IGV4aXN0IG9uIGpRdWVyeS55aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGV2ZW50cyA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGJlZm9yZVZhbGlkYXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBiZWZvcmUgdmFsaWRhdGluZyB0aGUgd2hvbGUgZm9ybS5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQsIG1lc3NhZ2VzLCBkZWZlcnJlZHMpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIG1lc3NhZ2VzOiBhbiBhc3NvY2lhdGl2ZSBhcnJheSB3aXRoIGtleXMgYmVpbmcgYXR0cmlidXRlIElEcyBhbmQgdmFsdWVzIGJlaW5nIGVycm9yIG1lc3NhZ2UgYXJyYXlzXG4gICAgICAgICAqICAgIGZvciB0aGUgY29ycmVzcG9uZGluZyBhdHRyaWJ1dGVzLlxuICAgICAgICAgKiAgLSBkZWZlcnJlZHM6IGFuIGFycmF5IG9mIERlZmVycmVkIG9iamVjdHMuIFlvdSBjYW4gdXNlIGRlZmVycmVkcy5hZGQoY2FsbGJhY2spIHRvIGFkZCBhIG5ldyBkZWZlcnJlZCB2YWxpZGF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgaGFuZGxlciByZXR1cm5zIGEgYm9vbGVhbiBmYWxzZSwgaXQgd2lsbCBzdG9wIGZ1cnRoZXIgZm9ybSB2YWxpZGF0aW9uIGFmdGVyIHRoaXMgZXZlbnQuIEFuZCBhc1xuICAgICAgICAgKiBhIHJlc3VsdCwgYWZ0ZXJWYWxpZGF0ZSBldmVudCB3aWxsIG5vdCBiZSB0cmlnZ2VyZWQuXG4gICAgICAgICAqL1xuICAgICAgICBiZWZvcmVWYWxpZGF0ZTogJ2JlZm9yZVZhbGlkYXRlJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFmdGVyVmFsaWRhdGUgZXZlbnQgaXMgdHJpZ2dlcmVkIGFmdGVyIHZhbGlkYXRpbmcgdGhlIHdob2xlIGZvcm0uXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBtZXNzYWdlcywgZXJyb3JBdHRyaWJ1dGVzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBtZXNzYWdlczogYW4gYXNzb2NpYXRpdmUgYXJyYXkgd2l0aCBrZXlzIGJlaW5nIGF0dHJpYnV0ZSBJRHMgYW5kIHZhbHVlcyBiZWluZyBlcnJvciBtZXNzYWdlIGFycmF5c1xuICAgICAgICAgKiAgICBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgYXR0cmlidXRlcy5cbiAgICAgICAgICogIC0gZXJyb3JBdHRyaWJ1dGVzOiBhbiBhcnJheSBvZiBhdHRyaWJ1dGVzIHRoYXQgaGF2ZSB2YWxpZGF0aW9uIGVycm9ycy4gUGxlYXNlIHJlZmVyIHRvIGF0dHJpYnV0ZURlZmF1bHRzIGZvciB0aGUgc3RydWN0dXJlIG9mIHRoaXMgcGFyYW1ldGVyLlxuICAgICAgICAgKi9cbiAgICAgICAgYWZ0ZXJWYWxpZGF0ZTogJ2FmdGVyVmFsaWRhdGUnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYmVmb3JlVmFsaWRhdGVBdHRyaWJ1dGUgZXZlbnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSB2YWxpZGF0aW5nIGFuIGF0dHJpYnV0ZS5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQsIGF0dHJpYnV0ZSwgbWVzc2FnZXMsIGRlZmVycmVkcylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0gYXR0cmlidXRlOiB0aGUgYXR0cmlidXRlIHRvIGJlIHZhbGlkYXRlZC4gUGxlYXNlIHJlZmVyIHRvIGF0dHJpYnV0ZURlZmF1bHRzIGZvciB0aGUgc3RydWN0dXJlIG9mIHRoaXMgcGFyYW1ldGVyLlxuICAgICAgICAgKiAgLSBtZXNzYWdlczogYW4gYXJyYXkgdG8gd2hpY2ggeW91IGNhbiBhZGQgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlcyBmb3IgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUuXG4gICAgICAgICAqICAtIGRlZmVycmVkczogYW4gYXJyYXkgb2YgRGVmZXJyZWQgb2JqZWN0cy4gWW91IGNhbiB1c2UgZGVmZXJyZWRzLmFkZChjYWxsYmFjaykgdG8gYWRkIGEgbmV3IGRlZmVycmVkIHZhbGlkYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBoYW5kbGVyIHJldHVybnMgYSBib29sZWFuIGZhbHNlLCBpdCB3aWxsIHN0b3AgZnVydGhlciB2YWxpZGF0aW9uIG9mIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlLlxuICAgICAgICAgKiBBbmQgYXMgYSByZXN1bHQsIGFmdGVyVmFsaWRhdGVBdHRyaWJ1dGUgZXZlbnQgd2lsbCBub3QgYmUgdHJpZ2dlcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgYmVmb3JlVmFsaWRhdGVBdHRyaWJ1dGU6ICdiZWZvcmVWYWxpZGF0ZUF0dHJpYnV0ZScsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhZnRlclZhbGlkYXRlQXR0cmlidXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBhZnRlciB2YWxpZGF0aW5nIHRoZSB3aG9sZSBmb3JtIGFuZCBlYWNoIGF0dHJpYnV0ZS5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQsIGF0dHJpYnV0ZSwgbWVzc2FnZXMpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIGF0dHJpYnV0ZTogdGhlIGF0dHJpYnV0ZSBiZWluZyB2YWxpZGF0ZWQuIFBsZWFzZSByZWZlciB0byBhdHRyaWJ1dGVEZWZhdWx0cyBmb3IgdGhlIHN0cnVjdHVyZSBvZiB0aGlzIHBhcmFtZXRlci5cbiAgICAgICAgICogIC0gbWVzc2FnZXM6IGFuIGFycmF5IHRvIHdoaWNoIHlvdSBjYW4gYWRkIGFkZGl0aW9uYWwgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlcyBmb3IgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUuXG4gICAgICAgICAqL1xuICAgICAgICBhZnRlclZhbGlkYXRlQXR0cmlidXRlOiAnYWZ0ZXJWYWxpZGF0ZUF0dHJpYnV0ZScsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBiZWZvcmVTdWJtaXQgZXZlbnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSBzdWJtaXR0aW5nIHRoZSBmb3JtIGFmdGVyIGFsbCB2YWxpZGF0aW9ucyBoYXZlIHBhc3NlZC5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQpXG4gICAgICAgICAqIHdoZXJlIGV2ZW50IGlzIGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIGhhbmRsZXIgcmV0dXJucyBhIGJvb2xlYW4gZmFsc2UsIGl0IHdpbGwgc3RvcCBmb3JtIHN1Ym1pc3Npb24uXG4gICAgICAgICAqL1xuICAgICAgICBiZWZvcmVTdWJtaXQ6ICdiZWZvcmVTdWJtaXQnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYWpheEJlZm9yZVNlbmQgZXZlbnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSBzZW5kaW5nIGFuIEFKQVggcmVxdWVzdCBmb3IgQUpBWC1iYXNlZCB2YWxpZGF0aW9uLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudCwganFYSFIsIHNldHRpbmdzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBqcVhIUjogYSBqcVhIUiBvYmplY3RcbiAgICAgICAgICogIC0gc2V0dGluZ3M6IHRoZSBzZXR0aW5ncyBmb3IgdGhlIEFKQVggcmVxdWVzdFxuICAgICAgICAgKi9cbiAgICAgICAgYWpheEJlZm9yZVNlbmQ6ICdhamF4QmVmb3JlU2VuZCcsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhamF4Q29tcGxldGUgZXZlbnQgaXMgdHJpZ2dlcmVkIGFmdGVyIGNvbXBsZXRpbmcgYW4gQUpBWCByZXF1ZXN0IGZvciBBSkFYLWJhc2VkIHZhbGlkYXRpb24uXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBqcVhIUiwgdGV4dFN0YXR1cylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0ganFYSFI6IGEganFYSFIgb2JqZWN0XG4gICAgICAgICAqICAtIHRleHRTdGF0dXM6IHRoZSBzdGF0dXMgb2YgdGhlIHJlcXVlc3QgKFwic3VjY2Vzc1wiLCBcIm5vdG1vZGlmaWVkXCIsIFwiZXJyb3JcIiwgXCJ0aW1lb3V0XCIsIFwiYWJvcnRcIiwgb3IgXCJwYXJzZXJlcnJvclwiKS5cbiAgICAgICAgICovXG4gICAgICAgIGFqYXhDb21wbGV0ZTogJ2FqYXhDb21wbGV0ZScsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhZnRlckluaXQgZXZlbnQgaXMgdHJpZ2dlcmVkIGFmdGVyIHlpaSBhY3RpdmVGb3JtIGluaXQuXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50KVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgYWZ0ZXJJbml0OiAnYWZ0ZXJJbml0J1xuICAgIH07XG5cbiAgICAvLyBOT1RFOiBJZiB5b3UgY2hhbmdlIGFueSBvZiB0aGVzZSBkZWZhdWx0cywgbWFrZSBzdXJlIHlvdSB1cGRhdGUgeWlpXFx3aWRnZXRzXFxBY3RpdmVGb3JtOjpnZXRDbGllbnRPcHRpb25zKCkgYXMgd2VsbFxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgLy8gd2hldGhlciB0byBlbmNvZGUgdGhlIGVycm9yIHN1bW1hcnlcbiAgICAgICAgZW5jb2RlRXJyb3JTdW1tYXJ5OiB0cnVlLFxuICAgICAgICAvLyB0aGUgalF1ZXJ5IHNlbGVjdG9yIGZvciB0aGUgZXJyb3Igc3VtbWFyeVxuICAgICAgICBlcnJvclN1bW1hcnk6ICcuZXJyb3Itc3VtbWFyeScsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gcGVyZm9ybSB2YWxpZGF0aW9uIGJlZm9yZSBzdWJtaXR0aW5nIHRoZSBmb3JtLlxuICAgICAgICB2YWxpZGF0ZU9uU3VibWl0OiB0cnVlLFxuICAgICAgICAvLyB0aGUgY29udGFpbmVyIENTUyBjbGFzcyByZXByZXNlbnRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgYXR0cmlidXRlIGhhcyB2YWxpZGF0aW9uIGVycm9yXG4gICAgICAgIGVycm9yQ3NzQ2xhc3M6ICdoYXMtZXJyb3InLFxuICAgICAgICAvLyB0aGUgY29udGFpbmVyIENTUyBjbGFzcyByZXByZXNlbnRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgYXR0cmlidXRlIHBhc3NlcyB2YWxpZGF0aW9uXG4gICAgICAgIHN1Y2Nlc3NDc3NDbGFzczogJ2hhcy1zdWNjZXNzJyxcbiAgICAgICAgLy8gdGhlIGNvbnRhaW5lciBDU1MgY2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZSBpcyBiZWluZyB2YWxpZGF0ZWRcbiAgICAgICAgdmFsaWRhdGluZ0Nzc0NsYXNzOiAndmFsaWRhdGluZycsXG4gICAgICAgIC8vIHRoZSBHRVQgcGFyYW1ldGVyIG5hbWUgaW5kaWNhdGluZyBhbiBBSkFYLWJhc2VkIHZhbGlkYXRpb25cbiAgICAgICAgYWpheFBhcmFtOiAnYWpheCcsXG4gICAgICAgIC8vIHRoZSB0eXBlIG9mIGRhdGEgdGhhdCB5b3UncmUgZXhwZWN0aW5nIGJhY2sgZnJvbSB0aGUgc2VydmVyXG4gICAgICAgIGFqYXhEYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAvLyB0aGUgVVJMIGZvciBwZXJmb3JtaW5nIEFKQVgtYmFzZWQgdmFsaWRhdGlvbi4gSWYgbm90IHNldCwgaXQgd2lsbCB1c2UgdGhlIHRoZSBmb3JtJ3MgYWN0aW9uXG4gICAgICAgIHZhbGlkYXRpb25Vcmw6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gd2hldGhlciB0byBzY3JvbGwgdG8gZmlyc3QgdmlzaWJsZSBlcnJvciBhZnRlciB2YWxpZGF0aW9uLlxuICAgICAgICBzY3JvbGxUb0Vycm9yOiB0cnVlLFxuICAgICAgICAvLyBvZmZzZXQgaW4gcGl4ZWxzIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHdoZW4gc2Nyb2xsaW5nIHRvIHRoZSBmaXJzdCBlcnJvci5cbiAgICAgICAgc2Nyb2xsVG9FcnJvck9mZnNldDogMFxuICAgIH07XG5cbiAgICAvLyBOT1RFOiBJZiB5b3UgY2hhbmdlIGFueSBvZiB0aGVzZSBkZWZhdWx0cywgbWFrZSBzdXJlIHlvdSB1cGRhdGUgeWlpXFx3aWRnZXRzXFxBY3RpdmVGaWVsZDo6Z2V0Q2xpZW50T3B0aW9ucygpIGFzIHdlbGxcbiAgICB2YXIgYXR0cmlidXRlRGVmYXVsdHMgPSB7XG4gICAgICAgIC8vIGEgdW5pcXVlIElEIGlkZW50aWZ5aW5nIGFuIGF0dHJpYnV0ZSAoZS5nLiBcImxvZ2luZm9ybS11c2VybmFtZVwiKSBpbiBhIGZvcm1cbiAgICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gYXR0cmlidXRlIG5hbWUgb3IgZXhwcmVzc2lvbiAoZS5nLiBcIlswXWNvbnRlbnRcIiBmb3IgdGFidWxhciBpbnB1dClcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAvLyB0aGUgalF1ZXJ5IHNlbGVjdG9yIG9mIHRoZSBjb250YWluZXIgb2YgdGhlIGlucHV0IGZpZWxkXG4gICAgICAgIGNvbnRhaW5lcjogdW5kZWZpbmVkLFxuICAgICAgICAvLyB0aGUgalF1ZXJ5IHNlbGVjdG9yIG9mIHRoZSBpbnB1dCBmaWVsZCB1bmRlciB0aGUgY29udGV4dCBvZiB0aGUgZm9ybVxuICAgICAgICBpbnB1dDogdW5kZWZpbmVkLFxuICAgICAgICAvLyB0aGUgalF1ZXJ5IHNlbGVjdG9yIG9mIHRoZSBlcnJvciB0YWcgdW5kZXIgdGhlIGNvbnRleHQgb2YgdGhlIGNvbnRhaW5lclxuICAgICAgICBlcnJvcjogJy5oZWxwLWJsb2NrJyxcbiAgICAgICAgLy8gd2hldGhlciB0byBlbmNvZGUgdGhlIGVycm9yXG4gICAgICAgIGVuY29kZUVycm9yOiB0cnVlLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiB3aGVuIGEgY2hhbmdlIGlzIGRldGVjdGVkIG9uIHRoZSBpbnB1dFxuICAgICAgICB2YWxpZGF0ZU9uQ2hhbmdlOiB0cnVlLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiB3aGVuIHRoZSBpbnB1dCBsb3NlcyBmb2N1c1xuICAgICAgICB2YWxpZGF0ZU9uQmx1cjogdHJ1ZSxcbiAgICAgICAgLy8gd2hldGhlciB0byBwZXJmb3JtIHZhbGlkYXRpb24gd2hlbiB0aGUgdXNlciBpcyB0eXBpbmcuXG4gICAgICAgIHZhbGlkYXRlT25UeXBlOiBmYWxzZSxcbiAgICAgICAgLy8gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IHRoZSB2YWxpZGF0aW9uIHNob3VsZCBiZSBkZWxheWVkIHdoZW4gYSB1c2VyIGlzIHR5cGluZyBpbiB0aGUgaW5wdXQgZmllbGQuXG4gICAgICAgIHZhbGlkYXRpb25EZWxheTogNTAwLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIGVuYWJsZSBBSkFYLWJhc2VkIHZhbGlkYXRpb24uXG4gICAgICAgIGVuYWJsZUFqYXhWYWxpZGF0aW9uOiBmYWxzZSxcbiAgICAgICAgLy8gZnVuY3Rpb24gKGF0dHJpYnV0ZSwgdmFsdWUsIG1lc3NhZ2VzLCBkZWZlcnJlZCwgJGZvcm0pLCB0aGUgY2xpZW50LXNpZGUgdmFsaWRhdGlvbiBmdW5jdGlvbi5cbiAgICAgICAgdmFsaWRhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gc3RhdHVzIG9mIHRoZSBpbnB1dCBmaWVsZCwgMDogZW1wdHksIG5vdCBlbnRlcmVkIGJlZm9yZSwgMTogdmFsaWRhdGVkLCAyOiBwZW5kaW5nIHZhbGlkYXRpb24sIDM6IHZhbGlkYXRpbmdcbiAgICAgICAgc3RhdHVzOiAwLFxuICAgICAgICAvLyB3aGV0aGVyIHRoZSB2YWxpZGF0aW9uIGlzIGNhbmNlbGxlZCBieSBiZWZvcmVWYWxpZGF0ZUF0dHJpYnV0ZSBldmVudCBoYW5kbGVyXG4gICAgICAgIGNhbmNlbGxlZDogZmFsc2UsXG4gICAgICAgIC8vIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXRcbiAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gd2hldGhlciB0byB1cGRhdGUgYXJpYS1pbnZhbGlkIGF0dHJpYnV0ZSBhZnRlciB2YWxpZGF0aW9uXG4gICAgICAgIHVwZGF0ZUFyaWFJbnZhbGlkOiB0cnVlXG4gICAgfTtcblxuXG4gICAgdmFyIHN1Ym1pdERlZmVyO1xuXG4gICAgdmFyIHNldFN1Ym1pdEZpbmFsaXplRGVmZXIgPSBmdW5jdGlvbigkZm9ybSkge1xuICAgICAgICBzdWJtaXREZWZlciA9ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgJGZvcm0uZGF0YSgneWlpU3VibWl0RmluYWxpemVQcm9taXNlJywgc3VibWl0RGVmZXIucHJvbWlzZSgpKTtcbiAgICB9O1xuXG4gICAgLy8gZmluYWxpemUgeWlpLmpzICRmb3JtLnN1Ym1pdFxuICAgIHZhciBzdWJtaXRGaW5hbGl6ZSA9IGZ1bmN0aW9uKCRmb3JtKSB7XG4gICAgICAgIGlmKHN1Ym1pdERlZmVyKSB7XG4gICAgICAgICAgICBzdWJtaXREZWZlci5yZXNvbHZlKCk7XG4gICAgICAgICAgICBzdWJtaXREZWZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICRmb3JtLnJlbW92ZURhdGEoJ3lpaVN1Ym1pdEZpbmFsaXplUHJvbWlzZScpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgdmFyIG1ldGhvZHMgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIChhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIGlmICgkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZhbGlkYXRpb25VcmwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy52YWxpZGF0aW9uVXJsID0gJGZvcm0uYXR0cignYWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJC5lYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNbaV0gPSAkLmV4dGVuZCh7dmFsdWU6IGdldFZhbHVlKCRmb3JtLCB0aGlzKX0sIGF0dHJpYnV0ZURlZmF1bHRzLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgd2F0Y2hBdHRyaWJ1dGUoJGZvcm0sIGF0dHJpYnV0ZXNbaV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScsIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHNldHRpbmdzLFxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgICAgICBzdWJtaXR0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogZ2V0Rm9ybU9wdGlvbnMoJGZvcm0pXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBDbGVhbiB1cCBlcnJvciBzdGF0dXMgd2hlbiB0aGUgZm9ybSBpcyByZXNldC5cbiAgICAgICAgICAgICAgICAgKiBOb3RlIHRoYXQgJGZvcm0ub24oJ3Jlc2V0JywgLi4uKSBkb2VzIHdvcmsgYmVjYXVzZSB0aGUgXCJyZXNldFwiIGV2ZW50IGRvZXMgbm90IGJ1YmJsZSBvbiBJRS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAkZm9ybS5iaW5kKCdyZXNldC55aWlBY3RpdmVGb3JtJywgbWV0aG9kcy5yZXNldEZvcm0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZhbGlkYXRlT25TdWJtaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0ub24oJ21vdXNldXAueWlpQWN0aXZlRm9ybSBrZXl1cC55aWlBY3RpdmVGb3JtJywgJzpzdWJtaXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuc3VibWl0T2JqZWN0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQueWlpQWN0aXZlRm9ybScsIG1ldGhvZHMuc3VibWl0Rm9ybSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmFmdGVySW5pdCk7XG4gICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBhZGQgYSBuZXcgYXR0cmlidXRlIHRvIHRoZSBmb3JtIGR5bmFtaWNhbGx5LlxuICAgICAgICAvLyBwbGVhc2UgcmVmZXIgdG8gYXR0cmlidXRlRGVmYXVsdHMgZm9yIHRoZSBzdHJ1Y3R1cmUgb2YgYXR0cmlidXRlXG4gICAgICAgIGFkZDogZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGF0dHJpYnV0ZSA9ICQuZXh0ZW5kKHt2YWx1ZTogZ2V0VmFsdWUoJGZvcm0sIGF0dHJpYnV0ZSl9LCBhdHRyaWJ1dGVEZWZhdWx0cywgYXR0cmlidXRlKTtcbiAgICAgICAgICAgICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgICAgIHdhdGNoQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHJlbW92ZSB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBJRCBmcm9tIHRoZSBmb3JtXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzW2ldWydpZCddID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlID0gYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgdW53YXRjaEF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gbWFudWFsbHkgdHJpZ2dlciB0aGUgdmFsaWRhdGlvbiBvZiB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBJRFxuICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gbWV0aG9kcy5maW5kLmNhbGwodGhpcywgaWQpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZSgkKHRoaXMpLCBhdHRyaWJ1dGUsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGZpbmQgYW4gYXR0cmlidXRlIGNvbmZpZyBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZSBJRFxuICAgICAgICBmaW5kOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gJCh0aGlzKS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAkLmVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1tpXVsnaWQnXSA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBhdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykudW5iaW5kKCcueWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlRGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHZhbGlkYXRlIGFsbCBhcHBsaWNhYmxlIGlucHV0cyBpbiB0aGUgZm9ybVxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKGZvcmNlVmFsaWRhdGUpIHtcbiAgICAgICAgICAgIGlmIChmb3JjZVZhbGlkYXRlKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuc3VibWl0dGluZyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKSxcbiAgICAgICAgICAgICAgICBuZWVkQWpheFZhbGlkYXRpb24gPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlcyA9IHt9LFxuICAgICAgICAgICAgICAgIGRlZmVycmVkcyA9IGRlZmVycmVkQXJyYXkoKSxcbiAgICAgICAgICAgICAgICBzdWJtaXR0aW5nID0gZGF0YS5zdWJtaXR0aW5nICYmICFmb3JjZVZhbGlkYXRlO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS5zdWJtaXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gJC5FdmVudChldmVudHMuYmVmb3JlVmFsaWRhdGUpO1xuICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnQsIFttZXNzYWdlcywgZGVmZXJyZWRzXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQucmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnN1Ym1pdHRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjbGllbnQtc2lkZSB2YWxpZGF0aW9uXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZm9ybSA9ICRmb3JtO1xuICAgICAgICAgICAgICAgIGlmICghJCh0aGlzLmlucHV0KS5pcyhcIjpkaXNhYmxlZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAvLyBwZXJmb3JtIHZhbGlkYXRpb24gb25seSBpZiB0aGUgZm9ybSBpcyBiZWluZyBzdWJtaXR0ZWQgb3IgaWYgYW4gYXR0cmlidXRlIGlzIHBlbmRpbmcgdmFsaWRhdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWJtaXR0aW5nIHx8IHRoaXMuc3RhdHVzID09PSAyIHx8IHRoaXMuc3RhdHVzID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXNnID0gbWVzc2FnZXNbdGhpcy5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobXNnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2cgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlc1t0aGlzLmlkXSA9IG1zZztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmJlZm9yZVZhbGlkYXRlQXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnQsIFt0aGlzLCBtc2csIGRlZmVycmVkc10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnJlc3VsdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YWxpZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlKHRoaXMsIGdldFZhbHVlKCRmb3JtLCB0aGlzKSwgbXNnLCBkZWZlcnJlZHMsICRmb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZW5hYmxlQWpheFZhbGlkYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmVlZEFqYXhWYWxpZGF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBhamF4IHZhbGlkYXRpb25cbiAgICAgICAgICAgICQud2hlbi5hcHBseSh0aGlzLCBkZWZlcnJlZHMpLmFsd2F5cyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgZW1wdHkgbWVzc2FnZSBhcnJheXNcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgwID09PSBtZXNzYWdlc1tpXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXNzYWdlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmVlZEFqYXhWYWxpZGF0aW9uICYmICgkLmlzRW1wdHlPYmplY3QobWVzc2FnZXMpIHx8IGRhdGEuc3VibWl0dGluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRidXR0b24gPSBkYXRhLnN1Ym1pdE9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dERhdGEgPSAnJicgKyBkYXRhLnNldHRpbmdzLmFqYXhQYXJhbSArICc9JyArICRmb3JtLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkYnV0dG9uICYmICRidXR0b24ubGVuZ3RoICYmICRidXR0b24uYXR0cignbmFtZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHREYXRhICs9ICcmJyArICRidXR0b24uYXR0cignbmFtZScpICsgJz0nICsgJGJ1dHRvbi5hdHRyKCd2YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGRhdGEuc2V0dGluZ3MudmFsaWRhdGlvblVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICRmb3JtLmF0dHIoJ21ldGhvZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJGZvcm0uc2VyaWFsaXplKCkgKyBleHREYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IGRhdGEuc2V0dGluZ3MuYWpheERhdGFUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnRzLmFqYXhDb21wbGV0ZSwgW2pxWEhSLCB0ZXh0U3RhdHVzXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKGpxWEhSLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnRzLmFqYXhCZWZvcmVTZW5kLCBbanFYSFIsIHNldHRpbmdzXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKG1zZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobXNncyAhPT0gbnVsbCAmJiB0eXBlb2YgbXNncyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmVuYWJsZUFqYXhWYWxpZGF0aW9uIHx8IHRoaXMuY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG1zZ3NbdGhpcy5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVJbnB1dHMoJGZvcm0sICQuZXh0ZW5kKG1lc3NhZ2VzLCBtc2dzKSwgc3VibWl0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5wdXRzKCRmb3JtLCBtZXNzYWdlcywgc3VibWl0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuc3VibWl0dGluZykge1xuICAgICAgICAgICAgICAgICAgICAvLyBkZWxheSBjYWxsYmFjayBzbyB0aGF0IHRoZSBmb3JtIGNhbiBiZSBzdWJtaXR0ZWQgd2l0aG91dCBwcm9ibGVtXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5wdXRzKCRmb3JtLCBtZXNzYWdlcywgc3VibWl0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5wdXRzKCRmb3JtLCBtZXNzYWdlcywgc3VibWl0dGluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3VibWl0Rm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBTZWNvbmQgc3VibWl0J3MgY2FsbCAoZnJvbSB2YWxpZGF0ZS91cGRhdGVJbnB1dHMpXG4gICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gJC5FdmVudChldmVudHMuYmVmb3JlU3VibWl0KTtcbiAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQucmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbGlkYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdWJtaXRGaW5hbGl6ZSgkZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdXBkYXRlSGlkZGVuQnV0dG9uKCRmb3JtKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgICAvLyBjb250aW51ZSBzdWJtaXR0aW5nIHRoZSBmb3JtIHNpbmNlIHZhbGlkYXRpb24gcGFzc2VzXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEZpcnN0IHN1Ym1pdCdzIGNhbGwgKGZyb20geWlpLmpzL2hhbmRsZUFjdGlvbikgLSBleGVjdXRlIHZhbGlkYXRpbmdcbiAgICAgICAgICAgICAgICBzZXRTdWJtaXRGaW5hbGl6ZURlZmVyKCRmb3JtKTtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLnNldHRpbmdzLnRpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGRhdGEuc2V0dGluZ3MudGltZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkYXRhLnN1Ym1pdHRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG1ldGhvZHMudmFsaWRhdGUuY2FsbCgkZm9ybSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2V0Rm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgLy8gQmVjYXVzZSB3ZSBiaW5kIGRpcmVjdGx5IHRvIGEgZm9ybSByZXNldCBldmVudCBpbnN0ZWFkIG9mIGEgcmVzZXQgYnV0dG9uICh0aGF0IG1heSBub3QgZXhpc3QpLFxuICAgICAgICAgICAgLy8gd2hlbiB0aGlzIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGZvcm0gaW5wdXQgdmFsdWVzIGhhdmUgbm90IGJlZW4gcmVzZXQgeWV0LlxuICAgICAgICAgICAgLy8gVGhlcmVmb3JlIHdlIGRvIHRoZSBhY3R1YWwgcmVzZXQgd29yayB0aHJvdWdoIHNldFRpbWVvdXQuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdpdGhvdXQgc2V0VGltZW91dCgpIHdlIHdvdWxkIGdldCB0aGUgaW5wdXQgdmFsdWVzIHRoYXQgYXJlIG5vdCByZXNldCB5ZXQuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBnZXRWYWx1ZSgkZm9ybSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRjb250YWluZXIgPSAkZm9ybS5maW5kKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5yZW1vdmVDbGFzcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc2V0dGluZ3MudmFsaWRhdGluZ0Nzc0NsYXNzICsgJyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnNldHRpbmdzLmVycm9yQ3NzQ2xhc3MgKyAnICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc2V0dGluZ3Muc3VjY2Vzc0Nzc0NsYXNzXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZCh0aGlzLmVycm9yKS5odG1sKCcnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkZm9ybS5maW5kKGRhdGEuc2V0dGluZ3MuZXJyb3JTdW1tYXJ5KS5oaWRlKCkuZmluZCgndWwnKS5odG1sKCcnKTtcbiAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIGVycm9yIG1lc3NhZ2VzLCBpbnB1dCBjb250YWluZXJzLCBhbmQgb3B0aW9uYWxseSBzdW1tYXJ5IGFzIHdlbGwuXG4gICAgICAgICAqIElmIGFuIGF0dHJpYnV0ZSBpcyBtaXNzaW5nIGZyb20gbWVzc2FnZXMsIGl0IGlzIGNvbnNpZGVyZWQgdmFsaWQuXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlcyBhcnJheSB0aGUgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlcywgaW5kZXhlZCBieSBhdHRyaWJ1dGUgSURzXG4gICAgICAgICAqIEBwYXJhbSBzdW1tYXJ5IHdoZXRoZXIgdG8gdXBkYXRlIHN1bW1hcnkgYXMgd2VsbC5cbiAgICAgICAgICovXG4gICAgICAgIHVwZGF0ZU1lc3NhZ2VzOiBmdW5jdGlvbiAobWVzc2FnZXMsIHN1bW1hcnkpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVJbnB1dCgkZm9ybSwgdGhpcywgbWVzc2FnZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoc3VtbWFyeSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVN1bW1hcnkoJGZvcm0sIG1lc3NhZ2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyBlcnJvciBtZXNzYWdlcyBhbmQgaW5wdXQgY29udGFpbmVyIG9mIGEgc2luZ2xlIGF0dHJpYnV0ZS5cbiAgICAgICAgICogSWYgbWVzc2FnZXMgaXMgZW1wdHksIHRoZSBhdHRyaWJ1dGUgaXMgY29uc2lkZXJlZCB2YWxpZC5cbiAgICAgICAgICogQHBhcmFtIGlkIGF0dHJpYnV0ZSBJRFxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZXMgYXJyYXkgd2l0aCBlcnJvciBtZXNzYWdlc1xuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlQXR0cmlidXRlOiBmdW5jdGlvbihpZCwgbWVzc2FnZXMpIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBtZXRob2RzLmZpbmQuY2FsbCh0aGlzLCBpZCk7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciBtc2cgPSB7fTtcbiAgICAgICAgICAgICAgICBtc2dbaWRdID0gbWVzc2FnZXM7XG4gICAgICAgICAgICAgICAgdXBkYXRlSW5wdXQoJCh0aGlzKSwgYXR0cmlidXRlLCBtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgdmFyIHdhdGNoQXR0cmlidXRlID0gZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUpIHtcbiAgICAgICAgdmFyICRpbnB1dCA9IGZpbmRJbnB1dCgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWxpZGF0ZU9uQ2hhbmdlKSB7XG4gICAgICAgICAgICAkaW5wdXQub24oJ2NoYW5nZS55aWlBY3RpdmVGb3JtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGUudmFsaWRhdGVPbkJsdXIpIHtcbiAgICAgICAgICAgICRpbnB1dC5vbignYmx1ci55aWlBY3RpdmVGb3JtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuc3RhdHVzID09IDAgfHwgYXR0cmlidXRlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGUudmFsaWRhdGVPblR5cGUpIHtcbiAgICAgICAgICAgICRpbnB1dC5vbigna2V5dXAueWlpQWN0aXZlRm9ybScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShlLndoaWNoLCBbMTYsIDE3LCAxOCwgMzcsIDM4LCAzOSwgNDBdKSAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSAhPT0gZ2V0VmFsdWUoJGZvcm0sIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVBdHRyaWJ1dGUoJGZvcm0sIGF0dHJpYnV0ZSwgZmFsc2UsIGF0dHJpYnV0ZS52YWxpZGF0aW9uRGVsYXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciB1bndhdGNoQXR0cmlidXRlID0gZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUpIHtcbiAgICAgICAgZmluZElucHV0KCRmb3JtLCBhdHRyaWJ1dGUpLm9mZignLnlpaUFjdGl2ZUZvcm0nKTtcbiAgICB9O1xuXG4gICAgdmFyIHZhbGlkYXRlQXR0cmlidXRlID0gZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUsIGZvcmNlVmFsaWRhdGUsIHZhbGlkYXRpb25EZWxheSkge1xuICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcblxuICAgICAgICBpZiAoZm9yY2VWYWxpZGF0ZSkge1xuICAgICAgICAgICAgYXR0cmlidXRlLnN0YXR1cyA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgIT09IGdldFZhbHVlKCRmb3JtLCB0aGlzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gMjtcbiAgICAgICAgICAgICAgICBmb3JjZVZhbGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghZm9yY2VWYWxpZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3MudGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGRhdGEuc2V0dGluZ3MudGltZXIpO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEuc2V0dGluZ3MudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLnN1Ym1pdHRpbmcgfHwgJGZvcm0uaXMoJzpoaWRkZW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAzO1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5maW5kKHRoaXMuY29udGFpbmVyKS5hZGRDbGFzcyhkYXRhLnNldHRpbmdzLnZhbGlkYXRpbmdDc3NDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtZXRob2RzLnZhbGlkYXRlLmNhbGwoJGZvcm0pO1xuICAgICAgICB9LCB2YWxpZGF0aW9uRGVsYXkgPyB2YWxpZGF0aW9uRGVsYXkgOiAyMDApO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHByb3RvdHlwZSB3aXRoIGEgc2hvcnRjdXQgbWV0aG9kIGZvciBhZGRpbmcgYSBuZXcgZGVmZXJyZWQuXG4gICAgICogVGhlIGNvbnRleHQgb2YgdGhlIGNhbGxiYWNrIHdpbGwgYmUgdGhlIGRlZmVycmVkIG9iamVjdCBzbyBpdCBjYW4gYmUgcmVzb2x2ZWQgbGlrZSBgYGB0aGlzLnJlc29sdmUoKWBgYFxuICAgICAqIEByZXR1cm5zIEFycmF5XG4gICAgICovXG4gICAgdmFyIGRlZmVycmVkQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICBhcnJheS5hZGQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5wdXNoKG5ldyAkLkRlZmVycmVkKGNhbGxiYWNrKSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9O1xuXG4gICAgdmFyIGJ1dHRvbk9wdGlvbnMgPSBbJ2FjdGlvbicsICd0YXJnZXQnLCAnbWV0aG9kJywgJ2VuY3R5cGUnXTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgY3VycmVudCBmb3JtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gJGZvcm1cbiAgICAgKiBAcmV0dXJucyBvYmplY3QgT2JqZWN0IHdpdGggYnV0dG9uIG9mIGZvcm0gb3B0aW9uc1xuICAgICAqL1xuICAgIHZhciBnZXRGb3JtT3B0aW9ucyA9IGZ1bmN0aW9uICgkZm9ybSkge1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1dHRvbk9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXNbYnV0dG9uT3B0aW9uc1tpXV0gPSAkZm9ybS5hdHRyKGJ1dHRvbk9wdGlvbnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIHRlbXBvcmFyeSBmb3JtIG9wdGlvbnMgcmVsYXRlZCB0byBzdWJtaXQgYnV0dG9uXG4gICAgICogQHBhcmFtICRmb3JtIHRoZSBmb3JtIGpRdWVyeSBvYmplY3RcbiAgICAgKiBAcGFyYW0gJGJ1dHRvbiB0aGUgYnV0dG9uIGpRdWVyeSBvYmplY3RcbiAgICAgKi9cbiAgICB2YXIgYXBwbHlCdXR0b25PcHRpb25zID0gZnVuY3Rpb24gKCRmb3JtLCAkYnV0dG9uKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnV0dG9uT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gJGJ1dHRvbi5hdHRyKCdmb3JtJyArIGJ1dHRvbk9wdGlvbnNbaV0pO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgJGZvcm0uYXR0cihidXR0b25PcHRpb25zW2ldLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzdG9yZXMgb3JpZ2luYWwgZm9ybSBvcHRpb25zXG4gICAgICogQHBhcmFtICRmb3JtIHRoZSBmb3JtIGpRdWVyeSBvYmplY3RcbiAgICAgKi9cbiAgICB2YXIgcmVzdG9yZUJ1dHRvbk9wdGlvbnMgPSBmdW5jdGlvbiAoJGZvcm0pIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidXR0b25PcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkZm9ybS5hdHRyKGJ1dHRvbk9wdGlvbnNbaV0sIGRhdGEub3B0aW9uc1tidXR0b25PcHRpb25zW2ldXSB8fCBudWxsKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBlcnJvciBtZXNzYWdlcyBhbmQgdGhlIGlucHV0IGNvbnRhaW5lcnMgZm9yIGFsbCBhcHBsaWNhYmxlIGF0dHJpYnV0ZXNcbiAgICAgKiBAcGFyYW0gJGZvcm0gdGhlIGZvcm0galF1ZXJ5IG9iamVjdFxuICAgICAqIEBwYXJhbSBtZXNzYWdlcyBhcnJheSB0aGUgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlc1xuICAgICAqIEBwYXJhbSBzdWJtaXR0aW5nIHdoZXRoZXIgdGhpcyBtZXRob2QgaXMgY2FsbGVkIGFmdGVyIHZhbGlkYXRpb24gdHJpZ2dlcmVkIGJ5IGZvcm0gc3VibWlzc2lvblxuICAgICAqL1xuICAgIHZhciB1cGRhdGVJbnB1dHMgPSBmdW5jdGlvbiAoJGZvcm0sIG1lc3NhZ2VzLCBzdWJtaXR0aW5nKSB7XG4gICAgICAgIHZhciBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuXG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdWJtaXR0aW5nKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JBdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMuaW5wdXQpLmlzKFwiOmRpc2FibGVkXCIpICYmICF0aGlzLmNhbmNlbGxlZCAmJiB1cGRhdGVJbnB1dCgkZm9ybSwgdGhpcywgbWVzc2FnZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yQXR0cmlidXRlcy5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hZnRlclZhbGlkYXRlLCBbbWVzc2FnZXMsIGVycm9yQXR0cmlidXRlc10pO1xuXG4gICAgICAgICAgICB1cGRhdGVTdW1tYXJ5KCRmb3JtLCBtZXNzYWdlcyk7XG5cbiAgICAgICAgICAgIGlmIChlcnJvckF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3Muc2Nyb2xsVG9FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9wID0gJGZvcm0uZmluZCgkLm1hcChlcnJvckF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZS5pbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgfSkuam9pbignLCcpKS5maXJzdCgpLmNsb3Nlc3QoJzp2aXNpYmxlJykub2Zmc2V0KCkudG9wIC0gZGF0YS5zZXR0aW5ncy5zY3JvbGxUb0Vycm9yT2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9wIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0b3AgPiAkKGRvY3VtZW50KS5oZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wID0gJChkb2N1bWVudCkuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHd0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3AgPCB3dG9wIHx8IHRvcCA+IHd0b3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQod2luZG93KS5zY3JvbGxUb3AodG9wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkYXRhLnN1Ym1pdHRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YS52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Ym1pdE9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBhcHBseUJ1dHRvbk9wdGlvbnMoJGZvcm0sIGRhdGEuc3VibWl0T2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGZvcm0uc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VibWl0T2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3RvcmVCdXR0b25PcHRpb25zKCRmb3JtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNhbmNlbGxlZCAmJiAodGhpcy5zdGF0dXMgPT09IDIgfHwgdGhpcy5zdGF0dXMgPT09IDMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0KCRmb3JtLCB0aGlzLCBtZXNzYWdlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIGhpZGRlbiBmaWVsZCB0aGF0IHJlcHJlc2VudHMgY2xpY2tlZCBzdWJtaXQgYnV0dG9uLlxuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0LlxuICAgICAqL1xuICAgIHZhciB1cGRhdGVIaWRkZW5CdXR0b24gPSBmdW5jdGlvbiAoJGZvcm0pIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgIHZhciAkYnV0dG9uID0gZGF0YS5zdWJtaXRPYmplY3QgfHwgJGZvcm0uZmluZCgnOnN1Ym1pdDpmaXJzdCcpO1xuICAgICAgICAvLyBUT0RPOiBpZiB0aGUgc3VibWlzc2lvbiBpcyBjYXVzZWQgYnkgXCJjaGFuZ2VcIiBldmVudCwgaXQgd2lsbCBub3Qgd29ya1xuICAgICAgICBpZiAoJGJ1dHRvbi5sZW5ndGggJiYgJGJ1dHRvbi5hdHRyKCd0eXBlJykgPT0gJ3N1Ym1pdCcgJiYgJGJ1dHRvbi5hdHRyKCduYW1lJykpIHtcbiAgICAgICAgICAgIC8vIHNpbXVsYXRlIGJ1dHRvbiBpbnB1dCB2YWx1ZVxuICAgICAgICAgICAgdmFyICRoaWRkZW5CdXR0b24gPSAkKCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdW25hbWU9XCInICsgJGJ1dHRvbi5hdHRyKCduYW1lJykgKyAnXCJdJywgJGZvcm0pO1xuICAgICAgICAgICAgaWYgKCEkaGlkZGVuQnV0dG9uLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQoJzxpbnB1dD4nKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICRidXR0b24uYXR0cignbmFtZScpLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJGJ1dHRvbi5hdHRyKCd2YWx1ZScpXG4gICAgICAgICAgICAgICAgfSkuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkaGlkZGVuQnV0dG9uLmF0dHIoJ3ZhbHVlJywgJGJ1dHRvbi5hdHRyKCd2YWx1ZScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBlcnJvciBtZXNzYWdlIGFuZCB0aGUgaW5wdXQgY29udGFpbmVyIGZvciBhIHBhcnRpY3VsYXIgYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0XG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZSBvYmplY3QgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIGEgcGFydGljdWxhciBhdHRyaWJ1dGUuXG4gICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHRoZSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzXG4gICAgICogQHJldHVybiBib29sZWFuIHdoZXRoZXIgdGhlcmUgaXMgYSB2YWxpZGF0aW9uIGVycm9yIGZvciB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZVxuICAgICAqL1xuICAgIHZhciB1cGRhdGVJbnB1dCA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlLCBtZXNzYWdlcykge1xuICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKSxcbiAgICAgICAgICAgICRpbnB1dCA9IGZpbmRJbnB1dCgkZm9ybSwgYXR0cmlidXRlKSxcbiAgICAgICAgICAgIGhhc0Vycm9yID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKCEkLmlzQXJyYXkobWVzc2FnZXNbYXR0cmlidXRlLmlkXSkpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hZnRlclZhbGlkYXRlQXR0cmlidXRlLCBbYXR0cmlidXRlLCBtZXNzYWdlc1thdHRyaWJ1dGUuaWRdXSk7XG5cbiAgICAgICAgYXR0cmlidXRlLnN0YXR1cyA9IDE7XG4gICAgICAgIGlmICgkaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICBoYXNFcnJvciA9IG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF0ubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJGZvcm0uZmluZChhdHRyaWJ1dGUuY29udGFpbmVyKTtcbiAgICAgICAgICAgIHZhciAkZXJyb3IgPSAkY29udGFpbmVyLmZpbmQoYXR0cmlidXRlLmVycm9yKTtcbiAgICAgICAgICAgIHVwZGF0ZUFyaWFJbnZhbGlkKCRmb3JtLCBhdHRyaWJ1dGUsIGhhc0Vycm9yKTtcbiAgICAgICAgICAgIGlmIChoYXNFcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZW5jb2RlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVycm9yLnRleHQobWVzc2FnZXNbYXR0cmlidXRlLmlkXVswXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGVycm9yLmh0bWwobWVzc2FnZXNbYXR0cmlidXRlLmlkXVswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MgKyAnICcgKyBkYXRhLnNldHRpbmdzLnN1Y2Nlc3NDc3NDbGFzcylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKGRhdGEuc2V0dGluZ3MuZXJyb3JDc3NDbGFzcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlcnJvci5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MgKyAnICcgKyBkYXRhLnNldHRpbmdzLmVycm9yQ3NzQ2xhc3MgKyAnICcpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhkYXRhLnNldHRpbmdzLnN1Y2Nlc3NDc3NDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdHRyaWJ1dGUudmFsdWUgPSBnZXRWYWx1ZSgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzRXJyb3I7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIGVycm9yIHN1bW1hcnkuXG4gICAgICogQHBhcmFtICRmb3JtIHRoZSBmb3JtIGpRdWVyeSBvYmplY3RcbiAgICAgKiBAcGFyYW0gbWVzc2FnZXMgYXJyYXkgdGhlIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXNcbiAgICAgKi9cbiAgICB2YXIgdXBkYXRlU3VtbWFyeSA9IGZ1bmN0aW9uICgkZm9ybSwgbWVzc2FnZXMpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyksXG4gICAgICAgICAgICAkc3VtbWFyeSA9ICRmb3JtLmZpbmQoZGF0YS5zZXR0aW5ncy5lcnJvclN1bW1hcnkpLFxuICAgICAgICAgICAgJHVsID0gJHN1bW1hcnkuZmluZCgndWwnKS5lbXB0eSgpO1xuXG4gICAgICAgIGlmICgkc3VtbWFyeS5sZW5ndGggJiYgbWVzc2FnZXMpIHtcbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc0FycmF5KG1lc3NhZ2VzW3RoaXMuaWRdKSAmJiBtZXNzYWdlc1t0aGlzLmlkXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gJCgnPGxpLz4nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3MuZW5jb2RlRXJyb3JTdW1tYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvci50ZXh0KG1lc3NhZ2VzW3RoaXMuaWRdWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yLmh0bWwobWVzc2FnZXNbdGhpcy5pZF1bMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICR1bC5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN1bW1hcnkudG9nZ2xlKCR1bC5maW5kKCdsaScpLmxlbmd0aCA+IDApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBnZXRWYWx1ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlKSB7XG4gICAgICAgIHZhciAkaW5wdXQgPSBmaW5kSW5wdXQoJGZvcm0sIGF0dHJpYnV0ZSk7XG4gICAgICAgIHZhciB0eXBlID0gJGlucHV0LmF0dHIoJ3R5cGUnKTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdjaGVja2JveCcgfHwgdHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgdmFyICRyZWFsSW5wdXQgPSAkaW5wdXQuZmlsdGVyKCc6Y2hlY2tlZCcpO1xuICAgICAgICAgICAgaWYgKCEkcmVhbElucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRyZWFsSW5wdXQgPSAkZm9ybS5maW5kKCdpbnB1dFt0eXBlPWhpZGRlbl1bbmFtZT1cIicgKyAkaW5wdXQuYXR0cignbmFtZScpICsgJ1wiXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICRyZWFsSW5wdXQudmFsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0LnZhbCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBmaW5kSW5wdXQgPSBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSkge1xuICAgICAgICB2YXIgJGlucHV0ID0gJGZvcm0uZmluZChhdHRyaWJ1dGUuaW5wdXQpO1xuICAgICAgICBpZiAoJGlucHV0Lmxlbmd0aCAmJiAkaW5wdXRbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZGl2Jykge1xuICAgICAgICAgICAgLy8gY2hlY2tib3ggbGlzdCBvciByYWRpbyBsaXN0XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0LmZpbmQoJ2lucHV0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciB1cGRhdGVBcmlhSW52YWxpZCA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlLCBoYXNFcnJvcikge1xuICAgICAgICBpZiAoYXR0cmlidXRlLnVwZGF0ZUFyaWFJbnZhbGlkKSB7XG4gICAgICAgICAgICAkZm9ybS5maW5kKGF0dHJpYnV0ZS5pbnB1dCkuYXR0cignYXJpYS1pbnZhbGlkJywgaGFzRXJyb3IgPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgICAgICAgfVxuICAgIH1cbn0pKHdpbmRvdy5qUXVlcnkpO1xuIiwiLy9nZXQgdGhlIGNsaWNrIGV2ZW50IGZvciB0aGUgdmlldyBwdWJsaXNoZXIgYWdlbnRzXG4kKFwiLnZpZXdQcm9maWxlSW5mb1wiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAkKCcjbW9kYWwtcHJvZmlsZScpLm1vZGFsKCdzaG93JylcbiAgICAgICAgICAgIC5maW5kKCcjbW9kYWxQcm9maWxlQ29udGVudCcpXG4gICAgICAgICAgICAvLy5sb2FkKCQodGhpcykuYXR0cigndmFsdWUnKSArICc/aWQ9JyArICQoJyNib29rLXJpZ2h0c19vd25lcl9pZCcpLnZhbCgpKTtcbiAgICAgICAgICAgIC5sb2FkKCQodGhpcykuYXR0cigndmFsdWUnKSk7XG59KTtcblxuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IE1pa2UgS2luZyAoQG1pY2phbWtpbmcpXG4gKlxuICogalF1ZXJ5IFN1Y2NpbmN0IHBsdWdpblxuICogVmVyc2lvbiAxLjEuMCAoT2N0b2JlciAyMDE0KVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxuICovXG5cbiAvKmdsb2JhbCBqUXVlcnkqL1xuKGZ1bmN0aW9uKCQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdCQuZm4uc3VjY2luY3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cblx0XHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7XG5cdFx0XHRcdHNpemU6IDI0MCxcblx0XHRcdFx0b21pc3Npb246ICcuLi4nLFxuXHRcdFx0XHRpZ25vcmU6IHRydWVcblx0XHRcdH0sIG9wdGlvbnMpO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIHRleHREZWZhdWx0LFxuXHRcdFx0XHR0ZXh0VHJ1bmNhdGVkLFxuXHRcdFx0XHRlbGVtZW50cyA9ICQodGhpcyksXG5cdFx0XHRcdHJlZ2V4ICAgID0gL1shLVxcLzotQFxcWy1gey1+XSQvLFxuXHRcdFx0XHRpbml0ICAgICA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0ZXh0RGVmYXVsdCA9ICQodGhpcykuaHRtbCgpO1xuXG5cdFx0XHRcdFx0XHRpZiAodGV4dERlZmF1bHQubGVuZ3RoID4gc2V0dGluZ3Muc2l6ZSkge1xuXHRcdFx0XHRcdFx0XHR0ZXh0VHJ1bmNhdGVkID0gJC50cmltKHRleHREZWZhdWx0KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5zdWJzdHJpbmcoMCwgc2V0dGluZ3Muc2l6ZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuc3BsaXQoJyAnKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5zbGljZSgwLCAtMSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuam9pbignICcpO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChzZXR0aW5ncy5pZ25vcmUpIHtcblx0XHRcdFx0XHRcdFx0XHR0ZXh0VHJ1bmNhdGVkID0gdGV4dFRydW5jYXRlZC5yZXBsYWNlKHJlZ2V4LCAnJyk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLmh0bWwodGV4dFRydW5jYXRlZCArIHNldHRpbmdzLm9taXNzaW9uKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdGluaXQoKTtcblx0XHR9KTtcblx0fTtcbn0pKGpRdWVyeSk7XG5cbiJdfQ==

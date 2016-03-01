tui.util.defineNamespace("fedoc.content", {});
fedoc.content["AutoComplete.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Auto complete's Core element. All of auto complete objects belong with this object.\n * @version 1.1.2\n * @author NHN Entertainment FE Dev Team. &lt;dl_javascript@nhnent.com>\n*/\n'use strict';\n\nvar DataManager = require('./manager/data'),\n    InputManager = require('./manager/input'),\n    ResultManager = require('./manager/result');\n\nvar DEFAULT_COOKIE_NAME = '_atcp_use_cookie';\n\nvar requiredOptions = [\n        'resultListElement',\n        'searchBoxElement',\n        'orgQueryElement',\n        'formElement',\n        'subQuerySet',\n        'template',\n        'listConfig',\n        'actions',\n        'searchUrl'\n    ],\n    rIsElementOption = /element/i;\n\n/**\n * @constructor\n * @param {Object} options\n * @example\n *  var autoCompleteObj = new ne.component.AutoComplete({\n *     \"config\" : \"Default\"    // Dataset in autoConfig.js\n *  });\n *\n *  // The form of config file \"autoConfig.js\"\n *  // var Default = {\n *  //     // Result element\n *  //     'resultListElement': '._resultBox',\n *  //\n *  //     // Input element\n *  //     'searchBoxElement':  '#ac_input1',\n *  //\n *  //     // Hidden element that is for throwing query that user type.\n *  //     'orgQueryElement' : '#org_query',\n *  //\n *  //     // on,off Button element\n *  //     'toggleBtnElement' : \"#onoffBtn\",\n *  //\n *  //     // on,off State element\n *  //     'onoffTextElement' : \".baseBox .bottom\",\n *  //\n *  //     // on, off State image source\n *  //     'toggleImg' : {\n *  //         'on' : '../img/btn_on.jpg',\n *  //         'off' : '../img/btn_off.jpg'\n *  //     },\n *  //\n *  //     // Collection items each count.\n *  //     'viewCount' : 3,\n *  //\n *  //     // Key arrays (sub query keys' array)\n *  //     'subQuerySet': [\n *  //         ['key1', 'key2', 'key3'],\n *  //         ['dep1', 'dep2', 'dep3'],\n *  //         ['ch1', 'ch2', 'ch3'],\n *  //         ['cid']\n *  //     ],\n *  //\n *  //     // Config for auto complete list by index of collection\n *  //     'listConfig': {\n *  //         '0': {\n *  //             'template': 'department',\n *  //             'subQuerySet' : 0,\n *  //             'action': 0\n *  //         },\n *  //         '1': {\n *  //             'template': 'srch_in_department',\n *  //             'subQuerySet' : 1,\n *  //             'action': 0\n *  //         },\n *  //         '2': {\n *  //             'template': 'srch_in_department',\n *  //             'subQuerySet' : 2,\n *  //             'action': 1,\n *  //             'staticParams': 0\n *  //         },\n *  //         '3': {\n *  //             'template': 'department',\n *  //             'subQuerySet' : 0,\n *  //             'action': 1,\n *  //             'staticParams': 1\n *  //         }\n *  //     },\n *  //\n *  //     // Mark up for each collection. (Default markup is defaults.)\n *  //     // This markup has to have \"keywold-field\" but title.\n *  //     'template': {\n *  //         department: {\n *  //             element: '&lt;li class=\"department\">' +\n *  //                           '&lt;span class=\"slot-field\">Shop the&lt;/span> ' +\n *  //                           '&lt;a href=\"#\" class=\"keyword-field\">@subject@&lt;/a> ' +\n *  //                           '&lt;span class=\"slot-field\">Store&lt;/span>' +\n *  //                       '&lt;/li>',\n *  //             attr: ['subject']\n *  //         },\n *  //         srch: {\n *  //             element: '&lt;li class=\"srch\">&lt;span class=\"keyword-field\">@subject@&lt;/span>&lt;/li>',\n *  //             attr: ['subject']\n *  //         },\n *  //         srch_in_department: {\n *  //             element: '&lt;li class=\"inDepartment\">' +\n *  //                          '&lt;a href=\"#\" class=\"keyword-field\">@subject@&lt;/a> ' +\n *  //                          '&lt;span class=\"slot-field\">in &lt;/span>' +\n *  //                          '&lt;span class=\"depart-field\">@department@&lt;/span>' +\n *  //                      '&lt;/li>',\n *  //             attr: ['subject', 'department']\n *  //         },\n *  //         title: {\n *  //             element: '&lt;li class=\"title\">&lt;span>@title@&lt;/span>&lt;/li>',\n *  //             attr: ['title']\n *  //         },\n *  //         defaults: {\n *  //             element: '&lt;li class=\"srch\">&lt;span class=\"keyword-field\">@subject@&lt;/span>&lt;/li>',\n *  //             attr: ['subject']\n *  //         }\n *  //     },\n *  //\n *  //     // Action attribute for each collection\n *  //     'actions': [\n *  //         \"http://www.fashiongo.net/catalog.aspx\",\n *  //         \"http://www.fashiongo.net/search2.aspx\"\n *  //     ],\n *  //\n *  //     // Set static options for each collection.\n *  //     'staticParams':[\n *  //         \"qt=ProductName\",\n *  //         \"at=TEST,bt=ACT\"\n *  //     ],\n *  //\n *  //     // Whether use title or not.\n *  //     'useTitle': true,\n *  //\n *  //     // Form element that include search element\n *  //     'formElement' : '#ac_form1',\n *  //\n *  //     // Cookie name for save state\n *  //     'cookieName' : \"usecookie\",\n *  //\n *  //     // Class name for selected element\n *  //     'mouseOverClass' : 'emp',\n *  //\n *  //     // Auto complete API\n *  //     'searchUrl' : 'http://10.24.136.172:20011/ac',\n *  //\n *  //     // Auto complete API request config\n *  //     'searchApi' : {\n *  //         'st' : 1111,\n *  //         'r_lt' : 1111,\n *  //         'r_enc' : 'UTF-8',\n *  //         'q_enc' : 'UTF-8',\n *  //         'r_format' : 'json'\n *  //     }\n *  // }\n */\nvar AutoComplete = tui.util.defineClass(/**@lends AutoComplete.prototype */{\n    /**\n     * Direction value for key\n     */\n    flowMap: {\n        'NEXT': 'next',\n        'PREV': 'prev',\n        'FIRST': 'first',\n        'LAST': 'last'\n    },\n\n    /**\n     * Interval for check update input\n     */\n    watchInterval: 300,\n\n    /**\n     * Initialize\n     * @param {Object} options autoconfig values\n     */\n    init: function(options) {\n        this.options = {};\n        this.isUse = true;\n        this.queries = null;\n        this.isIdle = true;\n\n        this._checkValidation(options);\n        this._setOptions(options);\n\n        this.dataManager = new DataManager(this, this.options);\n        this.inputManager = new InputManager(this, this.options);\n        this.resultManager = new ResultManager(this, this.options);\n\n        this.setToggleBtnImg(this.isUse);\n        this.setCookieValue(this.isUse);\n    },\n\n    /**\n     * Check required fields and validate fields.\n     * @param {Object} options component configurations\n     * @private\n     */\n    _checkValidation: function(options) {\n        var isExisty = tui.util.isExisty,\n            config = options.config;\n\n        if (!isExisty(config)) {\n            throw new Error('No configuration #' + config);\n        }\n\n        tui.util.forEach(requiredOptions, function(name) {\n            if (!isExisty(config[name])) {\n                throw new Error(name + 'does not not exist.');\n            }\n        });\n    },\n\n    /**\n     * Set component options\n     * @param {Object} options component configurations\n     * @private\n     */\n    _setOptions: function(options) {\n        var config = options.config,\n            cookieValue;\n\n        if (!config.toggleImg || !config.onoffTextElement) {\n            this.isUse = true;\n            delete config.onoffTextElement;\n        } else {\n            cookieValue = $.cookie(config.cookieName);\n            this.isUse = (cookieValue === 'use' || !cookieValue);\n        }\n        config.cookieName = config.cookieName || DEFAULT_COOKIE_NAME;\n\n        if (tui.util.isFalsy(config.watchInterval)) {\n            config.watchInterval = this.watchInterval;\n        }\n\n        tui.util.forEach(config, function(value, name) {\n            if (rIsElementOption.test(name)) {\n                this.options[name] = $(value);\n            } else {\n                this.options[name] = value;\n            }\n        }, this);\n    },\n\n    /**\n     * Request data at api server with keyword\n     * @param {String} keyword The key word to send to Auto complete API\n     */\n    request: function(keyword) {\n        this.dataManager.request(keyword);\n    },\n\n    /**\n     * Return string in input element.\n     * @returns {String}\n     */\n    getValue: function() {\n        return this.inputManager.getValue();\n    },\n\n    /**\n     * Set inputManager's value to show at search element\n     * @param {String} keyword The string to show up at search element\n     */\n    setValue: function(keyword) {\n        this.inputManager.setValue(keyword);\n    },\n\n    /**\n     * Set additional parameters at inputManager.\n     * @param {string} paramStr String to be addition parameters.(saperator '&amp;')\n     * @param {string} index The index for setting key value\n     */\n    setParams: function(paramStr, index) {\n        this.inputManager.setParams(paramStr, index);\n    },\n\n    /**\n     * Request to draw result at resultManager with data from api server.\n     * @param {Array} dataArr Data array from api server\n     */\n    setServerData: function(dataArr) {\n        this.resultManager.draw(dataArr);\n    },\n\n    /**\n     * Set Cookie value with whether use auto complete or not\n     * @param {Boolean} isUse Whether use auto complete or not\n     */\n    setCookieValue: function(isUse) {\n        $.cookie(this.options.cookieName, isUse ? 'use' : 'notUse');\n        this.isUse = isUse;\n        this.setToggleBtnImg(isUse);\n    },\n\n    /**\n     * Save Korean that is matched real query.\n     * @param {array} queries Result queries\n     */\n    setQueries: function(queries) {\n        this.queries = [].concat(queries);\n    },\n\n    /**\n     * Get whether use auto complete or not\n     * @api\n     * @returns {Boolean}\n     * @example\n     *  autoComplete.isUseAutoComplete(); => true|false\n     */\n    isUseAutoComplete: function() {\n        return this.isUse;\n    },\n\n    /**\n     * Get whether result list area show or not\n     * @returns {Boolean}\n     */\n    isShowResultList: function() {\n        return this.resultManager.isShowResultList();\n    },\n\n    /**\n     * Change toggle button image by auto complete state\n     * @param {Boolean} isUse whether use auto complete or not\n     */\n    setToggleBtnImg: function(isUse) {\n        this.inputManager.setToggleBtnImg(isUse);\n    },\n\n    /**\n     * Hide search result list area\n     */\n    hideResultList: function() {\n        this.resultManager.hideResultList();\n    },\n\n    /**\n     * Show search result list area\n     */\n    showResultList: function() {\n        if (this.isUseAutoComplete()) {\n            this.resultManager.showResultList();\n        }\n    },\n\n    /**\n     * Move to next item in result list.\n     * @param {string} flow Direction to move.\n     */\n    moveNextResult: function(flow) {\n        this.resultManager.moveNextResult(flow);\n    },\n\n    /**\n     * Set text to auto complete switch\n     * @param {Boolean} isUse Whether use auto complete or not\n     */\n    changeOnOffText: function(isUse) {\n        this.resultManager.changeOnOffText(isUse);\n    },\n\n    /**\n     * Reset serachApi\n     * @api\n     * @param {Object} options searchApi옵션 설정\n     * @example\n     *  autoComplete.setSearchApi({\n     *      'st' : 111,\n     *      'r_lt' : 111,\n     *      'r_enc' : 'UTF-8',\n     *      'q_enc' : 'UTF-8',\n     *      'r_format' : 'json'\n     *  });\n     */\n    setSearchApi: function(options) {\n        tui.util.extend(this.options.searchApi, options);\n    },\n\n    /**\n     * clear ready value and set idle state\n     */\n    clearReadyValue: function() {\n        if (tui.util.isExisty(this.readyValue)) {\n            this.request(this.readyValue);\n        } else {\n            this.isIdle = true;\n        }\n        this.readyValue = null;\n    }\n});\ntui.util.CustomEvents.mixin(AutoComplete);\nmodule.exports = AutoComplete;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"
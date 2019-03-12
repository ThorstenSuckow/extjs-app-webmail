/**
 * conjoon
 * (c) 2007-2018 conjoon.org
 * licensing@conjoon.org
 *
 * app-cn_mail
 * Copyright (C) 2018 Thorsten Suckow-Homberg/conjoon.org
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Overridden coon.comp.component.Iframe-implementation to make sure a
 * CSS string is prepended before each message.
 *
 */
Ext.define('conjoon.cn_mail.view.mail.message.reader.MessageViewIframe', {

    extend: 'coon.comp.component.Iframe',

    alias : 'widget.cn_mail-mailmessagereadermessageviewiframe',

    /**
     * Overridden to make sure the return value of #getDefaultBodyCss is
     * prepended to the value that gets set.
     * Will not prepend the value if an empty string or a falsy value was
     * submitted.
     *
     * @inheritdoc
     */
    setSrcDoc : function(value) {

        const me = this;

        value = value ? me.getDefaultCss() + value : value;

        return me.callParent([value]);
    },


    getDefaultCss : function() {

        return ["<style type=\"text/css\">",
            " html, body {",
            " height:-moz-max-content;",
            " width:-moz-max-content;",
            " height:max-content;",
            " width:max-content;",
            "margin:0px;",
            "padding:0px;",
            "}",
            "body {",
            "text-align:justify;",
            "color: rgb(64, 64, 64);",
            " font-family: \"Open Sans\", \"Helvetica Neue\", helvetica, arial, verdana, sans-serif;",
            "font-size: 14px;",
            "font-weight: 400;",
            "line-height: 22.4px;",
            " }",
            "blockquote {",
            "margin-left:4px;",
            "padding-left:10px;",
            "border-left:4px solid #bee9fc;",
            "}",
            "</style>"].join('');
    }




});

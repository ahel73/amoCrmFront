import $ from 'jquery';
import twig from 'twigjs';
import Modal from 'lib/components/base/modal';
import tokenButtonTpl from './token_button.twig';


var TokenButton = (function () {
    function TokenButton(widgetId) {
        TokenButton.widgetId = widgetId;
        TokenButton.$tokenField = $('input[name="gnzs_token"]');
        TokenButton.tokenFieldValue = TokenButton.getTokenFieldValue();
        this.render();
    }

    TokenButton.prototype.render = function () {
        var $button = $(twig({
            data: tokenButtonTpl
        }).render({
            buttonText: TokenButton.getTokenFieldValue().length 
                ? 'Обновить ключ' 
                : 'Сгенерировать ключ',
        }));
        
        $button.parent().css({
            float: 'right'
        });
        $button.on('click', this.onClick);
        TokenButton.$tokenField.on('change', this.onChange);
        //TokenButton.$switcher.on('change', this.onSwitcherChange);
        TokenButton.$tokenField.parent()
            .append($button)
            .closest('.widget_settings_block__item_field')
            .css('padding', '20px 0')
            .find('.widget_settings_block__title_field')
            .css('width', 'auto');
        //TokenButton.checkToken();
        TokenButton.displayButton($button);
    };
    TokenButton.prototype.onClick = function (e) {
        var accountId = AMOCRM.constant('account')['id'];
        var login = AMOCRM.constant('user')['login'];
        var hash = AMOCRM.constant('user')['api_key'];
        $(e.currentTarget).trigger('button:load:start');
        $.ajax({
            url: "https://core.gnzs.ru/amocrm/token/public/get/" + accountId + "/" + TokenButton.widgetId,
            method: 'POST',
            data: {
                login: login,
                hash: hash
            },
            success: function (response) {
                if ('token' in response) {
                    TokenButton.$tokenField.val(response.token).trigger('change');
                }
                else {
                    var modal = new Modal({});
                    modal.showError(null, !1);
                }
                $(e.currentTarget).trigger('button:load:stop');
                //TokenButton.checkToken();
                TokenButton.displayButton($(e.currentTarget));
            },
            error: function (jqXHR) {
                var modal = new Modal({});
                modal.showError(null, !1);
                $(e.currentTarget).trigger('button:load:stop');
            }
        });
    };
    TokenButton.prototype.onChange = function (e) {
        TokenButton.tokenFieldValue = TokenButton.getTokenFieldValue();
    };
    // TokenButton.prototype.onSwitcherChange = function (e) {
    //     TokenButton.checkToken();
    // };
    TokenButton.disableButton = function ($button) {
        $button.removeClass('button-input_blue');
        $button.removeClass('gnzs-settings-token-button_not_value');
        $button.attr('disabled', 'disabled');
    };
    TokenButton.enableButton = function ($button) {
        $button.removeAttr('disabled');
        if (TokenButton.tokenFieldValue) {
            $button.removeClass('gnzs-settings-token-button_not_value');
            $button.addClass('button-input_blue');
        } else {
            $button.removeClass('button-input_blue');
            $button.addClass('gnzs-settings-token-button_not_value');
        }
    };
    TokenButton.getTokenFieldValue = function () {
        return $.trim(TokenButton.$tokenField.val());
    };
    // TokenButton.checkToken = function () {
    //     var isActive = TokenButton.$switcher.val();
    //     var $button = $('.js-gnzs-settings-token-button');
    //     if (parseInt(isActive)) {
    //         TokenButton.enableButton($button);
    //     }
    //     else {
    //         TokenButton.disableButton($button);
    //     }
    // };

    TokenButton.displayButton = function ($button) {
        $button.show();
    };

    return TokenButton;
}());

export default TokenButton;

import $ from 'jquery';
import Modal from 'lib/components/base/modal';
import twig from 'twigjs';
import template from './pay_modal.twig';


Twig.functions.gnzsWordForm = function (number, words) {
    var cases = [2, 0, 1, 1, 1, 2];
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

const class__payModal = 'gnzs-pay-modal';
const class__container = `${class__payModal}__container`;
const class__form = `${class__payModal}__form`;
const class__formError = `${class__form}-error`;
const class__formButton = `${class__form}-button`;


function PayModal(data, pm, popup) {
    var userData = {};

    userData.user_email = AMOCRM.constant('user').login || '';
    userData.user_name = AMOCRM.constant('user').name || '';
    userData.user_phone = AMOCRM.constant('user').personal_mobile || '';

    data = _.extend({}, userData, data);

    var $el = $(twig({data: template}).render(data));
    var $form = $el.find(`.${class__form}`);
    var $error = $el.find(`.${class__formError}`);
    var $button = $form.find(`.${class__formButton}`);


    return new Modal({
        class_name: class__container,
        init_animation: true,
        init: function ($modalBody) {
            $form.on('submit', function (e) {
                e.preventDefault();
                var data = {};

                $(this).find('input').each(function (i, val) {
                    data[val.name] = val.value;
                });

                $form.find('input, button').prop('disabled', true);
                $error.hide();
                $button.trigger('button:load:start');

                $.ajax({
                    url: 'https://core.gnzs.ru/amocrm/api/account/widget/payment/order',
                    method: 'post',
                    data: data,
                    headers: {'X-Secret': '7b02741081ddd766258300806e85b399'},
                    success: function () {
                        if (typeof popup === 'object' && typeof popup.close === 'function') {
                            popup.close();
                        }
                        pm.create({
                            type: 'success',
                            title: 'ЗАЯКА УСПЕШНО ОТПРАВЛЕНА',
                            isButtonEnabled: false,
                        });
                        $modalBody.find('.modal-body__close').click();
                    },
                    error: function () {
                        $error.show();
                    },
                    complete: function () {
                        $form.find('input, button').prop('disabled', false);
                        $button.trigger('button:load:stop');
                    }
                });
            });

            $modalBody
                .trigger('modal:loaded')
                .append($el)
                .trigger('modal:centrify')
                .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
        },
        destroy: function () {
            $el.off('submit', `.${class__form}`);
        }
    });
}

export default PayModal;
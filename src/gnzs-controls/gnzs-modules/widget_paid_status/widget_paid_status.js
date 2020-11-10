import $ from 'jquery';
import ad from '../account_data/account_data';
import payModal from '../pay_modal/pay_modal';
import PopupManager from '../popup/popup';


export default function (widget, gnzsWidgetId, popupId) {
    return new Promise(function (resolve) {

        var pm = new PopupManager($('#popups_wrapper'), {
            bgImage: `${widget.params.images_path}/gnzs_logo_white.png`
        });

        ad.getPaidStatus(widget, gnzsWidgetId, function (data) {
            if (_.isArray(data)) {
                pm.create({
                    type: 'danger',
                    title: 'Данные аккаунта не найдены, обратитесь в support@gnzs.ru',
                    isButtonEnabled: false,
                });
                resolve(false);
                return;
            }

            var lsName = 'gnzs_widget_pay_popup_' + gnzsWidgetId + 'expires';

            data.gnzs_widget_id = gnzsWidgetId;

            var text = (
                data.is_demo == 0
                    ? 'Оплаченный период'
                    : 'Демо-период'
            ) + (
                data.days_left > 0
                    ? ' подходит к концу'
                    : ' закончился'
            );

            if (typeof data.shownotify_daysleft !== 'string') {
                data.shownotify_daysleft = '';
            }

            var show = data.shownotify_daysleft.split(',').map(function (i) {
                return parseInt(i.trim());
            }).indexOf(parseInt(data.days_left)) > -1;


            var expired = localStorage.getItem(lsName) < Date.now();

            if (expired && (show || data.days_left <= 0)) {
                var popup;
                if (popupId) popup = pm.findById(popupId);

                if (!popup) {
                    var popup = pm.create({
                        type: 'info',
                        title: data.name,
                        text: text,
                        buttonText: 'Оплатить',
                    }, {
                        onClose: function () {
                            localStorage.setItem(lsName, Date.now() + (3600000 * 24));
                            this.close();
                        },
                        onButtonClick: function () {
                            payModal(data, pm, popup);
                        }
                    });

                    if (popupId) popup.data.id = popupId;
                }
            }

            resolve(data.days_left > 0);
        });
    });
}
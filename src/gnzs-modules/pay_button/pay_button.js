import $ from 'jquery';
import twig from 'twigjs';
import moment from 'moment';
import PopupManager from '../popup/popup';
import payModal from '../pay_modal/pay_modal';
import payButtonTpl from './pay_button.twig';

class PayButton{
    constructor(widget, data){
        this.gnzsWidgetId = widget.GNZS_WIDGET_ID;
        this.token = widget.params.gnzs_token;
        this.widget = widget;

        this.render(data);
    }

    render(data){

        if ((data.is_demo == 1 || data.days_left <= 0) && $("#widget_active__sw").length) {
            var $payButton = $(twig({
                data: payButtonTpl
            }).render());
            
        } else {
            const datoTo = moment().add(parseInt(data.days_left) - 1, 'days').format('DD.MM.YYYY');
            let text = data.days_left>3000 ? 'Активирован навсегда' : 'Активен до ' + datoTo;

            var $payButton = $(twig({
                data: '<button class="gnzs-widget__active-till-text">{{text}}</button>',
            }).render({text}));
        }

        $('.widget_settings_block__controls.widget_settings_block__controls_top').append($payButton);

        var pm_1 = new PopupManager($('#popups_wrapper'), {
            bgImage: `${this.widget.params.images_path}/gnzs_logo_white.png`
        });

        data.gnzs_widget_id = this.gnzsWidgetId;
        data.token = this.token;

        $payButton.on('click', function (e) {
            e.preventDefault();
            payModal(data, pm_1);
        });
    }
}

export default PayButton;
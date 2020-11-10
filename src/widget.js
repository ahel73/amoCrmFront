import './style.scss';
import $ from 'jquery';

import paidStatus from './gnzs-modules/widget_paid_status/widget_paid_status';
import PayButton from './gnzs-modules/pay_button/pay_button';
import Token from './gnzs-modules/token/token_button';
import ad from './gnzs-modules/account_data/account_data';
import Vue from "vue"
import App from './App.vue'



export default function () {
    const self = this;
    self.GNZS_WIDGET_ID = 21; // указываем ID интеграции из БД core_gnzs

    this.callbacks = {

        render: () => {
            return true;
        },
        init: async () => {
            let area = self.system().area;
            const settings = self.get_settings();

            console.log('init распределение сделок', {area, settings});

            // if ('widget_active' in settings && settings.widget_active === 'Y') {
            //     ad.onInit(self, self.GNZS_WIDGET_ID);
            //     const isActive = await paidStatus(self, self.GNZS_WIDGET_ID, `${self.params.widget_code}PaidStatus`); 

            //     if(!isActive) return;

            //     // запуск виджета тут
                
            // }

            return true;
        },
        bind_actions: () => {
            return true;
        },
        settings: ($modal) => {

            console.log('settings temp 1 Распределение сделок');
            // new Token(self.GNZS_WIDGET_ID);

            // let isActiveWidget = self.params.widget_active === 'Y';

            // if(isActiveWidget){
            //     ad.getPaidStatus(self, self.GNZS_WIDGET_ID, (data) => {
            //         const pb = new PayButton(self, data);
            //     });
            // }

            return true;
        },
        advancedSettings: () => {
        },
        onSave: () => {
            let token = $.trim($('input[name="gnzs_token"]').val());
            ad.setAuth(token, self.GNZS_WIDGET_ID);

            return true;
        },
        destroy: () => {
        },
        onAddAsSource: () => {
        },
        contacts: {
            selected: () => {
            }
        },
        leads: {
            selected: () => {
            }
        },
        tasks: {
            selected: () => {
            }
        },
        dpSettings: () => {
            console.log('dpSettings - распределение сделок');
            var div = document.createElement('div');
            div.id = "gnsz_widget-task-allocator";
            var parent = document.querySelector("#widget_settings__fields_wrapper").closest('form');
            var child = parent.querySelector('.digital-pipeline__warning-container');
            parent.insertBefore(div, child);
            
            new Vue({
                render: h => h(App)
            }).$mount('#gnsz_widget-task-allocator')
        }
    };

    return this;
}

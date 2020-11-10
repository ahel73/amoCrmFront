import $ from 'jquery';
import twig from 'twigjs';
import tpl from './popup.twig';

class Popup{
    constructor(data, cbs){
        var self = this;
        this.template = tpl;

        if (typeof data !== 'object') {
            data = {};
        }

        var defaultData = {
            isClosing: true,
            isButtonEnabled: true,
        };

        data = _.extend({}, defaultData, data);

        self.data = data;
        self.$el = self.render(data);

        self.$el.on('click', '.genezis-notification-close', function (e) {
            e.preventDefault();
            if (cbs && typeof cbs.onClose === 'function') {
                cbs.onClose.bind(self)();
            } else {
                self.close();
            }
        });

        self.$el.on('click', '.notification__genezis-button', function (e) {
            e.preventDefault();
            if (cbs && typeof cbs.onButtonClick === 'function') {
                cbs.onButtonClick.bind(self)();
            }
        });

        setTimeout(function () {
            if (cbs && typeof cbs.onOpen === 'function') {
                cbs.onOpen.bind(self)();
            }
            self.$el.addClass('expanded');
        }, 100);
    }

    close() {
        var self = this;

        if (self.$el) {
            self.$el.removeClass('expanded');
            self.$el.addClass('closing');
            setTimeout(function () {
                self.$el.remove();
            }, 500);
        }
    };

    destroy() {
        this.$el.remove();
    };

    render(data) {
        return $(twig({data: this.template}).render(data));
    };
}

class PopupManager{
    constructor(node, defaultData){
        this.mountNode = node;
        this.defaultData = defaultData || {};
        this.collection = [];
    }

    create(data, cbs) {
        var popup = new Popup(_.extend({}, this.defaultData, data), cbs);
        this.collection.push(popup);
        this.mountNode.prepend(popup.$el);

        return popup;
    }

    closeAll() {
        this.collection.forEach(function (popup) {
            popup.close();
        });
        this.collection = [];
    }

    destroyAll() {
        this.collection.forEach(function (popup) {
            popup.destroy();
        });
        this.collection = [];
    }

    findById(id) {
        var result = this.collection.filter(function (popup) {
            return popup.data.id === id;
        });

        if (result.length) {
            return result[0];
        }
        
        return;
    }
}

export default PopupManager;
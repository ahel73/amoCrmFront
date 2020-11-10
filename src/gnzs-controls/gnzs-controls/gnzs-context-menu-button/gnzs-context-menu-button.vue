<template>
    <div 
        class="gnzs-amo--context-menu-button__container"
        :class="[{'gnzs-amo--context-menu-button__container_opened': opened}]"
    >
        <button 
            class="gnzs-amo--context-menu-button"
            type="button" 
            tabindex="-1"
            @click="open"
        >
            <svg class="gnzs-amo--context-menu-button__icon">
                <use xlink:href="#gnzs-1c-icon__button-more"></use>
            </svg>
        </button>

        <ul class="gnzs-amo--context-menu-button__menu">
            <li 
                v-for="item in items" :key="item" 
                class="gnzs-amo--context-menu-button__menu-item"
                @click="onClickWrapper(item.onClick)"
            >
                <svg class="gnzs-amo--context-menu-button__menu-item-icon">
                    <use :xlink:href="item.iconLink"></use>
                </svg>
                <span class="gnzs-amo--context-menu-button__menu-item-text">
                    {{ item.text }}
                </span>
            </li>
        </ul>

    
    </div>
    
</template>

<script>
import './gnzs-context-menu-button.scss';
import clipboard from 'clipboard';

export default {
    props: {
        items: {
            type: Array,
            default: []
        }
    },
    data(){
        return {
            opened: false,
        }
    },
    methods: {
        open(){
            this.opened = true;
        },
        clickOutside(e){
            if (!this.$el.contains(e.target)) {
                this.opened = false;
            }
        },
        onClickWrapper(func){
            if(func) func();
            this.opened = false;
        },
    },
    created(){
        document.addEventListener('click', this.clickOutside);
        this.$on('hook:beforeDestroy', () => document.removeEventListener('click', this.clickOutside));
    }
}
</script>
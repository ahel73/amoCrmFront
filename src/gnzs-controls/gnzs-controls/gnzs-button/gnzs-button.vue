<template>
    <button 
        type="button"
        class="gnzs-amo--button"
        :class="[
            {[`gnzs-amo--button_${type}`]: type.length},
            {'gnzs-amo--button_loading': loading},
            {'gnzs-amo--button_disabled': disabled},
            {[additionalClass]: additionalClass.length}
        ]"
        @click="onClick"
        tabindex=""
    >

        <div class="gnzs-amo--button__icon" v-if="type==='remove'">
            <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.498 3.33H0c0-.353.137-.691.38-.94.243-.25.573-.39.917-.39h10.406c.344 0 .674.14.917.39.243.249.38.587.38.94h-1.502zM3.901.67c0-.176.067-.345.188-.47a.646.646 0 01.456-.2h3.9c.174 0 .34.07.463.196a.679.679 0 01.191.474v.67H3.901V.67zm1.297 4l.653 8.64H4.545L3.9 4.66l1.297.01zm2.604-.01h1.287l-.653 8.65H7.139l.663-8.65zm-5.266 8.93l.136 1.05h7.675l.137-1.05.868-8.93h1.473l-1.122 9.98a1.36 1.36 0 01-.376.967 1.294 1.294 0 01-.94.393H2.583c-.344 0-.674-.14-.917-.39a1.348 1.348 0 01-.38-.94L.147 4.66h1.52l.869 8.93z"></path>
            </svg>
        </div>

        <span class="gnzs-amo--button__inner">
            <slot></slot>
        </span>
        <div class="gnzs-amo--button__spinner" v-if="type!=='cancel'">
            <span class="gnzs-amo--button__spinner-icon"></span>
        </div>
    </button>
</template>

<script>
import './gnzs-button.scss';


export default {
    name: 'gnzs-button',
    props: {
        loading: Boolean,
        disabled: Boolean,
        additionalClass: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'default',
        }
    },
    methods: {
        onClick(){
            if(!this.loading && !this.disabled){
                this.$emit('click', this);
            }
        }
    },
}
</script>
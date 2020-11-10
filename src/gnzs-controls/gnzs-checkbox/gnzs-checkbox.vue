<template>
    <label class="gnzs-amo--checkbox">
       
        <div class="gnzs-amo--checkbox__body">
            <input 
                class="gnzs-amo--checkbox__input" 
                :class="class_par"
                type="checkbox" 
                :value="value"
                :name="name"
                :checked="checked"
                @click="click_ev" 
                @change="$emit('input', $event.target.checked)" 
            />
            <span class="gnzs-amo--checkbox__helper"></span>
        </div>
        <span class="gnzs-amo--checkbox__text" v-if="label.length">
            {{label}}
        </span>
    </label>
</template>

<script>

import './gnzs-checkbox.scss';

export default {
    props: {
        name: {
            type: String,
            default: '',
        },
        value: {
            default: false,
        },
        label: {
            type: String,
            default: '',
        },
        checked: {
            type: Boolean,
            default: false,
        },
        click_ev: Function,
        class_par: Object,
    },
}
</script>
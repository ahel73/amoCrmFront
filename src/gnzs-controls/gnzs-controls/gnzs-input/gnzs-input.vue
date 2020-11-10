<template>
    <input 
        class="gnzs-amo--input" 
        :type="type" 
        :value="value"
        :data-name="name"
        @input="onInputHandler"
        tabindex=""
    />
</template>

<script>
import './gnzs-input.scss';

export default {
    name: 'gnzs-input',
    props: {
        name: {
            type: String,
            default: '',
        },
        value: {
            default: '',
        },
        hints: {
            type: Array,
            default: () => [],
        },
        type: {
            type: String,
            default: 'text',
        }
    },
    methods: {
        onInputHandler(e){
            this.$emit('input', e.target.value)
        },
        onFocusHandler(e){
            if(!this.hints.length) return;

            this.$refs['wrapper'].classList.add('gnzs-amo--input_with-hints_opened');            
        }
    }
}
</script>
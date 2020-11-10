<template>
    <div 
        class="gnzs-amo--input-hints" 
        tabindex="" 
        @focusin="onFocusinHandler"
        @focusout="onFocusoutHandler"
        ref="container"
    >
        <input 
            :type="type" 
            class="gnzs-amo--input"
            :data-name="name"
            :value="value"
            @input="onInputHandler"
            ref="input"
        />
        <div class="custom-scroll gnzs-amo--input-hints__hints" v-if="hints.length" ref="hints">
            <div class="gnzs-amo--input-hints__hint-item" v-for="(hint, i) of hints" :key="i" @mousedown="onHintClickHandler(hint.value)">
                <div class="gnzs-amo--input-hints__hint-value">{{hint.value}}</div>
                <div class="gnzs-amo--input-hints__hint-info">{{hint.info}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import '../gnzs-input/gnzs-input.scss';
import './gnzs-input-hints.scss';

export default {
    name: 'gnzs-input-with-hints',
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
        onFocusinHandler(e){
            if(!this.hints.length) return;

            this.$refs['container'].classList.add('gnzs-amo--input-hints_opened');
            this.$refs['input'].style.width = this.$refs['hints'].offsetWidth + 'px';
            
        },
        onFocusoutHandler(e){
            this.$refs['input'].style.width = '';
            this.$refs['container'].classList.remove('gnzs-amo--input-hints_opened');
        },
        onHintClickHandler(val){
            this.$refs['input'].value = val;
            this.$emit('input', val);
        }
    }
}
</script>
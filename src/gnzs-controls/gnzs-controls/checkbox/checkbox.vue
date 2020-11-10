<template>
    <label :class="[{'gnzs-amo--control-checkbox': true, 'is-checked': checked}, className]">
        <div class="gnzs-amo--control-checkbox__body">
            <input @change="changeVal($event)" type="checkbox" :checked="checked"/>
            <span :class="{'gnzs-amo--control-checkbox__helper': true, 'gnzs-amo--control-checkbox__helper_minus': checkedMinus}" ></span>
        </div>
        <div v-if="text" :class="{'gnzs-amo--control-checkbox__text': true}" :title="text">
            <span>{{text}}</span>
        </div>
    </label>
</template>

<script>
import Vue from 'vue';
export default {
    props: {
            className: String,
            text: String,
            checked: Boolean,
            checkedMinus: Boolean,
    },
    data() {
        return {
            show: false
        }
    },
    methods: {
        changeVal: function (event) {
            this.$emit('input', event.target.checked)
        }
    },
}
</script>
<style lang="scss">

.gnzs-amo--control-checkbox {
    display: -webkit-inline-box;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    margin: 0 7px 0 0;
    padding: 0;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    border: 0;
    width: 100%;

    &__body {
        display: inline-flex;
    }

    & input {
        position: absolute;
        opacity: 0;
        z-index: 4;
        width: 20px;
        height: 20px;
    }

    & input:checked + &__helper:not(&__helper_minus) {
        background-color: #fff;
        background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJfeDIwMTRfX0l0ZW1fMV8iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCINCgkgeT0iMHB4IiB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTIgMTEiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDEyIDExIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJjaGVjay5zdmciPg0KCTxnPg0KCQk8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzJFMzY0MCIgZD0iTTExLjQ3NiwwLjE1MWMtMC4zNzctMC4yOTYtMC45OTctMC4xMzktMS4zNTksMC4zMjRMNS4xNTMsNi41Mw0KCQkJQzUuMDc3LDYuNjI0LDQuODg0LDYuNjU3LDQuNzg1LDYuNTk1TDEuNzIzLDQuNjg4QzEuMjQsNC4zNDIsMC42MjQsNC4zNjYsMC4zNDksNC43NTNjLTAuMjY4LDAuMzc4LTAuMTgsMC45OTQsMC4yMDksMS40NjQNCgkJCWwzLjUwOSw0LjIzNEM0LjM2MSwxMC44MDUsNC43NDIsMTEsNS4xNCwxMWMwLjQ2NSwwLDAuODk1LTAuMjY2LDEuMTc3LTAuNzI4bDUuMjY0LTguNjE1QzExLjkxNiwxLjEwOSwxMS44NzEsMC40NjIsMTEuNDc2LDAuMTUxDQoJCQl6Ii8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo=);
        background-size: 70%;
        background-position: center;
        background-repeat: no-repeat;
    }

    & input:checked + &__helper_minus::after {
        content: '';
        position: absolute;
        display: block;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 2px;
        background-color: #20252C;
    }

    &__helper {
        position: relative;
        width: 18px;
        height: 18px;
        z-index: 3;
        background-color: #fff;
        border: 1px solid #e8e8e8;
        border-radius: 3px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        display: inline-flex;
    }

    &__text {
        display: -webkit-inline-box;
        display: inline-flex;
        font-size: 15px;
        line-height: 20px;
        margin: 0 0 0 7px;
        -webkit-transform: translateY(1px);
        transform: translateY(1px);
    }
}











</style>
<template>
    <section class="gnzs-amo--section"
        :class="[
            {[additionalClass]: additionalClass.length}
        ]"
    >
        <div class="gnzs-amo--section__header-wrapper">
            <div class="gnzs-amo--section__header" :class="[{[headerClass]: headerClass.length}]">
                <slot name="header" v-if="!header.length"></slot>
                <div v-else>{{ header }}</div>
            </div>
            <slot name="header-control"></slot>
        </div>
        <div class="gnzs-amo--section__description">
            <slot name="description"></slot>
        </div>
        <div class="gnzs-amo--section__body">
            <slot></slot>
        </div>
    </section>
</template>

<script>
import gnzsSwitcher from '../gnzs-switcher/gnzs-switcher';
import './gnzs-section.scss';

export default {
    props: {
        header: {
            type: String,
            default: '',
        },
        additionalClass: {
            type: String,
            default: ''
        },
        headerClass: {
            type: String,
            default: ''
        }
    },
    components: {
        gnzsSwitcher
    }
}
</script>
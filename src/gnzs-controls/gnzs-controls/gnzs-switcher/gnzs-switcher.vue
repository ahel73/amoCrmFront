<template>
    <div class="gnzs-amo--switcher">
        <label class="gnzs-amo--switcher__label">
            <input 
                type="checkbox" 
                class="gnzs-amo--switcher__checkbox"
                :checked="!!value"
                @change="$emit('input', $event.target.checked)"
            >
            <span class="gnzs-amo--switcher__helper"></span>
        </label>
    </div>
</template>

<script>
import './gnzs-switcher.scss';

export default {
    props: {
        name: {
            type: String,
            default: '',
        },
        value: {
            default: false,
        }
    }
}
</script>
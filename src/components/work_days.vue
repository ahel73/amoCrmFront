<template>
<div>
    <p>
        <gnzs-checkbox
            v-for="(day, index) in days_checket" :key="index" 
                name="days[]"
                :value="day.alias"
                :label="day.name"
                :checked="day.checked"
                :click_ev="click_ev"
        />
    </p>
</div>
</template>
<script>
import gnzsCheckbox from '../gnzs-controls/gnzs-checkbox/gnzs-checkbox';
export default {
    props: ['days_checket', 'click_ev'],
    data() {
        return {
            
        }
    },
    components: {
        gnzsCheckbox
    }
}
</script>
<style>
    
</style>
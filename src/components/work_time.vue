<template>
<div class="work_time">
    от <input type="time" name="start" :value="start" @input="input_ev"> 
    до <input type="time" name="end" :value="end" @input="input_ev">
</div>
</template>
<script>
export default {
    props: {
        start: {
            type: String,
            default: '00:00'
        },
        end: {
            type: String,
            default: '00:00'
        },
        input_ev: Function
    }
}
</script>
<style lang="scss">
input{
    background-color: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 3px;
    padding: 10px;
    margin: 0 15px 0 5px;
}
</style>
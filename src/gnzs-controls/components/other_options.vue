<template>
    <ol :class="{'block_work_time' : flagWorkTime}">
        <template v-for="(option, name) in otherOptions">
            <template v-if='flagWorkTime'>
                <li v-if='name=="isAssignOnlyWorkime"' :key="name"> 
                    <gnzs-checkbox
                        name="otherOptions[]"
                        :value="option.alias"
                        :label="option.name"
                        :checked="option.checked"
                        :click_ev="click_ev"
                    />
                </li>
            </template>
            <template v-else>
                <li v-if='name !="isAssignOnlyWorkime"' :key="name"> 
                    <gnzs-checkbox
                        name="otherOptions[]"
                        :value="option.alias"
                        :label="option.name"
                        :checked="option.checked"
                        :click_ev="click_ev"
                    />
                </li>
            </template>
        </template>
    </ol>
</template>
<script>
import gnzsCheckbox from '../gnzs-controls/gnzs-checkbox/gnzs-checkbox';
export default {
    props: ['otherOptions', 'click_ev', 'flagWorkTime'],
    components: {
        gnzsCheckbox
    }
}
</script>
<style scoped  lang="scss">
    ol{
        list-style-type: none;
        padding: 0;
        margin: 0 0 35px;
    }
    .block_work_time {
        margin: 20px 0 0;
    }
    li{
        padding: 8px 0;
    }
</style>
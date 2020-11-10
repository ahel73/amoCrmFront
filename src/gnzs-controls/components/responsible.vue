<template>
    <ol class="responsible">
        <template v-for="(group, index)  in groups">
            <li 
                v-if="group.id != 'group_free_users' && group.managers.length" 
                :key="index"
                class="js_block_group"
            >
                <label :for='group.id'>
                    <div class="gnzs-amo--checkbox__kntnr">
                        <input 
                            :id="group.id"
                            class="gnzs-amo--checkbox__elem"
                            type="checkbox" 
                            :checked="group.isChecked"
                            @change='change_checkbox_group($event.target, group)'
                        >
                        <span class="gnzs-amo--checkbox__psevdo"></span>
                    </div>
                    
                    <span>
                        {{group.name}}
                    </span>
                </label>
                
                <ol :class="{'css_opacity' : group.isChecked}">
                    <li 
                        v-for="(work, index2 ) in group.managers" 
                        :key="index2" 
                    >
                        <label :for='work.id + "-" + index2'>
                            <div class="gnzs-amo--checkbox__kntnr">
                                <input 
                                    :id='work.id + "-" + index2'
                                    class="gnzs-amo--checkbox__elem"
                                    type="checkbox" 
                                    :checked="work.isChecked"
                                    @change='change_checkbox_work($event.target, work, group)'
                                >
                                <span class="gnzs-amo--checkbox__psevdo"></span>
                            </div>
                            <span>
                                {{work.name}}
                            </span>
                        </label>
                    </li>
                </ol>
            </li>
        </template>
    </ol>
</template>

<script>
export default {
    props: ['groups', 'selectWork'],
    methods: {
        change_checkbox_group(elem, group){
            group.isChecked = elem.checked
            var mngrs = group.managers;
            for(var i = 0; i < mngrs.length; i++ ){
                mngrs[i].isChecked = elem.checked;
            }
            this.$emit('jsonEvent');
        },
        change_checkbox_work(elem, work, group){
            work.isChecked = elem.checked
            if(!elem.checked){
                group.isChecked = elem.checked;
                console.log(group);
            }
            
            this.$emit('jsonEvent');
        }
    }
}
</script>

<style   lang="scss" scope   >
label{
    display: flex;
}
.gnzs-amo--checkbox__kntnr{
    display: inline-block;
    margin-right: 5px;
}
.gnzs-amo--checkbox__elem{
    display: none;
}
.gnzs-amo--checkbox__psevdo{
    display: inline-block;
    width: 18px;
    height: 18px;
    background-color: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 3px;
}
.gnzs-amo--checkbox__elem:checked + .gnzs-amo--checkbox__psevdo{
    background: #fff url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMyRTM2NDAiIGQ9Ik0xMS40NzYuMTUxYy0uMzc3LS4yOTYtLjk5Ny0uMTM5LTEuMzU5LjMyNEw1LjE1MyA2LjUzYy0uMDc2LjA5NC0uMjY5LjEyNy0uMzY4LjA2NUwxLjcyMyA0LjY4OEMxLjI0IDQuMzQyLjYyNCA0LjM2Ni4zNDkgNC43NTNjLS4yNjguMzc4LS4xOC45OTQuMjA5IDEuNDY0bDMuNTA5IDQuMjM0Yy4yOTQuMzU0LjY3NS41NDkgMS4wNzMuNTQ5LjQ2NSAwIC44OTUtLjI2NiAxLjE3Ny0uNzI4bDUuMjY0LTguNjE1Yy4zMzUtLjU0OC4yOS0xLjE5NS0uMTA1LTEuNTA2eiIvPjwvc3ZnPg==) no-repeat;
	background-size: 70%;
	background-position: 50%;

}
    ol{
        list-style-type: none;
    }
    li ol{
        margin-left: 30px;
    }
    .responsible{
        border: 1px solid #d4d5d8;
        padding: 10px;
        max-height: 300px;
        overflow: auto;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    li{
        padding: 3px 0;
    }
    
    .responsible label{
        font-weight: bold;
    }
    .responsible ol label{
        font-weight: normal;
    }
    .css_opacity {
            opacity: .5;
    }
</style>
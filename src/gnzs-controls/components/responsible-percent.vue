<template>
<div>
    <p>
        <span>
            Общая загруженность отделов
        </span>
        <span>
            <span 
                :class="{red : (percentsDeps > 100 || percentsDeps < 100) && percentsDeps     !=0}"
            >
                {{percentsDeps}}</span>/100%</span>
    </p>
    <ol  class="responsible">
        <template v-for="(group, index)  in groups">
            <li 
                v-if="group.id != 'group_free_users' && group.managers.length" 
                :key="index" 
                class="js_block_group css_block_group"
            >
                <label>
                    <input
                        class="input_percent js_group"
                        :name="group.id" 
                        :value="group.percent"
                        @focus="clear_value"
                        @blur="blur_input"
                        @input="joint_fun_ev_input_group"
                    >
                    <span>
                        {{group.name}}
                    </span>
                    <span class="css_percent" title="Распределение среди сотрудников группы должно равняться 100%">
                        <span class="css_js_real_percent"
                            :class="{red : (group.percentsWorks > 100 || group.percentsWorks < 100) && group.percentsWorks !=0 }"
                        >
                            {{group.percentsWorks}}</span>/100%</span>
                </label>

                <ol>
                    <li 
                        v-for="(work, index2 ) in group.managers" 
                        :key="index2" 
                    >
                       <label>
                            <input 
                                class="input_percent js_work"
                                :name="work.id" 
                                :value="work.percent"
                                @focus="clear_value"
                                @blur="blur_input"
                                @input="joint_fun_ev_input_work"
                            >
                            <span>
                                {{work.name}}
                            </span>
                        </label>
                    </li>
                </ol>
            </li>
        </template>
    </ol>
</div>
    
</template>

<script>
import gnzsCheckbox from "../gnzs-controls/gnzs-checkbox/gnzs-checkbox";
export default {
    props: ['groups', 'percentsDeps'],
    components: {
        gnzsCheckbox
    },
    methods: {
        
        // Предварительная очистка процентного инпута
        clear_value(oe){
            oe.target.dataset.value = oe.target.value;
            oe.target.value = '';
        },

        // Действия при выходе из процентного инпута
        blur_input(oe){
            if(!oe.target.value){
                oe.target.value = oe.target.dataset.value;
            }
        },

        // проверка корректности содержимого процентного инпута
        test_ok_number(oe){
            if( !Number(oe.target.value) || 
                (Number(oe.target.value) > 100) || 
                (Number(oe.target.value) < 0)
            ){
                oe.target.value = oe.target.value.slice(0, -1);
                return false;
            }
            return true;
        },

        // Подготовительная функция для отправки данных по подсчёту процентов в родитель
        count_percent_group(oe, event_name, zero) {
            var percent = oe.target.value || zero;
            var id_group_parent;
            if(oe.target.classList.contains('js_work')){
                id_group_parent = oe.target.closest('.js_block_group').querySelector('.js_group').name
            }
            this.$emit(event_name, [percent, oe.target.name, id_group_parent])
            this.$emit('jsonEvent');
        },

        // Объединённая функция для события инпут в группе
        joint_fun_ev_input_group(oe){
            if(this.test_ok_number(oe)) {
                this.count_percent_group(oe, 'incrPersentGroup');
            }else{
                this.count_percent_group(oe,'incrPersentGroup', 0);
            }
        },

        // Объединённая функция для события инпут в работнике
        joint_fun_ev_input_work(oe){
            if(this.test_ok_number(oe)) {
                this.count_percent_group(oe, 'incrPersentWorks');
            }else{
                this.count_percent_group(oe,'incrPersentWorks', 0);
            }
        }
    }
}
</script>

<style   lang="scss" >
    p{
        display: flex;
        justify-content: space-between;
    }
    .red{
        color: red;
    }
    .input_percent{
        width: 25px;
        text-align: center;
        border: none;
        border-bottom: 1px solid #4c8bf7;
        padding: 0;
        padding-bottom: 1px;
        border-radius: 0;
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
    .css_block_group > label{
        display: flex;
        font-weight: bold;
    }
    .css_percent{
        display: inline-flex;
        margin-left: auto;
        font-weight: bold;
    }
    li{
        padding: 3px 0;
    }
    
</style>
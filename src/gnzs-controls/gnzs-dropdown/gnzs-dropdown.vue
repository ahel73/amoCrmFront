<template>
    <div class="gnzs-amo--dropdown" 
        :class="[{'gnzs-amo--dropdown_disabled': disabled}]"
    >
        <!-- Список по умолчанию -->
        <ul 
            v-if="!isGrouped" 
            class="custom-scroll gnzs-amo--dropdown__list" ref="list" 
            tabindex="-1"
            @focusout="closeList"
        >
            
            <li 
                v-if="useEmptyItem"
                class="gnzs-amo--dropdown__list-item"
                @click="onListItemClickHandler({value: '',title: 'Выбрать'})"
            >
                <span 
                    class="gnzs-amo--dropdown__list-item-inner"
                    :data-value="-1"
                >
                    Выбрать
                </span>
            </li>
            
            <li 
                class="gnzs-amo--dropdown__list-item" 
                :class="[{'gnzs-amo--dropdown__list-item_selected': item.value == selectedValue}]"
                v-for="(item, index) in items" 
                :key="index" 
                @click="onListItemClickHandler(item)"
            >
                <span class="gnzs-amo--dropdown__list-item-inner" :data-value="item.value">
                    {{prefix + '' + item.title }}
                </span>
                <span v-if="item.info && item.info.length" class="gnzs-amo--dropdown__list-item-info" >{{ item.info }}</span>
            </li>
        </ul>
        <!-- Иной список -->
        <ul v-else class="custom-scroll gnzs-amo--dropdown__list" ref="list" tabindex="-1" @focusout="closeList">
            <li
                class="gnzs-amo--dropdown__group-item"
                v-for="(group, index) in items" 
                :key="index" 
            >
                <span class="gnzs-amo--dropdown__group-title" :data-value="group.value">{{group.title}}</span>

                <ul class="gnzs-amo--dropdown__group-inner-list">
                    <li 
                        class="gnzs-amo--dropdown__list-item" 
                        :class="[{'gnzs-amo--dropdown__list-item_selected': item.value == selectedValue}]"
                        v-for="(item, index) in group.items" 
                        :key="index" 
                        @click="onListItemClickHandler(item, group)"
                    >
                        <span class="gnzs-amo--dropdown__list-item-inner" :data-value="item.value">{{ item.title }}</span>
                        <span v-if="item.info && item.info.length" class="gnzs-amo--dropdown__list-item-info" >{{ item.info }}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <!-- Кнопка -->
        <button type="button" class="gnzs-amo--dropdown__button" @click="onButtonClickHandler">
            <div class="gnzs-amo--dropdown__button-inner">{{selectedTitle}}</div>
        </button>
        <!-- Скрытый инпут -->
        <input 
            class="gnzs-amo--dropdown__input" 
            :data-name="name" 
            type="hidden" 
            ref="input-control" 
            :value="value"
        />
    </div>
</template>

<script>

import './gnzs-dropdown.scss';


export default {
    data(){
        return {
            selectedValue: '',
        }
    },
    props: {
        name: String,
        disabled: Boolean,
        useEmptyItem: {
            type: Boolean,
            default: true,
        },
        isGrouped: {
            type: Boolean,
            default: false,
        },
        value: {
            default: '',
        },
        items: {
            type: Array,
            default: [],
        },
        // начальный заголовок
        title: String,
        // Префикс перед текстом в списке
        prefix: {
            type: String,
            default: ''
        }
    },
    computed: {
        selectedTitle(){
            // Если выпадашка пустая
            if(!this.items.length) return (this.prefix + "" + (this.title || 'Выбрать'));
            
            // Если выподашка не по умолчанию
            if(this.isGrouped){
                for(let g of this.items){
                    
                    const item = g.items.find(item => item.value == this.selectedValue);

                    if(item) return (this.prefix + "" +  item.title)
                }

                return (this.prefix + "" + (this.title || 'Выбрать'));
            }

            // Действия по умолчанию
            const elem = this.items.find(item => item.value == this.selectedValue);
            
            if(elem) return this.prefix + "" +  elem.title;
            return (this.prefix + "" + (this.title || 'Выбрать'));
        }
    },
    methods: {
        openList(){
            this.$refs['list'].classList.add('gnzs-amo--dropdown__list_opened');
            this.$refs['list'].focus();
        },
        closeList(){
            this.$refs['list'].classList.remove('gnzs-amo--dropdown__list_opened');
        },
        onButtonClickHandler(){
            if(!this.disabled) {
                this.openList();
            }
        },
        onListItemClickHandler(item, group){
            console.log(item.value)
            
            this.selectedValue = item.value;
            this.$refs['input-control'].value = item.value;

            if(this.isGrouped){
                this.$refs['input-control'].dataset.groupValue = group.value;
                this.$emit('input', item.value, group.value);
            } else {
                this.$emit('input', item.value);
                this.$emit('jsonEvent');
            }

            this.closeList();
        },
    },
    created(){
        this.selectedValue = this.value;
    },
}
</script>
<template>
  <div class="gnzs-amo--checkboxes-dropdown" tabindex="-1">
  <div class="custom-scroll gnzs-amo--checkboxes-dropdown__list" v-show="listShow">
    <div>
      <div class="gnzs-amo--checkboxes-dropdown__label" >
      <customCheckbox
        @input="selectAll($event)"
        :text='allTitle'
        :checked="allSelected"
        :checkedMinus="minus"
        v-model="allSelected"
      ></customCheckbox>
      </div>
      <div v-if="searchable" class="gnzs-amo--checkboxes-dropdown__search">
        <svg class="gnzs-amo--checkboxes-dropdown__search-icon" viewBox="0 0 16 15" xmlns="http://www.w3.org/2000/svg"><path id="deSearch" class="decls-1" d="M818.493 273.994a6.5 6.5 0 116.5-6.5 6.5 6.5 0 01-6.5 6.5zm0-11.007a4.506 4.506 0 104.5 4.506 4.5 4.5 0 00-4.5-4.506zm9.516 12.124l-.893.9-3.108-2.633 1.381-1.388z" transform="translate(-812 -261)"></path></svg>
        <input v-model="search" class="gnzs-amo--checkboxes-dropdown__search-input" type="text" placeholder="Поиск">
      </div>

        <template v-if="!searchable">
          <div v-for="(item, index ) in items" :key="index" class="gnzs-amo--checkboxes-dropdown__label">

          <customCheckbox
            @input="select($event, item.option)"
            :checked="item.isChecked"
            :text='item.option'
            v-model="item.isChecked"
          ></customCheckbox>
        </div>
        </template>
        <template v-else>
          <div v-for="(item, index ) in selectedItems" :key="index" class="gnzs-amo--checkboxes-dropdown__label">

          <customCheckbox
            @input="select($event, item.option)"
            :checked="item.isChecked"
            :text='item.option'
            v-model="item.isChecked"
          ></customCheckbox>
          </div>
        </template>
        

    </div>
  </div>

  <div class="gnzs-amo--checkboxes-dropdown__title-wrapper">
    <customCheckbox
      @input="selectAll($event)"
      className='gnzs-amo--checkboxes-dropdown__label-title'
      :checkedMinus="minus"
      :checked="allSelected"
      v-model="allSelected"
    ></customCheckbox>

    <span class="gnzs-amo--checkboxes-dropdown__title_selected" @click="listShow = !listShow">
      <span>
        <div v-for="(name, i) in selectedNames" :key="i" class="gnzs-amo--checkboxes-dropdown__title-name_selected">
          {{ name }}
        </div>
        <div v-if="moreNames" class="gnzs-amo--checkboxes-dropdown__title-name_selected">
          Ещё
          {{ moreNames}}
        </div>
        <div v-if="!minus && !allSelected">
          {{ allTitle }}
        </div>
        <div v-else-if="!minus">
          {{ 'Всё' }}
        </div>
      </span>
    </span>
    <span class="gnzs-amo--checkboxes-dropdown__icon" @click="listShow = !listShow"></span>
  </div>
</div>
</template>

<script>
import Vue from 'vue';
import customCheckbox from './../checkbox/checkbox.vue';

export default {
  props: {
    searchable: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: [],
    },
    value: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
        listShow: false,
        allTitle: 'Выбрать всё',
        allSelected: false,
        minus: false,
        selectedNames: [],
        selectedIds: [],
        search: '',
        moreNames: 0
    }
  },
  created() {
    let self = this;

    for (const key in this.items) {
      this.items[key].isChecked = this.value.includes(this.items[key].id)
      
          if (this.items[key].isChecked) {
            if (this.selectedNames.length < 5) {
              this.selectedNames.push(this.items[key].option);
              this.selectedIds.push(this.items[key].id);
            } else {
              this.moreNames++
            }
            
          }
      }

      if (this.selectedNames.length + this.moreNames !== Object.keys(this.items).length && this.selectedNames.length !== 0) {
        
        this.minus = true;
      } else {
        this.minus = false;
      }

      if (this.selectedNames.length !== 0) {
        this.allSelected = true;
        this.allTitle = 'Снять выделение'

      } else {
        this.allSelected = false;
        this.allTitle = 'Выбрать всё'
      }
      if (this.selectedNames.length + this.moreNames == Object.keys(this.items).length) {
        this.selectedNames = [];
        this.moreNames = 0;
      }
    document.addEventListener('click', self.closeSublist)
  },
  beforeDestroy() {
    let self = this;
    document.removeEventListener('click', self.closeSublist)
  },
  methods: {
    closeSublist: function  (e) {
      if (e.target.closest('.gnzs-amo--checkboxes-dropdown') == null) {
        this.listShow = false;
      }
      
    },
    selectAll: function (event) {
      this.minus = false;

      for (const key in this.items) {
          this.items[key].isChecked = event;
          if (event) this.selectedIds.push(this.items[key].id)
      }

      if (event) {
        this.allTitle = 'Снять выделение';
      } else {
        this.allTitle = 'Выбрать всё'
        this.selectedNames = [];
        this.selectedIds = [];
        this.moreNames = 0;
      }

      this.emitEvent();
    },
    select: function (event, name) {
      this.selectedNames = [];
      this.selectedIds = [];
      this.moreNames = 0;

      for (const key in this.items) {
          if (this.items[key].isChecked) {
            if (this.selectedNames.length < 5) {
              this.selectedNames.push(this.items[key].option);
              this.selectedIds.push(this.items[key].id);
            } else {
              this.moreNames++
            }
            
          }
      }

      if (this.selectedNames.length + this.moreNames !== Object.keys(this.items).length && this.selectedNames.length !== 0) {
        this.minus = true;
      } else {
        this.minus = false;
      }

      if (this.selectedNames.length !== 0) {
        this.allSelected = true;
        this.allTitle = 'Снять выделение'

      } else {
        this.allSelected = false;
        this.allTitle = 'Выбрать всё'
      }
      if (this.selectedNames.length + this.moreNames == Object.keys(this.items).length) {
        this.selectedNames = [];
        this.moreNames = 0;
      }

      this.emitEvent();
    },

    emitEvent: function () {
      this.$emit('input', this.selectedIds);
    }
  },
  computed: {
    selectedItems: function () {
      let self = this;
      if (this.searchable) {
        let items = this.items.filter(function(el) {
          return el.option.indexOf(self.search.toLowerCase()) > -1;
        })
        return items;
      }
    }
  },
  components: {
      customCheckbox: customCheckbox,
  }

}
</script>
<style lang="scss">

.gnzs-amo--checkboxes-dropdown {
  position: relative;
  z-index: 10;

  &:focus {
    outline: none;
  }

    &__title-wrapper {
    display: flex;
    position: relative;
    color: #313942;
    padding: 8px;
    border: 1px solid #dadadb;
    border-bottom-width: 2px;
    border-radius: 3px;
    cursor: pointer;
    min-height: 15px;
    background: -webkit-gradient(linear,left top,left bottom,from(#fcfcfc),to(#f8f8f9));
    background: linear-gradient(to bottom,#fcfcfc 0%,#f8f8f9 100%);
  }

  &__list {
    display: block;
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #dadadb;
    border-radius: 3px;
    font-size: 16px;
    color: #313942;
    height: auto;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    max-height: 355px;
  }

  &__label {
    padding: 8px;
    &:hover {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTQ5RUNEMjEyMDY3MTFFMzlENjhCQkZEODc5M0QzOTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTQ5RUNEMjIyMDY3MTFFMzlENjhCQkZEODc5M0QzOTciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5NDlFQ0QxRjIwNjcxMUUzOUQ2OEJCRkQ4NzkzRDM5NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5NDlFQ0QyMDIwNjcxMUUzOUQ2OEJCRkQ4NzkzRDM5NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmGtzdkAAAAQSURBVHjaYv7w4aMXQIABAAjQAx8gqcVGAAAAAElFTkSuQmCC);
    }
  }

  &__title_selected {
    white-space: nowrap;
    display: -webkit-box;
    display: flex;
    overflow: hidden;
    width: calc(100% - 25px);
    text-overflow: ellipsis;
    flex-shrink: 0;
    align-self: center;
  }

  &__label-title {
    align-self: flex-start;
  }

  &__icon {
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 12px;
      width: 6px;
      height: 6px;
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      margin-left: 7px;
      right: 12px;
      z-index: 10;
    }
  }

  &__search {
    padding: 8px;
    display: flex;
    align-items: center;
  }

  &__search-icon {
    width: 16px;
    height: 15px;
    margin-right: 8px;
    margin-left: 4px;
    fill: #6e747a;
  }

  &__search-input {
    font-size: 15px;
    outline: none;
    border-top: none;
    border-right: none;
    border-left: none;
    padding: 0;
    line-height: 26px;
    height: 26px;
    border-bottom: 1px solid #4c8bf7;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>


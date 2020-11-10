<template>
  <div id="app">
    <!-- Способ распределения задач -->
    <h5>Распределение задач</h5>
    <gnzs-dropdown
      :use-empty-item="false" 
      :items="settings.typeDispensation"
      :value="settings.assignType"
      @input="changeDistributionTasks"
      @jsonEvent='jsonEvent'
    /> 
    
    <h5 class="bold">Сменить ответственного по сделке</h5>
    <h5>Выберете группу или пользователей</h5>
    <!-- По очереди -->
    <div v-if="settings.assignType == 1">
      <gnzs-responsible
        :groups="settings.groups"
        @jsonEvent='jsonEvent'
        :selectWork="selectWork"
      />
    </div>
    <!-- По процентам -->
    <div v-else-if="settings.assignType == 2">
      <gnzs-responsible-percent
        :groups="settings.groups"
        :percentsDeps="percentsDeps"
        v-on:incrPersentGroup="incrPersentGroup"
        v-on:incrPersentWorks="incrPersentWorks"
        @jsonEvent='jsonEvent'
      />
    </div>
    
    <h5>Контроль повторных сделок</h5>
    <gnzs-dropdown
      :items="settings.optionsRepeatLeadsControl"
      :use-empty-item="false"
      :value="settings.repeatLeadsControl"
      @input="changeRepeatLeadsControl"
      @jsonEvent='jsonEvent'
    /> 
    <other-options
      :otherOptions="settings.otherOptions"
      :click_ev="receivingOtherOptions"
      :flagWorkTime="true"
    />
    <div v-if="settings.otherOptions.isAssignOnlyWorkime.checked" class="dinamic_block" >
      <h5>Рабочее время</h5>
      <work-time
        :start="settings.workTime.start"
        :end="settings.workTime.end"
        :input_ev="receivingTime"
      /> 
      
      <h5>Рабочие дни</h5>
      <work-days
        :days_checket="settings.workDays"
        :click_ev="receivingDay"
      />
    </div>
    
    <other-options
      :otherOptions="settings.otherOptions"
      :click_ev="receivingOtherOptions"
    />
    
  </div>
</template>

<script>
import gnzsDropdown from './gnzs-controls/gnzs-dropdown/gnzs-dropdown.vue';
import gnzsResponsible from './components/responsible'
import gnzsResponsiblePercent from './components/responsible-percent'
import workTime from './components/work_time.vue'
import workDays from './components/work_days'
import otherOptions from './components/other_options'

export default {
  name: 'App',

  components: {
    gnzsDropdown,
    gnzsResponsible,
    gnzsResponsiblePercent,
    workTime,
    workDays,
    otherOptions
  }, 

  data(){
    return {      
      settings: {}, // объект со всеми настройками виджита заполняется в жизненном цикле created      
    }
  },

  computed: {
    
    // Общий процент по распределению задач мужду отделами 
    percentsDeps(){
      var length_groups = this.settings.groups.length;
      var percentsDeps = 0;

      for(var i = 0; i < length_groups; i++){
        percentsDeps += this.settings.groups[i].percent;
      }
      
      return percentsDeps;
    }
  },   

  methods:{
    // Смена режима распределения задач
    changeDistributionTasks(index){
      this.settings.assignType = index;
    },

    // Подсчёт процента нагрузки по группам
    incrPersentGroup(par){
      var groups = this.settings.groups;
      for(var i = 0; i < groups.length; i++){
        if(groups[i].id == par[1]){
          console.log(groups[i]);
          groups[i].percent = Number(par[0]);
          // this.percentsDeps;
          break;
        }
      }
    },

    // Подсчёт процента нагрузки по работникам в группе
    incrPersentWorks(par){
      var parentGroup;

      for(var i = 0; i < this.settings.groups.length; i++){
        var group = this.settings.groups[i];
        if(group.id == par[2]){
          parentGroup = group;
          break;
        }
      }
      
      var works = parentGroup.managers;
      var groupPercent = 0;
      for(var i = 0; i < works.length; i++){
        if(works[i].id == par[1]){
          works[i].percent = par[0];
        }
        groupPercent += Number(works[i].percent);
      }
      parentGroup.percentsWorks = groupPercent;

    },

    // Смена контроля повторных сделок
    changeRepeatLeadsControl(index){
      console.log(index)
      this.settings.repeatLeadsControl = index
      console.log(this.settings.repeatLeadsControl)
    },

    // Получение время
    receivingTime(oe){
      this.settings.workTime[oe.target.name] = oe.target.value
      this.jsonEvent()
    },

    // Получение дня
    receivingDay(oe){
      this.settings.workDays[oe.target.value].checked = oe.target.checked
      this.jsonEvent()
    },

    // Получение других опций
    receivingOtherOptions(oe){
      this.settings.otherOptions[oe.target.value].checked = oe.target.checked
      this.jsonEvent()
    },    
    
    // Обновление инпута с настройками
    jsonEvent(){
      var json_obj = JSON.stringify(this.settings);      
      const $input = $('.widget_settings_block__controls__custom');
      $input.val(json_obj).change();
      console.log(1);
    }
  },

  beforeCreate(){
    console.log('beforeCreate')            
  },

  created(){  
    console.log('created');
    

    // устанавливаем инпут с json и формируем объект в зависимости от того пуст инпут или нет
    var controlInput = document.querySelector('.widget_settings_block__controls__custom');
    var valueControlInput = controlInput.value ? controlInput.value : false

    // получаем из амо отделы и работников в них
      var deps = JSON.parse(JSON.stringify(AMOCRM.constant('groups'))); 
      // console.log(deps);
            
      var managers = JSON.parse(JSON.stringify(AMOCRM.constant('managers'))); 
      // var amoObj = AMOCRM.constant('managers');
      // console.log(managers);
      // console.log(AMOCRM.constant('managers'))
      
      // Если инпут хранения не пустой то надо сформировать список менеджеров с учётом ранее сохранённых настроек
      if(valueControlInput){
        
        // Получаем из инпута массив групп в которых уже есть работники и синхранизирёем их c иассивами из амо
        var groups = JSON.parse(controlInput.value).groups;
        // console.log(groups);
        if(groups){
          // Объект групп для хранения процентов и чикедов по ним
          var groupsObj = {};        
          // Объект где ключом будем идентификатор менеджера а значением объект по нему
          var mngrsObj = {}

          // Проходим по группам и вторым циклом по менеджерам и заполняем объект групп и менеджеров с учётом чикета
          for(var i1 = 0; i1 < groups.length; i1++){
            const group = groups[i1];
            const groupId = group.id;
            const groupName = group.name;
            const groupIsCheked = group.isChecked;
            const groupMngrs = group.managers;
            //  Создаём объект по группе и записываем по нему данные по чикеду и процентам
            groupsObj[groupId] = {}
            groupsObj[groupId].isChecked = groupIsCheked;
            groupsObj[groupId].percent = group.percent;
            groupsObj[groupId].percentsWorks = Number(group.percentsWorks);
                        
            // Проходимся по менеджерам и добавляем их в массив
            for(let i2 = 0; i2 < groupMngrs.length; i2++ ){
              const mngr = groupMngrs[i2];
              mngrsObj[mngr.id] = {};
              mngrsObj[mngr.id].id = mngr.id;
              mngrsObj[mngr.id].title = mngr.name;
              mngrsObj[mngr.id].percent = mngr.percent;
              mngrsObj[mngr.id].isChecked = mngr.isChecked;
              mngrsObj[mngr.id].group = groupId;
              mngrsObj[mngr.id].groupName = groupName;
              mngrsObj[mngr.id].groupIsCheked = groupIsCheked;
            }
          }
                    
          // проходим циклом объект менеджеров из амо и синхарнизируем их с объектом менеджеров из инпута
          for(const mngr in managers  ){
            // Если менеджер есть в инпуте но в другой группе
            if(mngrsObj[mngr] && managers[mngr].group != mngrsObj[mngr].group){
              // если новая группа есть в группах из инпута и у неё есть чикед то ставим чикед иначе оставляем тот который был
              var idNewGroup = managers[mngr].group
              var isChecked = (groupsObj && groupsObj[idNewGroup] && groupsObj[idNewGroup].isChecked) ? true : mngrsObj[mngr].isChecked
              managers[mngr].isChecked = isChecked;
            }
            // Если пользователь в той же группе что и был то присваиваем ему его чикед
            else if(mngrsObj[mngr]){
              managers[mngr].isChecked = mngrsObj[mngr].isChecked;
              // ставим процент
              managers[mngr].percent = mngrsObj[mngr].percent
            } else {
              // Если новый пользователь устанавливаем его группу и чикеду присваиваем значение чикеда группы если есть либо фалсе
              var id_group = managers[mngr].group;
              if(groupsObj[id_group]){
                managers[mngr].isChecked = (groupsObj[id_group] && groupsObj[id_group].isChecked) ? true : false;
              }else{
                false;
              }
              
            }
          }
        }
        
      
        // Получаем идентификатор объекта настроек
        var settingsId = JSON.parse(controlInput.value).settingsId;
        // По распредению задачь
        var  oldAssignType = JSON.parse(controlInput.value).assignType

        // Повторные сделки
        var oldRepeatLeadsControl = JSON.parse(controlInput.value).repeatLeadsControl
        
        // Рабочее время
        var oldWorkTime= JSON.parse(controlInput.value).workTime;

        // Рабочие дни
        var oldWorkDays = JSON.parse(controlInput.value).workDays;
        
        // Другие опции
        var oldOtherOptions = JSON.parse(controlInput.value).otherOptions
      }
      
      // Формируем окончательное состояние групп и работников
      var groups = [];
      for( var dep in deps){
        // console.log(dep + ' ' + groupsObj[dep].percentsWorks);
        var objDep = {
          id: dep, 
          name: deps[dep],
          isChecked: (groupsObj && groupsObj[dep]) ? groupsObj[dep].isChecked : false,
          percent: (groupsObj && groupsObj[dep]) ? groupsObj[dep].percent : 0,
          managers: [],
          percentsWorks: (groupsObj && groupsObj[dep]) ? groupsObj[dep].percentsWorks : 0
        }        
        for(var mngr in managers){
          mngr = managers[mngr];
          if(!mngr.active){
            continue;
          }
          
          
          if(mngr.group == objDep.id){
            var objMngr = {
              name: mngr.title,
              group: mngr.group,
              id: mngr.id,
              isChecked: mngr.isChecked || false, // судьба: группы, инпута-сохранения, новая
              percent: mngr.percent || 0,
            }
            
            objDep.managers.push(objMngr);
          }
        }
        groups.push(objDep)
      }

      // Формируем объект виджета
      this.settings = {
        // Устанавливаем идентификатор объекта настроек, идентификатор создаётся только в моомент первичного формирования объекта
        settingsId: settingsId || Math.floor(Math.random() * (100 - 10) + 10) + Date.now(),
        // Варианты способов распределения задач
        typeDispensation: [
          {value: 1, title: 'По очереди'},
          {value: 2, title: 'По процентам'},
        ],
        // Выбранный способ распределения задач
        assignType: oldAssignType || 1,

        // Группы и работники
        groups: groups,

        // Варианты перечней способов контроля повторных сделак 
        optionsRepeatLeadsControl: [
          {value: 1, title: 'Не учитывать повторные сделки'},
          {value: 2, title: 'Повторные сделки по Контакту распределять на ответственного'},
          {value: 3, title: 'Повторные сделки по Компании распределять на ответственного'},
          {value: 4, title: 'Повторные сделки по Контакту и Компании распределять на ответственного'},
        ],
        
        // Перечень способов контроля повторных сделак
        repeatLeadsControl: oldRepeatLeadsControl || 0, 
        
        // Рабочее время
        workTime: oldWorkTime || {
            start: '09:00', 
            end: '18:00',
        },

        // Рабочии дни
        workDays: oldWorkDays || {
          mon: {alias: 'mon', name: 'Пн', checked: false,},
          tue: {alias: 'tue', name: 'Вт', checked: false,},
          wed: {alias: 'wed', name: 'Ср', checked: false,},
          thu: {alias: 'thu', name: 'Чт', checked: false,},
          fri: {alias: 'fri', name: 'Пт', checked: false,},
          sat: {alias: 'sat', name: 'Сб', checked: false,},
          sun: {alias: 'sun', name: 'Вс', checked: false,},
        },

        // Иные опции
        otherOptions: oldOtherOptions || {
          isAssignOnlyWorkime: {
            alias: 'isAssignOnlyWorkime',
            name: 'Распределять только в рабочее время',
            checked: false
          },
          isAssignRepeatedLeads: {
            alias: 'isAssignRepeatedLeads',
            name: 'Распределять повторно если этап не сменится',
            checked: false
          },
          isChangeContactsRespUser: {
            alias: 'isChangeContactsRespUser',
            name: 'Сменить ответственного у контакта и компании',
            checked: false
          },
          isChangeTasksRespUser: {
            alias: 'isChangeTasksRespUser',
            name: 'Сменить ответственного у открытых задач по сделке',
            checked: false
          },
          isTriggerToCurrentDeals: {
            alias: 'isTriggerToCurrentDeals',
            name: 'Применить триггер к текущим сделкам в статусе',
            checked: false
          }
        },
      }
      console.log(this.settings.groups);
  },

  beforeMount(){
    console.log('beforeMount');
  },

  mounted(){
    console.log('mounted');
  },

  beforeUpdate(){
    console.log('beforeUpdate');
  },

  updated(){
    console.log('updated');
  }
}
</script>

<style  lang="scss">
  #app {
    padding-right: 20px;
    font-family: 'PT Sans',Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2e3640;
  }
  .bold{
    font-weight: 600;
    font-weight: bold;
  }

  .row{
    margin-bottom: 15px;
  }

  .row > * {
    margin-right: 10px;
  }
  h5{
    margin: 0 0 10px 0;
  }
  .gnzs-amo--dropdown, .work_time{
    margin-bottom: 20px;
  }
  .dinamic_block{
    padding-left: 26px;
  }
</style>

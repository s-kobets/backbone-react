import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';

import '../css/main.css';

const AppState = Backbone.Model.extend({
  defaults: {
    username: '',
    state: 'start'
  }
});

const UserNameModel = Backbone.Model.extend({
  // Модель пользователя
  defaults: {
    Name: ''
  }
});

const Family = Backbone.Collection.extend({
  // Коллекция пользователей
  model: UserNameModel,
  checkUser: function(username) {
    // Проверка пользователя
    var findResult = this.find(function(user) {
      return user.get('Name') == username;
    });
    return findResult != null;
  }
});

const MyFamily = new Family([
  // Моя семья
  { Name: 'Саша' },
  { Name: 'Юля' },
  { Name: 'Елизар' }
]);

const appState = new AppState();

const Block = Backbone.View.extend({
  el: $('#block'),
  templates: {
    // Шаблоны на разное состояние
    start: _.template($('#start').html()),
    success: _.template($('#success').html()),
    error: _.template($('#error').html())
  },
  initialize: function() {
    // Подписка на событие модели
    this.model.bind('change', this.render, this);
  },
  events: {
    'click input:button': 'check' // Обработчик клика на кнопке "Проверить"
  },
  check: function() {
    const username = $(this.el)
      .find('input:text')
      .val();
    const find = MyFamily.checkUser(username); // Проверка имени пользователя
    appState.set({
      // Сохранение имени пользователя и состояния
      state: find ? 'success' : 'error',
      username: username
    });
  },
  render: function() {
    const state = this.model.get('state');

    $(this.el).html(this.templates[state](this.model.toJSON()));
    return this;
  }
});

const block = new Block({ model: appState });
appState.trigger('change');

const Controller = Backbone.Router.extend({
  routes: {
    '': 'start', // Пустой hash-тэг
    '!/': 'start', // Начальная страница
    '!/success': 'success', // Блок удачи
    '!/error': 'error' // Блок ошибки
  },

  start: function() {
    appState.set({ state: 'start' });
  },

  success: function() {
    appState.set({ state: 'success' });
  },

  error: function() {
    appState.set({ state: 'error' });
  }
});

const controller = new Controller();

Backbone.history.start();

appState.bind('change:state', function() {
  // подписка на смену состояния для контроллера
  const state = this.get('state');
  if (state == 'start')
    controller.navigate('!/', false); // false потому, что нам не надо
  else
    // вызывать обработчик у Router
    controller.navigate(`!/${state}`, false);
});

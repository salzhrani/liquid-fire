import { setDefaults } from "./animate";
import Rule from "./rule";
import Constraint from "./constraint";
import Action from "./action";

export default class DSL {

  constructor(map) {
    this.map = map;
  }

  setDefault(props) {
    setDefaults(props);
  }

  transition() {
    var rule = new Rule();
    var parts = Array.prototype.slice.apply(arguments).reduce(function(a,b){
      return a.concat(b);
    }, []);

    for (var i = 0; i < parts.length; i++) {
      rule.add(parts[i]);
    }

    this.map.addRule(rule);
  }

  fromRoute(routeName) {
    return [
      new Constraint('oldRoute', routeName)
    ];
  }

  toRoute(routeName) {
    return [
      new Constraint('newRoute', routeName)
    ];
  }

  withinRoute(routeName) {
    return this.fromRoute(routeName).concat(this.toRoute(routeName));
  }

  fromValue(matcher) {
    return [
      new Constraint('oldValue', matcher)
    ];
  }

  toValue(matcher) {
    return [
      new Constraint('newValue', matcher)
    ];
  }

  betweenValues(matcher) {
    return this.fromValue(matcher).concat(this.toValue(matcher));
  }

  fromModel(matcher) {
    return [
      new Constraint('oldModel', matcher)
    ];
  }

  toModel(matcher) {
    return [
      new Constraint('newModel', matcher)
    ];
  }

  betweenModels(matcher) {
    return this.fromModel(matcher).concat(this.toModel(matcher));
  }

  hasClass(name) {
    return new Constraint('parentElementClass', name);
  }

  matchSelector(selector) {
    return new Constraint('parentElement', function(elt) {
      return elt.is(selector);
    });
  }

  childOf(selector) {
    return this.matchSelector(selector + ' > *');
  }

  use(nameOrHandler, ...args) {
    return new Action(nameOrHandler, args);
  }

  reverse(nameOrHandler, ...args) {
    return new Action(nameOrHandler, args, { reversed: true });
  }

  useAndReverse(nameOrHandler, ...args) {
    return [
      this.use(nameOrHandler, ...args),
      this.reverse(nameOrHandler, ...args)
    ];
  }

  onInitialRender() {
    return new Constraint('firstTime', 'yes');
  }

  includingInitialRender() {
    return new Constraint('firstTime', ['yes', 'no']);
  }

  inHelper(...names) {
    return new Constraint('helperName', names);
  }

  toModal(matcher) {
    return new Constraint('newModalComponent', matcher);
  }

  fromModal(matcher) {
    return new Constraint('oldModalComponent', matcher);
  }

  debug() {
    return 'debug';
  }
}

import simplify from './simplify';
import substitute from './substitute';
import evaluate from './evaluate';
import expressionToString from './expression-to-string';
import getSymbols from './get-symbols';
import { Parser } from './parser';
import createGenetic from './genetic.js';

export function Expression(tokens, parser) {
  this.tokens = tokens;
  this.parser = parser;
  this.unaryOps = parser.unaryOps;
  this.binaryOps = parser.binaryOps;
  this.ternaryOps = parser.ternaryOps;
  this.functions = parser.functions;
}

Expression.prototype.simplify = function (values) {
  values = values || {};
  return new Expression(simplify(this.tokens, this.unaryOps, this.binaryOps, this.ternaryOps, values), this.parser);
};

Expression.prototype.substitute = function (variable, expr) {
  if (!(expr instanceof Expression)) {
    expr = this.parser.parse(String(expr));
  }

  return new Expression(substitute(this.tokens, variable, expr), this.parser);
};

Expression.prototype.evaluate = function (values) {
  values = values || {};
  return evaluate(this.tokens, this, values);
};

Expression.prototype.maximize = function ( args ) {
  args = args || {};
  var constraints = args.constraints || [];
  console.log("constraints should be string", constraints);
  var scope = this;



  var method = args.method;
  var bestValue = -Infinity;


  //this will be called with optimal value
  var callBack = args.callBack  || function( bestValue ){
      console.log("bestValue: " + bestValue)
  };


  var genetic = createGenetic(callBack);

  var userData = 
  {
      constraints: constraints
  };
 
  
  var config = {
    "iterations": 100
    , "size": 100
    , "crossover": 0.9
    , "mutation": 0.2
    , "skip": 500
  };



genetic.evolve(config,userData);

  //we have to have some constrains to make linear optimisation
  if(constraints.length > 0){


      bestValue = 6;
  }
  else {

    bestValue = Infinity;

  }

  return bestValue;
};

Expression.prototype.toString = function () {
  return expressionToString(this.tokens, false);
};

Expression.prototype.symbols = function () {
  var vars = [];
  getSymbols(this.tokens, vars);
  return vars;
};

Expression.prototype.variables = function () {
  var vars = [];
  getSymbols(this.tokens, vars);
  var functions = this.functions;
  return vars.filter(function (name) {
    return !(name in functions);
  });
};

Expression.prototype.toJSFunction = function (param, variables) {
  var expr = this;
  var f = new Function(param, 'with(this.functions) with (this.ternaryOps) with (this.binaryOps) with (this.unaryOps) { return ' + expressionToString(this.simplify(variables).tokens, true) + '; }'); // eslint-disable-line no-new-func
  return function () {
    return f.apply(expr, arguments);
  };
};

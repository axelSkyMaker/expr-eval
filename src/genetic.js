
import Genetic from '../node_modules/genetic-js/lib/genetic.js';
import { Parser } from './parser';

var createGenetic = function ( callBack ) {
    var genetic = Genetic.create();



    // more likely allows the most fit individuals to survive between generations
    genetic.select1 = Genetic.Select1.Fittest;

    // always mates the most fit individual with random individuals
    genetic.optimize = Genetic.Optimize.Maximize;

    //create new individual
    genetic.seed = function () {
        var random1 = Math.random() * 40;
        var random2 = Math.random() * 40;
        var random3 = Math.random() * 40;

        var individual = { width: random1, height: random2, depth: random3 };

        return individual;
    };

     genetic.fitness = function (individual) {
        var width = individual.width;
        var height = individual.height;
        var base = width;
        var bigValue = 1e16;
        var constraints = this.userData.constraints;

        //creating my own sign function because dont want Math.sign behaviour at 0
        var mySign = function (boolean) {
            if ( boolean === false) {
                return 1;
            }
            else {
                return 0;
            }
        };



        var totalVolume = 1200;
        var constraint3 = 1;
        
        
        var constraintString3 = constraints[0];
        var value = Parser.evaluate(constraintString3, {x1:base,x2:height});
        


        //the volyme is the fitness
        var fitness = base * base * height - mySign(value) * bigValue;
        return fitness; 
    };



    genetic.crossOver = function (mother, father) {
        var newWidth = mother.width + father.width / 2;
        var newHeight = mother.height + father.height / 2;
        var newDepth = mother.depth + father.depth / 2;
        var child1 = { width: newWidth, height: newHeight, depth: newDepth };
        var child2 = { width: newWidth, height: mother.height, depth: newDepth };
        return [child1, child2];
    };

    genetic.mutation = function (ind) {
        ind.width = ind.width + Math.random() * 200 - 100;
        ind.height = ind.height + Math.random() * 200 - 100;
    };

    genetic.notification = function (population, generation, stats, isFinished) {
        // console.log("stats: ", stats);
        if (isFinished) {
            callBack(stats);
            // console.log("done");
        }

    };

    genetic.generation = function () {
        return true;
    };

    return genetic;

};


export default createGenetic;
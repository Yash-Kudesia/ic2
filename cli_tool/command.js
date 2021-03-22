#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
const {
    login,
    init,
    status,
    sess
} = require('./utils');

// Questions
const questions = [
    {
        type: 'input',
        name: 'username',
        message: 'Your username'
    },
    {
        type: 'input',
        name: 'password',
        message: 'Your password'
    }
];

program
    .version('1.0.0')
    .description('IC2 Client Tool');

program
    .command('start')
    .alias('s')
    .description('Authenticate yourself')
    .action(() => {
        prompt(questions).then(answers => login(answers));
    });

program
    .command('init')
    .alias('i')
    .description('Initialise the client')
    .action(() => {
        init();
    });
program
    .command('status')
    .alias('st')
    .description('Status of the program')
    .action(() => {
        status();
    });
program
    .command('session')
    .alias('se')
    .description('Details of Session')
    .action(() => {
        sess();
    });


program.parse(process.argv);
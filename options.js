const async = require('async');
const prompt = require('prompt');
const { argv } = require('yargs');
const chalk = require('chalk');
const os = require('os');

const parseOptions = (options, promptOptions, done) => {
  // options.gitAccount = `${shellQuote([options.gitUser])}:${shellQuote([options.gitPassword])}`;
  done(null, { ...options, ...promptOptions });
};

const promptUser = (options, done) => {
  const fmtDesc = (text) => `${chalk.whiteBright(text)} `;
  const { defaults, skipPrompt } = options;

  const properties = {
    isGitRepo: {
      description: fmtDesc('Is this a git repo?'),
      required: true,
      default: defaults.projectDir
    }
  };

  if (skipPrompt) {
    done(null, options, defaults);
  } else {
    prompt.message = '>>';
    prompt.delimiter = chalk.cyan('> ');
    prompt.start();
    prompt.get({ properties }, (err, promptOpts) => (
      done(null, options, promptOpts)
    ));
  }
};

const initOptions = (done) => {
  const options = {
    homeDir: os.homedir(),
    skipPrompt: argv.force || argv.skip || false,
    verbosity: argv.v || argv.verbosity || 2,
    baseJsRepo: argv.repo || argv.api || 'https://njhoffman@github.com/njhoffman/core-api.git',
    spawn: {
      stdio: argv.stdio || 'inherit',
    },
    defaults: {
      isGitRepo: argv.git || argv.gitrepo | false,
      repoName: argv.name || false,
      gitUser: argv.user || false,
      gitPassword: argv.password || argv.pass || false,
      subName: 'core'
    }
  };
  const { defaults: { repoName }, homeDir } = options;
  options.defaults.projectDir = repoName ? `${homeDir}/${repoName}` : false;
  done(null, options);
};

const getOptions = (done) => async.waterfall([
  initOptions,
  promptUser,
  parseOptions
], done);

module.exports = { getOptions };

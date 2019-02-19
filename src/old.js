let jsonConfig;

try{
  jsonConfig = require('/run/config.json');
} catch(err) {
  // Mocking data in dev mode
  jsonConfig = {
    info: {
      limits: {
        cpu: 1
      }
    }
  };
}
/**
* Read number of CPUs from environment or fallback to the _private_ configuration property
* Useful for determining the number of processes to fork.
*/
function num_of_cpus() {
  try {
    if(process.env['OMP_NUM_THREADS']) {
      return process.env['OMP_NUM_THREADS'];
    }

    return Math.ceil(jsonConfig.info.limits.cpu);
  } catch (err) {
    throw new Error('Could not get number of cpus');
  }
};

function read_base64_json(varName) {
  try {
    return JSON.parse(new Buffer(process.env[varName], 'base64').toString());
  } catch (err) {
    throw new Error(`no ${varName} environment variable`);
  }
};

/**
* Reads Platform.sh configuration from environment and returns a single object
*/
function config() {
  if(!process.env.PLATFORM_PROJECT) {
    throw Error('This is not running on platform.sh');
  }

  return {
    application: read_base64_json('PLATFORM_APPLICATION'),
    relationships: read_base64_json('PLATFORM_RELATIONSHIPS'),
    variables: read_base64_json('PLATFORM_VARIABLES'),
    application_name: process.env.PLATFORM_APPLICATION_NAME,
    app_dir: process.env.PLATFORM_APP_DIR,
    environment: process.env.PLATFORM_ENVIRONMENT,
    project: process.env.PLATFORM_PROJECT,
    routes: read_base64_json('PLATFORM_ROUTES'),
    tree_id: process.env.PLATFORM_TREE_ID,
    project_entropy: process.env.PLATFORM_PROJECT_ENTROPY,
    branch: process.env.PLATFORM_BRANCH,
    document_root: process.env.PLATFORM_DOCUMENT_ROOT,
    port: process.env.PORT,
    omp_num_threads: num_of_cpus()
  };
};

module.exports = {
  config
};

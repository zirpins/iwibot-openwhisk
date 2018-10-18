## Getting your environment set up
1. If you have not installed and configured your Bluemix CLI already, follow the steps as shown [here](https://console.bluemix.net/openwhisk/learn/cli).
2. Run `npm install` in the root directory of the project to install the serverless dependency
3. Copy the `template.local.env`, or respective on windows the `windows-template.local.env`, and paste it named `local.env`. Then add your IBM credentials to the `local.env`. Optionally add another organization and space.
4. Login to your IBMCloud-CLI on linux via `./bx_authenticate.sh` and on windows via `call bx_authenticate.bat`.

The commands shown bellow need the `serverless` framework to be installed globally, otherwise you need to execute the appropriate commands through the `package.js` scripts section.  
To install `serverless` globally type `sudo npm i -g serverless`.

After you installed `serverless` globally you can start creating a template with `sls iwibot template create --kind nodejs --name test`.   

### Working with the Serverless Framework
For the deployment of the functions we are using the serverles framework. All information that are needed for the deployment are kept inside the  ***__serverless.yml__*** found at the root of the openwhisk folder.

A plugin is added to extend the serverless framework functionality.
* `sls iwibot` will package and deploy all enabled functions
* `sls iwibot enable` enables all functions in the `serverless.yml` file
* `sls iwibot enable --fn Router` enable *only* Router function in the `serverless.yml` file
* `sls iwibot disable` disables all functions in the `serverless.yml` file
* `sls iwibot disable --fn Router` disable *only* Router function in the `serverless.yml` file
* `sls iwibot remove` removes all, in the `serverless.yml`, enabled functions. With `--force | -f` you can force a deletion of all deployed functions 
* `sls iwibot package` will package enabled functions. The artifacts are stored in the `.serverless/` directory 
* `sls iwibot deploy` will package and deploy enabled functions
* `sls iwibot service bind` binds resources of enabled functions, to the functions
* `sls iwibot service unbind` unbinds resources of enabled functions, to the functions
* `sls iwibot api bind` configures the api gateway definitions of enabled functions
* `sls iwibot api unbind` deletes the api gateway definitions of enabled functions
* `sls iwibot bind` configures api gateway definitions and bind services *(shorthand for `sls iwibot service bind` and `sls iwibot api bind`)*
* `sls iwibot unbind` remove the api gateway definitions and service bindings *(shorthand for `sls iwibot service unbind` and `sls iwibot api unbind`)*
* `sls iwibot template create --name test --kind nodejs|go|python|php|java` creates a funtion template based on the kind. `-n` is the shorcut for `--name` and `-k` for `--kind. 

If you want to bind resources to or create api's for functions, first you __*need*__ to __*deploy*__ the functions! After that be sure, that the needed environment variables are visible (local.env). The authenticate scripts make the env vars visible. Then you can invoke `sls iwibot service bind` and `sls iwibot api bind` or the shorthand `sls iwibot finalize`.

Detailed information on how to work with the serverless framework can be found [here](https://serverless.com/framework/docs/providers/openwhisk/).

## Function Template's  
In summary, till now, there are five templates:
* NodeJS 8 (npm) 
* Go (go get)
* Java (maven)
* PHP 7.2 (composer)
* Python 3 (pip)

So you are not fixed to one language. If you wish to, you can change to Python or Java.

### NodeJS
For building a ***__nodejs__*** function you need the node package manager (npm), so install [nodejs](https://nodejs.org/en/download/package-manager/) for your OS. The package manager is shipped with nodejs.  
You can also install it via your favour package manager!
Dependencies can be searched on [npmjs](https://www.npmjs.com/) and goes into the `package.json`.

To create a nodejs template, invoke the following command: `sls iwibot template create -n name -k nodejs` where **name** is the name of your function.

### Go
If you like to write a ***__go__*** function, install [go tools](https://golang.org/doc/install#install) to be able to build go functions.  
These are the [standard libraries](https://golang.org/pkg/#stdlib) in go.

To create a go template, invoke the following command: `sls iwibot template create -n name -k go` where **name** is the name of your function.
  
Put the dependencies, like normal in go, in the go file imports. When `sls iwibot package` is invoked, the dependencies will be downloaded and the binary be build and zipped.
 
### Java
The ***__java__*** functions require maven for building the project.   
1. download maven from [here](https://maven.apache.org/download.cgi)
2. install maven like [here](https://maven.apache.org/install.html); or via your favorite package manager
3. search for dependencies at [maven central](https://mvnrepository.com/)
4. add to the `pom.xml`

To create a java template, invoke the following command: `sls iwibot template create -n name -k java` where **name** is the name of your function. 

### Python
You can also write your program in ***__python__***. The needed dependencies can be added to the requirements.txt.  
The [Python Requirements Pugin](https://www.npmjs.com/package/serverless-python-requirements) is used for packaging python functions.

To create a python template, invoke the following command: `sls iwibot template create -n name -k python` where **name** is the name of your function.

### PHP
For writing ***__php__*** functions you need to install [composer](https://getcomposer.org/download/).  
Dependencies you can search at [packagist](https://packagist.org/) and add to the `composer.json`.

To create a php template, invoke the following command: `sls iwibot template create -n name -k php` where **name** is the name of your function.

### Common Infos

To deploy your own Router, till now you need to add your `workspace_id` to `nodejs-router/lib/conversation.js` and then package and deploy the Router function.

Via `enabled: true` in the `serverless.yml` file the functions can be enabled and disabled for packaging and deployment.  

When a template is created via `sls iwibot template create` it is enabled by default. Only the functions you're working on should be enabled to reduce the development time and prevent failures. 

**Service bindings** and **routes** can be *configured* like in the **Router** function.

If you want to **bind a new service**: `type` is the **service offer**, eg. conversation|weatherinsights, `instance` is the **service name** and `key` is the name of the **service Credentials** you want to bind (eg. Credentials-1).   

## Testing
Enable all functions with `sls iwibot enable`. Deploy the functions with `sls iwibot deploy test`, get the Test-API-URL with `ibmcloud wsk api list`. Copy the URL of `/iwibotTest` API to your clipboard and paste it as the `ACTION_PREFIX_URL` value in `local.env`.  

For testing the nodejs functions, install the dependencies with `./installFunctionDependencies.sh`. Prepare your test environment with `source local.env` on linux or `call local.env` on windows and run `npm test`.  

## Tips & Infos
[IBM Openwhisk System Details and Limits](https://console.bluemix.net/docs/openwhisk/openwhisk_reference.html#openwhisk_reference)  
The maximum size of the zip file to be uploaded is 48MB!

When any problems occur, feel free to open a new Issue.

Please add IDE specified directories to the `.gitignore` file.

If a new runtime should be supported, the build and the deploy part must be implemented into the [Serverless Build Plugin](https://github.com/HSKA-IWI-VSYS/iwibot-serverless-build-plugin).

The `js-yaml` and `ncp` dependencies in the `package.json` are needed for the `iwibot-serverless-build-plugin`. Other dependencies for this plugin must be added to the `package.json` as well.

When you have a deployment error and in the shown url is something like `placeholder/_/placeholder` then check your `.wskprops` file in your home directory. The `NAMESPACE` value could be empty. To fix this just overwrite the `OW_NAMESPACE=_` with `NAMESPACE=ORG_SPACE` where `ORG` is the wanted organization and `SPACE` the space.

Rules and Feeds are not supported, but can be implemented!  
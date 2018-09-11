## Getting your environment set up
1. If you have not installed and configured your Bluemix CLI already, follow the steps as shown [here](https://console.bluemix.net/openwhisk/learn/cli).
2. Run `npm install` in the root directory of the project to install the serverless dependency
3. Run `npm run deploy` to deploy and `npm run undeploy` to undeploy the functions

### Working with the Serverless Framework
For the deployment of the functions we are using the serverles framework. All information that are needed for the deployment are kept inside the  ***serverless.yml*** found at the root of the openwhisk folder.

Detailed information on how to work with the serverless framework can be found [here](https://serverless.com/framework/docs/providers/openwhisk/).
### NodeJS
For the ***nodejs*** actions you need the node package manager (npm), so install [nodejs](https://nodejs.org/en/download/package-manager/) for your OS. The package manager is shipped with nodejs.  
You can also install it via your favour package manager!
Dependencies can be searched on [npmjs](https://www.npmjs.com/) and goes into the `package.json`.

### Go
If you like to write a ***go*** action, install [go tools](https://golang.org/doc/install#install) to be able to build go actions.  
These are the [standard libraries](https://golang.org/pkg/#stdlib) in go.
 
### Java
The ***java*** actions require maven for building the project.   
1. download maven from [here](https://maven.apache.org/download.cgi)
2. install maven like [here](https://maven.apache.org/install.html)
3. search for dependencies at [maven central](https://mvnrepository.com/)
4. add to the `pom.xml`

or..  

... use apt or other package managers where maven is distributed over.  

### Python
You can also write your program in ***python***.

Now there is no mechanism to include dependencies; if you like to do that read the python action README.md.    

When a mechanism for the dependencies is established, you will probably need python package manager (pip). [Here]() you can install it from or use the package manager of your choice to install it.

### PHP
For writing ***php*** actions you need to install [composer](https://getcomposer.org/download/).  
Dependencies you can search at [packagist](https://packagist.org/) and add to the `composer.json`.

## Action Templates  
In summary, till now, there are five templates:
* NodeJS (npm) 
* Go (go get)
* Java (maven)
* PHP (composer)
* Python (pip)

So you are not fixed to one language. If you wish to, you can change to Python or Java.

For the usage of every template you need to make a **copy** of the template directory you wish and change it's name. If you like to develop in java just name the copy **java**-MyAction. **_Use always the template language as prefix of the name of your action._** 

## Use a Go Template  
Just copy the `template-go` directory and name it `go-ActionName`.  
Put the dependencies, like normal in go, in the go file imports. When you execute `deploy.sh` the dependencies will be downloaded, the binary will be build and zipped and the zip will be uploaded.
 
## Use a NodeJS Template

## Use a Java Template

## Use a Python Template

## Use a PHP Template

## Tips and tricks  
The maximum size of the zip file to be uploaded is 48MB!

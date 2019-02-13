@ECHO OFF
:: Login requiered to provision the API Gateway
call local.cmd
ibmcloud login -a %API_ENDPOINT% -u %BLUEMIX_USERNAME% -p %BLUEMIX_PASSWORD% -o %BLUEMIX_ORGANIZATION% -s %BLUEMIX_SPACE%
:: target org in cf
ibmcloud target --cf %BLUEMIX_ORGANIZATION%
ibmcloud target -o %BLUEMIX_ORGANIZATION% -s %BLUEMIX_SPACE%
:: install wsk plugin for the bluemix cli
ibmcloud plugin install cloud-functions

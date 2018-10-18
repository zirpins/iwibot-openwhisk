# Watson Assistant workspace for the IWIBot

Exported Watson Assistant workspace from the IWIBot.

## Creating a Watson Assistant workspace
1. Clone the repository. In a console run:
    ```
    $ git clone https://github.com/HSKA-IWI-VSYS/iwibot-openwhisk
    ```
1. Create your own Watson Assistant service:
    1. Navigate to [Watsons Assistant](https://console.bluemix.net/catalog/services/conversation)
    2. Name the service `conversation` and choose the region, organisation and space you want to deploy it to.
    3. Click `create` on the bottom-right corner 
2. Click on `Starttool` to open the Watson Assistant web interface.  
If you have not been redirected to your services page after creating it, navigate to the [dashboard](https://console.bluemix.net/dashboard/apps), find and select your service (conversation), then click on `Starttool`.
3. Click on `Create Workspace`  
4. Click on the import symbol next to the title "Workspaces" and select the `conversation_backup/conversation_backup.json` located in your cloned repository.
    
Further information about working with the Watson Assistant can be found [here](https://console.bluemix.net/docs/services/conversation/index.html#about).
#!/bin/bash
# Login requiered to provision the API Gateway
source local.env
ibmcloud login -a "$API_ENDPOINT" -u "$BLUEMIX_USERNAME" -p "$BLUEMIX_PASSWORD" \
    -o "$BLUEMIX_ORGANIZATION" -s "$BLUEMIX_SPACE" \
# target org in cf
ibmcloud target --cf "$BLUEMIX_ORGANIZATION"
# install wsk plugin for the bluemix cli
ibmcloud plugin install cloud-functions -r IBM Cloud

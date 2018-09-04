#!/bin/bash
# Login requiered to provision the API Gateway
source local.env
bx login -a "$API_ENDPOINT" -u "$BLUEMIX_USERNAME" -p "$BLUEMIX_PASSWORD" \
    -o "$BLUEMIX_ORGANIZATION" -s "$BLUEMIX_SPACE" \
# target org in cf
bx target --cf "$BLUEMIX_ORGANIZATION"
# install wsk plugin for the bluemix cli
bx plugin install Cloud-Functions -r Bluemix

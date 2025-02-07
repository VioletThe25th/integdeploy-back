FROM mongo

COPY init.json /init.json

CMD mongoimport --host mongo_db --db IntegDeploy --collection users --type json --file /init.json --jsonArray
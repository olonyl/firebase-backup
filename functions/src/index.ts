import * as functions from "firebase-functions";

import { firestore } from 'firebase-admin';

const client = new firestore.v1.FirestoreAdminClient();

exports.backupDatabaseFunction = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
    const projectId = (process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT) || "XXXX";
    const databaseName = client.databasePath(projectId, '(default)');
    return client
        .exportDocuments({
            name: databaseName,
            outputUriPrefix: `gs://${projectId}-backup`,
            collectionIds: [],
        })
        .then(responses => {
            const response = responses[0];
            console.log(`Operation Name: ${response['name']}`);
        })
        .catch(err => {
            console.error(err);
            throw new Error('Export operation failed');
        });
});
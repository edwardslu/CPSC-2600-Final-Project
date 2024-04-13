(() => {
    let config = require(`${__dirname}/config/config`);

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = `mongodb+srv://${config.USERNAME}:${config.PASSWORD}@${config.SERVER}/?retryWrites=true&w=majority&appName=${config.DATABASE}`;


    const run = async () => {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        try {
            await client.connect();
            console.log(client.db());
            return client.db();
        } catch {
            console.error('Error connecting to MongoDB');
        }
    }


    const find = async (collection, query) => {
        return collection.find(query).toArray()
            .catch(err => {
                console.log("Could not find ", query, err.message);
            })
    }

    const deleteMany = async (collection, query) => {
        return collection.deleteMany(query)
            .catch(err => {
                console.log("Could not delete many ", query, err.message);
            })
    }

    const deleteOne = async (collection, query) => {
        return collection.deleteOne(query)
            .catch(err => {
                console.log("Could not delete one ", query, err.message);
            })
    }

    const insertMany = async (collection, documents) => {
        return collection.insertMany(documents)
            .then(res => console.log("Data inserted with IDs", res.insertedIds))
            .catch(err => {
                console.log("Could not add data ", err.message);
                if (!(err.name === 'BulkWriteError' && err.code === 11000)) throw err;
            })
    }

    const insertOne = async (collection, document) => {
        return await collection.insertOne(document)
            .then(res => console.log("Data inserted with ID", res.insertedId))
            .catch(err => {
                console.log("Could not add data ", err.message);
                if (!(err.name === 'BulkWriteError' && err.code === 11000)) throw err;
            })
    }

    const util = {
        run: run,
        client: client,
        uri: uri,
        username: 'elu09',
        password: 'cpsc2190',
        port: 22643,
        database: 'forum',
        collections: ['logs', 'posts', 'users', 'roles'],
        logRequest: logRequest,
        find: find,
        insertOne: insertOne,
        insertMany: insertMany
    }
    const moduleExport = util;
    if (typeof __dirname != 'undefined')
        module.exports = moduleExport;

})
(() => {
    const MongoClient = require('mongodb').MongoClient;
    const express = require('express');
    const connection = require('./config/config');
    const Log = require('./log.js');
    let mongoClient = undefined;


    //-------------------------------------------------------------------------
    /**
     * Connection Strings
     */
    //-------------------------------------------------------------------------
    //----------------------------------------------------------------
    //let uri = 
    const getUri = () => {
        return `mongodb+srv://${connection.USERNAME}:${connection.PASSWORD}@${connection.SERVER}/${connection.DATABASE}?retryWrites=true&w=majority`;
    }

    const getMongoClient = () => {
        let uri = 'mongodb+srv://'+connection.USERNAME+':'+connection.PASSWORD+'@'+connection.SERVER+'/'+connection.DATABASE+'?retryWrites=true&w=majority';
        console.log(`\t|Connection String<<${uri}>>`)
        if (!mongoClient)
            mongoClient = new MongoClient(uri)
        return mongoClient
    }
    //-------------------------------------------------------------------------
    /**
     * Data Manipulation Language (DML) functions
     */
    //-------------------------------------------------------------------------
    //find matching documents
    const find = async (collection, query) => {
        return collection.find(query).toArray()
            .catch(err => {
                console.log("Could not find ", query, err.message);
            })
    }
    //delete matching documents
    const deleteMany = async (collection, query) => {
        return collection.deleteMany(query)
            .catch(err => {
                console.log("Could not delete many ", query, err.message);
            })
    }
    //delete one matching document
    const deleteOne = async (collection, query) => {
        return collection.deleteOne(query)
            .catch(err => {
                console.log("Could not delete one ", query, err.message);
            })
    }
    //insert data into our collection
    const insertMany = async (collection, documents) => {
        return collection.insertMany(documents)
            .then(res => console.log("Data inserted with IDs", res.insertedIds))
            .catch(err => {
                console.log("Could not add data ", err.message);
                //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
                if (!(err.name === 'BulkWriteError' && err.code === 11000)) throw err;
            })
    }
    const insertOne = async (collection, document) => {
        return await collection.insertOne(document)
            .then(res => console.log("Data inserted with ID", res.insertedId))
            .catch(err => {
                console.log("Could not add data ", err.message);
                //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
                if (!(err.name === 'BulkWriteError' && err.code === 11000)) throw err;
            })
    }
    //-------------------------------------------------------------------------
    const logRequest = async (req, res) => {
        const client = getMongoClient();
        client.connect()
            .then(conn => {
                console.log('\t|inside connect()')
                console.log('\t|Connected successfully to MongoDB!',
                    conn.s.url.replace(/:([^:@]{1,})@/, ':****@'))

                let collection = client.db().collection("Log")
                let log = Log(req.method, req.url, req.query, res.statusCode)
                util.insertOne(collection, log)

            })
            .catch(err => console.log(`\t|Could not connect to MongoDB Server\n\t|${err}`))
    }
    const util = {
        getUri: getUri,
        getMongoClient: getMongoClient,
        logRequest: logRequest,
        find: find,
        insertOne: insertOne,
        insertMany: insertMany
    }
    const moduleExport = util
    if (typeof __dirname != 'undefined')
        module.exports = moduleExport
})()
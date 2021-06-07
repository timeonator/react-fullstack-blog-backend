import MongoClient from 'mongodb'

const withDB = async (operations) => {
    try {
        const articleName = req.params.name;
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        const db = client.db('myDB');
        operations(db)
        client.close();
    } catch(error) {
        res.send(500).send({message:'Something went wrong', error});      
    }
}
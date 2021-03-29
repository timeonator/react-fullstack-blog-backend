import express from 'express';
import bodyParser,{json} from 'body-parser';
import MongoClient from 'mongodb'

const app = express();
const uri = 'mongodb://localhost:27017';

const wrapArticleDB = async (operation) => {
    try {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        const db = client.db('myDB');
        operation(db);
        // client.close();              
    } catch(error) {
        res.status(500).send("Wrap Something went wrong")
    }


}

app.use(json())
app.post('/api/articles/:name/upvote', async (req,res) => {

    wrapArticleDB(async (db) => {
        const articleName = req.params.name;
        const articleInfo = await db.collection('articles').findOne({name : articleName});
        await db.collection('articles').updateOne({name:articleName},{
            '$set': {
                upvotes : 1 + articleInfo.upvotes
            }
        })
        const updatedArticleInfo = await db.collection('articles').findOne({name : articleName});
        // console.log("wrapp exec", updatedArticleInfo);
        res.status(200).send(updatedArticleInfo);
    });
});


app.post('/api/articles/:name/add-comment', (req,res) =>{
    let name = req.params.name;
    let {username,text} = req.body
    console.log (name, username, text);
    articleInfo[name].comments.push({username,text});
    res.status(200).send(articleInfo[name]);
})


app.get('/api/articles/all', (async (req,res) => {
    try {
        const articleName = req.params.name;
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        const db = client.db('myDB');
        const articles = db.collection('articles');
        const query = "{}"; const options = "{}";
        const cursor = articles.find(query);
        const articleInfo = (await cursor.toArray());
        await client.close();
        res.send(articleInfo);
    } 
    catch(error) {
        res.send(500).send({message:'Something went wrong', error});      
    }
}));
app.get('/api/articles/:name', (async (req,res) => {
    try {
        const articleName = req.params.name;
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = client.db('myDB');
        const articles = db.collection('articles');
        const query = {name:articleName}; const options = {};
        const articleInfo = articles.find(query).toArray();
        res.send(await articleInfo);   
        await client.close();

    } 
    catch(error) {
        res.send(500).send({message:'Something went wrong', error});      
    }
}));

app.get('/hello',(req,res) => res.send('hello'));
app.post('/hello',(req,res) => res.send(`Hello ${req.body.name}!`));
app.get('/hello/:name',(req,res) => res.send(`Hello ${req.params.name}!`));

app.listen(8000, () => console.log("listening on port 8000:"));
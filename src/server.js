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
    let {username,text} = req.body;
    const articleName = req.params.name;

    wrapArticleDB(async (db) => {
        const articleInfo = await db.collection('articles').findOne({name : articleName});
        console.log(articleInfo);
        articleInfo.comments.push({username,text});
        await db.collection('articles').updateOne({name:articleName},{
            '$set': {
                comments : articleInfo.comments
            }
        })
    res.status(200).send(articleInfo);        
    })
})


app.get('/api/articles/all', (async (req,res) => {
    wrapArticleDB(async (db) => {
        const articleName = req.params.name;
        const articles = db.collection('articles');
        const query = "{}";
        const cursor = articles.find(query);
        const articleInfo = (await cursor.toArray());
        res.status(200).send(articleInfo);
        cursor.close();
    });
}));


app.get('/api/articles/:name', (async (req,res) => {
    wrapArticleDB(async (db) => {
        const articleName = req.params.name;       
        const articles = db.collection('articles');
        const query = {name:articleName}; const options = {};
        const articleInfo = (await articles.find(query).toArray())[0];
        res.status(200).send(articleInfo);   
    })
}));

app.get('/hello',(req,res) => res.send('hello'));
app.post('/hello',(req,res) => res.send(`Hello ${req.body.name}!`));
app.get('/hello/:name',(req,res) => res.send(`Hello ${req.params.name}!`));

app.listen(8000, () => console.log("listening on port 8000:"));
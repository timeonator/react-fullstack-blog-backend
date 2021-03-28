import express from 'express';
import bodyParser,{json} from 'body-parser';
import MongoClient from 'mongodb'

const app = express();

const withDB = (op) => {

}

app.use(json())
app.post('/api/articles/:name/upvote', (req,res) => {
    let name = req.params.name;
    articleInfo[name].upvotes += 1;
    res.status(200).send(`${name} now has ${articleInfo[name].upvotes} upvotes!`);
});
app.post('/api/articles/:name/add-comment', (req,res) =>{
    let name = req.params.name;
    let {username,text} = req.body
    console.log (name, username, text);
    articleInfo[name].comments.push({username,text});
    res.status(200).send(articleInfo[name]);
})


app.get('/api/article/all', (async (req,res) => {
    const uri = 'mongodb://localhost:27017';
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
app.get('/api/article/:name', (async (req,res) => {
    const uri = 'mongodb://localhost:27017';
    try {
        const articleName = req.params.name;
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
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
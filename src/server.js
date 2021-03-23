import express from 'express';
import bodyParser,{json} from 'body-parser';
const app = express();

const articleInfo = {
    'learn-react': {
        upvotes: 0,
        comments: [],
    },
    'learn-node': {
        upvotes: 0,
        comments: [],
    },
    'my-thoughts-on-resumes': {
        upvotes: 0,
        comments: [],
    },
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
} )

app.get('/hello',(req,res) => res.send('hello'));
app.post('/hello',(req,res) => res.send(`Hello ${req.body.name}!`));
app.get('/hello/:name',(req,res) => res.send(`Hello ${req.params.name}!`));

app.listen(8000, () => console.log("listening on port 8000:"));
import express, {Request, Response, NextFunction, Router} from 'express';
import cors from 'cors';
import Users from './classes/Users';
import {registerValidate, loginValidate, userValidate, noteValidate} from './middlewares/middlewares';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

const port = process.env.PORT || 8080;

export const userList: Users[] = [];

app.get('/users', (req: Request, res: Response) => {
    return res.json(userList);
});

app.post('/register', registerValidate, (req: Request, res: Response) => {
    return res.status(201).json({
        message: 'Cadastrado com sucesso.'
    });
});

app.post('/login', loginValidate, (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'Redirecionando...'
    });
});

app.post('/notes', userValidate, (req: Request, res: Response) => {
    res.status(200).json({
        mensagem: 'Logado com sucesso.'
    });
});

app.post('/:name/notes', noteValidate, (req: Request, res: Response) => {
    return res.status(201).json({
        message: 'Nota adicionada.'
    });
});

app.delete('/:name/notes/:noteId', (req: Request, res: Response) => {
    const {name, noteId} = req.params;
    const findUser = userList.findIndex(user => user.name === name);
    const findNoteId = userList[findUser].notes.findIndex(note => note.id === parseInt(noteId));

    return userList[findUser].notes.splice(findNoteId, 1),
    res.json({
        message: 'Nota apagada.'
    });
});

app.put('/:name/notes/:noteId', (req: Request, res: Response) => {
    const {name, noteId} = req.params;
    const {note} = req.body;
    const findUser = userList.findIndex(user => user.name === name);
    const findNoteId = userList[findUser].notes.findIndex(note => note.id === parseInt(noteId));

    return userList[findUser].notes[findNoteId].note = note,
    res.json('Nota editada.');
});

app.listen(port, () => {
    console.log(`API's running on ${port} port.`);
});
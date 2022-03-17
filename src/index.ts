import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import Users from './Class/Users';
import Notes from './Class/Notes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

const port = process.env.PORT || 8080;

const userList: Users[] = [];

app.get('/users', (req: Request, res: Response) => {
    return res.json(userList);
});

app.post('/register', registerValidate, (req: Request, res: Response) => {
    return res.status(201).json({
        message: 'Cadastrado com sucesso.'
    });
});

function registerValidate(req: Request, res: Response, next: NextFunction) {
    const {name, password} = req.body;
    const newUser = new Users(name, password);
    const userName = userList.find(user => user.name === name);
    let validate = true;

    if(!name || !password) {
        return validate = false,
        res.status(400).json({
            message: 'Preencha todos os campos.'
        });
    }

    if(newUser.name.length <= 3) {
        return validate = false,
        res.status(400).json({
            message: 'O nome deve conter no mínimo 4 caracteres.'
        });
    }

    if(newUser.password.length <= 7) {
        return validate = false,
        res.status(400).json({
            message: 'A senha deve conter no mínimo 8 caracteres.'
        });
    }

    if(userName) {
        return validate = false,
        res.status(401).json({
            message: 'Usuário já cadastrado.'
        });
    }

    if(validate === true) {
        return userList.push(newUser),
        next();
    }
}

app.post('/login', loginValidate, (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'Redirecionando...'
    });
});

function loginValidate(req: Request, res: Response, next: NextFunction) {
    const {name, password} = req.body;
    const userName = userList.find(user => user.name === name);
    const userPassword = userList.find(user => user.password === password);
    let validate = true;

    if(!userName || !userPassword) {
        return validate = false,
        res.status(400).json({
            message: 'Nome ou senha incorretos.'
        });
    }

    if(validate === true) {
        return next();
    }
}

app.post('/notes', userValidate, (req: Request, res: Response) => {
    res.status(200).json({
        mensagem: 'Logado com sucesso.'
    });
});

function userValidate(req: Request, res: Response, next: NextFunction) {
    const {name} = req.body;
    const userName = userList.find(user => user.name === name)?.name;
    let validate = true;

    if(name !== userName) {
        return validate = false,
        res.status(404).json({
            mensagem: 'Usuário não está logado.'
        });
    }

    if(validate === true) {
        next();
    }
}

app.post('/:name/notes', noteValidate, (req: Request, res: Response) => {
    return res.status(201).json({
        message: 'Nota adicionada.'
    });
});

function noteValidate(req: Request, res: Response, next: NextFunction) {
    const {name} = req.params;
    const {note} = req.body;
    const addNote = new Notes(note);
    const findUser = userList.findIndex(user => user.name === name);
    let validate = true;

    if(!note) {
        return validate = false,
        res.status(400).json({
            message: 'Preencha o campo.'
        });
    }

    if(note.length > 56) {
        return validate = false,
        res.status(400).json({
            message: 'Este campo não deve conter mais que 56 caracteres.'
        });
    }

    if(validate === true) {
        return userList[findUser].notes.push(addNote),
        next();
    }
}

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
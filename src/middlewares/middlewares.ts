import express, {Request, Response, NextFunction} from 'express';
import Users from '../classes/Users';
import Notes from '../classes/Notes';
import {userList} from '../index';

export function registerValidate(req: Request, res: Response, next: NextFunction) {
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

export function userValidate(req: Request, res: Response, next: NextFunction) {
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

export function loginValidate(req: Request, res: Response, next: NextFunction) {
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

export function noteValidate(req: Request, res: Response, next: NextFunction) {
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
import Notes from './Notes';

export default class User {
    id: number;
    notes: Notes[] = [];
    constructor(public name: string, public password: string) {
        this.id = Math.floor(Math.random() * 250);
    }
}
export default class Notes {
    id: number;
    constructor(public note: string) {
        this.id = Math.floor(Math.random() * 250);
    }
}
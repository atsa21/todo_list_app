import { Priority } from "./priority.model";

export class Todo {
    key?: string | null;
    category?: string;
    task?: string[];
    date?: string;
    priority?: Priority;
    tags?: string[];
    cheched?: boolean;
    authorId?: string;
}
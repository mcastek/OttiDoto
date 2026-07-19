import { db } from "../../db";
import { CreateSubTask, subTasksTable } from "../../db/schemas";

export class SubTaskServices {
    async create(subTask_data: CreateSubTask): Promise<void> {
        await db.insert(subTasksTable).values(subTask_data)
    }
}
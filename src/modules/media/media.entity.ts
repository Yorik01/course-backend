import {
    Column,
    Entity,
    Index,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Course } from "../course/course.entity";
import { LessonMaterial } from "../course/lesson/lesson-material/lesson-material.entity";
import { User } from "../user/user.entity";

@Index("media_file_name_uindex", ["fileName"], { unique: true })
@Index("media_pk", ["id"], { unique: true })
@Entity({ name: 'media' })
export class Media {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    fileName: string;

    @Column({ type: 'varchar', length: 255 })
    mimetype: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title?: string;

    @OneToOne(
        () => Course,
        course => course.media)
    course: Course;

    @OneToOne(
        () => LessonMaterial,
        lessonMaterial => lessonMaterial.media
    )
    lessonMaterial: LessonMaterial;

    @OneToMany(
        () => User,
        users => users.media
    )
    users: User[];
}  
import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional-cls-hooked";

import { LessonType } from "../../../../common/enums/lesson-type.enum";

import { MediaService } from "../../../media/media.service";
import { LessonMaterial } from "./lesson-material.entity";

import { CreateLessonMaterialRequestDto } from "./dto/request/create-lesson-material.request-dto";

import { LessonMaterialService } from "./lesson-material.service";
import { TestService } from "./test/test.service";
import { TextContentService } from "./text-content/text-content.service";
import { Lesson } from "../lesson.entity";

@Injectable()
export class LessonMaterialFacade {

    constructor(
        private readonly lessonMaterialService: LessonMaterialService,
        private readonly testService: TestService,
        private readonly textContentService: TextContentService,
        private readonly mediaService: MediaService
    ) { }

    @Transactional()
    public async createMany(createDtos: CreateLessonMaterialRequestDto[], lessonId: number): Promise<LessonMaterial[]> {
        const lessonMaterials: LessonMaterial[] = [];

        for (const createDto of createDtos) {
            const lessonMaterial = this.lessonMaterialService.createEntity(createDto, lessonId);
            await this._attachMaterial(lessonMaterial, createDto);

            lessonMaterials.push(lessonMaterial);
        }
        return this.lessonMaterialService.createMany(lessonMaterials);
    }

    @Transactional()
    public async deleteAttachedMaterials(lesson: Lesson): Promise<void> {
        for (const material of lesson.lessonMaterials) {
            await this._deleteAttachedMaterial(material);
        }
    }

    private async _attachMaterial(lessonMaterial: LessonMaterial, createDto: CreateLessonMaterialRequestDto): Promise<void> {
        switch (lessonMaterial.type) {
            case LessonType.Text:
                const textContent = await this.textContentService.create(createDto.textContent);
                lessonMaterial.textContentId = textContent.id;
                break;
            case LessonType.Test:
                const test = await this.testService.create(createDto.test);
                lessonMaterial.testId = test.id;
                break;
            default:
                const media = await this.mediaService.getUnboundByIdOrFail(createDto.mediaId);
                lessonMaterial.mediaId = media.id;
                break;
        }
    }

    private async _deleteAttachedMaterial(lessonMaterial: LessonMaterial): Promise<void> {
        switch (lessonMaterial.type) {
            case LessonType.Text:
                await this.textContentService.deleteById(lessonMaterial.textContentId);
                break;
            case LessonType.Test:
                await this.testService.deleteById(lessonMaterial.testId);
                break;
            default:
                await this.mediaService.deleteById(lessonMaterial.mediaId);
                break;
        }
    }
}
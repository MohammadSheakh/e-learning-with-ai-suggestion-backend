import { StatusCodes } from 'http-status-codes';
import { AdminModuleProgress } from './adminModuleProgress.model';
import { IAdminModuleProgress } from './adminModuleProgress.interface';
import { GenericService } from '../../_generic-module/generic.services';
import mongoose from 'mongoose';

export class AdminModuleProgressService extends GenericService<
  typeof AdminModuleProgress,
  IAdminModuleProgress
> {
  constructor() {
    super(AdminModuleProgress);
  }


  async getModuleProgressByCapsule(capsuleId: string, studentId: string) {
    return await AdminModuleProgress.aggregate(
    [

      // Step 1: Match this student's module progress for this capsule
      {
        $match: {
          capsuleId: new mongoose.Types.ObjectId(capsuleId),
          studentId: new mongoose.Types.ObjectId(studentId),
        },
      },

      // Step 2: Join with Module to get title, description, orderNumber
      {
        $lookup: {
          from: 'adminmodules',
          localField: 'moduleId',
          foreignField: '_id',
          as: 'moduleInfo',
        },
      },
      { $unwind: '$moduleInfo' },

      
      // Step 3: Join LessonProgress for this module + student
      {
        $lookup: {
          from: 'lessonprogress',
          let: { moduleId: '$moduleId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$moduleId', '$$moduleId'] },
                    { $eq: ['$studentId', new mongoose.Types.ObjectId(studentId)] },
                  ],
                },
              },
            },

            /*-----------------------------------

            // Join each lessonProgress with Lesson to get title, duration, orderNumber
            {
              $lookup: {
                from: 'lessons',
                localField: 'lessonId',
                foreignField: '_id',
                as: 'lessonInfo',
              },
            },
            { $unwind: '$lessonInfo' },

            // Sort lessons by orderNumber
            { $sort: { 'lessonInfo.orderNumber': 1 } },

            ----------------------------------*/

            {
              $project: {
                _id: 1,
                lessonId: 1,
                status: 1,
                lastViewedAt: 1,
                completedAt: 1,
                // Lesson content fields
                title: '$lessonInfo.title',
                duration: '$lessonInfo.duration',
                orderNumber: '$lessonInfo.orderNumber',
                attachments: '$lessonInfo.attachments',
              },
            },
          ],
          as: 'lessons',
        },
      },
      

      // Step 4: Sort modules by orderNumber
      { $sort: { 'moduleInfo.orderNumber': 1 } },

      // Step 5: Project final shape
      {
        $project: {
          _id: 1,
          moduleId: 1,
          status: 1,
          completedLessonsCount: 1,
          totalLessons: 1,
          // Module content fields
          title: '$moduleInfo.title',
          description: '$moduleInfo.description',
          orderNumber: '$moduleInfo.orderNumber',
          // Nested lessons with their progress
          lessons: 1,
        },
      },
    ]);
  }
}

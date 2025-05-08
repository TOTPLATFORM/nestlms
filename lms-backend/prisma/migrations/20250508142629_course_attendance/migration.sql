-- CreateTable
CREATE TABLE `CourseTimeTable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionStartDate` DATETIME(3) NOT NULL,
    `sessionEndDate` DATETIME(3) NOT NULL,
    `course_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CourseTimeTable_course_id_sessionStartDate_sessionEndDate_key`(`course_id`, `sessionStartDate`, `sessionEndDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseAttendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrolledUser_id` INTEGER NOT NULL,
    `attendanceDate_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CourseAttendance_enrolledUser_id_attendanceDate_id_key`(`enrolledUser_id`, `attendanceDate_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseTimeTable` ADD CONSTRAINT `CourseTimeTable_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseAttendance` ADD CONSTRAINT `CourseAttendance_enrolledUser_id_fkey` FOREIGN KEY (`enrolledUser_id`) REFERENCES `CourseEnrollment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseAttendance` ADD CONSTRAINT `CourseAttendance_attendanceDate_id_fkey` FOREIGN KEY (`attendanceDate_id`) REFERENCES `CourseTimeTable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

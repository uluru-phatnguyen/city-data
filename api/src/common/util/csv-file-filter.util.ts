import { UnsupportedMediaTypeException } from '@nestjs/common';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

export function csvFileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) {
  // Check if the file has a .csv extension
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new UnsupportedMediaTypeException({
        message: 'Only support CSV file',
        errorCode: 'CSV_FILE_ONLY',
      }),
    ); // Reject with an error
  }
}

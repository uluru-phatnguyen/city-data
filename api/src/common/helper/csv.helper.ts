import { createReadStream, promises as fs } from 'fs';
import { parse } from 'fast-csv';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

/* eslint-disable */
export async function parseCsvFile<T extends object>(
  cityId: number,
  filePath: string,
  dtoClass: new () => T,
): Promise<T[]> {
  const results: T[] = [];

  const delimeter = await getDelimiter(filePath);

  return new Promise((resolve, reject) => {
    createReadStream(filePath)
      .pipe(parse({ headers: true, delimiter: delimeter, ignoreEmpty: true }))
      .on('data', async (row) => {
        const dtoInstance = plainToInstance(dtoClass, { ...row, cityId });
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
          const messages: string[] = [];
          errors.forEach((e) => {
            Object.values(e.constraints ?? {})?.forEach((m) => {
              messages.push(m);
            });
          });

          return reject(
            new BadRequestException({
              // message: `${errors.map((e) => Object.values(e?.constraints ?? {})).join(', ')}`,
              message: messages,
              errorCode: 'VALIDATION_FAILED',
            }),
          );
        } else {
          results.push(dtoInstance);
        }
      })
      .on('end', async () => {
        // Delete file after stream finishes
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.error('Error deleting file:', error);
        }

        return resolve(results);
      })
      .on('error', (error) =>
        reject(
          new BadRequestException({
            message: `Error parsing CSV: ${error.message}`,
            errorCode: 'INVALID_CSV_FORMAT',
          }),
        ),
      );
    // .on('error', (error) => reject(error));
  });
}

export async function getDelimiter(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let delimiter = ',';

    createReadStream(filePath)
      .once('data', (chunk) => {
        const firstLine = chunk.toString().split('\n')[0];

        if (firstLine.includes(';')) {
          delimiter = ';';
        }

        resolve(delimiter);
      })
      .on('error', (error) =>
        reject(
          new BadRequestException({
            message: `Error parsing CSV: ${error.message}`,
            errorCode: 'INVALID_CSV_FORMAT',
          }),
        ),
      );
  });
}

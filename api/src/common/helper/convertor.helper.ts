/* eslint-disable */
export class Convertor {
  static transformerDate = {
    from: (value: string | number | Date) =>
      value ? new Date(value).toISOString() : value,
    to: (value: string | number | Date) => value,
  };

  static transformerJSON = {
    from: (value: any) => JSON.stringify(value || {}),
    to: (value: any) => value,
  };
}

export class TypeOrmColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

import {
  IsNotEmpty,
  IsNumber,
  IsString,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  IsIn,
} from 'class-validator';
import { StatusOnOffArray } from 'src/shared/constants/array.constants';

export class UpdateAgoraCredentialsDto {
  @IsNotEmpty()
  @IsNumber()
  @IsIn(StatusOnOffArray)
  agora_status: number;

  @IsRequiredAndNotEmptyIfAgoraStatus(
    1,
    {
      message:
        'Both Agora App ID and Agora App Secret are required when Agora Status is 1',
    },
    'agora_app_id',
  )
  agora_app_id: string;

  @IsRequiredAndNotEmptyIfAgoraStatus(
    1,
    {
      message:
        'Both Agora App ID and Agora App Secret are required when Agora Status is 1',
    },
    'app_certificate',
  )
  app_certificate: string;
}

export function IsRequiredAndNotEmptyIfAgoraStatus(
  value: number,
  validationOptions?: ValidationOptions,
  field_name?: string,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isRequiredAndNotEmptyIfAgoraStatus',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [value],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const agoraStatus = args.object['agora_status'];
          const fieldValue = args.object[field_name];
          if (agoraStatus === value && !fieldValue) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const agoraStatus = args.object['agora_status'];
          if (agoraStatus === value) {
            const fieldLabel =
              field_name === 'agora_app_id'
                ? 'Agora App ID'
                : 'Agora App Secret';
            return `${fieldLabel} is required when Agora Status is ${value}`;
          }
          return '';
        },
      },
    });
  };
}

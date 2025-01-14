import type { HTMLChakraProps } from '@chakra-ui/react';
import type React from 'react';
import type { ControllerRenderProps, FieldValues, Path, RegisterOptions } from 'react-hook-form';

import type { FieldProps } from 'toolkit/chakra/field';

export interface FormFieldPropsBase<
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
> extends Omit<FieldProps, 'children'> {
  name: Name;
  placeholder: string;
  rules?: Omit<RegisterOptions<FormFields, Name>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  onBlur?: () => void;
  onChange?: () => void;
  rightElement?: ({ field }: { field: ControllerRenderProps<FormFields, Name> }) => React.ReactNode;
  inputProps?: HTMLChakraProps<'input' | 'textarea'>;
}

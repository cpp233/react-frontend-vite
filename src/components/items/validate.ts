import { z, ZodType } from 'zod';
import { fromZodError } from 'zod-validation-error';

const tagScheme: ZodType<Tag> = z.object({
  name: z.string().min(1, { message: '至少输入一个字符' }),
  id: z.string().optional(),
});

export const itemSchema: ZodType<FormItem> = z
  .object({
    name: z
      .string({ required_error: '不能为空' })
      .min(2, { message: '至少输入二个字符' }),
    quantity: z
      .number({ required_error: '不能为空' })
      .int({ message: '必须为整数' })
      .min(0, { message: '不能为负数' }),
    content: z.string().optional(),
    tagList: z.array(z.string().min(1)).optional(),
    // tagList2: z.array(z.string().min(1)).optional(),
    tagList2: z.array(tagScheme).optional(),
    isShow: z.boolean().optional(),
  })
  .strict({ message: '存在未知字段，请检查 itemSchema' });

export const newItemSchema: ZodType<NewFormItem> = z
  .object({
    name: z
      .string({ required_error: '不能为空' })
      .min(2, { message: '至少输入二个字符' }),
    quantity: z
      .number({ required_error: '不能为空' })
      .int({ message: '必须为整数' })
      .min(0, { message: '不能为负数' }),
    content: z.string().optional(),
    tagList: z.array(z.string().min(1)).optional(),
    tagList2: z.array(z.string().min(1)).optional(),
    isShow: z.boolean().optional(),
  })
  .strict({ message: '存在未知字段，请检查 itemSchema' });

// const res = itemSchema.safeParse({ username: 'Ludwig' });

// try {
//   itemSchema.parse({
//     id: 1,
//     email: 'foobar', // note: invalid email
//   });
// } catch (err) {
//   const validationError = fromZodError(err);
//   // the error now is readable by the user
//   // you may print it to console
//   // or return it via an API
//   console.log(validationError);
// }

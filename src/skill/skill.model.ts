import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SkillCategory } from '@prisma/client';

registerEnumType(SkillCategory, { name: 'SkillCategory' });

@ObjectType('Skill')
export class SkillModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => SkillCategory)
  category: SkillCategory;
}

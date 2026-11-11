import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Experience')
export class ExperienceModel {
  @Field(() => Int)
  id: number;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field({ description: 'Product, domain and team in one line' })
  context: string;

  @Field({ description: 'Start month, YYYY-MM' })
  startDate: string;

  @Field(() => String, { nullable: true, description: 'End month, YYYY-MM; null while the job is current' })
  endDate: string | null;

  @Field()
  isCurrent: boolean;

  @Field(() => Int, { description: 'Length of the period in whole months, both months inclusive' })
  durationMonths: number;
}

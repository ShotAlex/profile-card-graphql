import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Project')
export class ProjectModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => String, { nullable: true, description: 'Live product URL' })
  url: string | null;

  @Field(() => String, { nullable: true, description: 'Source code repository' })
  repoUrl: string | null;
}

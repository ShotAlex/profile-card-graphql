import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LinkKind } from '@prisma/client';

registerEnumType(LinkKind, { name: 'LinkKind' });

@ObjectType('ProfileLink')
export class ProfileLinkModel {
  @Field(() => LinkKind)
  kind: LinkKind;

  @Field()
  label: string;

  @Field()
  url: string;
}

@ObjectType('Profile')
export class ProfileModel {
  @Field(() => Int)
  id: number;

  @Field()
  slug: string;

  @Field()
  name: string;

  @Field()
  headline: string;

  @Field()
  description: string;

  @Field()
  location: string;
}

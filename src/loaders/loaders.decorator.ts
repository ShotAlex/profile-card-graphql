import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { RequestLoaders } from './loaders.factory';

export type { RequestLoaders } from './loaders.factory';

export interface GraphQLContext {
  loaders: RequestLoaders;
}

/** Injects the request-scoped DataLoaders into a resolver method. */
export const Loaders = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestLoaders =>
    GqlExecutionContext.create(ctx).getContext<GraphQLContext>().loaders,
);

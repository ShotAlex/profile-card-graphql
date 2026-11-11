import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import { DatabaseModule } from './database/database.module';
import { ExperienceModule } from './experience/experience.module';
import { HealthController } from './health.controller';
import { GraphQLContext } from './loaders/loaders.decorator';
import { LoadersFactory } from './loaders/loaders.factory';
import { LoadersModule } from './loaders/loaders.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProfileModule,
    ExperienceModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [LoadersModule],
      inject: [LoadersFactory],
      useFactory: (loaders: LoadersFactory) => ({
        // Schema is generated from the code; locally it is also written to schema.graphql for review.
        autoSchemaFile: process.env.NODE_ENV === 'production' ? true : join(process.cwd(), 'schema.graphql'),
        sortSchema: true,
        // The card is public read-only data, so Sandbox and introspection stay on in production:
        // opening the deployed URL in a browser shows Apollo Sandbox right away.
        introspection: true,
        includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
        context: (): GraphQLContext => ({ loaders: loaders.create() }),
      }),
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}

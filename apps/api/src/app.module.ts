import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EntitiesModule } from './modules/entities/entities.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { CorrectionsModule } from './modules/corrections/corrections.module';
import { FeedModule } from './modules/feed/feed.module';
import { MarketsModule } from './modules/markets/markets.module';
import { NewsModule } from './modules/news/news.module';
import { DealsModule } from './modules/deals/deals.module';
import { InvestmentsModule } from './modules/investments/investments.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CommunityModule } from './modules/community/community.module';
import { GroupsModule } from './modules/groups/groups.module';
import { LiveModule } from './modules/live/live.module';
import { MediaModule } from './modules/media/media.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SearchModule } from './modules/search/search.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule.forRoot({ pinoHttp: { redact: ['req.headers.authorization', 'req.headers.cookie'] } }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    HealthModule,
    AuthModule, UsersModule, EntitiesModule, ClaimsModule, CorrectionsModule, FeedModule, MarketsModule, NewsModule, DealsModule, InvestmentsModule, PortfolioModule, WatchlistModule, MessagingModule, NotificationsModule, CommunityModule, GroupsModule, LiveModule, MediaModule, UploadsModule, SearchModule, AssistantModule, ModerationModule, AdminModule,
  ],
})
export class AppModule {}

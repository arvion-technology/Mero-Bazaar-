import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './database/prisma.module';
import { ListingsModule } from './modules/listings/listings.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { SearchModule } from './search/search.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { LeadsModule } from './modules/leads/leads.module';
import { MedicalModule } from './modules/medical/medical.module';
import { TradesModule } from './modules/trades/trades.module';
import { RentalModule } from './modules/rental/rental.module';
import { AgricultureModule } from './modules/agriculture/agriculture.module';
import { SecondhandModule } from './modules/secondhand/secondhand.module';
import { FoodsModule } from './modules/foods/foods.module';
import { BeautyModule } from './modules/beauty/beauty.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PhoneOtpModule } from './modules/otp/otp.module';
import { VendorKycModule } from './modules/vendor-kyc/vendor-kyc.module';
import { SessionsModule } from './modules/session/session.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminUserService } from './modules/admin-user/admin-user.service';
import { AdminUserController } from './modules/admin-user/admin-user.controller';
import { AdminUserModule } from './modules/admin-user/admin-user.module';
import { VendorSalesOverviewModule } from './modules/vendor-sales-overview/vendor-sales-overview.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { SellerModule } from './modules/seller/seller.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ListingsModule,
    VehiclesModule,
    SearchModule,
    JobsModule,
    LeadsModule,
    MedicalModule,
    TradesModule,
    RentalModule,
    AgricultureModule,
    SecondhandModule,
    FoodsModule,
    BeautyModule,
    ReviewsModule,
    AuthModule,
    UserModule,
    PhoneOtpModule,
    VendorKycModule,
    SessionsModule,
    VendorModule,
    NotificationsModule,
    AdminUserModule,
    VendorSalesOverviewModule,
    WishlistModule,
    SellerModule,
    OrdersModule,
  ],
  controllers: [AppController, AdminUserController],
  providers: [AppService, AdminUserService],
})
export class AppModule {}
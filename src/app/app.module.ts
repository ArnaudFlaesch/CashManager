import { DragDropModule } from '@angular/cdk/drag-drop';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { fr } from 'date-fns/locale/fr';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { CreateMiniWidgetModalComponent } from './modals/create-mini-widget-modal/create-mini-widget-modal.component';
import { CreateWidgetModalComponent } from './modals/create-widget-modal/create-widget-modal.component';
import { ImportConfigModalComponent } from './modals/import-config-modal/import-config-modal.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { AuthService } from './services/auth.service/auth.service';
import { ConfigService } from './services/config.service/config.service';
import { DateUtilsService } from './services/date.utils.service/date.utils.service';
import { ErrorHandlerService } from './services/error.handler.service';
import { NotificationService } from './services/notification.service/NotificationService';
import { TabService } from './services/tab.service/tab.service';
import { ThemeService } from './services/theme.service/theme.service';
import { MiniWidgetService } from './services/widget.service/miniwidget.service';
import { WidgetService } from './services/widget.service/widget.service';
import { TabComponent } from './tab/tab.component';
import { AbstractWidgetComponent } from './widgets/abstract-widget/abstract-widget.component';
import { AirParifMapComponent } from './widgets/airparif-widget/airparif-map/airparif-map.component';
import { AirParifWidgetComponent } from './widgets/airparif-widget/airparif-widget.component';
import { AirParifWidgetService } from './widgets/airparif-widget/airparif-widget.service';
import { CalendarWidgetComponent } from './widgets/calendar-widget/calendar-widget.component';
import { CalendarWidgetService } from './widgets/calendar-widget/calendar-widget.service';
import { EventDetailModalComponent } from './widgets/calendar-widget/event-detail-modal/event-detail-modal.component';
import { DeleteWidgetComponent } from './widgets/delete-widget/delete-widget.component';
import { EcowattWidgetComponent } from './widgets/ecowatt-widget/ecowatt-widget.component';
import { IncidentWidgetComponent } from './widgets/incident-widget/incident-widget.component';
import { IncidentWidgetService } from './widgets/incident-widget/incident.widget.service';
import { MiniWidgetComponent } from './widgets/mini-widget/mini-widget.component';
import { MiniWidgetListComponent } from './widgets/miniwidget-list/miniwidget-list.component';
import { RssFeedComponent } from './widgets/rss-widget/rss-feed/rss-feed.component';
import { RssWidgetComponent } from './widgets/rss-widget/rss-widget.component';
import { RssWidgetService } from './widgets/rss-widget/rss.widget.service';
import { GameDetailsComponent } from './widgets/steam-widget/game-details/game-details.component';
import { SteamWidgetComponent } from './widgets/steam-widget/steam-widget.component';
import { SteamWidgetService } from './widgets/steam-widget/steam.widget.service';
import { StravaActivitiesComponent } from './widgets/strava-widget/strava-activities/strava-activities.component';
import { StravaWidgetComponent } from './widgets/strava-widget/strava-widget.component';
import { StravaWidgetService } from './widgets/strava-widget/strava.widget.service';
import { TwitterWidgetComponent } from './widgets/twitter-widget/twitter-widget.component';
import { TwitterWidgetService } from './widgets/twitter-widget/twitter.widget.service';
import { WeatherForecastComponent } from './widgets/weather-widget/weather-forecast/weather-forecast.component';
import { WeatherMiniWidgetComponent } from './widgets/weather-widget/weather-mini-widget/weather-miniwidget.component';
import { WeatherTodayComponent } from './widgets/weather-widget/weather-today/weather-today.component';
import { WeatherWidgetComponent } from './widgets/weather-widget/weather-widget.component';
import { WeatherWidgetService } from './widgets/weather-widget/weather.widget.service';
import { WidgetListComponent } from './widgets/widget-list/widget-list.component';
import { WidgetComponent } from './widgets/widget/widget.component';
import { WorkoutSessionEditComponent } from './widgets/workout-widget/workout-session-edit/workout-session-edit.component';
import { WorkoutStatisticsComponent } from './widgets/workout-widget/workout-statistics/workout-statistics.component';
import { WorkoutWidgetComponent } from './widgets/workout-widget/workout-widget.component';
import { WorkoutWidgetService } from './widgets/workout-widget/workout.widget.service';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TabComponent,
    WidgetComponent,
    RssWidgetComponent,
    DeleteWidgetComponent,
    WeatherWidgetComponent,
    WidgetListComponent,
    MiniWidgetListComponent,
    MiniWidgetComponent,
    StravaWidgetComponent,
    CalendarWidgetComponent,
    SteamWidgetComponent,
    GameDetailsComponent,
    DateFormatPipe,
    SafePipe,
    CreateWidgetModalComponent,
    CreateMiniWidgetModalComponent,
    ImportConfigModalComponent,
    EventDetailModalComponent,
    WorkoutWidgetComponent,
    AirParifWidgetComponent,
    RssFeedComponent,
    StravaActivitiesComponent,
    WeatherForecastComponent,
    WeatherTodayComponent,
    WeatherMiniWidgetComponent,
    WorkoutSessionEditComponent,
    TwitterWidgetComponent,
    EcowattWidgetComponent,
    AirParifMapComponent,
    AbstractWidgetComponent,
    WorkoutStatisticsComponent,
    NotificationsComponent,
    IncidentWidgetComponent,
    ConfirmModalComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    DragDropModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDividerModule,
    MatNativeDateModule,
    MatIconModule,
    MatInputModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatDialogModule,
    MatCardModule,
    MatToolbarModule,
    MatPaginatorModule,
    NgChartsModule,
    MatDateFnsModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [
    AuthService,
    TabService,
    WidgetService,
    MiniWidgetService,
    ConfigService,
    RssWidgetService,
    WeatherWidgetService,
    ErrorHandlerService,
    DateUtilsService,
    SteamWidgetService,
    AirParifWidgetService,
    WorkoutWidgetService,
    CalendarWidgetService,
    StravaWidgetService,
    NotificationService,
    TwitterWidgetService,
    IncidentWidgetService,
    ThemeService,
    { provide: MAT_DATE_LOCALE, useValue: fr },
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

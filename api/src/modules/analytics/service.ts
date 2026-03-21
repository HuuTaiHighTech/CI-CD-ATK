import { BetaAnalyticsDataClient } from '@google-analytics/data';
import env from '~/config/env';
import type { AnalyticsQuery } from '~/modules/analytics/schema';

class AnalyticsService {
  private client;
  private propertyId;

  constructor() {
    const { GOOGLE_SERVICE_ACCOUNT, GA_PROPERTY_ID } = env;
    const credentials = GOOGLE_SERVICE_ACCOUNT;
    this.client = new BetaAnalyticsDataClient({ credentials });
    this.propertyId = `properties/${GA_PROPERTY_ID}`;
  }

  getOverview = async (query: AnalyticsQuery) => {
    const { startDate, endDate } = query;
    const [realtimeReport, analyticsReport] = await Promise.all([
      this.client.runRealtimeReport({
        property: this.propertyId,
        metrics: [{ name: 'activeUsers' }]
      }),

      this.client.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'screenPageViewsPerSession' },
          { name: 'bounceRate' }
        ]
      })
    ]);

    const metrics = analyticsReport[0].rows?.[0]?.metricValues;

    return {
      activeUsers: Number(
        realtimeReport[0].rows?.[0]?.metricValues?.[0]?.value || 0
      ),
      totalUsers: Number(metrics?.[0]?.value || 0),
      newUsers: Number(metrics?.[1]?.value || 0),
      returningUsers:
        Number(metrics?.[0]?.value || 0) - Number(metrics?.[1]?.value || 0),
      sessions: Number(metrics?.[2]?.value || 0),
      pageViews: Number(metrics?.[3]?.value || 0),
      averageSessionDuration: Number(metrics?.[4]?.value || 0),
      averagePagePerSession: Number(metrics?.[5]?.value || 0),
      bounceRate: Number(metrics?.[6]?.value || 0)
    };
  };

  getTopPages = async (query: AnalyticsQuery) => {
    const { startDate, endDate, limit } = query;
    const [response] = await this.client.runReport({
      property: this.propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit
    });

    return response.rows?.map((row) => ({
      path: row.dimensionValues?.[0]?.value,
      title: row.dimensionValues?.[1]?.value,
      views: Number(row.metricValues?.[0]?.value || 0)
    }));
  };

  getTrafficSources = async (query: AnalyticsQuery) => {
    const { startDate, endDate, limit } = query;
    const [response] = await this.client.runReport({
      property: this.propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit
    });

    return response.rows?.map((row) => ({
      source: row.dimensionValues?.[0]?.value,
      medium: row.dimensionValues?.[1]?.value,
      sessions: Number(row.metricValues?.[0]?.value || 0)
    }));
  };

  getTopDevices = async (query: AnalyticsQuery) => {
    const { startDate, endDate } = query;
    const [response] = await this.client.runReport({
      property: this.propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
    });

    return response.rows?.map((row) => ({
      device: row.dimensionValues?.[0]?.value,
      sessions: row.metricValues?.[0]?.value
    }));
  };

  getTopLocations = async (query: AnalyticsQuery) => {
    const { startDate, endDate, limit } = query;
    const [response] = await this.client.runReport({
      property: this.propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'country' }, { name: 'city' }],
      metrics: [{ name: 'activeUsers' }],
      dimensionFilter: {
        filter: {
          fieldName: 'country',
          stringFilter: {
            matchType: 'EXACT',
            value: 'Vietnam'
          }
        }
      },
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit
    });

    return response.rows?.map((row) => ({
      country: row.dimensionValues?.[0]?.value,
      city: row.dimensionValues?.[1]?.value,
      users: row.metricValues?.[0]?.value
    }));
  };
}

export default new AnalyticsService();

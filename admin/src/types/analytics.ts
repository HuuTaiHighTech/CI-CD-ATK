export interface AnalyticsOverview {
  activeUsers: number;
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  sessions: number;
  pageViews: number;
  averageSessionDuration: number;
  averagePagePerSession: number;
  bounceRate: number;
}

export interface TopPage {
  path: string;
  title: string;
  views: number;
}

export interface TopLocation {
  country: string;
  city: string;
  users: number;
}

export type TrafficSource = {
  source: string;
  medium: string;
  sessions: number;
};

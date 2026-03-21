export interface HttpResponse<T = any> {
   status?: number;
   message: string;
   data?: T;
}

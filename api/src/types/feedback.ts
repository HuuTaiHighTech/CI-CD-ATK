export interface FeedbackDto {
   id: string;
   star: number;
   avatar: string;
   name: string;
   position: string;
   content?: string;
   visible?: boolean;
   createdAt: Date;
   updatedAt?: Date;
}

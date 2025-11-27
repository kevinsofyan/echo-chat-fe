export interface IMessageSender {
  id: string;
  username: string;
  full_name: string;
}

export interface IMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender: IMessageSender;
  content: string;
  type: string;
  created_at: string;
}

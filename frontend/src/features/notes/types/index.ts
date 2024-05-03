export interface Note {
  id: number;
  user_id: number;
  content: string;
  updated_at: Date;
}

export interface NoteUpdate {
  id: number;
  content: string;
}

export interface Book {
  id: string;
  author: string;
  comments: Comment[];
  genre: string;
  rating: number;
  readers: Reader[];
  title: string;
}
export interface Comment {
  username: string;
  text: string;
}
export interface Reader {
  username: string;
  rating: number;
}

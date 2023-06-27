export interface Book {
  id: string;
  author: string;
  genre: string;
  rating: number;
  title: string;
  readers: Reader[];
}

export interface Reader {
  username: string;
  rating: number;
}

export interface StoreResponse {
	status: number;
	data: IPost;
}

export interface StoreRequest {
	name: string;
}
export interface IPost {
  _id: string;
  name: string;
  text: string;
  date: Date;
}

export interface IPostResponse {
  posts?: Array<IPost>;
  searchPosts?: Array<IPost>;
}
export interface ISpecialPostResponse {
  post: IPost;
}

export interface IStoreCommentRequest {
  data: string;
  postId: string;
}

export interface IStoreLikeRequest {
  postId: string;
}
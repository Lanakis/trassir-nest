export interface User {
  Account: string;
  Authority: number;
  CitizenIDNo: string;
  Doors: number[];
  IsFirstEnter: boolean;
  IsSubscribed: number;
  MobileInfo: string;
  Password: string;
  RoomNo: string | null; // `null` is allowed
  UseTime: number;
  UserID: string;
  UserName: string;
  UserStatus: number;
  UserType: number;
  VTOPosition: string;
  ValidFrom: string; // This could be `Date` if you prefer to work with date objects
  ValidTo: string; // Same as above
}

export interface UserListResponse {
  UserList: User[];
}

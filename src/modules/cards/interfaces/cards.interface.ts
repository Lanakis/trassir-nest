interface ICard {
  UserID: string;
  CardNo: string;
  CardType: number;
  CardName: string;
  CardStatus: number;
}

export interface ICardList {
  CardList: ICard[];
}

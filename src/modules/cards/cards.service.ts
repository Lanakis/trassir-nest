import { Injectable, Inject } from '@nestjs/common';
import { CardsRepository } from './repository/cards.repository';
import { Connection } from 'mysql2/promise';
import { UpdateCardsDto } from './dto/update-cards.dto';
import { CreateCardsDto } from './dto/create-cards.dto';
import { HttpRequestService } from '../http-request/http-request.service';
import { Cards } from './entities/cards.entity';
import { ExternalUsersService } from '../external-users/external-users.service';
import { ICardList } from './interfaces/cards.interface';

@Injectable()
export class CardsService {
  constructor(
    readonly cardsRepository: CardsRepository,
    @Inject('MYSQL_CONNECTION') private readonly mysqlConnection: Connection,
    private readonly httpRequestService: HttpRequestService,
    private readonly externalUsersService: ExternalUsersService,
  ) {}

  async create(createCardsDto: CreateCardsDto): Promise<Cards> {
    // Создаем объект карты
    const card = this.cardsRepository.create(createCardsDto);

    // Находим внешнего пользователя и панель
    const foundedExternalUser = await this.externalUsersService.findOne(createCardsDto.external_user_id);
    card.externalUser = foundedExternalUser;
    const foundedPanel = foundedExternalUser.panel;

    // Создаем объект cardList
    const cardList: ICardList = {
      CardList: createCardsDto.cards.map((el) => ({
        UserID: foundedExternalUser.user_id,
        CardNo: el.card_no,
        CardType: el.card_type,
        CardName: el.card_name,
        CardStatus: el.card_status,
      })),
    };

    console.log(cardList);

    // Сохраняем карту в базе данных
    // await this.cardsRepository.persistAndFlush(card);

    // Создаем экземпляр Dahua API
    const dahuaApi = this.httpRequestService.createDahuaApi(foundedPanel.ip, foundedPanel.login, foundedPanel.password);

    // Отправляем данные на внешний сервер
    await this.httpRequestService.insertMultiCards(dahuaApi, cardList);

    return card;
  }

  async findAll(): Promise<[Cards[], number]> {
    return await this.cardsRepository.findAndCount({});
  }

  async findOne(id: string): Promise<Cards> {
    return await this.cardsRepository.findOneOrFail({ id });
  }

  async update(id: string, updatePanelsDto: UpdateCardsDto): Promise<Cards> {
    const panel = await this.cardsRepository.update(id, updatePanelsDto);
    await this.cardsRepository.flush();
    return panel;
  }

  async remove(id: string): Promise<Cards> {
    const panel = await this.cardsRepository.findOneOrFail({ id });
    await this.cardsRepository.removeAndFlush(panel);
    return panel;
  }

  async test() {
    const dahuaApi = this.httpRequestService.createDahuaApi('localhost:1081', 'admin', 'admin123');
    await this.httpRequestService.getAccessCardFind(dahuaApi);

    await this.httpRequestService.removeAllCards(dahuaApi);
  }

}

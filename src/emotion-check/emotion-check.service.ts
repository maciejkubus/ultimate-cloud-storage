import { BadRequestException, ImATeapotException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EmotionsService } from 'src/emotions/emotions.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateEmotionCheckDto } from './dto/create-emotion-check.dto';
import { UpdateEmotionCheckDto } from './dto/update-emotion-check.dto';
import { EmotionCheck } from './entities/emotion-check.entity';

@Injectable()
export class EmotionChecksService {
  constructor(
    @Inject('EMOTION_CHECK_REPOSITORY')
    private emotionCheckRepository: Repository<EmotionCheck>,
    private emotionService: EmotionsService,
    private usersService: UsersService,
  ) {}

  isValidDate(day: number, month: number, year: number, hour: number, minute: number): boolean {
    if (
      year < 1000 || year > 9999 ||
      month < 1 || month > 12 ||
      day < 1 || day > 31 ||
      hour < 0 || hour > 23 ||
      minute < 0 || minute > 59
    ) {
      return false;
    }
    const date = new Date(year, month - 1, day, hour, minute);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date.getHours() === hour &&
      date.getMinutes() === minute
    );
  }

  async create(dto: CreateEmotionCheckDto, userId: number): Promise<EmotionCheck> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if(!this.isValidDate(dto.day, dto.month, dto.year, dto.hour, dto.minute)) {
      throw new BadRequestException('Date is not correct');
    }

    const emotionCheck = this.emotionCheckRepository.create(dto);
    emotionCheck.user = user;

    return this.emotionCheckRepository.save(emotionCheck);
  }

  findAll(userId: number) {
    return this.emotionCheckRepository.find({
      relations: ['user', 'emotions'],
      where: { user: { id: userId } },
      order: { created: 'DESC' },
    });
  }

  findOne(id: number): Promise<EmotionCheck> {
    return this.emotionCheckRepository.findOne({
      where: { id },
      relations: ['user', 'emotions'],
    });
  }

  async addEmotion(emotionCheckId: number, emotionId: number, userId: number): Promise<EmotionCheck> {
    const emotionCheck = await this.emotionCheckRepository.findOne({
      where: { id: emotionCheckId },
      relations: ['emotions'],
    });

    if (!emotionCheck) {
      throw new NotFoundException('EmotionCheck not found');
    }

    const emotion = await this.emotionService.findOne(emotionId, userId); // Ensure your service has this method
    if (!emotion) {
      throw new NotFoundException('Emotion not found');
    }

    const alreadyExists = emotionCheck.emotions.some(e => e.id === emotion.id);
    if (alreadyExists) {
      throw new ImATeapotException('Already added')
      return emotionCheck;
    }

    emotionCheck.emotions.push(emotion);
    return this.emotionCheckRepository.save(emotionCheck);
  }

  async removeEmotion(emotionCheckId: number, emotionId: number, userId: number): Promise<EmotionCheck> {
    const emotionCheck = await this.emotionCheckRepository.findOne({
      where: { id: emotionCheckId },
      relations: ['user', 'emotions'],
    });

    if (!emotionCheck) {
      throw new NotFoundException('EmotionCheck not found');
    }
    if (emotionCheck.user?.id !== userId) {
      throw new NotFoundException('EmotionCheck not owned by user');
    }
    emotionCheck.emotions = emotionCheck.emotions.filter(e => e.id !== emotionId);

    return this.emotionCheckRepository.save(emotionCheck);
  }

  async update(id: number, dto: UpdateEmotionCheckDto): Promise<EmotionCheck> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('EmotionCheck not found');
    }
    if(!this.isValidDate(
      dto.day ? dto.day : existing.day, 
      dto.month ? dto.month : existing.month, 
      dto.year ? dto.year : existing.year, 
      dto.hour ? dto.hour : existing.hour, 
      dto.minute ? dto.minute : existing.minute
    )) {
      throw new BadRequestException('Date is not correct');
    }

    Object.assign(existing, dto);

    return this.emotionCheckRepository.save(existing);
  }

  remove(id: number) {
    return this.emotionCheckRepository.delete(id);
  }

  async isEmotionCheckOwner(emotionCheckId: number, userId: number): Promise<boolean> {
    const emotionCheck = await this.emotionCheckRepository.findOne({
      where: { id: emotionCheckId },
      relations: ['user'],
    });

    return emotionCheck?.user?.id === userId;
  }
}

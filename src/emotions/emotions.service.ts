import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';
import { Emotion } from './entities/emotion.entity';

@Injectable()
export class EmotionsService {
  constructor(
      @Inject('EMOTION_REPOSITORY')
      private emotionsRepository: Repository<Emotion>,
      private usersService: UsersService,
    ) {}
  async create(createEmotionDto: CreateEmotionDto, userId: number): Promise<Emotion> {
      const user = await this.usersService.findOne(userId);
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const emotion = this.emotionsRepository.create(createEmotionDto);
      emotion.user = user;
      return await this.emotionsRepository.save(emotion);
    }

  findAll(userId: number) {
    return this.emotionsRepository.find({
      relations: ['user'],
      where: { user: { id: userId }}
    })
  }

  findOne(id: number, userId: number) {
    return this.emotionsRepository.findOne({
      relations: ['user'],
      where: { 
        id,
        user: { 
          id: userId 
        }
      }
    })
  }

  async update(id: number, updateEmotionDto: UpdateEmotionDto) {
    await this.emotionsRepository.update(id, updateEmotionDto);
    return await this.emotionsRepository.findOne({
      relations: ['user'],
      where: {
        id,
      }
    })
  }

  remove(id: number) {
    return this.emotionsRepository.delete(id)
  }

  async isEmotionOwner(emotionId: number, userId: number): Promise<boolean> {
    const emotion = await this.findOne(emotionId, userId)
    
    if (!emotion || !emotion.user) {
      return false;
    }


    return emotion.user.id === userId;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async getAllBoards(): Promise<Board[]> {
    const found = await this.prisma.board.findMany();

    if (found.length === 0) {
      throw new NotFoundException(`Can't find Boards}`);
    }

    return found;
  }

  async getBoardById(id: string): Promise<Board> {
    const found = await this.prisma.board.findUnique({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    return found;
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.prisma.board.create({
      data: {
        title: createBoardDto.title,
        description: createBoardDto.description,
        status: BoardStatus.PUBLIC,
      },
    });
  }

  async deleteBoard(id: string): Promise<void> {
    await this.prisma.board.delete({
      where: { id },
    });
  }

  async updateBoardStatus(id: string, status: BoardStatus): Promise<Board> {
    return this.prisma.board.update({
      where: { id },
      data: { status },
    });
  }
}

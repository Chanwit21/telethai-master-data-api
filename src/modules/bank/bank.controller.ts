import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankMapper } from './mapper/bank.mapper';
import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { CreateBankDto, UpdateBankDto, BankResponseDto } from './dto/bank.dto';

/**
 * Bank Controller
 * Handles HTTP requests for bank management
 */
@ApiTags('banks')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('banks')
export class BankController {
  private readonly logger = new Logger(BankController.name);

  constructor(
    private readonly service: BankService,
    private readonly mapper: BankMapper,
  ) {}

  @Post()
  @Roles(RoleEnum.admin)
  @UseGuards(MockAuthGuard, RolesGuard)
  @ApiCreatedResponse({ type: BankResponseDto })
  async create(@Body() data: CreateBankDto): Promise<BankResponseDto> {
    this.logger.log('POST /banks');
    const domain = await this.service.create(data);
    return this.mapper.toDto(domain);
  }

  @Get()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(MockAuthGuard, RolesGuard)
  @ApiOkResponse({ type: [BankResponseDto] })
  async findAll(): Promise<BankResponseDto[]> {
    this.logger.log('GET /banks');
    const domains = await this.service.findAll();
    return this.mapper.toDtos(domains);
  }

  @Get(':code')
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(MockAuthGuard, RolesGuard)
  @ApiOkResponse({ type: BankResponseDto })
  @ApiNotFoundResponse({ description: 'Bank not found' })
  async findByCode(@Param('code') code: string): Promise<BankResponseDto> {
    this.logger.log(`GET /banks/${code}`);
    const domain = await this.service.findByCode(code);
    return this.mapper.toDto(domain);
  }

  @Patch(':code')
  @Roles(RoleEnum.admin)
  @UseGuards(MockAuthGuard, RolesGuard)
  @ApiOkResponse({ type: BankResponseDto })
  @ApiNotFoundResponse({ description: 'Bank not found' })
  async update(
    @Param('code') code: string,
    @Body() data: UpdateBankDto,
  ): Promise<BankResponseDto | null> {
    this.logger.log(`PATCH /banks/${code}`);
    const domain = await this.service.update(code, data);
    return domain ? this.mapper.toDto(domain) : null;
  }

  @Delete(':code')
  @Roles(RoleEnum.admin)
  @UseGuards(MockAuthGuard, RolesGuard)
  @ApiOkResponse({ description: 'Bank deleted' })
  @ApiNotFoundResponse({ description: 'Bank not found' })
  async remove(@Param('code') code: string): Promise<{ message: string }> {
    this.logger.log(`DELETE /banks/${code}`);
    await this.service.remove(code);
    return { message: 'Bank deleted successfully' };
  }
}

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
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodMapper } from './mapper/payment-method.mapper';
import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
  PaymentMethodResponseDto,
} from './dto/payment-method.dto';

/**
 * PaymentMethod Controller
 * Handles HTTP requests for payment method management
 */
@ApiTags('payment-methods')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('payment-methods')
export class PaymentMethodController {
  private readonly logger = new Logger(PaymentMethodController.name);

  constructor(
    private readonly service: PaymentMethodService,
    private readonly mapper: PaymentMethodMapper,
  ) {}

  @Post()
  @Roles(RoleEnum.admin)
  @UseGuards(MockAuthGuard, RolesGuard)
  @ApiCreatedResponse({ type: PaymentMethodResponseDto })
  async create(
    @Body() data: CreatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    this.logger.log('POST /payment-methods');
    // Set createdBy and updatedBy from test defaults if not provided
    const enrichedData = {
      ...data,
      createdBy: data.createdBy || '00000000-0000-0000-0000-000000000001',
      updatedBy: data.updatedBy || '00000000-0000-0000-0000-000000000001',
    };
    const domain = await this.service.create(
      enrichedData as CreatePaymentMethodDto,
    );
    return this.mapper.toDto(domain);
  }

  @Get()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(MockAuthGuard, RolesGuard)
  @ApiOkResponse({ type: [PaymentMethodResponseDto] })
  async findAll(): Promise<PaymentMethodResponseDto[]> {
    this.logger.log('GET /payment-methods');
    const domains = await this.service.findAll();
    return this.mapper.toDtos(domains);
  }

  @Get(':id')
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(MockAuthGuard, RolesGuard)
  @ApiOkResponse({ type: PaymentMethodResponseDto })
  @ApiNotFoundResponse({ description: 'Payment method not found' })
  async findById(
    @Param('id') id: string,
  ): Promise<PaymentMethodResponseDto | null> {
    this.logger.log(`GET /payment-methods/${id}`);
    const domain = await this.service.findById(id);
    return domain ? this.mapper.toDto(domain) : null;
  }

  @Patch(':id')
  @Roles(RoleEnum.admin)
  @UseGuards(MockAuthGuard, RolesGuard)
  @ApiOkResponse({ type: PaymentMethodResponseDto })
  @ApiNotFoundResponse({ description: 'Payment method not found' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto | null> {
    this.logger.log(`PATCH /payment-methods/${id}`);
    const domain = await this.service.update(id, data);
    return domain ? this.mapper.toDto(domain) : null;
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  @UseGuards(MockAuthGuard, RolesGuard)
  @ApiOkResponse({ description: 'Payment method deleted' })
  @ApiNotFoundResponse({ description: 'Payment method not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    this.logger.log(`DELETE /payment-methods/${id}`);
    await this.service.remove(id);
    return { message: 'Payment method deleted successfully' };
  }
}

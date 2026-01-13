import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Logger,
  UseGuards,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProductBrandService } from './product-brand.service';
import {
  ProductBrandResponseDto,
  CreateProductBrandDto,
  UpdateProductBrandDto,
} from './dto/product-brand.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { ProductBrandMapper } from './mapper/product-brand.mapper';

@ApiTags('Product Brands')
@ApiBearerAuth()
@UseGuards(MockAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('product-brands')
export class ProductBrandController {
  private readonly logger = new Logger(ProductBrandController.name);

  constructor(
    private readonly service: ProductBrandService,
    private readonly mapper: ProductBrandMapper,
  ) {}

  @Post()
  @Roles(RoleEnum.admin)
  @ApiCreatedResponse({
    type: ProductBrandResponseDto,
    description: 'Product brand created',
  })
  @HttpCode(201)
  async create(@Body() data: CreateProductBrandDto): Promise<any> {
    this.logger.log('POST /product-brands');
    const domain = await this.service.create(data);
    // Map Domain → DTO for response
    return this.mapper.toDto(domain);
  }

  @Get()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @ApiOkResponse({ type: [ProductBrandResponseDto] })
  async findAll(): Promise<ProductBrandResponseDto[]> {
    this.logger.log('GET /product-brands');
    const domains = await this.service.findAll();
    // Map Domain[] → DTO[] for response
    return this.mapper.toDtos(domains);
  }

  @Get(':id')
  @Roles(RoleEnum.admin, RoleEnum.user)
  @ApiOkResponse({ type: ProductBrandResponseDto })
  @ApiNotFoundResponse({ description: 'Product brand not found' })
  async findById(
    @Param('id') id: string,
  ): Promise<ProductBrandResponseDto | null> {
    this.logger.log(`GET /product-brands/${id}`);
    const domain = await this.service.findById(id);
    // Map Domain → DTO for response
    return domain ? this.mapper.toDto(domain) : null;
  }

  @Patch(':id')
  @Roles(RoleEnum.admin)
  @ApiOkResponse({ type: ProductBrandResponseDto })
  @ApiNotFoundResponse({ description: 'Product brand not found' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProductBrandDto,
  ): Promise<ProductBrandResponseDto | null> {
    this.logger.log(`PATCH /product-brands/${id}`);
    const domain = await this.service.update(id, data);
    // Map Domain → DTO for response
    return domain ? this.mapper.toDto(domain) : null;
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  @ApiOkResponse({ description: 'Product brand deleted' })
  @ApiNotFoundResponse({ description: 'Product brand not found' })
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`DELETE /product-brands/${id}`);
    return this.service.remove(id);
  }
}

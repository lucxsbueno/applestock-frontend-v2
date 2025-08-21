export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  productType: 'iphone' | 'macbook' | 'accessory';
  isSerialized: boolean;
  quantity: number;
  status: 'in_stock' | 'reserved' | 'repair' | 'sold';
  location: string;
  price: number;
  cost: number;
  mainPicture?: string;
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductItem {
  id: string;
  productId: string;
  serial?: string;
  status: 'in_stock' | 'reserved' | 'repair' | 'sold';
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  id: string;
  key: string;
  name: string;
  schema: Record<string, any>;
  columnMeta: Record<string, any>;
}

// Mock de tipos de produtos
export const productTypes: ProductType[] = [
  {
    id: 'pt_iphone',
    key: 'iphone',
    name: 'iPhone',
    schema: {
      storageGb: { type: 'number', required: true },
      color: { type: 'string', required: true },
      batteryHealthPct: { type: 'number', min: 0, max: 100 },
      imei: { type: 'string' },
      carrierLock: { type: 'string', enum: ['factory_unlocked', 'carrier_locked', 'unknown'] },
      grade: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
      hasBox: { type: 'boolean' },
      isSealed: { type: 'boolean' }
    },
    columnMeta: {
      storageGb: { label: 'Storage', type: 'number', unit: 'GB', filterable: true, sortable: true },
      color: { label: 'Color', type: 'string', filterable: true },
      batteryHealthPct: { label: 'Battery', type: 'percentage', filterable: true, sortable: true },
      grade: { label: 'Grade', type: 'enum', filterable: true, sortable: true },
      hasBox: { label: 'Has Box', type: 'boolean', filterable: true },
      isSealed: { label: 'Sealed', type: 'boolean', filterable: true }
    }
  },
  {
    id: 'pt_macbook',
    key: 'macbook',
    name: 'MacBook',
    schema: {
      storageGb: { type: 'number', required: true },
      ramGb: { type: 'number', required: true },
      processor: { type: 'string', required: true },
      color: { type: 'string', required: true },
      batteryHealthPct: { type: 'number', min: 0, max: 100 },
      serial: { type: 'string' },
      grade: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
      hasBox: { type: 'boolean' },
      isSealed: { type: 'boolean' }
    },
    columnMeta: {
      storageGb: { label: 'Storage', type: 'number', unit: 'GB', filterable: true, sortable: true },
      ramGb: { label: 'RAM', type: 'number', unit: 'GB', filterable: true, sortable: true },
      processor: { label: 'Processor', type: 'string', filterable: true },
      color: { label: 'Color', type: 'string', filterable: true },
      batteryHealthPct: { label: 'Battery', type: 'percentage', filterable: true, sortable: true },
      grade: { label: 'Grade', type: 'enum', filterable: true, sortable: true }
    }
  },
  {
    id: 'pt_accessory',
    key: 'accessory',
    name: 'Accessory',
    schema: {
      material: { type: 'string' },
      color: { type: 'string' },
      compatibleModel: { type: 'string' },
      size: { type: 'string' }
    },
    columnMeta: {
      material: { label: 'Material', type: 'string', filterable: true },
      color: { label: 'Color', type: 'string', filterable: true },
      compatibleModel: { label: 'Compatible with', type: 'string', filterable: true },
      size: { label: 'Size', type: 'string', filterable: true }
    }
  }
];

// Mock de produtos
export const mockProducts: Product[] = [
  // iPhones
  {
    id: 'prd_iphone_1',
    sku: 'IPH13-128-MID',
    name: 'iPhone 13',
    brand: 'Apple',
    category: 'smartphone',
    productType: 'iphone',
    isSerialized: true,
    quantity: 1,
    status: 'in_stock',
    location: 'Loja Centro',
    price: 3999.90,
    cost: 3000.00,
    mainPicture: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 128,
      color: 'Midnight',
      batteryHealthPct: 87,
      grade: 'A',
      imei: '359012345678901',
      carrierLock: 'factory_unlocked',
      hasBox: true,
      isSealed: false
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'prd_iphone_2',
    sku: 'IPH14-256-BLU',
    name: 'iPhone 14',
    brand: 'Apple',
    category: 'smartphone',
    productType: 'iphone',
    isSerialized: true,
    quantity: 1,
    status: 'in_stock',
    location: 'Loja Centro',
    price: 4999.90,
    cost: 3800.00,
    mainPicture: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 256,
      color: 'Blue',
      batteryHealthPct: 92,
      grade: 'A',
      imei: '359012345678902',
      carrierLock: 'factory_unlocked',
      hasBox: true,
      isSealed: true
    },
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'prd_iphone_3',
    sku: 'IPH12-64-BLK',
    name: 'iPhone 12',
    brand: 'Apple',
    category: 'smartphone',
    productType: 'iphone',
    isSerialized: true,
    quantity: 1,
    status: 'repair',
    location: 'Oficina',
    price: 2999.90,
    cost: 2200.00,
    attributes: {
      storageGb: 64,
      color: 'Black',
      batteryHealthPct: 78,
      grade: 'B',
      imei: '359012345678903',
      carrierLock: 'carrier_locked',
      hasBox: false,
      isSealed: false
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: 'prd_iphone_4',
    sku: 'IPH13-512-WHT',
    name: 'iPhone 13',
    brand: 'Apple',
    category: 'smartphone',
    productType: 'iphone',
    isSerialized: true,
    quantity: 1,
    status: 'reserved',
    location: 'Loja Centro',
    price: 5499.90,
    cost: 4200.00,
    mainPicture: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 512,
      color: 'White',
      batteryHealthPct: 95,
      grade: 'A',
      imei: '359012345678904',
      carrierLock: 'factory_unlocked',
      hasBox: true,
      isSealed: false
    },
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: 'prd_iphone_5',
    sku: 'IPH14-128-PUR',
    name: 'iPhone 14',
    brand: 'Apple',
    category: 'smartphone',
    productType: 'iphone',
    isSerialized: true,
    quantity: 1,
    status: 'sold',
    location: 'Loja Norte',
    price: 4499.90,
    cost: 3500.00,
    mainPicture: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 128,
      color: 'Purple',
      batteryHealthPct: 89,
      grade: 'A',
      imei: '359012345678905',
      carrierLock: 'factory_unlocked',
      hasBox: true,
      isSealed: false
    },
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  },
  // MacBooks
  {
    id: 'prd_macbook_1',
    sku: 'MBP13-512-SIL',
    name: 'MacBook Pro 13"',
    brand: 'Apple',
    category: 'laptop',
    productType: 'macbook',
    isSerialized: true,
    quantity: 1,
    status: 'in_stock',
    location: 'Loja Centro',
    price: 8999.90,
    cost: 7000.00,
    mainPicture: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 512,
      ramGb: 8,
      processor: 'M2',
      color: 'Silver',
      batteryHealthPct: 95,
      serial: 'C02XYZ123456',
      grade: 'A',
      hasBox: true,
      isSealed: false
    },
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-10T09:15:00Z'
  },
  {
    id: 'prd_macbook_2',
    sku: 'MBA15-256-SPACE',
    name: 'MacBook Air 15"',
    brand: 'Apple',
    category: 'laptop',
    productType: 'macbook',
    isSerialized: true,
    quantity: 1,
    status: 'in_stock',
    location: 'Loja Norte',
    price: 7999.90,
    cost: 6200.00,
    mainPicture: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 256,
      ramGb: 8,
      processor: 'M2',
      color: 'Space Gray',
      batteryHealthPct: 97,
      serial: 'C02XYZ123457',
      grade: 'A',
      hasBox: true,
      isSealed: true
    },
    createdAt: '2024-01-14T13:20:00Z',
    updatedAt: '2024-01-14T13:20:00Z'
  },
  {
    id: 'prd_macbook_3',
    sku: 'MBP16-1TB-MID',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    category: 'laptop',
    productType: 'macbook',
    isSerialized: true,
    quantity: 1,
    status: 'reserved',
    location: 'Loja Sul',
    price: 15999.90,
    cost: 12500.00,
    mainPicture: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 1024,
      ramGb: 16,
      processor: 'M3 Pro',
      color: 'Midnight',
      batteryHealthPct: 99,
      serial: 'C02XYZ123458',
      grade: 'A',
      hasBox: true,
      isSealed: true
    },
    createdAt: '2024-01-22T10:45:00Z',
    updatedAt: '2024-01-22T10:45:00Z'
  },
  {
    id: 'prd_macbook_4',
    sku: 'MBA13-512-GOLD',
    name: 'MacBook Air 13"',
    brand: 'Apple',
    category: 'laptop',
    productType: 'macbook',
    isSerialized: true,
    quantity: 1,
    status: 'in_stock',
    location: 'Loja Centro',
    price: 6499.90,
    cost: 5000.00,
    attributes: {
      storageGb: 512,
      ramGb: 8,
      processor: 'M1',
      color: 'Gold',
      batteryHealthPct: 88,
      serial: 'C02XYZ123459',
      grade: 'B',
      hasBox: false,
      isSealed: false
    },
    createdAt: '2024-01-08T16:30:00Z',
    updatedAt: '2024-01-08T16:30:00Z'
  },
  {
    id: 'prd_macbook_5',
    sku: 'MBP14-512-SIL',
    name: 'MacBook Pro 14"',
    brand: 'Apple',
    category: 'laptop',
    productType: 'macbook',
    isSerialized: true,
    quantity: 1,
    status: 'sold',
    location: 'Loja Norte',
    price: 11999.90,
    cost: 9500.00,
    mainPicture: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 512,
      ramGb: 16,
      processor: 'M3',
      color: 'Silver',
      batteryHealthPct: 96,
      serial: 'C02XYZ123460',
      grade: 'A',
      hasBox: true,
      isSealed: false
    },
    createdAt: '2024-01-19T14:15:00Z',
    updatedAt: '2024-01-19T14:15:00Z'
  },
  // Acessórios
  {
    id: 'prd_accessory_1',
    sku: 'CASE-IPH13-CLEAR',
    name: 'Capa iPhone 13 Transparente',
    brand: 'Apple',
    category: 'case',
    productType: 'accessory',
    isSerialized: false,
    quantity: 25,
    status: 'in_stock',
    location: 'Loja Centro',
    price: 89.90,
    cost: 45.00,
    mainPicture: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=150&h=150&fit=crop',
    attributes: {
      material: 'Silicone',
      color: 'Transparente',
      compatibleModel: 'iPhone 13',
      size: 'Padrão'
    },
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-05T16:45:00Z'
  },
  {
    id: 'prd_accessory_2',
    sku: 'CASE-IPH14-BLACK',
    name: 'Capa iPhone 14 Preta',
    brand: 'Apple',
    category: 'case',
    productType: 'accessory',
    isSerialized: false,
    quantity: 18,
    status: 'in_stock',
    location: 'Loja Norte',
    price: 99.90,
    cost: 50.00,
    mainPicture: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=150&h=150&fit=crop',
    attributes: {
      material: 'Silicone',
      color: 'Preto',
      compatibleModel: 'iPhone 14',
      size: 'Padrão'
    },
    createdAt: '2024-01-07T12:30:00Z',
    updatedAt: '2024-01-07T12:30:00Z'
  },
  {
    id: 'prd_accessory_3',
    sku: 'CABLE-USB-C',
    name: 'Cabo USB-C 2m',
    brand: 'Apple',
    category: 'cable',
    productType: 'accessory',
    isSerialized: false,
    quantity: 50,
    status: 'in_stock',
    location: 'Loja Centro',
    price: 149.90,
    cost: 75.00,
    attributes: {
      material: 'Nylon',
      color: 'Branco',
      compatibleModel: 'Universal',
      size: '2 metros'
    },
    createdAt: '2024-01-03T09:20:00Z',
    updatedAt: '2024-01-03T09:20:00Z'
  },
  {
    id: 'prd_accessory_4',
    sku: 'ADAPTER-USB-C',
    name: 'Adaptador USB-C para HDMI',
    brand: 'Apple',
    category: 'adapter',
    productType: 'accessory',
    isSerialized: false,
    quantity: 12,
    status: 'in_stock',
    location: 'Loja Sul',
    price: 299.90,
    cost: 150.00,
    mainPicture: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=150&fit=crop',
    attributes: {
      material: 'Alumínio',
      color: 'Prata',
      compatibleModel: 'MacBook',
      size: 'Padrão'
    },
    createdAt: '2024-01-09T11:45:00Z',
    updatedAt: '2024-01-09T11:45:00Z'
  },
  {
    id: 'prd_accessory_5',
    sku: 'CHARGER-20W',
    name: 'Carregador 20W',
    brand: 'Apple',
    category: 'charger',
    productType: 'accessory',
    isSerialized: false,
    quantity: 50,
    status: 'in_stock',
    location: 'Loja Centro',
    price: 199.90,
    cost: 100.00,
    mainPicture: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=150&fit=crop',
    attributes: {
      material: 'Plástico',
      color: 'Branco',
      compatibleModel: 'iPhone',
      size: 'Padrão'
    },
    createdAt: '2024-01-04T14:15:00Z',
    updatedAt: '2024-01-04T14:15:00Z'
  },
  // Mais iPhones
  {
    id: 'prd_iphone_6',
    sku: 'IPH15-256-BLU',
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'smartphone',
    productType: 'iphone',
    isSerialized: true,
    quantity: 1,
    status: 'in_stock',
    location: 'Loja Sul',
    price: 5999.90,
    cost: 4500.00,
    mainPicture: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 256,
      color: 'Blue',
      batteryHealthPct: 96,
      grade: 'A',
      imei: '359012345678906',
      carrierLock: 'factory_unlocked',
      hasBox: true,
      isSealed: true
    },
    createdAt: '2024-01-23T09:30:00Z',
    updatedAt: '2024-01-23T09:30:00Z'
  },
  {
    id: 'prd_iphone_7',
    sku: 'IPH15P-512-NAT',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'smartphone',
    productType: 'iphone',
    isSerialized: true,
    quantity: 1,
    status: 'reserved',
    location: 'Loja Centro',
    price: 7999.90,
    cost: 6000.00,
    mainPicture: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 512,
      color: 'Natural Titanium',
      batteryHealthPct: 98,
      grade: 'A',
      imei: '359012345678907',
      carrierLock: 'factory_unlocked',
      hasBox: true,
      isSealed: true
    },
    createdAt: '2024-01-24T11:45:00Z',
    updatedAt: '2024-01-24T11:45:00Z'
  },
  {
    id: 'prd_iphone_8',
    sku: 'IPH14P-128-GOLD',
    name: 'iPhone 14 Pro',
    brand: 'Apple',
    category: 'smartphone',
    productType: 'iphone',
    isSerialized: true,
    quantity: 1,
    status: 'in_stock',
    location: 'Loja Norte',
    price: 6499.90,
    cost: 5000.00,
    mainPicture: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 128,
      color: 'Gold',
      batteryHealthPct: 91,
      grade: 'A',
      imei: '359012345678908',
      carrierLock: 'factory_unlocked',
      hasBox: true,
      isSealed: false
    },
    createdAt: '2024-01-21T14:20:00Z',
    updatedAt: '2024-01-21T14:20:00Z'
  },
  {
    id: 'prd_iphone_9',
    sku: 'IPH13-256-GREEN',
    name: 'iPhone 13',
    brand: 'Apple',
    category: 'smartphone',
    productType: 'iphone',
    isSerialized: true,
    quantity: 1,
    status: 'repair',
    location: 'Oficina',
    price: 3499.90,
    cost: 2600.00,
    attributes: {
      storageGb: 256,
      color: 'Green',
      batteryHealthPct: 82,
      grade: 'B',
      imei: '359012345678909',
      carrierLock: 'factory_unlocked',
      hasBox: false,
      isSealed: false
    },
    createdAt: '2024-01-11T16:30:00Z',
    updatedAt: '2024-01-25T10:15:00Z'
  },
  {
    id: 'prd_iphone_10',
    sku: 'IPH12-128-RED',
    name: 'iPhone 12',
    brand: 'Apple',
    category: 'smartphone',
    productType: 'iphone',
    isSerialized: true,
    quantity: 1,
    status: 'sold',
    location: 'Loja Centro',
    price: 2799.90,
    cost: 2000.00,
    mainPicture: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 128,
      color: 'Red',
      batteryHealthPct: 85,
      grade: 'B',
      imei: '359012345678910',
      carrierLock: 'factory_unlocked',
      hasBox: true,
      isSealed: false
    },
    createdAt: '2024-01-13T12:45:00Z',
    updatedAt: '2024-01-26T15:30:00Z'
  },
  // Mais MacBooks
  {
    id: 'prd_macbook_6',
    sku: 'MBA13-256-SIL',
    name: 'MacBook Air 13"',
    brand: 'Apple',
    category: 'laptop',
    productType: 'macbook',
    isSerialized: true,
    quantity: 1,
    status: 'in_stock',
    location: 'Loja Sul',
    price: 5499.90,
    cost: 4200.00,
    mainPicture: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 256,
      ramGb: 8,
      processor: 'M2',
      color: 'Silver',
      batteryHealthPct: 93,
      serial: 'C02XYZ123461',
      grade: 'A',
      hasBox: true,
      isSealed: false
    },
    createdAt: '2024-01-17T13:45:00Z',
    updatedAt: '2024-01-17T13:45:00Z'
  },
  {
    id: 'prd_macbook_7',
    sku: 'MBP14-1TB-SPACE',
    name: 'MacBook Pro 14"',
    brand: 'Apple',
    category: 'laptop',
    productType: 'macbook',
    isSerialized: true,
    quantity: 1,
    status: 'reserved',
    location: 'Loja Centro',
    price: 13999.90,
    cost: 11000.00,
    mainPicture: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 1024,
      ramGb: 16,
      processor: 'M3 Pro',
      color: 'Space Gray',
      batteryHealthPct: 97,
      serial: 'C02XYZ123462',
      grade: 'A',
      hasBox: true,
      isSealed: true
    },
    createdAt: '2024-01-25T10:30:00Z',
    updatedAt: '2024-01-25T10:30:00Z'
  },
  {
    id: 'prd_macbook_8',
    sku: 'MBA15-512-MID',
    name: 'MacBook Air 15"',
    brand: 'Apple',
    category: 'laptop',
    productType: 'macbook',
    isSerialized: true,
    quantity: 1,
    status: 'in_stock',
    location: 'Loja Norte',
    price: 8499.90,
    cost: 6500.00,
    mainPicture: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 512,
      ramGb: 8,
      processor: 'M2',
      color: 'Midnight',
      batteryHealthPct: 94,
      serial: 'C02XYZ123463',
      grade: 'A',
      hasBox: true,
      isSealed: false
    },
    createdAt: '2024-01-20T15:20:00Z',
    updatedAt: '2024-01-20T15:20:00Z'
  },
  {
    id: 'prd_macbook_9',
    sku: 'MBP16-2TB-SIL',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    category: 'laptop',
    productType: 'macbook',
    isSerialized: true,
    quantity: 1,
    status: 'sold',
    location: 'Loja Sul',
    price: 18999.90,
    cost: 15000.00,
    mainPicture: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop',
    attributes: {
      storageGb: 2048,
      ramGb: 32,
      processor: 'M3 Max',
      color: 'Silver',
      batteryHealthPct: 99,
      serial: 'C02XYZ123464',
      grade: 'A',
      hasBox: true,
      isSealed: false
    },
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-27T14:45:00Z'
  },
  {
    id: 'prd_macbook_10',
    sku: 'MBA13-128-GOLD',
    name: 'MacBook Air 13"',
    brand: 'Apple',
    category: 'laptop',
    productType: 'macbook',
    isSerialized: true,
    quantity: 1,
    status: 'repair',
    location: 'Oficina',
    price: 4499.90,
    cost: 3500.00,
    attributes: {
      storageGb: 128,
      ramGb: 8,
      processor: 'M1',
      color: 'Gold',
      batteryHealthPct: 76,
      serial: 'C02XYZ123465',
      grade: 'C',
      hasBox: false,
      isSealed: false
    },
    createdAt: '2024-01-09T11:30:00Z',
    updatedAt: '2024-01-28T16:20:00Z'
  },
  // Mais Acessórios
  {
    id: 'prd_accessory_6',
    sku: 'CASE-IPH15-CLEAR',
    name: 'Capa iPhone 15 Transparente',
    brand: 'Apple',
    category: 'case',
    productType: 'accessory',
    isSerialized: false,
    quantity: 30,
    status: 'in_stock',
    location: 'Loja Centro',
    price: 99.90,
    cost: 50.00,
    mainPicture: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=150&h=150&fit=crop',
    attributes: {
      material: 'Silicone',
      color: 'Transparente',
      compatibleModel: 'iPhone 15',
      size: 'Padrão'
    },
    createdAt: '2024-01-26T14:30:00Z',
    updatedAt: '2024-01-26T14:30:00Z'
  },
  {
    id: 'prd_accessory_7',
    sku: 'CASE-IPH14P-BLUE',
    name: 'Capa iPhone 14 Pro Azul',
    brand: 'Apple',
    category: 'case',
    productType: 'accessory',
    isSerialized: false,
    quantity: 15,
    status: 'in_stock',
    location: 'Loja Norte',
    price: 119.90,
    cost: 60.00,
    mainPicture: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=150&h=150&fit=crop',
    attributes: {
      material: 'Silicone',
      color: 'Azul',
      compatibleModel: 'iPhone 14 Pro',
      size: 'Padrão'
    },
    createdAt: '2024-01-24T16:45:00Z',
    updatedAt: '2024-01-24T16:45:00Z'
  },
  {
    id: 'prd_accessory_8',
    sku: 'CABLE-LIGHTNING',
    name: 'Cabo Lightning 1m',
    brand: 'Apple',
    category: 'cable',
    productType: 'accessory',
    isSerialized: false,
    quantity: 75,
    status: 'in_stock',
    location: 'Loja Centro',
    price: 89.90,
    cost: 45.00,
    attributes: {
      material: 'Nylon',
      color: 'Branco',
      compatibleModel: 'iPhone',
      size: '1 metro'
    },
    createdAt: '2024-01-02T10:15:00Z',
    updatedAt: '2024-01-02T10:15:00Z'
  },
  {
    id: 'prd_accessory_9',
    sku: 'ADAPTER-MAGSAFE',
    name: 'Adaptador MagSafe',
    brand: 'Apple',
    category: 'adapter',
    productType: 'accessory',
    isSerialized: false,
    quantity: 8,
    status: 'in_stock',
    location: 'Loja Sul',
    price: 399.90,
    cost: 200.00,
    mainPicture: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=150&fit=crop',
    attributes: {
      material: 'Alumínio',
      color: 'Prata',
      compatibleModel: 'iPhone 12+',
      size: 'Padrão'
    },
    createdAt: '2024-01-12T13:20:00Z',
    updatedAt: '2024-01-12T13:20:00Z'
  },
  {
    id: 'prd_accessory_10',
    sku: 'CHARGER-35W',
    name: 'Carregador 35W Duplo',
    brand: 'Apple',
    category: 'charger',
    productType: 'accessory',
    isSerialized: false,
    quantity: 20,
    status: 'in_stock',
    location: 'Loja Centro',
    price: 299.90,
    cost: 150.00,
    mainPicture: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=150&fit=crop',
    attributes: {
      material: 'Plástico',
      color: 'Branco',
      compatibleModel: 'iPhone/MacBook',
      size: 'Padrão'
    },
    createdAt: '2024-01-06T11:30:00Z',
    updatedAt: '2024-01-06T11:30:00Z'
  }
];

// Mock de itens serializados (para produtos com isSerialized = true)
export const mockProductItems: ProductItem[] = [
  {
    id: 'item_iphone_1',
    productId: 'prd_iphone_1',
    serial: '359012345678901',
    status: 'in_stock',
    attributes: {
      batteryHealthPct: 87,
      lastCheck: '2024-01-15T10:00:00Z'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'item_iphone_2',
    productId: 'prd_iphone_2',
    serial: '359012345678902',
    status: 'in_stock',
    attributes: {
      batteryHealthPct: 92,
      lastCheck: '2024-01-16T10:00:00Z'
    },
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'item_iphone_3',
    productId: 'prd_iphone_3',
    serial: '359012345678903',
    status: 'repair',
    attributes: {
      batteryHealthPct: 78,
      lastCheck: '2024-01-17T10:00:00Z',
      repairNotes: 'Tela trincada, aguardando peça'
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: 'item_macbook_1',
    productId: 'prd_macbook_1',
    serial: 'C02XYZ123456',
    status: 'in_stock',
    attributes: {
      batteryHealthPct: 89,
      lastCheck: '2024-01-14T10:00:00Z'
    },
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z'
  }
];

// Função para obter produtos (simula API)
export const getProducts = (): Product[] => {
  return mockProducts;
};

// Função para obter tipos de produtos (simula API)
export const getProductTypes = (): ProductType[] => {
  return productTypes;
};

export const getProductItems = (productId?: string) => {
  if (productId) {
    return mockProductItems.filter(item => item.productId === productId);
  }
  return mockProductItems;
}; 
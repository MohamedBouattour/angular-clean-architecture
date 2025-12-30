import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

interface FeatureAttribute {
  name: string;
  type: string;
}

interface FeatureDefinition {
  name: string;
  attributes: FeatureAttribute[];
}

interface FeatureSchema {
  version: string;
  features: Record<string, FeatureDefinition>;
}

/**
 * Dynamic Features Service
 * Reads feature-schema.json and generates mock data based on attribute types
 */
@Injectable()
export class FeaturesService implements OnModuleInit {
  private readonly logger = new Logger(FeaturesService.name);
  private schema: FeatureSchema | null = null;
  
  // In-memory storage: { featureType: { id: item } }
  private readonly store: Map<string, Map<string, any>> = new Map();

  // Sample data for generating realistic mock values
  private readonly sampleData = {
    names: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'],
    adjectives: ['Premium', 'Professional', 'Elite', 'Advanced', 'Ultimate', 'Classic', 'Modern', 'Deluxe'],
    words: ['Widget', 'Gadget', 'Tool', 'Device', 'System', 'Solution', 'Platform', 'Service'],
    firstNames: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria'],
    lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'],
    cities: ['New York', 'London', 'Paris', 'Tokyo', 'Berlin', 'Sydney', 'Toronto', 'Dubai', 'Singapore', 'Amsterdam'],
    countries: ['USA', 'UK', 'France', 'Japan', 'Germany', 'Australia', 'Canada', 'UAE', 'Singapore', 'Netherlands'],
    descriptions: [
      'A high-quality solution for modern needs',
      'Industry-leading performance and reliability',
      'Designed for professionals who demand the best',
      'Innovative features meet elegant design',
      'The perfect choice for discerning customers',
    ],
  };

  async onModuleInit() {
    await this.loadSchema();
    this.initializeMockData();
  }

  private async loadSchema() {
    try {
      // Try multiple possible paths for the schema file
      const possiblePaths = [
        path.join(process.cwd(), 'feature-schema.json'),
        path.join(process.cwd(), '..', '..', 'feature-schema.json'),
        path.join(__dirname, '..', '..', '..', '..', '..', 'feature-schema.json'),
      ];

      for (const schemaPath of possiblePaths) {
        if (fs.existsSync(schemaPath)) {
          const content = fs.readFileSync(schemaPath, 'utf-8');
          this.schema = JSON.parse(content);
          this.logger.log(`Loaded feature schema from: ${schemaPath}`);
          return;
        }
      }

      this.logger.warn('feature-schema.json not found, using default schema');
      this.schema = this.getDefaultSchema();
    } catch (error) {
      this.logger.error('Error loading schema:', error);
      this.schema = this.getDefaultSchema();
    }
  }

  private getDefaultSchema(): FeatureSchema {
    return {
      version: '1.0',
      features: {
        product: {
          name: 'product',
          attributes: [
            { name: 'name', type: 'string' },
            { name: 'price', type: 'number' },
            { name: 'description', type: 'string' },
          ],
        },
      },
    };
  }

  private initializeMockData() {
    if (!this.schema) return;

    // Generate initial mock data for each feature
    for (const [featureKey, feature] of Object.entries(this.schema.features)) {
      const pluralKey = this.pluralize(featureKey);
      const featureStore = new Map<string, any>();

      // Generate 5-10 random items for each feature
      const count = 5 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const id = String(i + 1);
        const item = this.generateMockItem(id, feature.attributes);
        featureStore.set(id, item);
      }

      this.store.set(pluralKey, featureStore);
      this.logger.log(`Generated ${count} mock items for: ${pluralKey}`);
    }
  }

  private generateMockItem(id: string, attributes: FeatureAttribute[]): any {
    const item: any = { id };

    for (const attr of attributes) {
      item[attr.name] = this.generateMockValue(attr.name, attr.type);
    }

    return item;
  }

  private generateMockValue(name: string, type: string): any {
    const lowerName = name.toLowerCase();

    switch (type.toLowerCase()) {
      case 'string':
        return this.generateStringValue(lowerName);
      case 'number':
        return this.generateNumberValue(lowerName);
      case 'boolean':
        return Math.random() > 0.5;
      case 'date':
        return this.generateDateValue(lowerName);
      default:
        return `Mock ${name}`;
    }
  }

  private generateStringValue(name: string): string {
    // Generate contextual string values based on field name
    if (name.includes('name') || name === 'title') {
      const adj = this.randomFrom(this.sampleData.adjectives);
      const noun = this.randomFrom(this.sampleData.words);
      return `${adj} ${noun}`;
    }
    if (name.includes('author') || name.includes('firstname') || name === 'first') {
      return `${this.randomFrom(this.sampleData.firstNames)} ${this.randomFrom(this.sampleData.lastNames)}`;
    }
    if (name.includes('description') || name.includes('bio')) {
      return this.randomFrom(this.sampleData.descriptions);
    }
    if (name.includes('email')) {
      return `${this.randomFrom(this.sampleData.firstNames).toLowerCase()}@example.com`;
    }
    if (name.includes('isbn')) {
      return `978-${this.randomDigits(10)}`;
    }
    if (name.includes('city') || name.includes('location')) {
      return this.randomFrom(this.sampleData.cities);
    }
    if (name.includes('country') || name.includes('nationality')) {
      return this.randomFrom(this.sampleData.countries);
    }
    if (name.includes('phone')) {
      return `+1-${this.randomDigits(3)}-${this.randomDigits(3)}-${this.randomDigits(4)}`;
    }
    
    // Default: generate a random name-like string
    return `${this.randomFrom(this.sampleData.names)} ${Math.floor(Math.random() * 1000)}`;
  }

  private generateNumberValue(name: string): number {
    if (name.includes('price') || name.includes('cost')) {
      return Math.round(Math.random() * 1000 * 100) / 100; // 0-1000 with 2 decimals
    }
    if (name.includes('age')) {
      return 18 + Math.floor(Math.random() * 60);
    }
    if (name.includes('year') || name.includes('founded')) {
      return 1950 + Math.floor(Math.random() * 74);
    }
    if (name.includes('quantity') || name.includes('count') || name.includes('stock')) {
      return Math.floor(Math.random() * 1000);
    }
    if (name.includes('rating')) {
      return Math.round(Math.random() * 5 * 10) / 10; // 0-5 with 1 decimal
    }
    
    // Default: random integer 0-100
    return Math.floor(Math.random() * 100);
  }

  private generateDateValue(name: string): Date {
    const now = new Date();
    
    if (name.includes('birth') || name.includes('dob')) {
      // Birth date: 18-80 years ago
      const yearsAgo = 18 + Math.floor(Math.random() * 62);
      return new Date(now.getFullYear() - yearsAgo, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    }
    if (name.includes('published') || name.includes('created') || name.includes('founded')) {
      // Past date: 0-30 years ago
      const daysAgo = Math.floor(Math.random() * 365 * 30);
      return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    }
    
    // Default: random date within last 5 years
    const daysAgo = Math.floor(Math.random() * 365 * 5);
    return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  }

  private randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private randomDigits(count: number): string {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 10)).join('');
  }

  private pluralize(word: string): string {
    if (word.endsWith('y')) {
      return word.slice(0, -1) + 'ies';
    }
    if (word.endsWith('s') || word.endsWith('x') || word.endsWith('ch') || word.endsWith('sh')) {
      return word + 'es';
    }
    return word + 's';
  }

  private getFeatureStore(type: string): Map<string, any> {
    // Try both singular and plural forms
    if (this.store.has(type)) {
      return this.store.get(type)!;
    }
    
    // Create new store if doesn't exist
    const newStore = new Map<string, any>();
    this.store.set(type, newStore);
    return newStore;
  }

  private getFeatureDefinition(type: string): FeatureDefinition | null {
    if (!this.schema) return null;
    
    // Try to find by plural or singular name
    const singular = type.endsWith('s') ? type.slice(0, -1) : type;
    return this.schema.features[singular] || this.schema.features[type] || null;
  }

  async findAll(type: string, filter?: string): Promise<any[]> {
    const featureStore = this.getFeatureStore(type);
    let items = Array.from(featureStore.values());

    // Simple filter implementation
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      items = items.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(lowerFilter)
        )
      );
    }

    return items;
  }

  async findOne(type: string, id: string): Promise<any> {
    const featureStore = this.getFeatureStore(type);
    const item = featureStore.get(id);

    if (!item) {
      throw new NotFoundException(`${type} with id ${id} not found`);
    }

    return item;
  }

  async create(type: string, data: any): Promise<any> {
    const featureStore = this.getFeatureStore(type);
    const id = uuidv4();
    const newItem = { id, ...data };
    featureStore.set(id, newItem);
    return newItem;
  }

  async update(type: string, id: string, data: any): Promise<any> {
    const featureStore = this.getFeatureStore(type);

    if (!featureStore.has(id)) {
      throw new NotFoundException(`${type} with id ${id} not found`);
    }

    const updatedItem = { id, ...data };
    featureStore.set(id, updatedItem);
    return updatedItem;
  }

  async delete(type: string, id: string): Promise<{ success: boolean }> {
    const featureStore = this.getFeatureStore(type);

    if (!featureStore.has(id)) {
      throw new NotFoundException(`${type} with id ${id} not found`);
    }

    featureStore.delete(id);
    return { success: true };
  }

  /**
   * Get the schema for a feature type (useful for frontend forms)
   */
  async getSchema(type: string): Promise<FeatureDefinition | null> {
    return this.getFeatureDefinition(type);
  }

  /**
   * Get all available feature types
   */
  async getAvailableFeatures(): Promise<string[]> {
    return this.schema ? Object.keys(this.schema.features) : [];
  }
}

import crypto from 'crypto';
import { db } from './db';

const SECRET_KEY = process.env.AUTH_SECRET || 'bcgsp-secret-key-change-in-production';

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function seed() {
  console.log('🌱 Seeding BCGSP database...');

  try {
    // 1. Create admin user
    console.log('Creating admin user...');
    const adminPasswordHash = await hashPassword('admin123');
    const admin = await db.user.upsert({
      where: { email: 'admin@bcgsp.com' },
      update: {},
      create: {
        email: 'admin@bcgsp.com',
        name: 'BCGSP Admin',
        passwordHash: adminPasswordHash,
        role: 'admin',
      },
    });
    console.log(`✅ Admin user created: ${admin.email}`);

    // 2. Create sample SME user
    console.log('Creating sample SME user...');
    const smePasswordHash = await hashPassword('sme123');
    const smeUser = await db.user.upsert({
      where: { email: 'sme@example.com' },
      update: {},
      create: {
        email: 'sme@example.com',
        name: 'Sarah Chen',
        passwordHash: smePasswordHash,
        role: 'sme',
      },
    });
    console.log(`✅ SME user created: ${smeUser.email}`);

    // 3. Create sample company for SME user
    console.log('Creating sample company...');
    const company = await db.company.upsert({
      where: { userId: smeUser.id },
      update: {},
      create: {
        userId: smeUser.id,
        name: 'TechVenture Solutions',
        industry: 'Technology',
        subIndustry: 'SaaS',
        businessModel: 'B2B SaaS',
        stage: 'Growth',
        revenue: '$1M-$5M',
        employees: '11-50',
        region: 'North America',
        country: 'United States',
        foundedYear: 2019,
        website: 'https://techventure.example.com',
        description: 'A B2B SaaS company providing data analytics solutions for mid-market enterprises.',
        targetCustomers: 'Mid-market enterprises with 100-1000 employees seeking data analytics solutions',
        products: 'DataViz Pro (analytics platform), InsightHub (reporting tool), DataSync (integration service)',
      },
    });
    console.log(`✅ Company created: ${company.name}`);

    // 4. Create sample diagnostic with answers
    console.log('Creating sample diagnostic...');
    const diagnostic = await db.diagnostic.create({
      data: {
        userId: smeUser.id,
        companyId: company.id,
        status: 'completed',
        businessModel: 62,
        market: 48,
        product: 55,
        customers: 44,
        marketing: 38,
        sales: 52,
        operations: 58,
        financial: 42,
        team: 66,
        growth: 35,
        overallScore: 50.9,
        riskScore: 53.4,
        growthPotential: 46.95,
        investmentReady: 48.39,
      },
    });
    console.log(`✅ Diagnostic created: ${diagnostic.id}`);

    // 5. Create diagnostic answers (10 questions per dimension)
    console.log('Creating diagnostic answers...');
    const dimensions = [
      'businessModel', 'market', 'product', 'customers', 'marketing',
      'sales', 'operations', 'financial', 'team', 'growth',
    ];

    const questionTexts: Record<string, string[]> = {
      businessModel: [
        'How clearly defined is your value proposition?',
        'How diversified are your revenue streams?',
        'How scalable is your current business model?',
        'How well does your pricing capture value?',
        'How strong are your competitive moats?',
        'How sustainable is your cost structure?',
        'How aligned is your model with market needs?',
        'How effective is your distribution strategy?',
        'How adaptable is your model to market changes?',
        'How well does your model support recurring revenue?',
      ],
      market: [
        'How large is your addressable market?',
        'How fast is your market growing?',
        'How well do you understand market trends?',
        'How strong is your market positioning?',
        'How effective is your market research?',
        'How well do you track competitor activities?',
        'How clear is your market entry strategy?',
        'How diversified is your market exposure?',
        'How strong are your market partnerships?',
        'How well do you respond to market shifts?',
      ],
      product: [
        'How strong is your product-market fit?',
        'How differentiated is your product?',
        'How satisfied are your customers with the product?',
        'How robust is your product roadmap?',
        'How effective is your product development process?',
        'How well does your product solve customer pain points?',
        'How innovative is your product compared to alternatives?',
        'How reliable is your product quality?',
        'How well does your product integrate with customer workflows?',
        'How effective is your product feedback loop?',
      ],
      customers: [
        'How well do you understand your customer segments?',
        'How effective is your customer acquisition?',
        'How strong is your customer retention?',
        'How satisfied are your customers (NPS)?',
        'How effective is your customer success program?',
        'How well do you track customer health?',
        'How strong is your customer feedback system?',
        'How well do you handle customer complaints?',
        'How effective is your upselling/cross-selling?',
        'How strong is your customer advocacy?',
      ],
      marketing: [
        'How effective is your brand awareness strategy?',
        'How well do you measure marketing ROI?',
        'How strong is your content marketing?',
        'How effective are your digital marketing channels?',
        'How well do you target your ideal customers?',
        'How strong is your social media presence?',
        'How effective is your marketing automation?',
        'How well does marketing align with sales?',
        'How strong is your thought leadership?',
        'How effective is your event marketing?',
      ],
      sales: [
        'How effective is your sales process?',
        'How strong is your sales team?',
        'How well does your sales funnel convert?',
        'How effective is your CRM usage?',
        'How strong are your sales metrics and tracking?',
        'How well do you qualify leads?',
        'How effective is your sales enablement?',
        'How strong is your pipeline management?',
        'How well do you handle objections?',
        'How effective is your closing process?',
      ],
      operations: [
        'How efficient are your core processes?',
        'How well do you manage quality?',
        'How effective is your supply chain?',
        'How strong is your operational technology?',
        'How well do you manage capacity?',
        'How effective is your project management?',
        'How well do you handle compliance?',
        'How strong is your vendor management?',
        'How effective are your operational metrics?',
        'How well do you manage operational risk?',
      ],
      financial: [
        'How healthy is your cash flow?',
        'How strong are your profit margins?',
        'How effective is your financial planning?',
        'How well do you manage working capital?',
        'How strong is your financial reporting?',
        'How effective is your budget management?',
        'How well do you manage financial risk?',
        'How strong is your unit economics?',
        'How effective is your capital allocation?',
        'How well prepared are you for fundraising?',
      ],
      team: [
        'How strong is your leadership team?',
        'How effective is your hiring process?',
        'How well do you retain top talent?',
        'How strong is your team culture?',
        'How effective is your performance management?',
        'How well do you develop employee skills?',
        'How strong is your organizational structure?',
        'How effective is your internal communication?',
        'How well do you manage remote/hybrid work?',
        'How strong is your succession planning?',
      ],
      growth: [
        'How strong is your growth strategy?',
        'How effective are your growth experiments?',
        'How well do you leverage viral growth?',
        'How strong is your referral program?',
        'How effective is your expansion strategy?',
        'How well do you track growth metrics?',
        'How strong is your product-led growth?',
        'How effective is your partnership-driven growth?',
        'How well do you optimize conversion rates?',
        'How strong is your international growth capability?',
      ],
    };

    // Sample answer scores for each dimension
    const sampleScores: Record<string, number[]> = {
      businessModel: [4, 2, 3, 3, 2, 3, 4, 3, 3, 3],   // avg: 3.0 → 60%
      market: [3, 2, 3, 2, 3, 2, 3, 2, 2, 3],            // avg: 2.5 → 50%
      product: [4, 3, 3, 3, 2, 3, 3, 3, 3, 3],            // avg: 3.0 → 60%
      customers: [3, 2, 2, 3, 2, 2, 3, 2, 2, 2],          // avg: 2.3 → 46%
      marketing: [2, 2, 2, 3, 2, 2, 2, 2, 2, 2],          // avg: 2.1 → 42%
      sales: [3, 3, 3, 2, 3, 3, 3, 2, 3, 2],              // avg: 2.7 → 54%
      operations: [3, 3, 3, 3, 3, 3, 2, 3, 3, 3],         // avg: 2.9 → 58%
      financial: [2, 2, 2, 3, 2, 2, 2, 3, 2, 2],          // avg: 2.2 → 44%
      team: [4, 3, 4, 3, 3, 3, 3, 3, 3, 4],               // avg: 3.3 → 66%
      growth: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],             // avg: 2.0 → 40%
    };

    const answersData = [];
    for (const dimension of dimensions) {
      const scores = sampleScores[dimension];
      const questions = questionTexts[dimension];
      for (let i = 0; i < 10; i++) {
        answersData.push({
          diagnosticId: diagnostic.id,
          dimension,
          questionIndex: i,
          questionText: questions[i],
          answer: scores[i],
        });
      }
    }

    await db.diagnosticAnswer.createMany({ data: answersData });
    console.log(`✅ Created ${answersData.length} diagnostic answers`);

    // 6. Create sample knowledge articles
    console.log('Creating knowledge articles...');
    const knowledgeArticles = [
      {
        title: 'Business Model Canvas: A Complete Guide for SMEs',
        category: 'framework',
        content: `# Business Model Canvas for SMEs

## Overview
The Business Model Canvas (BMC) is a strategic management template used for developing new business models and documenting existing ones. It provides a visual chart with elements describing a firm's value proposition, infrastructure, customers, and finances.

## The 9 Building Blocks

### 1. Customer Segments
Define the different groups of people or organizations your enterprise aims to reach and serve.

### 2. Value Propositions
Describe the bundle of products and services that create value for a specific Customer Segment.

### 3. Channels
Outline how you communicate with and reach your Customer Segments to deliver your Value Proposition.

### 4. Customer Relationships
Describe the types of relationships you establish with specific Customer Segments.

### 5. Revenue Streams
Represent the cash a company generates from each Customer Segment.

### 6. Key Resources
Describe the most important assets required to make a business model work.

### 7. Key Activities
Describe the most important things a company must do to make its business model work.

### 8. Key Partnerships
Describe the network of suppliers and partners that make the business model work.

### 9. Cost Structure
Describe all costs incurred to operate a business model.

## How to Use
1. Print or draw the canvas on a large surface
2. Start with Customer Segments and Value Proposition
3. Work through each building block systematically
4. Iterate and refine based on market feedback

## Common Pitfalls
- Focusing too much on the product, not enough on customer needs
- Ignoring competitive alternatives
- Underestimating the cost of customer acquisition
- Not validating assumptions with real customers`,
        tags: 'business model, strategy, framework, canvas, SME',
        author: 'BCGSP Strategy Team',
        readTime: 12,
        published: true,
      },
      {
        title: 'Porter\'s Five Forces: Analyzing Industry Competition',
        category: 'framework',
        content: `# Porter's Five Forces Analysis

## Overview
Porter's Five Forces is a framework for analyzing competition of a business. It draws from industrial organization economics to derive five forces that determine the competitive intensity and attractiveness of a market.

## The Five Forces

### 1. Threat of New Entrants
- Economies of scale
- Brand loyalty
- Capital requirements
- Access to distribution
- Government policies

### 2. Bargaining Power of Suppliers
- Number of suppliers
- Uniqueness of input
- Switching costs
- Threat of forward integration

### 3. Bargaining Power of Buyers
- Number of buyers
- Switching costs
- Price sensitivity
- Threat of backward integration

### 4. Threat of Substitutes
- Availability of substitutes
- Price-performance tradeoff
- Switching costs

### 5. Competitive Rivalry
- Number of competitors
- Industry growth rate
- Fixed costs
- Exit barriers

## Application for SMEs
- Use to assess market attractiveness before entry
- Identify which forces are most critical for your business
- Develop strategies to position against strong forces
- Regularly reassess as market conditions change`,
        tags: 'competition, market analysis, strategy, Porter',
        author: 'BCGSP Strategy Team',
        readTime: 10,
        published: true,
      },
      {
        title: 'How TechStartup Grew 300% Using Data-Driven Strategy',
        category: 'case_study',
        content: `# Case Study: TechStartup's 300% Growth Journey

## Background
TechStartup, a B2B SaaS company in the analytics space, was struggling with growth stagnation. After completing a comprehensive diagnostic assessment, they identified critical gaps in their marketing and sales dimensions.

## The Challenge
- Overall diagnostic score: 42/100
- Marketing score: 28/100 (Critical)
- Sales score: 35/100 (Critical)
- Customer score: 48/100 (Weak)

## The Strategy

### Phase 1: Foundation (0-30 days)
- Conducted deep customer research
- Rebuilt ideal customer profiles
- Implemented marketing analytics

### Phase 2: Growth (30-90 days)
- Launched targeted content marketing
- Implemented account-based sales
- Built strategic partnerships

### Phase 3: Scale (90-180 days)
- Scaled successful channels
- Built automated marketing engine
- Expanded sales team strategically

## Results
- 300% revenue growth in 12 months
- Marketing score improved from 28 to 72
- Sales score improved from 35 to 68
- Customer retention increased from 72% to 91%

## Key Lessons
1. Data-driven decisions outperform intuition
2. Focus on one weak dimension at a time
3. Customer feedback is the most valuable data
4. Invest in systems before scaling`,
        tags: 'case study, growth, SaaS, data-driven, marketing',
        author: 'BCGSP Research Team',
        readTime: 8,
        published: true,
      },
      {
        title: 'Financial Health Checklist for SMEs',
        category: 'guide',
        content: `# Financial Health Checklist for SMEs

## Monthly Checks
- [ ] Cash flow statement reviewed
- [ ] Revenue vs. budget comparison
- [ ] Accounts receivable aging reviewed
- [ ] Accounts payable schedule confirmed
- [ ] Burn rate calculated and tracked

## Quarterly Reviews
- [ ] P&L statement analyzed
- [ ] Balance sheet reviewed
- [ ] Unit economics (CAC, LTV, payback period)
- [ ] Revenue concentration analysis
- [ ] Working capital optimization

## Annual Assessments
- [ ] Financial audit completed
- [ ] Tax strategy optimized
- [ ] Capital structure reviewed
- [ ] Insurance coverage assessed
- [ ] Investment readiness evaluation

## Key Financial Ratios to Track

### Liquidity
- Current Ratio: Current Assets / Current Liabilities (Target: >1.5)
- Quick Ratio: (Cash + Receivables) / Current Liabilities (Target: >1.0)

### Profitability
- Gross Margin: (Revenue - COGS) / Revenue (Target: >60% for SaaS)
- Net Margin: Net Income / Revenue (Target: >15%)

### Efficiency
- CAC Payback: CAC / (Monthly Revenue per Customer × Gross Margin)
- LTV:CAC Ratio: Customer LTV / CAC (Target: >3:1)

## Warning Signs
- Declining gross margins
- Increasing accounts receivable days
- Negative operating cash flow
- High customer concentration
- Rapidly increasing burn rate`,
        tags: 'finance, checklist, metrics, health, SME',
        author: 'BCGSP Finance Team',
        readTime: 15,
        published: true,
      },
      {
        title: 'Growth Strategy Playbook: From Product-Market Fit to Scale',
        category: 'playbook',
        content: `# Growth Strategy Playbook

## Stage 1: Find Product-Market Fit
- Talk to 100+ potential customers
- Measure Sean Ellis test (>40% "very disappointed")
- Iterate rapidly based on feedback
- Focus on one customer segment

## Stage 2: Build Growth Engine
- Identify your primary growth channel
- Optimize conversion funnel step by step
- Implement measurement infrastructure
- Test secondary growth channels

## Stage 3: Scale What Works
- Increase investment in top-performing channels
- Build growth team with specialized roles
- Implement growth experiments framework
- Develop viral and referral mechanics

## Stage 4: Optimize and Diversify
- Reduce dependency on single channels
- Optimize unit economics at scale
- Explore new market segments
- Build brand as growth driver

## Growth Metrics Framework

### Acquisition
- Traffic, signups, activation rate
- Channel-specific conversion rates
- Cost per acquisition by channel

### Activation
- Time to value
- Onboarding completion rate
- Feature adoption rates

### Retention
- Cohort retention curves
- Churn rate (logo and revenue)
- Net revenue retention

### Revenue
- ARPU/ARPA
- Expansion revenue
- LTV by segment

### Referral
- Net Promoter Score
- Referral rate
- Viral coefficient`,
        tags: 'growth, playbook, strategy, scale, product-market fit',
        author: 'BCGSP Growth Team',
        readTime: 20,
        published: true,
      },
      {
        title: 'Investment Readiness: Preparing Your SME for External Funding',
        category: 'guide',
        content: `# Investment Readiness Guide

## What Investors Look For

### 1. Strong Team (30% weight)
- Complementary skill sets
- Track record of execution
- Clear roles and responsibilities
- Advisor network

### 2. Market Opportunity (25% weight)
- Large addressable market (TAM/SAM/SOM)
- Clear market timing
- Defensible market position
- Growth trajectory

### 3. Financial Health (25% weight)
- Clean financial statements
- Strong unit economics
- Predictable revenue model
- Capital efficiency

### 4. Growth Potential (20% weight)
- Scalable business model
- Clear growth levers
- Product-market fit evidence
- Expansion opportunities

## Preparation Checklist

### Documents to Prepare
- [ ] Pitch deck (10-15 slides)
- [ ] Financial model (3-5 year projections)
- [ ] Cap table
- [ ] Data room with legal documents
- [ ] Customer case studies
- [ ] Competitive analysis

### Metrics to Know Cold
- Monthly/annual revenue and growth rate
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- LTV:CAC ratio
- Payback period
- Churn rate
- Burn rate and runway
- Gross margin

### Common Red Flags
- Unclear business model
- High customer concentration
- Founder disputes
- Inconsistent financial data
- No clear use of funds
- Unrealistic valuations
- Lack of market validation`,
        tags: 'investment, funding, readiness, investor, preparation',
        author: 'BCGSP Investment Team',
        readTime: 18,
        published: true,
      },
    ];

    for (const article of knowledgeArticles) {
      await db.knowledgeArticle.create({ data: article });
    }
    console.log(`✅ Created ${knowledgeArticles.length} knowledge articles`);

    // 7. Create industry benchmarks
    console.log('Creating industry benchmarks...');
    const industries = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'];
    const metrics = [
      'businessModel', 'market', 'product', 'customers', 'marketing',
      'sales', 'operations', 'financial', 'team', 'growth',
      'overallScore', 'riskScore', 'growthPotential', 'investmentReady',
    ];

    const benchmarkValues: Record<string, Record<string, { value: number; industryAvg: number; topPerformer: number }>> = {
      Technology: {
        businessModel: { value: 62, industryAvg: 58, topPerformer: 85 },
        market: { value: 55, industryAvg: 52, topPerformer: 82 },
        product: { value: 58, industryAvg: 55, topPerformer: 88 },
        customers: { value: 50, industryAvg: 48, topPerformer: 80 },
        marketing: { value: 48, industryAvg: 45, topPerformer: 78 },
        sales: { value: 52, industryAvg: 50, topPerformer: 82 },
        operations: { value: 60, industryAvg: 56, topPerformer: 85 },
        financial: { value: 45, industryAvg: 42, topPerformer: 80 },
        team: { value: 65, industryAvg: 60, topPerformer: 88 },
        growth: { value: 50, industryAvg: 48, topPerformer: 85 },
        overallScore: { value: 54.5, industryAvg: 51.4, topPerformer: 83.3 },
        riskScore: { value: 48, industryAvg: 52, topPerformer: 25 },
        growthPotential: { value: 52, industryAvg: 50, topPerformer: 82 },
        investmentReady: { value: 48, industryAvg: 45, topPerformer: 80 },
      },
      Healthcare: {
        businessModel: { value: 55, industryAvg: 52, topPerformer: 78 },
        market: { value: 60, industryAvg: 58, topPerformer: 82 },
        product: { value: 62, industryAvg: 60, topPerformer: 85 },
        customers: { value: 58, industryAvg: 55, topPerformer: 80 },
        marketing: { value: 40, industryAvg: 38, topPerformer: 70 },
        sales: { value: 45, industryAvg: 42, topPerformer: 75 },
        operations: { value: 65, industryAvg: 62, topPerformer: 88 },
        financial: { value: 55, industryAvg: 52, topPerformer: 82 },
        team: { value: 60, industryAvg: 58, topPerformer: 85 },
        growth: { value: 42, industryAvg: 40, topPerformer: 72 },
        overallScore: { value: 54.2, industryAvg: 51.7, topPerformer: 79.7 },
        riskScore: { value: 42, industryAvg: 45, topPerformer: 22 },
        growthPotential: { value: 48, industryAvg: 46, topPerformer: 76 },
        investmentReady: { value: 50, industryAvg: 48, topPerformer: 78 },
      },
      Finance: {
        businessModel: { value: 58, industryAvg: 55, topPerformer: 82 },
        market: { value: 52, industryAvg: 50, topPerformer: 80 },
        product: { value: 55, industryAvg: 52, topPerformer: 78 },
        customers: { value: 52, industryAvg: 50, topPerformer: 78 },
        marketing: { value: 42, industryAvg: 40, topPerformer: 72 },
        sales: { value: 48, industryAvg: 45, topPerformer: 78 },
        operations: { value: 68, industryAvg: 65, topPerformer: 90 },
        financial: { value: 62, industryAvg: 60, topPerformer: 88 },
        team: { value: 58, industryAvg: 55, topPerformer: 82 },
        growth: { value: 40, industryAvg: 38, topPerformer: 70 },
        overallScore: { value: 53.5, industryAvg: 51.0, topPerformer: 79.8 },
        riskScore: { value: 45, industryAvg: 48, topPerformer: 20 },
        growthPotential: { value: 46, industryAvg: 44, topPerformer: 74 },
        investmentReady: { value: 52, industryAvg: 50, topPerformer: 80 },
      },
      Retail: {
        businessModel: { value: 50, industryAvg: 48, topPerformer: 75 },
        market: { value: 55, industryAvg: 52, topPerformer: 80 },
        product: { value: 52, industryAvg: 50, topPerformer: 78 },
        customers: { value: 55, industryAvg: 52, topPerformer: 82 },
        marketing: { value: 55, industryAvg: 52, topPerformer: 80 },
        sales: { value: 58, industryAvg: 55, topPerformer: 82 },
        operations: { value: 60, industryAvg: 58, topPerformer: 85 },
        financial: { value: 48, industryAvg: 45, topPerformer: 78 },
        team: { value: 50, industryAvg: 48, topPerformer: 75 },
        growth: { value: 45, industryAvg: 42, topPerformer: 72 },
        overallScore: { value: 52.8, industryAvg: 50.2, topPerformer: 78.7 },
        riskScore: { value: 50, industryAvg: 52, topPerformer: 28 },
        growthPotential: { value: 50, industryAvg: 48, topPerformer: 76 },
        investmentReady: { value: 46, industryAvg: 44, topPerformer: 75 },
      },
      Manufacturing: {
        businessModel: { value: 48, industryAvg: 45, topPerformer: 72 },
        market: { value: 50, industryAvg: 48, topPerformer: 75 },
        product: { value: 58, industryAvg: 55, topPerformer: 82 },
        customers: { value: 48, industryAvg: 45, topPerformer: 72 },
        marketing: { value: 38, industryAvg: 35, topPerformer: 68 },
        sales: { value: 45, industryAvg: 42, topPerformer: 72 },
        operations: { value: 65, industryAvg: 62, topPerformer: 88 },
        financial: { value: 52, industryAvg: 50, topPerformer: 80 },
        team: { value: 55, industryAvg: 52, topPerformer: 78 },
        growth: { value: 38, industryAvg: 35, topPerformer: 68 },
        overallScore: { value: 49.7, industryAvg: 46.9, topPerformer: 75.5 },
        riskScore: { value: 52, industryAvg: 55, topPerformer: 30 },
        growthPotential: { value: 42, industryAvg: 40, topPerformer: 70 },
        investmentReady: { value: 44, industryAvg: 42, topPerformer: 72 },
      },
    };

    const benchmarkData = [];
    for (const industry of industries) {
      const industryMetrics = benchmarkValues[industry];
      for (const metric of metrics) {
        const values = industryMetrics[metric];
        benchmarkData.push({
          companyId: company.id,
          industry,
          metric,
          value: values.value,
          industryAvg: values.industryAvg,
          topPerformer: values.topPerformer,
          year: 2024,
        });
      }
    }

    await db.benchmark.createMany({ data: benchmarkData });
    console.log(`✅ Created ${benchmarkData.length} benchmark entries`);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`  - Admin user: admin@bcgsp.com / admin123`);
    console.log(`  - Sample SME user: sme@example.com / sme123`);
    console.log(`  - Sample company: ${company.name}`);
    console.log(`  - Sample diagnostic with ${answersData.length} answers`);
    console.log(`  - ${knowledgeArticles.length} knowledge articles`);
    console.log(`  - ${benchmarkData.length} benchmark entries`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
}

// Run seed if called directly
seed()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });

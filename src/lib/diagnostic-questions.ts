export interface DiagnosticQuestion {
  id: string;
  dimension: string;
  dimensionKey: string;
  dimensionIndex: number;
  question: string;
  order: number;
}

export interface DiagnosticDimension {
  key: string;
  name: string;
  weight: number;
  color: string;
  questions: DiagnosticQuestion[];
}

export const DIMENSIONS: DiagnosticDimension[] = [
  {
    key: 'business_model',
    name: 'مدل کسب‌وکار',
    weight: 15,
    color: '#059669',
    questions: [
      { id: 'bm1', dimension: 'مدل کسب‌وکار', dimensionKey: 'business_model', dimensionIndex: 0, question: 'مدل درآمدی کسب‌وکار شما چقدر شفاف و مستند است؟', order: 1 },
      { id: 'bm2', dimension: 'مدل کسب‌وکار', dimensionKey: 'business_model', dimensionIndex: 0, question: 'جریان‌های درآمدی شما چقدر متنوع هستند؟ (از یک منبع وابسته نیستید)', order: 2 },
      { id: 'bm3', dimension: 'مدل کسب‌وکار', dimensionKey: 'business_model', dimensionIndex: 0, question: 'مزیت رقابتی هسته‌ای شما چقدر قابل دفاع و پایدار است؟', order: 3 },
      { id: 'bm4', dimension: 'مدل کسب‌وکار', dimensionKey: 'business_model', dimensionIndex: 0, question: 'ارزش پیشنهادی شما چقدر برای مشتری هدف متمایز و قابل درک است؟', order: 4 },
      { id: 'bm5', dimension: 'مدل کسب‌وکار', dimensionKey: 'business_model', dimensionIndex: 0, question: 'مدل قیمت‌گذاری شما چقدر با ارزش ارائه‌شده همخوانی دارد؟', order: 5 },
      { id: 'bm6', dimension: 'مدل کسب‌وکار', dimensionKey: 'business_model', dimensionIndex: 0, question: 'حاشیه سود ناخالص شما در مقایسه با میانگین صنعت چقدر است؟', order: 6 },
      { id: 'bm7', dimension: 'مدل کسب‌وکار', dimensionKey: 'business_model', dimensionIndex: 0, question: 'فرآیند تبدیل مشتری بالقوه به مشتری وفادار چقدر بهینه و مستند است؟', order: 7 },
      { id: 'bm8', dimension: 'مدل کسب‌وکار', dimensionKey: 'business_model', dimensionIndex: 0, question: 'شریک‌های استراتژیک و شبکه تامین شما چقدر قوی و پایدار هستند؟', order: 8 },
      { id: 'bm9', dimension: 'مدل کسب‌وکار', dimensionKey: 'business_model', dimensionIndex: 0, question: 'هزینه جذب مشتری (CAC) نسبت به ارزش طول عمر مشتری (LTV) چقدر مطلوب است؟', order: 9 },
      { id: 'bm10', dimension: 'مدل کسب‌وکار', dimensionKey: 'business_model', dimensionIndex: 0, question: 'مدل کسب‌وکار شما چقدر قابلیت مقیاس‌پذیری دارد؟', order: 10 },
    ],
  },
  {
    key: 'market_customers',
    name: 'بازار و مشتریان',
    weight: 12,
    color: '#0d9488',
    questions: [
      { id: 'mc1', dimension: 'بازار و مشتریان', dimensionKey: 'market_customers', dimensionIndex: 1, question: 'اندازه بازار هدف شما چقدر بزرگ و در حال رشد است؟', order: 1 },
      { id: 'mc2', dimension: 'بازار و مشتریان', dimensionKey: 'market_customers', dimensionIndex: 1, question: 'شناخت شما از نیازها و دردهای واقعی مشتریان چقدر عمیق است؟', order: 2 },
      { id: 'mc3', dimension: 'بازار و مشتریان', dimensionKey: 'market_customers', dimensionIndex: 1, question: 'نرخ حفظ مشتری (Retention Rate) شما چقدر است؟', order: 3 },
      { id: 'mc4', dimension: 'بازار و مشتریان', dimensionKey: 'market_customers', dimensionIndex: 1, question: 'شما چقدر از سهم بازار خود و رقبای اصلی آگاه هستید؟', order: 4 },
      { id: 'mc5', dimension: 'بازار و مشتریان', dimensionKey: 'market_customers', dimensionIndex: 1, question: 'روندهای بازار و تغییرات صنعت چقدر در استراتژی شما لحاظ شده‌اند؟', order: 5 },
      { id: 'mc6', dimension: 'بازار و مشتریان', dimensionKey: 'market_customers', dimensionIndex: 1, question: 'مکانیزم دریافت بازخورد مشتری و تحلیل آن چقدر سیستماتیک است؟', order: 6 },
      { id: 'mc7', dimension: 'بازار و مشتریان', dimensionKey: 'market_customers', dimensionIndex: 1, question: 'نرخ رضایت مشتری (CSAT/NPS) شما چقدر است؟', order: 7 },
      { id: 'mc8', dimension: 'بازار و مشتریان', dimensionKey: 'market_customers', dimensionIndex: 1, question: 'استراتژی ورود به بازارهای جدید یا بخش‌های جدید چقدر مشخص است؟', order: 8 },
      { id: 'mc9', dimension: 'بازار و مشتریان', dimensionKey: 'market_customers', dimensionIndex: 1, question: 'وابستگی شما به یک مشتری یا بخش خاص چقدر خطرناک است؟', order: 9 },
      { id: 'mc10', dimension: 'بازار و مشتریان', dimensionKey: 'market_customers', dimensionIndex: 1, question: 'برند شما چقدر در بازار شناخته‌شده و معتبر است؟', order: 10 },
    ],
  },
  {
    key: 'product_value',
    name: 'محصول / پیشنهاد ارزش',
    weight: 10,
    color: '#0891b2',
    questions: [
      { id: 'pv1', dimension: 'محصول / پیشنهاد ارزش', dimensionKey: 'product_value', dimensionIndex: 2, question: 'محصول/خدمت شما چقدر مشکلی واقعی و مهم را حل می‌کند؟', order: 1 },
      { id: 'pv2', dimension: 'محصول / پیشنهاد ارزش', dimensionKey: 'product_value', dimensionIndex: 2, question: 'تنوع و کیفیت محصول/خدمت شما چقدر رضایت‌بخش است؟', order: 2 },
      { id: 'pv3', dimension: 'محصول / پیشنهاد ارزش', dimensionKey: 'product_value', dimensionIndex: 2, question: 'فرآیند توسعه محصول جدید چقدر ساختاریافته و منظم است؟', order: 3 },
      { id: 'pv4', dimension: 'محصول / پیشنهاد ارزش', dimensionKey: 'product_value', dimensionIndex: 2, question: 'نرخ بازگشت محصول یا شکایت مشتری چقدر است؟', order: 4 },
      { id: 'pv5', dimension: 'محصول / پیشنهاد ارزش', dimensionKey: 'product_value', dimensionIndex: 2, question: 'محصول شما چقدر از نظر فناوری به‌روز و پیشرفته است؟', order: 5 },
      { id: 'pv6', dimension: 'محصول / پیشنهاد ارزش', dimensionKey: 'product_value', dimensionIndex: 2, question: 'زمان عرضه محصول به بازار (Time to Market) چقدر رقابتی است؟', order: 6 },
      { id: 'pv7', dimension: 'محصول / پیشنهاد ارزش', dimensionKey: 'product_value', dimensionIndex: 2, question: 'محصول/خدمت شما چقدر قابلیت شخصی‌سازی برای مشتریان دارد؟', order: 7 },
      { id: 'pv8', dimension: 'محصول / پیشنهاد ارزش', dimensionKey: 'product_value', dimensionIndex: 2, question: 'فرآیند تضمین کیفیت محصول چقدر مستند و قابل اتکا است؟', order: 8 },
      { id: 'pv9', dimension: 'محصول / پیشنهاد ارزش', dimensionKey: 'product_value', dimensionIndex: 2, question: 'محصول شما چقدر قابلیت ایجاد اثر شبکه‌ای یا پلتفرمی دارد؟', order: 9 },
      { id: 'pv10', dimension: 'محصول / پیشنهاد ارزش', dimensionKey: 'product_value', dimensionIndex: 2, question: 'چقدر محصول شما از کپی‌شدن توسط رقبا در امان است؟', order: 10 },
    ],
  },
  {
    key: 'customer_segmentation',
    name: 'مشتریان و بخش‌بندی',
    weight: 10,
    color: '#7c3aed',
    questions: [
      { id: 'cs1', dimension: 'مشتریان و بخش‌بندی', dimensionKey: 'customer_segmentation', dimensionIndex: 3, question: 'بخش‌بندی مشتریان شما چقدر دقیق و مبتنی بر داده است؟', order: 1 },
      { id: 'cs2', dimension: 'مشتریان و بخش‌بندی', dimensionKey: 'customer_segmentation', dimensionIndex: 3, question: 'شناخت شما از پرسونای مشتریان چقدر عمیق و ملموس است؟', order: 2 },
      { id: 'cs3', dimension: 'مشتریان و بخش‌بندی', dimensionKey: 'customer_segmentation', dimensionIndex: 3, question: 'استراتژی هدف‌گذاری مشتریان چقدر متمرکز و مؤثر است؟', order: 3 },
      { id: 'cs4', dimension: 'مشتریان و بخش‌بندی', dimensionKey: 'customer_segmentation', dimensionIndex: 3, question: 'داده‌های مشتری شما چقدر جامع و به‌روز هستند؟', order: 4 },
      { id: 'cs5', dimension: 'مشتریان و بخش‌بندی', dimensionKey: 'customer_segmentation', dimensionIndex: 3, question: 'نرخ تبدیل مشتری بالقوه به مشتری واقعی چقدر است؟', order: 5 },
      { id: 'cs6', dimension: 'مشتریان و بخش‌بندی', dimensionKey: 'customer_segmentation', dimensionIndex: 3, question: 'استراتژی وفادارسازی مشتریان چقدر برنامه‌ریزی‌شده است؟', order: 6 },
      { id: 'cs7', dimension: 'مشتریان و بخش‌بندی', dimensionKey: 'customer_segmentation', dimensionIndex: 3, question: 'ارزش طول عمر مشتری (LTV) برای هر بخش چقدر محاسبه‌شده است؟', order: 7 },
      { id: 'cs8', dimension: 'مشتریان و بخش‌بندی', dimensionKey: 'customer_segmentation', dimensionIndex: 3, question: 'کانال‌های ارتباطی با هر بخش مشتریان چقدر مناسب و فعال هستند؟', order: 8 },
      { id: 'cs9', dimension: 'مشتریان و بخش‌بندی', dimensionKey: 'customer_segmentation', dimensionIndex: 3, question: 'چقدر مشتریان فعلی شما به معرفی مشتریان جدید کمک می‌کنند؟', order: 9 },
      { id: 'cs10', dimension: 'مشتریان و بخش‌بندی', dimensionKey: 'customer_segmentation', dimensionIndex: 3, question: 'توزیع درآمد بین بخش‌های مختلف مشتریان چقدر متعادل است؟', order: 10 },
    ],
  },
  {
    key: 'marketing',
    name: 'بازاریابی',
    weight: 8,
    color: '#db2777',
    questions: [
      { id: 'mk1', dimension: 'بازاریابی', dimensionKey: 'marketing', dimensionIndex: 4, question: 'استراتژی بازاریابی شما چقدر مستند و هدفمند است؟', order: 1 },
      { id: 'mk2', dimension: 'بازاریابی', dimensionKey: 'marketing', dimensionIndex: 4, question: 'بودجه بازاریابی شما چقدر اصولی تخصیص داده شده است؟', order: 2 },
      { id: 'mk3', dimension: 'بازاریابی', dimensionKey: 'marketing', dimensionIndex: 4, question: 'بازگشت سرمایه بازاریابی (ROMI) چقدر اندازه‌گیری و بهینه می‌شود؟', order: 3 },
      { id: 'mk4', dimension: 'بازاریابی', dimensionKey: 'marketing', dimensionIndex: 4, question: 'حضور شما در کانال‌های دیجیتال بازاریابی چقدر مؤثر است؟', order: 4 },
      { id: 'mk5', dimension: 'بازاریابی', dimensionKey: 'marketing', dimensionIndex: 4, question: 'تولید محتوا و بازاریابی محتوایی شما چقدر مستمر و باکیفیت است؟', order: 5 },
      { id: 'mk6', dimension: 'بازاریابی', dimensionKey: 'marketing', dimensionIndex: 4, question: 'شناخت برند شما در بازار هدف چقدر بالاست؟', order: 6 },
      { id: 'mk7', dimension: 'بازاریابی', dimensionKey: 'marketing', dimensionIndex: 4, question: 'استراتژی بازاریابی دهان‌به‌دهان (Word of Mouth) چقدر فعال است؟', order: 7 },
      { id: 'mk8', dimension: 'بازاریابی', dimensionKey: 'marketing', dimensionIndex: 4, question: 'کمپین‌های تبلیغاتی شما چقدر هدفمند و قابل اندازه‌گیری هستند؟', order: 8 },
      { id: 'mk9', dimension: 'بازاریابی', dimensionKey: 'marketing', dimensionIndex: 4, question: 'از ابزارهای تحلیل بازاریابی و اتوماسیون چقدر استفاده می‌کنید؟', order: 9 },
      { id: 'mk10', dimension: 'بازاریابی', dimensionKey: 'marketing', dimensionIndex: 4, question: 'پیام و هویت بصری برند شما چقدر یکپارچه و متمایز است؟', order: 10 },
    ],
  },
  {
    key: 'sales',
    name: 'فروش',
    weight: 8,
    color: '#ea580c',
    questions: [
      { id: 'sl1', dimension: 'فروش', dimensionKey: 'sales', dimensionIndex: 5, question: 'فرآیند فروش شما چقدر ساختاریافته و مستند است؟', order: 1 },
      { id: 'sl2', dimension: 'فروش', dimensionKey: 'sales', dimensionIndex: 5, question: 'عملکرد تیم فروش نسبت به اهداف تعیین‌شده چقدر است؟', order: 2 },
      { id: 'sl3', dimension: 'فروش', dimensionKey: 'sales', dimensionIndex: 5, question: 'چرخه فروش (Sales Cycle) شما چقدر کوتاه و بهینه است؟', order: 3 },
      { id: 'sl4', dimension: 'فروش', dimensionKey: 'sales', dimensionIndex: 5, question: 'نرخ تبدیل لید به مشتری چقدر است؟', order: 4 },
      { id: 'sl5', dimension: 'فروش', dimensionKey: 'sales', dimensionIndex: 5, question: 'سیستم مدیریت ارتباط با مشتری (CRM) چقدر مؤثر پیاده‌سازی شده است؟', order: 5 },
      { id: 'sl6', dimension: 'فروش', dimensionKey: 'sales', dimensionIndex: 5, question: 'استراتژی فروش متقاطع (Cross-sell) و فروش افزایشی (Upsell) چقدر فعال است؟', order: 6 },
      { id: 'sl7', dimension: 'فروش', dimensionKey: 'sales', dimensionIndex: 5, question: 'تیم فروش شما چقدر آموزش‌دیده و ماهر است؟', order: 7 },
      { id: 'sl8', dimension: 'فروش', dimensionKey: 'sales', dimensionIndex: 5, question: 'پیش‌بینی فروش شما چقدر دقیق و قابل اتکا است؟', order: 8 },
      { id: 'sl9', dimension: 'فروش', dimensionKey: 'sales', dimensionIndex: 5, question: 'کانال‌های فروش شما چقدر متنوع و مؤثر هستند؟', order: 9 },
      { id: 'sl10', dimension: 'فروش', dimensionKey: 'sales', dimensionIndex: 5, question: 'فرآیند مذاکره و بستن قرارداد چقدر استاندارد و بهینه است؟', order: 10 },
    ],
  },
  {
    key: 'operations',
    name: 'عملیات',
    weight: 10,
    color: '#ca8a04',
    questions: [
      { id: 'op1', dimension: 'عملیات', dimensionKey: 'operations', dimensionIndex: 6, question: 'فرآیندهای عملیاتی کلیدی شما چقدر مستند و استاندارد شده‌اند؟', order: 1 },
      { id: 'op2', dimension: 'عملیات', dimensionKey: 'operations', dimensionIndex: 6, question: 'کارایی عملیاتی و بهره‌وری منابع چقدر مطلوب است؟', order: 2 },
      { id: 'op3', dimension: 'عملیات', dimensionKey: 'operations', dimensionIndex: 6, question: 'سیستم مدیریت زنجیره تامین چقدر قوی و پایدار است؟', order: 3 },
      { id: 'op4', dimension: 'عملیات', dimensionKey: 'operations', dimensionIndex: 6, question: 'زیرساخت فناوری اطلاعات چقدر مناسب و به‌روز است؟', order: 4 },
      { id: 'op5', dimension: 'عملیات', dimensionKey: 'operations', dimensionIndex: 6, question: 'مدیریت کیفیت و کنترل کیفیت چقدر سیستماتیک است؟', order: 5 },
      { id: 'op6', dimension: 'عملیات', dimensionKey: 'operations', dimensionIndex: 6, question: 'ظرفیت تولید/خدمت‌رسانی شما چقدر با تقاضا همخوانی دارد؟', order: 6 },
      { id: 'op7', dimension: 'عملیات', dimensionKey: 'operations', dimensionIndex: 6, question: 'مدیریت ریسک عملیاتی و طرح تداوم کسب‌وکار چقدر توسعه یافته است؟', order: 7 },
      { id: 'op8', dimension: 'عملیات', dimensionKey: 'operations', dimensionIndex: 6, question: 'از سیستم‌های اتوماسیون و دیجیتالی‌سازی چقدر استفاده می‌کنید؟', order: 8 },
      { id: 'op9', dimension: 'عملیات', dimensionKey: 'operations', dimensionIndex: 6, question: 'اندازه‌گیری و بهبود مستعمل شاخص‌های عملیاتی چقدر انجام می‌شود؟', order: 9 },
      { id: 'op10', dimension: 'عملیات', dimensionKey: 'operations', dimensionIndex: 6, question: 'انعطاف‌پذیری عملیاتی در برابر تغییرات بازار چقدر بالاست؟', order: 10 },
    ],
  },
  {
    key: 'financial_health',
    name: 'سلامت مالی',
    weight: 15,
    color: '#dc2626',
    questions: [
      { id: 'fh1', dimension: 'سلامت مالی', dimensionKey: 'financial_health', dimensionIndex: 7, question: 'جریان نقدی عملیاتی شما چقدر مثبت و پایدار است؟', order: 1 },
      { id: 'fh2', dimension: 'سلامت مالی', dimensionKey: 'financial_health', dimensionIndex: 7, question: 'سودآوری خالص کسب‌وکار در مقایسه با صنعت چقدر است؟', order: 2 },
      { id: 'fh3', dimension: 'سلامت مالی', dimensionKey: 'financial_health', dimensionIndex: 7, question: 'نسبت بدهی به حقوق صاحبان سهام چقدر مطلوب است؟', order: 3 },
      { id: 'fh4', dimension: 'سلامت مالی', dimensionKey: 'financial_health', dimensionIndex: 7, question: 'ذخایر مالی و صندوق اضطراری چقدر کافی هستند؟', order: 4 },
      { id: 'fh5', dimension: 'سلامت مالی', dimensionKey: 'financial_health', dimensionIndex: 7, question: 'بودجه‌بندی و پیش‌بینی مالی چقدر دقیق و منظم انجام می‌شود؟', order: 5 },
      { id: 'fh6', dimension: 'سلامت مالی', dimensionKey: 'financial_health', dimensionIndex: 7, question: 'رشد درآمد سالانه شما چقدر پایدار و قابل پیش‌بینی است؟', order: 6 },
      { id: 'fh7', dimension: 'سلامت مالی', dimensionKey: 'financial_health', dimensionIndex: 7, question: 'سیستم حسابداری و گزارشگری مالی چقدر شفاف و استاندارد است؟', order: 7 },
      { id: 'fh8', dimension: 'سلامت مالی', dimensionKey: 'financial_health', dimensionIndex: 7, question: 'دسترسی به منابع مالی و اعتبارات چقدر آسان است؟', order: 8 },
      { id: 'fh9', dimension: 'سلامت مالی', dimensionKey: 'financial_health', dimensionIndex: 7, question: 'مدیریت هزینه‌ها و بهینه‌سازی مصارف چقدر سیستماتیک است؟', order: 9 },
      { id: 'fh10', dimension: 'سلامت مالی', dimensionKey: 'financial_health', dimensionIndex: 7, question: 'شاخص‌های کلیدی مالی (KPI) چقدر منظم پایش و تحلیل می‌شوند؟', order: 10 },
    ],
  },
  {
    key: 'team_leadership',
    name: 'تیم و رهبری',
    weight: 7,
    color: '#2563eb',
    questions: [
      { id: 'tl1', dimension: 'تیم و رهبری', dimensionKey: 'team_leadership', dimensionIndex: 8, question: 'تیم مدیریت ارشد چقدر تجربه و شایستگی لازم را دارد؟', order: 1 },
      { id: 'tl2', dimension: 'تیم و رهبری', dimensionKey: 'team_leadership', dimensionIndex: 8, question: 'فرهنگ سازمانی چقدر نوآورانه و حمایتگر است؟', order: 2 },
      { id: 'tl3', dimension: 'تیم و رهبری', dimensionKey: 'team_leadership', dimensionIndex: 8, question: 'نرخ خروج کارکنان کلیدی چقدر است و چقدر نگران‌کننده است؟', order: 3 },
      { id: 'tl4', dimension: 'تیم و رهبری', dimensionKey: 'team_leadership', dimensionIndex: 8, question: 'برنامه‌های آموزش و توسعه مهارت‌های کارکنان چقدر ساختاریافته هستند؟', order: 4 },
      { id: 'tl5', dimension: 'تیم و رهبری', dimensionKey: 'team_leadership', dimensionIndex: 8, question: 'سیستم ارزیابی عملکرد و پاداش چقدر عادلانه و انگیزشی است؟', order: 5 },
      { id: 'tl6', dimension: 'تیم و رهبری', dimensionKey: 'team_leadership', dimensionIndex: 8, question: 'ارتباطات داخلی و شفافیت سازمانی چقدر مؤثر است؟', order: 6 },
      { id: 'tl7', dimension: 'تیم و رهبری', dimensionKey: 'team_leadership', dimensionIndex: 8, question: 'فرآیند استخدام و جذب استعدادها چقدر حرفه‌ای و سریع است؟', order: 7 },
      { id: 'tl8', dimension: 'تیم و رهبری', dimensionKey: 'team_leadership', dimensionIndex: 8, question: 'رهبری سازمان چقدر چشم‌انداز روشن و الهام‌بخش دارد؟', order: 8 },
      { id: 'tl9', dimension: 'تیم و رهبری', dimensionKey: 'team_leadership', dimensionIndex: 8, question: 'تفویض اختیار و تصمیم‌گیری غیرمتمرکز چقدر در سازمان رایج است؟', order: 9 },
      { id: 'tl10', dimension: 'تیم و رهبری', dimensionKey: 'team_leadership', dimensionIndex: 8, question: 'تنوع مهارتی تیم مدیریت چقدر کافی و متوازن است؟', order: 10 },
    ],
  },
  {
    key: 'growth_strategy',
    name: 'رشد و استراتژی',
    weight: 5,
    color: '#9333ea',
    questions: [
      { id: 'gs1', dimension: 'رشد و استراتژی', dimensionKey: 'growth_strategy', dimensionIndex: 9, question: 'استراتژی رشد بلندمدت کسب‌وکار چقدر شفاف و مستند است؟', order: 1 },
      { id: 'gs2', dimension: 'رشد و استراتژی', dimensionKey: 'growth_strategy', dimensionIndex: 9, question: 'نرخ رشد سالانه شما در مقایسه با میانگین صنعت چقدر است؟', order: 2 },
      { id: 'gs3', dimension: 'رشد و استراتژی', dimensionKey: 'growth_strategy', dimensionIndex: 9, question: 'فرصت‌های رشد جدید چقدر شناسایی و ارزیابی شده‌اند؟', order: 3 },
      { id: 'gs4', dimension: 'رشد و استراتژی', dimensionKey: 'growth_strategy', dimensionIndex: 9, question: 'آمادگی برای تغییرات استراتژیک و پیوت چقدر بالاست؟', order: 4 },
      { id: 'gs5', dimension: 'رشد و استراتژی', dimensionKey: 'growth_strategy', dimensionIndex: 9, question: 'همکاری‌های استراتژیک و اتحادها چقدر در برنامه رشد لحاظ شده‌اند؟', order: 5 },
      { id: 'gs6', dimension: 'رشد و استراتژی', dimensionKey: 'growth_strategy', dimensionIndex: 9, question: 'استراتژی بین‌المللی‌شدن (در صورت وجود) چقدر عملیاتی است؟', order: 6 },
      { id: 'gs7', dimension: 'رشد و استراتژی', dimensionKey: 'growth_strategy', dimensionIndex: 9, question: 'نوآوری و توسعه محصول/خدمت جدید چقدر در فرهنگ سازمان جا افتاده است؟', order: 7 },
      { id: 'gs8', dimension: 'رشد و استراتژی', dimensionKey: 'growth_strategy', dimensionIndex: 9, question: 'مانیتورینگ رقبا و تحلیل رقابتی چقدر مستمر و عمیق است؟', order: 8 },
      { id: 'gs9', dimension: 'رشد و استراتژی', dimensionKey: 'growth_strategy', dimensionIndex: 9, question: 'شاخص‌های کلیدی رشد (Growth KPIs) چقدر تعریف و ردیابی می‌شوند؟', order: 9 },
      { id: 'gs10', dimension: 'رشد و استراتژی', dimensionKey: 'growth_strategy', dimensionIndex: 9, question: 'آمادگی برای جذب سرمایه و مقیاس‌پذیری چقدر بالاست؟', order: 10 },
    ],
  },
];

export function getAllQuestions(): DiagnosticQuestion[] {
  return DIMENSIONS.flatMap((d) => d.questions);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 65) return 'text-yellow-500';
  if (score >= 50) return 'text-orange-500';
  return 'text-red-500';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (score >= 65) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (score >= 50) return 'bg-orange-100 text-orange-800 border-orange-200';
  return 'bg-red-100 text-red-800 border-red-200';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'عالی';
  if (score >= 65) return 'متوسط';
  if (score >= 50) return 'ضعیف';
  return 'بحرانی';
}

export function getTierLabel(score: number): string {
  if (score >= 90) return 'پیشگام استراتژیک';
  if (score >= 80) return 'رشدگر پایدار';
  if (score >= 65) return 'پتانسیل رشد';
  if (score >= 50) return 'نیازمند بهبود';
  return 'بحرانی';
}

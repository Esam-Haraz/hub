/* ============================================================================
   SERVICES HUB — BILINGUAL DICTIONARY (ENGLISH & ARABIC)
   Author: Esam Haraz
   Path: hub/assets/hub-i18n.js

   ----------------------------------------------------------------------------
   [REVIEW NOTE] TWO ALTERNATIVE HERO HEADLINE SUGGESTIONS:
   Option A (Currently active in HTML & dictionary below):
     EN: "Windows Desktop Tools & Data Analysis"
     AR: "أدوات سطح مكتب لويندوز وتحليل البيانات"

   Option B (Alternative — more action/outcome oriented):
     EN: "Practical Windows Automation & Clear Data Reports"
     AR: "أتمتة عملية لويندوز وتقارير بيانات واضحة"
   ----------------------------------------------------------------------------
   ============================================================================ */

window.PAGE_I18N = {
  en: {
    /* Navigation, Header & Accessibility */
    skipToMain: "Skip to main content",
    brandName: "Esam Haraz",
    navCtaTalk: "Let's talk",
    mobileMenuAria: "Open navigation menu",
    drawerIndexLabel: "Page sections",
    drawerSitesLabel: "Ecosystem sites",

    /* Section Index Labels (01 – 04) */
    indexHeading: "Index",
    idxWork: "Work",
    idxServices: "Services",
    idxAbout: "About",
    idxContact: "Contact",

    /* Hero Section */
    heroTitle: "Windows Desktop Tools & Data Analysis",
    heroLead:
      "I build standalone Windows utilities in Python and PyQt6, and clean, query, and visualize datasets using SQL, Excel, and Power BI.",
    heroCtaPrimary: "Start a project",
    heroCtaSecondary: "See the work ↓",
    heroLocation: "Egypt · EN / AR",
    heroAvailable: "Available for projects",
    heroScroll: "Scroll",

    /* Section 01: Work */
    workTitle: "Selected work",
    workLead:
      "Documented tools and analytical case studies, each accompanied by source files, queries, and reproducible steps.",

    /* Group A: Windows Tools */
    workGroupWinTitle: "Windows tools",
    workGroupWinNote: "Standalone executable utility",
    proj1Tab: "AutoDeploy v1.2.0",
    proj1Cat: "Windows utility · Python · PyQt6",
    proj1Title: "AutoDeploy — Post-Format Windows Setup Automation",
    proj1Desc:
      "Automates post-format Windows setup with silent installations, post-install file/script steps, and a portable self-updating executable.",
    proj1ImgAlt: "AutoDeploy v1.2.0 desktop interface showing silent setup queue and post-install steps",
    proj1Link: "Open project →",

    /* Group B: Data Analysis */
    workGroupDataTitle: "Data analysis",
    workAllDataLink: "All data projects →",

    proj2Tab: "Supply Chain",
    proj2Cat: "Logistics · Kaggle public dataset · Practice project",
    proj2Title: "Supply Chain & Shipment Deliveries Analysis",
    proj2Desc:
      "Evaluates 25,000 shipments; weather is the strongest separator of delays (41.45% in stormy weather vs 16.02% in cold weather).",
    proj2ImgAlt: "Supply Chain Excel dashboard showing delay rates by weather and delivery slicers",

    proj3Tab: "IBM HR Attrition",
    proj3Cat: "Human Resources · Kaggle public dataset · Practice project",
    proj3Title: "IBM HR Analytics: Employee Attrition & Performance",
    proj3Desc:
      "Analyzes 1,470 employee records; employees working overtime show 31% attrition compared to 10% without overtime.",
    proj3ImgAlt: "IBM HR Analytics Power BI dashboard showing retention and attrition metrics",

    proj4Tab: "Pizza Sales 2015",
    proj4Cat: "Retail · Kaggle public dataset · Practice project",
    proj4Title: "Pizza Sales Performance & Operations Analytics (2015)",
    proj4Desc:
      "Covers 21,350 orders and 49,574 pizzas sold across 2015, generating $817.86K in total revenue at a $38.31 average order value.",
    proj4ImgAlt: "Pizza Sales 2015 Power BI dashboard showing revenue, orders, and category breakdowns",

    caseStudyLink: "Case study →",

    /* Section 02: Services ("What I can build for you") */
    servicesTitle: "What I can build for you",
    servicesLead:
      "Focused desktop utilities and structured data workflows built around clear requirements.",

    srv1Title: "Windows tools & automation",
    srv1Desc:
      "Standalone desktop utilities packaged as single-file Windows executables with zero user setup, batch/registry handling, and bilingual interfaces.",
    srv1LinkAria: "Explore AutoDeploy Windows tool",

    srv2Title: "Data analysis & dashboards",
    srv2Desc:
      "Raw CSV cleaning, relational SQL querying, and interactive Excel or Power BI dashboards structured to answer concrete operational questions.",
    srv2LinkAria: "Explore Data Analysis portfolio",

    srv3Title: "Custom tools on request",
    srv3Desc:
      "Tailored Python utilities, file organizers, or reporting scripts built to automate repetitive desktop or spreadsheet tasks.",
    srv3LinkAria: "Request a custom tool in the contact form",

    /* Section 03: About */
    aboutTitle: "About",
    aboutPara1:
      "I am Esam Haraz, based in Egypt. I build Windows desktop tools with Python and PyQt6 packaged as standalone executables, and work on data analysis projects using SQL, Excel, and Power BI.",
    aboutPara2:
      "I am at the beginning of my journey and state that openly—every project I publish is documented from start to finish, including data cleaning notes, queries, and reproducible steps.",

    fact1Val: "1",
    fact1Lbl: "Desktop tool shipped",
    fact2Val: "3",
    fact2Lbl: "Data case studies",
    fact3Val: "EN / AR",
    fact3Lbl: "Bilingual documentation & interfaces",

    visualStageAria: "Diagram connecting Windows utility tracks and data analysis pipelines",
    visualCaptionName: "Esam Haraz",
    visualCaptionLoc: "Egypt",

    /* Section 04: Contact ("Start a project") */
    contactTitle: "Start a project",
    contactLead:
      "Share what you are looking to build or analyze, or reach out directly through any channel below.",
    chEmailLabel: "Email",
    chLinkedin: "LinkedIn",
    chGithub: "GitHub",
    chWhatsapp: "WhatsApp",

    formNameLabel: "Your name",
    formEmailLabel: "Your email",
    formScopeLabel: "What do you need?",
    chipWinTool: "Windows tool",
    chipAutoScript: "Automation script",
    chipDataDash: "Data analysis & dashboard",
    chipOther: "Something else",
    formDescLabel: "Project description",
    formSubmitBtn: "Send message",
    formCopyBtn: "Copy message",

    /* Footer */
    footerTagline: "Services Hub · Windows Desktop Tools & Data Analysis",
    footerCopy: "© 2026 Esam Haraz."
  },

  ar: {
    /* Navigation, Header & Accessibility */
    skipToMain: "تخطي إلى المحتوى الرئيسي",
    brandName: "عصام حراز",
    navCtaTalk: "تواصل معي",
    mobileMenuAria: "فتح قائمة التنقل",
    drawerIndexLabel: "أقسام الصفحة",
    drawerSitesLabel: "مواقع الشبكة",

    /* Section Index Labels (01 – 04) */
    indexHeading: "الفهرس",
    idxWork: "الأعمال",
    idxServices: "الخدمات",
    idxAbout: "عني",
    idxContact: "التواصل",

    /* Hero Section */
    heroTitle: "أدوات سطح مكتب لويندوز وتحليل البيانات",
    heroLead:
      "أبني أدوات مستقلة لنظام ويندوز باستخدام Python و PyQt6، وأقوم بتنظيف البيانات وتحليلها وبناء لوحات المعلومات عبر SQL و Excel و Power BI.",
    heroCtaPrimary: "ابدأ مشروعاً",
    heroCtaSecondary: "استعرض الأعمال ↓",
    heroLocation: "مصر · عربي / EN",
    heroAvailable: "متاح لاستقبال المشاريع",
    heroScroll: "مرر للأسفل",

    /* Section 01: Work */
    workTitle: "أعمال مختارة",
    workLead:
      "أدوات برمجية ودراسات حالة تحليلية موثقة بالكامل من البداية للنهاية مع الملفات المصدرية والاستعلامات وخطوات التشغيل.",

    /* Group A: Windows Tools */
    workGroupWinTitle: "أدوات ويندوز (Windows tools)",
    workGroupWinNote: "أداة تنفيذية مستقلة",
    proj1Tab: "AutoDeploy v1.2.0",
    proj1Cat: "أداة ويندوز · Python · PyQt6",
    proj1Title: "AutoDeploy — أتمتة إعداد الويندوز بعد الفورمات",
    proj1Desc:
      "يؤتمت تثبيت البرامج بعد فورمات الويندوز عبر التثبيت الصامت، وخطوات ما بعد التثبيت، وملف تنفيذي محمول يدعم التحديث الذاتي.",
    proj1ImgAlt: "واجهة برنامج AutoDeploy v1.2.0 تعرض طابور التثبيت الصامت وخطوات ما بعد التثبيت",
    proj1Link: "فتح المشروع ←",

    /* Group B: Data Analysis */
    workGroupDataTitle: "تحليل البيانات (Data analysis)",
    workAllDataLink: "كل مشاريع التحليل ←",

    proj2Tab: "سلاسل الإمداد",
    proj2Cat: "الخدمات اللوجستية · بيانات عامة من Kaggle · مشروع تدريبي",
    proj2Title: "تحليل سلاسل الإمداد وتسليم الشحنات",
    proj2Desc:
      "تحليل 25,000 شحنة؛ حالة الطقس هي العامل الأقوى في تباين التأخير (41.45% في الطقس العاصف مقابل 16.02% في الطقس البارد).",
    proj2ImgAlt: "لوحة معلومات Excel لمشروع سلاسل الإمداد تعرض معدلات التأخير حسب الطقس",

    proj3Tab: "التسرب الوظيفي (HR)",
    proj3Cat: "الموارد البشرية · بيانات عامة من Kaggle · مشروع تدريبي",
    proj3Title: "تحليل بيانات الموارد البشرية: التسرب الوظيفي والأداء",
    proj3Desc:
      "دراسة سجلات 1,470 موظفاً؛ يسجل الموظفون ذوو العمل الإضافي معدل تسرب 31% مقابل 10% بدون عمل إضافي.",
    proj3ImgAlt: "لوحة معلومات Power BI لمشروع التسرب الوظيفي تعرض مؤشرات البقاء والتسرب",

    proj4Tab: "مبيعات البيتزا 2015",
    proj4Cat: "التجزئة · بيانات عامة من Kaggle · مشروع تدريبي",
    proj4Title: "تحليل أداء مبيعات البيتزا والعمليات التشغيلية (2015)",
    proj4Desc:
      "تحليل 21,350 طلباً و49,574 قطعة بيتزا مباعة خلال 2015 بإجمالي إيرادات 817.86 ألف دولار ومتوسط قيمة طلب 38.31 دولار.",
    proj4ImgAlt: "لوحة معلومات Power BI لمشروع مبيعات البيتزا تعرض الإيرادات والطلبات",

    caseStudyLink: "دراسة الحالة ←",

    /* Section 02: Services ("What I can build for you") */
    servicesTitle: "ما يمكنني بناؤه لك",
    servicesLead:
      "أدوات سطح مكتب عملية ومسارات تحليل بيانات واضحة مبنية وفق متطلبات محددة.",

    srv1Title: "أدوات ويندوز والأتمتة",
    srv1Desc:
      "برامج سطح مكتب مستقلة مغلفة في ملف تنفيذي واحد (.exe) يعمل بدون إعداد مسبق، مع إدارة الملفات والريجستري ودعم اللغتين.",
    srv1LinkAria: "استكشاف أداة AutoDeploy لويندوز",

    srv2Title: "تحليل البيانات ولوحات المعلومات",
    srv2Desc:
      "تنظيف ملفات CSV الخام، وكتابة استعلامات SQL علائقية، وبناء لوحات تفاعلية في Excel أو Power BI للإجابة عن أسئلة تشغيلية محددة.",
    srv2LinkAria: "استكشاف معرض تحليل البيانات",

    srv3Title: "أدوات مخصصة حسب الطلب",
    srv3Desc:
      "بناء أدوات Python مخصصة، أو منظمات ملفات، أو سكربتات تقارير لأتمتة المهام المتكررة على سطح المكتب أو الجداول.",
    srv3LinkAria: "طلب أداة مخصصة عبر نموذج التواصل",

    /* Section 03: About */
    aboutTitle: "نبذة عني",
    aboutPara1:
      "أنا عصام حراز، من مصر. أطور أدوات سطح مكتب لنظام ويندوز باستخدام Python و PyQt6 مغلفة كملفات تنفيذية مستقلة، وأعمل على مشاريع تحليل البيانات باستخدام SQL و Excel و Power BI.",
    aboutPara2:
      "أنا في بداية مشواري وأكتب ذلك بصراحة؛ كل مشروع أنشره موثق من الألف للياء، شاملاً خطوات تنظيف البيانات والاستعلامات وطريقة إعادة التشغيل.",

    fact1Val: "1",
    fact1Lbl: "أداة سطح مكتب منشورة",
    fact2Val: "3",
    fact2Lbl: "دراسات حالة في تحليل البيانات",
    fact3Val: "عربي / EN",
    fact3Lbl: "توثيق وواجهات باللغتين",

    visualStageAria: "رسم توضيحي يربط مسار أدوات ويندوز ومسار تحليل البيانات",
    visualCaptionName: "عصام حراز",
    visualCaptionLoc: "مصر",

    /* Section 04: Contact ("Start a project") */
    contactTitle: "ابدأ مشروعاً",
    contactLead:
      "اكتب تفاصيل الأداة أو التحليل الذي تحتاجه، أو تواصل معي مباشرة عبر أي من القنوات التالية.",
    chEmailLabel: "البريد الإلكتروني",
    chLinkedin: "LinkedIn",
    chGithub: "GitHub",
    chWhatsapp: "WhatsApp",

    formNameLabel: "الاسم",
    formEmailLabel: "البريد الإلكتروني",
    formScopeLabel: "ما الذي تحتاجه؟",
    chipWinTool: "أداة ويندوز (Windows tool)",
    chipAutoScript: "سكربت أتمتة (Automation script)",
    chipDataDash: "تحليل بيانات ولوحة معلومات",
    chipOther: "شيء آخر",
    formDescLabel: "وصف المشروع",
    formSubmitBtn: "إرسال الرسالة",
    formCopyBtn: "نسخ الرسالة",

    /* Footer */
    footerTagline: "المركز الرئيسي للخدمات · أدوات ويندوز وتحليل البيانات",
    footerCopy: "© 2026 عصام حراز."
  }
};

export const defaultData = {
  hero: {
    badge: "Made in Vietnam — Trusted Worldwide",
    title: "Precision Fastening Solutions",
    subtitle: "TecoMaco delivers world-class industrial fasteners, automotive fastening solutions, and custom manufacturing — engineered with precision, trusted by global partners.",
    bgImage: "/images/factory/factory-1.jpg",
    image: "/images/factory/factory-3.jpg",
    card1: { icon: "🏭", text: "ISO 9001:2015" },
    card2: { icon: "🌍", text: "Global Export" },
    stats: [
      { number: 30000, suffix: "", label: "m² Factory" },
      { number: 300, suffix: "+", label: "Employees" },
      { number: 20, suffix: "+", label: "Years Exp." },
      { number: 50, suffix: "+", label: "Countries" }
    ]
  },
  about: {
    badge: "🏢 About TecoMaco",
    title: "Building Industrial Excellence",
    subtitle: "From our origins in China to our world-class manufacturing facility in Vietnam, TecoMaco has grown into a trusted global partner for precision fastening solutions.",
    heading: "Two Decades of Manufacturing Mastery",
    paragraphs: [
      "TecoMaco has evolved from a specialized machining workshop into a leading integrated industrial fastener manufacturer serving automotive, construction, and heavy industrial sectors worldwide.",
      "Our 30,000m² Vietnam facility features state-of-the-art cold heading, thread rolling, heat treatment, and surface finishing lines — enabling us to deliver over 500 tons of precision fasteners monthly to partners across 50+ countries."
    ],
    features: [
      { icon: '⚙️', text: 'Precision Engineering' },
      { icon: '🔬', text: 'R&D Innovation' },
      { icon: '✅', text: 'Quality Control' },
      { icon: '🌍', text: 'Global Export' },
      { icon: '🏭', text: '30,000m² Factory' },
      { icon: '📦', text: 'Custom Solutions' }
    ],
    gallery: [
      { src: '/images/factory/factory-2.jpg', alt: 'Factory Overview' },
      { src: '/images/factory/factory-4.jpg', alt: 'Production Line' },
      { src: '/images/factory/factory-5.jpg', alt: 'Manufacturing Equipment' },
      { src: '/images/factory/factory-6.jpg', alt: 'Quality Control' },
      { src: '/images/factory/factory-7.jpg', alt: 'Heat Treatment' },
      { src: '/images/factory/factory-8.jpg', alt: 'Surface Treatment' },
      { src: '/images/factory/factory-9.jpg', alt: 'Packaging Line' },
      { src: '/images/factory/factory-10.jpg', alt: 'Warehouse' },
      { src: '/images/factory/factory-11.jpg', alt: 'CNC Machining' },
      { src: '/images/factory/factory-12.jpg', alt: 'Assembly Area' }
    ]
  },
  timeline: [
    { year: '2005', desc: 'Precision Machining Origins — founded in China with a focus on high-precision custom automotive components.' },
    { year: '2013', desc: 'Tianjin Factory Establishment — expanded production lines to meet growing domestic and international fastener demands.' },
    { year: '2019', desc: 'Vietnam Factory Construction — established our state-of-the-art 30,000m² manufacturing facility in Vietnam.' },
    { year: '2022', desc: 'Global Market Expansion — acquired international quality certifications and scaled exports to 50+ countries.' },
    { year: '2024', desc: 'Phase II Smart Automation — upgraded manufacturing lines with advanced German cold heading and robotic logistics.' }
  ],
  products: [
    {
      id: 1,
      title: 'Staples',
      icon: '📎',
      image: '/images/factory/factory-2.jpg',
      videoUrl: '/videos/production-1.mp4',
      desc: 'Industrial staples for pneumatic fastening tools — precision wire forming for construction and packaging.',
      applications: ['Construction framing', 'Furniture assembly', 'Packaging', 'Insulation fastening'],
      materials: ['Low carbon steel', 'Stainless steel', 'Galvanized wire'],
      surfaces: ['Bright finish', 'Galvanized', 'Electro-zinc plated'],
      standards: ['DIN', 'ASTM', 'BS'],
      detail: 'TecoMaco staples are manufactured using precision wire-forming technology, ensuring consistent crown width, leg length, and point geometry. Suitable for use with all major pneumatic stapling systems.'
    },
    {
      id: 2,
      title: 'Brads',
      icon: '📌',
      image: '/images/factory/factory-4.jpg',
      videoUrl: '/videos/production-2.mp4',
      desc: 'Fine gauge brad nails for finish carpentry, trim work, and delicate woodworking applications.',
      applications: ['Trim & molding', 'Cabinet assembly', 'Finish carpentry', 'Decorative panels'],
      materials: ['Carbon steel', 'Stainless steel 304/316'],
      surfaces: ['Bright finish', 'Galvanized', 'Electro-plated'],
      standards: ['DIN', 'ISO', 'ANSI'],
      detail: 'Our precision brads feature consistent gauge dimensions and optimized point geometry for clean, splitting-free penetration in fine woodworking applications.'
    },
    {
      id: 3,
      title: 'Nails',
      icon: '🔨',
      image: '/images/factory/factory-5.jpg',
      videoUrl: '/videos/production-3.mp4',
      desc: 'Full range of industrial nails — coil nails, framing nails, roofing nails, and specialty fasteners.',
      applications: ['Structural framing', 'Roofing', 'Fencing', 'Pallet manufacturing'],
      materials: ['Carbon steel', 'Stainless steel', 'Hardened steel'],
      surfaces: ['Hot-dip galvanized', 'Electro-galvanized', 'Vinyl coated', 'Bright'],
      standards: ['DIN', 'ISO', 'ASTM', 'ANSI'],
      detail: 'From coil nails to strip nails, our full range covers every construction and industrial fastening need. Heat-treated for optimal hardness and withdrawal resistance.'
    },
    {
      id: 4,
      title: 'Screws',
      icon: '🔩',
      image: '/images/factory/factory-6.jpg',
      videoUrl: '/videos/production-4.mp4',
      desc: 'Self-tapping, drywall, machine, and specialty screws — precision thread rolling for superior holding power.',
      applications: ['Drywall installation', 'Metal framing', 'Machinery assembly', 'Automotive'],
      materials: ['Carbon steel C1022', 'Stainless steel 304/316', 'Alloy steel'],
      surfaces: ['Black phosphate', 'Zinc plated', 'Dacromet', 'Nickel plated'],
      standards: ['DIN', 'ISO', 'ASTM', 'ANSI', 'BS'],
      detail: 'Our screw manufacturing features cold heading, precision thread rolling, heat treatment, and advanced surface coating — delivering consistent torque performance and corrosion resistance.'
    },
    {
      id: 5,
      title: 'Bolts & Nuts',
      icon: '🔧',
      image: '/images/factory/factory-7.jpg',
      videoUrl: '/videos/production-1.mp4',
      desc: 'Hex bolts, carriage bolts, flange bolts with matching nuts — engineered for structural integrity.',
      applications: ['Structural steel', 'Machinery', 'Automotive', 'Infrastructure'],
      materials: ['Grade 4.8/8.8/10.9/12.9', 'Stainless A2/A4', 'Alloy steel'],
      surfaces: ['Hot-dip galvanized', 'Zinc flake', 'Dacromet', 'Black oxide'],
      standards: ['DIN 931/933', 'ISO 4014/4017', 'ASTM A325/A490', 'ANSI'],
      detail: 'Our bolt and nut production features multi-station cold forging, CNC precision machining, controlled heat treatment, and comprehensive dimensional inspection per international standards.'
    },
    {
      id: 6,
      title: 'Thread Rods',
      icon: '📏',
      image: '/images/factory/factory-8.jpg',
      videoUrl: '/videos/production-2.mp4',
      desc: 'Fully threaded rods and studs — continuous thread precision for structural and mechanical applications.',
      applications: ['Concrete anchoring', 'Pipe hanging', 'Structural connections', 'Chemical anchoring'],
      materials: ['Grade 4.8/8.8', 'Stainless steel 304/316', 'B7 alloy steel'],
      surfaces: ['Hot-dip galvanized', 'Zinc plated', 'Plain'],
      standards: ['DIN 975/976', 'ISO', 'ASTM A193'],
      detail: 'Thread rods are manufactured with continuous thread rolling for superior thread form accuracy. Available in lengths up to 3 meters with tight tolerance control.'
    },
    {
      id: 7,
      title: 'Rivets',
      icon: '🔘',
      image: '/images/factory/factory-9.jpg',
      videoUrl: '/videos/production-3.mp4',
      desc: 'Blind rivets, structural rivets, and solid rivets — reliable permanent fastening solutions.',
      applications: ['Sheet metal assembly', 'HVAC ductwork', 'Automotive', 'Aerospace'],
      materials: ['Aluminum 5050', 'Steel/steel', 'Stainless steel', 'Copper'],
      surfaces: ['Anodized', 'Painted', 'Zinc plated', 'Natural'],
      standards: ['DIN 7337', 'ISO 15983/15984', 'IFI'],
      detail: 'Our rivet range includes open-end, closed-end, multi-grip, and structural blind rivets. Manufactured with precise mandrel break-load control for consistent installation.'
    },
    {
      id: 8,
      title: 'Washers',
      icon: '⭕',
      image: '/images/factory/factory-10.jpg',
      videoUrl: '/videos/production-4.mp4',
      desc: 'Flat washers, spring washers, lock washers — essential load distribution and vibration resistance.',
      applications: ['General assembly', 'Structural connections', 'Vibration resistance', 'Sealing'],
      materials: ['Carbon steel', 'Stainless steel 304/316', 'Brass', 'Nylon'],
      surfaces: ['Zinc plated', 'Hot-dip galvanized', 'Black oxide', 'Dacromet'],
      standards: ['DIN 125/127/9021', 'ISO 7089/7090', 'ASTM F436'],
      detail: 'Our washer production features precision stamping and heat treatment, ensuring consistent flatness, hardness, and dimensional accuracy across the full size range.'
    },
    {
      id: 9,
      title: 'Springs',
      icon: '🔄',
      image: '/images/factory/factory-11.jpg',
      videoUrl: '/videos/production-1.mp4',
      desc: 'Compression, tension, and torsion springs — custom engineered for mechanical applications.',
      applications: ['Automotive', 'Industrial machinery', 'Electronics', 'Medical devices'],
      materials: ['Spring steel', 'Stainless steel 302/316', 'Music wire', 'Inconel'],
      surfaces: ['Zinc plated', 'Phosphate', 'Powder coated', 'Passivated'],
      standards: ['DIN 2098', 'ISO', 'ASTM'],
      detail: 'Custom spring manufacturing with CNC coiling, stress relieving, and comprehensive load testing. From micro springs to heavy-duty industrial springs.'
    }
  ],
  certifications: {
    badge: "🏆 Certifications & Achievements",
    title: "Trusted Worldwide",
    subtitle: "Our commitment to quality is backed by internationally recognized certifications and a proven track record of manufacturing excellence.",
    list: [
      {
        id: 1,
        icon: '🏆',
        title: 'ISO 9001:2015',
        pdfUrl: '/certs/ISO 90012015 - DRILLMACO INDUSTRIAL COMPANY LIMITED  (1).pdf',
        shortDesc: 'Quality Management System certificate validating that TecoMaco maintains strict manufacturing standards, quality controls, and customer-focused processes.',
        longDesc: 'The ISO 9001:2015 standard is the international benchmark for Quality Management Systems (QMS). For TecoMaco, this certification guarantees that every manufacturing step — from raw steel procurement to cold forging, thread rolling, heat treatment, and packaging — is governed by strict quality management procedures. This ensures high dimensional accuracy, consistent mechanical performance, and complete traceabilty of our fastener products.'
      },
      {
        id: 2,
        icon: '🌿',
        title: 'ISO 14001:2015',
        pdfUrl: '/certs/ISO 140012015 - DRILLMACO INDUSTRIAL COMPANY LIMITED.pdf',
        shortDesc: 'Environmental Management System certification validating TecoMaco\'s dedication to eco-friendly production, energy efficiency, and waste management.',
        longDesc: 'ISO 14001:2015 specifies the requirements for an environmental management system that an organization can use to enhance its environmental performance. TecoMaco is committed to minimizing the environmental footprint of our fastener manufacturing processes. This includes operating state-of-the-art closed-loop water treatment systems, optimizing energy efficiency in our heat treatment furnaces, and recycling 100% of steel scrap.'
      },
      {
        id: 3,
        icon: '🛡️',
        title: 'API Spec Q1 / Certificate Q1-2527',
        pdfUrl: '/certs/Certificate Q1-2527.pdf',
        shortDesc: 'American Petroleum Institute Specification Q1 certification, establishing our capability for high-strength energy infrastructure components.',
        longDesc: 'The API Spec Q1 certification is a prestigious quality management system standard designed specifically for manufacturing organizations in the petroleum and natural gas industry. This certification highlights TecoMaco\'s engineering capability to manufacture high-strength, high-integrity industrial fasteners capable of enduring extreme pressures, corrosive environments, and structural fatigue in critical energy infrastructure applications.'
      },
      {
        id: 4,
        icon: '📋',
        title: 'ISO standard compliance certificate',
        pdfUrl: '/certs/Certificate ISO-2660 (1).pdf',
        shortDesc: 'Conformity certification verifying structural fastener reliability and mechanical safety tolerances.',
        longDesc: 'This compliance certificate validates that TecoMaco fastener lines conform fully to international ISO mechanical safety and performance standards. It ensures that our tensile strength, yield strength, hardness, and corrosion-resistance specifications meet the safety requirements necessary for high-load industrial, construction, and automotive applications.'
      },
      {
        id: 5,
        icon: '🏢',
        title: 'TecoMaco Business Registration',
        pdfUrl: '/certs/TecoMaco Business Registration Certificate - Latest Version.pdf',
        shortDesc: 'Official business registration and manufacturing license for TecoMaco Vietnam operations.',
        longDesc: 'This document is the official business registration certificate issued by the Department of Planning and Investment of Vietnam. It validates TecoMaco as a legally registered enterprise authorized to conduct high-tech manufacturing, metal machining, chemical surface plating, and global exporting of industrial fasteners from our industrial zone facility.'
      },
      {
        id: 6,
        icon: '⚙️',
        title: 'TecoMaco PT Registration',
        pdfUrl: '/certs/TecoMaco PT Business Registration Certificate - Latest Version.pdf',
        shortDesc: 'Official business license for our specialized heat treatment and plating processing branch.',
        longDesc: 'This registration license authorizes operations for our specialized manufacturing branch. It covers advanced metal processing, including automated heat treatment furnaces, zinc plating lines, hot-dip galvanizing, and logistics management — ensuring our in-house capability covers the entire production lifecycle.'
      }
    ],
    stats: [
      { number: 50, suffix: '+', label: 'Export Countries' },
      { number: 500, suffix: 'T', label: 'Monthly Output' },
      { number: 10000, suffix: '+', label: 'Product SKUs' },
      { number: 99, suffix: '.5%', label: 'Quality Rate' }
    ]
  },
  contact: {
    badge: "📞 Get In Touch",
    title: "Let's Build Industrial Excellence Together",
    subtitle: "Ready to source world-class fasteners? Contact our team for quotes, technical support, or custom manufacturing inquiries.",
    address: "Bình Dương, Vietnam",
    email: "contact@tecomaco.com",
    phone: "+84 274 3789 789",
    workingHours: "Mon - Sat: 8:00 AM - 5:30 PM (GMT+7)",
    zaloLink: "https://zalo.me/0987654321",
    emailSubject: "Inquiry from Portfolio",
    emailBody: "Hello, I visited your portfolio and would like to get in touch to discuss collaborating on..."
  }
};

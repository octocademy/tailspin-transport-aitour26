/**
 * Static FAQ data organised by category.
 * Each category contains an icon, label, slug, and an array of Q&A items.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  slug: string;
  icon: string;
  label: string;
  items: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
  /* ------------------------------------------------------------------ */
  /*  Vehicles & Models                                                  */
  /* ------------------------------------------------------------------ */
  {
    slug: "vehicles",
    icon: "🚗",
    label: "Vehicles & Models",
    items: [
      {
        id: "vehicles-1",
        question: "What types of electric vehicles does Tailspin Transport offer?",
        answer:
          "We offer a diverse lineup of fully electric vehicles designed for every lifestyle — from sleek city sedans and spacious family SUVs to high-performance sports coupés and versatile crossovers. Every model in the Tailspin range is 100% battery-electric with zero tailpipe emissions.",
      },
      {
        id: "vehicles-2",
        question: "What is the range of a Tailspin electric vehicle?",
        answer:
          "Range varies by model and configuration. Our city sedans typically deliver 350–420 km on a single charge, while our long-range SUV and touring models can reach up to 620 km. Real-world range depends on driving style, weather conditions, and terrain, but our estimates are based on rigorous WLTP testing standards.",
      },
      {
        id: "vehicles-3",
        question: "Can I customise the colour and interior of my vehicle?",
        answer:
          "Absolutely. Each Tailspin model is available in a curated palette of exterior colours — from understated metallics to bold signature hues. Interior options include premium vegan leather, sustainable recycled fabrics, and hand-finished wood or aluminium trim accents. You can explore every combination in our online configurator before placing your order.",
      },
      {
        id: "vehicles-4",
        question: "Do Tailspin vehicles support over-the-air (OTA) software updates?",
        answer:
          "Yes. Every Tailspin vehicle receives free OTA updates for the life of the car. These updates can introduce new features, improve range efficiency, refine driver-assistance systems, and enhance infotainment capabilities — all without a trip to the service centre.",
      },
      {
        id: "vehicles-5",
        question: "What safety features are included?",
        answer:
          "Safety is at the core of every Tailspin vehicle. Standard features across the range include adaptive cruise control, automatic emergency braking, lane-keeping assist, blind-spot monitoring, 360° surround-view cameras, and a reinforced battery enclosure with multi-layer thermal protection. Our flagship models also include highway autopilot and intersection-awareness systems.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  Ordering & Pricing                                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "ordering",
    icon: "🛒",
    label: "Ordering & Pricing",
    items: [
      {
        id: "ordering-1",
        question: "How do I place an order for a Tailspin vehicle?",
        answer:
          "Ordering is simple. Browse our vehicle catalogue, choose your preferred model and configuration, then click \u201CReserve Now.\u201D You\u2019ll be guided through selecting your colour, interior, and any optional extras. A fully refundable reservation deposit secures your place in the production queue. You can complete the remaining payment closer to your delivery date.",
      },
      {
        id: "ordering-2",
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit and debit cards, bank transfers, and financing through our lending partners. If you choose financing, you can apply directly during checkout — most customers receive an approval decision within minutes. We also accept fleet purchase orders for business customers.",
      },
      {
        id: "ordering-3",
        question: "Is the reservation deposit refundable?",
        answer:
          "Yes, your reservation deposit is fully refundable at any point before your vehicle enters the final production stage. If you change your mind, simply contact our customer experience team and we'll process the refund within 5–7 business days.",
      },
      {
        id: "ordering-4",
        question: "Can I modify my order after it's been placed?",
        answer:
          "You can modify your configuration — including colour, interior, and optional extras — up until your vehicle enters the production queue. After that point, changes may not be possible, but our team will always do their best to accommodate requests. You'll receive status updates by email so you know exactly where your order stands.",
      },
      {
        id: "ordering-5",
        question: "Do you offer any discounts or referral programmes?",
        answer:
          "We run seasonal promotions and limited-time offers throughout the year. We also have a referral programme — when you refer a friend who completes a purchase, both of you receive credit towards accessories or service packages. Check our promotions page or subscribe to our newsletter for the latest deals.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  Delivery & Logistics                                               */
  /* ------------------------------------------------------------------ */
  {
    slug: "delivery",
    icon: "🚚",
    label: "Delivery & Logistics",
    items: [
      {
        id: "delivery-1",
        question: "How long does delivery take?",
        answer:
          "Delivery timelines depend on the model and configuration you choose. Standard models typically ship within 4–8 weeks from order confirmation. Custom-configured vehicles or limited-edition models may take 10–14 weeks. You'll receive a personalised delivery timeline during the order process and real-time tracking once your vehicle ships.",
      },
      {
        id: "delivery-2",
        question: "Can I pick up my vehicle instead of having it delivered?",
        answer:
          "Of course. You're welcome to collect your vehicle from any of our Tailspin Experience Centres. Pickup appointments include a complimentary one-on-one orientation session where our specialists walk you through every feature of your new car.",
      },
      {
        id: "delivery-3",
        question: "Do you deliver internationally?",
        answer:
          "Currently, we deliver to addresses across the United Kingdom and selected European markets. We're actively expanding our delivery network — join our mailing list to be notified when we launch in additional regions.",
      },
      {
        id: "delivery-4",
        question: "What happens on delivery day?",
        answer:
          "On delivery day, your Tailspin vehicle arrives fully charged and ready to drive. Our delivery specialist will walk you through the key features, help you set up the mobile app, pair your phone, and answer any questions. You'll also receive a welcome kit with charging adapters, documentation, and a few surprises.",
      },
      {
        id: "delivery-5",
        question: "Is there a delivery fee?",
        answer:
          "Home delivery is complimentary for all orders within mainland UK. For deliveries to the Scottish Highlands, Northern Ireland, or Channel Islands, a small logistics surcharge may apply — this will be clearly shown at checkout before you confirm your order.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  Charging & Battery                                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "charging",
    icon: "🔋",
    label: "Charging & Battery",
    items: [
      {
        id: "charging-1",
        question: "How do I charge my Tailspin vehicle at home?",
        answer:
          "Every Tailspin vehicle comes with a portable charging cable that works with a standard household outlet. For faster home charging, we recommend installing a dedicated wall charger — we partner with certified installers who can fit one at your home, often within a week of ordering. A full home charge typically takes 6–10 hours overnight on a 7 kW wall box.",
      },
      {
        id: "charging-2",
        question: "What public charging networks are compatible?",
        answer:
          "Tailspin vehicles are compatible with all major UK and European public charging networks, including CCS rapid chargers. Our in-car navigation automatically locates nearby chargers, shows real-time availability, and can even pre-condition the battery for the fastest possible charge when you arrive.",
      },
      {
        id: "charging-3",
        question: "How fast can I charge on a rapid charger?",
        answer:
          "On a DC rapid charger (150 kW+), most Tailspin models can charge from 10% to 80% in approximately 25–35 minutes. Our performance models support up to 250 kW peak charging, bringing that time down to around 18 minutes. Charging speed depends on the charger output, battery temperature, and current state of charge.",
      },
      {
        id: "charging-4",
        question: "How long does the battery last before it needs replacing?",
        answer:
          "Our battery packs are engineered to retain at least 80% of their original capacity after 200,000 km or 8 years — whichever comes first. Advanced thermal management and intelligent charge-limiting algorithms help preserve battery health over time. In real-world use, many of our early vehicles are showing even better longevity than these targets.",
      },
      {
        id: "charging-5",
        question: "Does Tailspin offer a home charger installation service?",
        answer:
          "Yes. When you order a vehicle, you can add a home charger installation package at checkout. Our certified partners will survey your property, install the wall box, and ensure everything is connected and tested. The whole process usually takes less than half a day.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  Warranty & Service                                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "warranty",
    icon: "🛡️",
    label: "Warranty & Service",
    items: [
      {
        id: "warranty-1",
        question: "What warranty comes with a Tailspin vehicle?",
        answer:
          "Every new Tailspin vehicle includes a comprehensive 5-year / 100,000 km bumper-to-bumper warranty, plus an 8-year / 200,000 km battery and drivetrain warranty. Paintwork is covered for 3 years against manufacturing defects, and corrosion protection lasts 12 years.",
      },
      {
        id: "warranty-2",
        question: "How do I schedule a service appointment?",
        answer:
          "You can book a service appointment through the Tailspin mobile app or via our website. Choose your nearest Experience Centre, select a convenient date and time, and describe any concerns. We also offer mobile service for many routine maintenance tasks — our technicians come to your home or workplace.",
      },
      {
        id: "warranty-3",
        question: "What routine maintenance does an electric vehicle need?",
        answer:
          "Electric vehicles require significantly less maintenance than traditional cars. There's no oil to change, no exhaust system, and brake wear is reduced thanks to regenerative braking. Routine checks include tyres, brake fluid, cabin air filters, and a software health check. We recommend an annual service to keep everything in top condition.",
      },
      {
        id: "warranty-4",
        question: "Do you offer roadside assistance?",
        answer:
          "Yes — every Tailspin vehicle includes complimentary 24/7 roadside assistance for the first 5 years. Whether you have a flat tyre, need a tow, or run low on charge, our partner network will get you back on the road. After the initial 5 years, you can extend coverage through our service subscription plans.",
      },
      {
        id: "warranty-5",
        question: "Can I purchase an extended warranty?",
        answer:
          "Absolutely. We offer extended warranty packages that can cover your vehicle for up to 10 years or 200,000 km. These packages are available at the time of purchase or anytime before your original warranty expires. Contact our customer experience team for pricing and options.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  Technology & Features                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "technology",
    icon: "💡",
    label: "Technology & Features",
    items: [
      {
        id: "tech-1",
        question: "Does Tailspin offer a mobile app?",
        answer:
          "Yes. The Tailspin app (available on iOS and Android) lets you remotely monitor your vehicle's charge level, pre-condition the cabin temperature, lock and unlock doors, view trip history, locate your car, and schedule service appointments — all from your phone.",
      },
      {
        id: "tech-2",
        question: "What infotainment system is installed?",
        answer:
          "Every Tailspin vehicle features a high-resolution touchscreen running our custom Tailspin OS. It includes built-in navigation with live traffic, streaming music, voice control, wireless Apple CarPlay and Android Auto, and access to the Tailspin app marketplace for additional functionality.",
      },
      {
        id: "tech-3",
        question: "Does the car support autonomous driving features?",
        answer:
          "All Tailspin vehicles come with Level 2 driver-assistance features as standard, including adaptive cruise control, lane centring, and automated parking. Our flagship models offer an optional Level 2+ highway autopilot that handles acceleration, braking, and steering on motorways under driver supervision.",
      },
      {
        id: "tech-4",
        question: "Can I use my vehicle as a power source?",
        answer:
          "Select Tailspin models support Vehicle-to-Load (V2L) functionality, allowing you to power external devices — from laptops and camping equipment to power tools — directly from the car's battery. V2L-equipped models include a standard outdoor power outlet rated at 3.6 kW.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  Sustainability                                                     */
  /* ------------------------------------------------------------------ */
  {
    slug: "sustainability",
    icon: "🌍",
    label: "Sustainability",
    items: [
      {
        id: "sustain-1",
        question: "How sustainable are Tailspin vehicles?",
        answer:
          "Sustainability is woven into every stage of our process. Our vehicles produce zero tailpipe emissions, and our factories run on 100% renewable energy. We use recycled and responsibly sourced materials wherever possible — including ocean-bound plastics in interior trim and recycled aluminium in body panels.",
      },
      {
        id: "sustain-2",
        question: "What happens to old batteries?",
        answer:
          "We operate a closed-loop battery programme. When a battery reaches the end of its automotive life, it's either repurposed for stationary energy storage (powering homes and businesses) or fully recycled to recover critical minerals like lithium, cobalt, and nickel. We aim for a 95%+ material recovery rate.",
      },
      {
        id: "sustain-3",
        question: "Does Tailspin offset its carbon emissions?",
        answer:
          "We go beyond offsetting. While we invest in verified carbon removal projects, our primary focus is on reducing emissions at the source — through renewable-powered manufacturing, efficient logistics, and sustainable supply chains. Every year, we publish a full sustainability report detailing our progress.",
      },
      {
        id: "sustain-4",
        question: "Are the interior materials eco-friendly?",
        answer:
          "Yes. We offer vegan leather made from plant-based materials, seat fabrics woven from recycled PET bottles, and natural fibre composites for interior panels. Even our packaging and delivery materials are recyclable or compostable. We believe luxury and sustainability go hand in hand.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  Returns & Cancellations                                            */
  /* ------------------------------------------------------------------ */
  {
    slug: "returns",
    icon: "🔄",
    label: "Returns & Cancellations",
    items: [
      {
        id: "returns-1",
        question: "Can I return my vehicle after purchase?",
        answer:
          "We offer a 14-day, no-questions-asked return policy from the date of delivery (or collection). If the vehicle doesn't meet your expectations, simply contact us within that window and we'll arrange a full refund. The vehicle must be in its original condition with fewer than 1,500 km driven.",
      },
      {
        id: "returns-2",
        question: "How do I cancel a reservation?",
        answer:
          "You can cancel your reservation at any time through the Tailspin app or by contacting our customer experience team. Your deposit will be refunded in full within 5–7 business days, provided the vehicle hasn't entered its final production stage.",
      },
      {
        id: "returns-3",
        question: "What if my vehicle arrives damaged?",
        answer:
          "In the unlikely event of delivery damage, please document it immediately with photos and contact us within 48 hours. We'll arrange for a prompt repair or, if necessary, a full replacement vehicle at no additional cost to you.",
      },
    ],
  },
];

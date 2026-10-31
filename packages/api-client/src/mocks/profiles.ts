import type { CompanyProfile, PersonProfile } from '@meridian/contracts';

// Fictional sample data (see prototype HANDOVER section 7). Real profiles come from sourced data with citations.
export const peopleFixture: Record<string, PersonProfile> = {
  "nia-mensah": {
    "id": "nia-mensah",
    "name": "Nia Mensah",
    "initials": "NM",
    "role": "CEO, Aya Health",
    "location": "Accra, Ghana",
    "claimed": true,
    "lede": [
      "Nia Mensah leads Aya Health, which equips rural clinics with solar-powered diagnostics. She previously ran clinic operations and now raises capital from a community of investors."
    ],
    "facts": [
      {
        "label": "Born",
        "value": "1985, Tamale"
      },
      {
        "label": "Education",
        "value": "University of Ghana, public health"
      },
      {
        "label": "Known for",
        "value": "Solar-powered rural clinics"
      },
      {
        "label": "Boards",
        "value": "Aya Health"
      }
    ],
    "timeline": [
      {
        "year": "2012",
        "title": "Joins clinic operations",
        "detail": "Regional health service"
      },
      {
        "year": "2018",
        "title": "Runs 40 clinics",
        "detail": "Operations lead"
      },
      {
        "year": "2023",
        "title": "Founds Aya Health",
        "detail": "First 14 clinics powered by solar"
      },
      {
        "year": "2026",
        "title": "Opens a $2M seed round",
        "detail": "Community investors"
      }
    ],
    "books": [
      {
        "id": "things-fall-apart",
        "title": "Things Fall Apart",
        "author": "Chinua Achebe",
        "spine": "#7A2E3A"
      }
    ],
    "interviews": [],
    "backers": [],
    "sources": [
      {
        "title": "Aya Health company site",
        "kind": "Company",
        "date": "Sep 2026"
      },
      {
        "title": "Regional health service report",
        "kind": "Report",
        "date": "Mar 2026"
      }
    ],
    "snapshot": {
      "title": "Aya Health",
      "stage": "Seed, 2026",
      "stats": [
        {
          "label": "Valuation cap",
          "value": "$12M"
        },
        {
          "label": "Raising",
          "value": "$2M"
        },
        {
          "label": "Clinics",
          "value": "14"
        },
        {
          "label": "Founded",
          "value": "2023"
        }
      ],
      "series": [
        1,
        2,
        3,
        5,
        8,
        12
      ],
      "seriesLabel": "Clinics, three years"
    }
  },
  "kunle-okafor": {
    "id": "kunle-okafor",
    "name": "Kunle Okafor",
    "initials": "KO",
    "role": "Partner, Sahel Ventures",
    "location": "Lagos, Nigeria",
    "claimed": true,
    "lede": [
      "Kunle Okafor invests in early-stage companies across West Africa, with a focus on logistics, health, and payments. He writes about diligence and founder-investor trust."
    ],
    "facts": [
      {
        "label": "Born",
        "value": "1981, Kano"
      },
      {
        "label": "Education",
        "value": "Lagos Business School"
      },
      {
        "label": "Known for",
        "value": "Seed investing in logistics and health"
      },
      {
        "label": "Boards",
        "value": "Sahel Ventures, Kora Freight"
      }
    ],
    "timeline": [
      {
        "year": "2009",
        "title": "Joins a regional bank",
        "detail": "Corporate lending"
      },
      {
        "year": "2016",
        "title": "Co-founds Sahel Ventures",
        "detail": "First fund, $40M"
      },
      {
        "year": "2021",
        "title": "Leads Kora Freight Series A",
        "detail": "Board seat"
      },
      {
        "year": "2025",
        "title": "Closes second fund",
        "detail": "$140M"
      }
    ],
    "books": [
      {
        "id": "zero-to-one",
        "title": "Zero to One",
        "author": "Peter Thiel",
        "spine": "#1F4E79"
      }
    ],
    "interviews": [],
    "backers": [],
    "sources": [
      {
        "title": "Sahel Ventures website",
        "kind": "Company",
        "date": "Aug 2026"
      },
      {
        "title": "Fund announcement",
        "kind": "Press release",
        "date": "Jun 2025"
      }
    ],
    "snapshot": {
      "title": "Sahel Ventures",
      "stage": "Venture capital",
      "stats": [
        {
          "label": "Assets",
          "value": "$180M"
        },
        {
          "label": "Portfolio",
          "value": "46"
        },
        {
          "label": "Cheque size",
          "value": "$100K to $1M"
        },
        {
          "label": "Founded",
          "value": "2016"
        }
      ],
      "series": [
        2,
        3,
        4,
        6,
        9,
        12
      ],
      "seriesLabel": "Assets, five years"
    }
  },
  "tunde-dlamini": {
    "id": "tunde-dlamini",
    "name": "Tunde Dlamini",
    "initials": "TD",
    "role": "CFO, Zuri Energy",
    "location": "Kumasi, Ghana",
    "claimed": true,
    "lede": [
      "Tunde Dlamini is chief financial officer of Zuri Energy, which finances solar systems for small businesses. He previously led finance at a listed utility."
    ],
    "facts": [
      {
        "label": "Born",
        "value": "1979, Mbabane"
      },
      {
        "label": "Education",
        "value": "University of Cape Town, accounting"
      },
      {
        "label": "Known for",
        "value": "Asset-backed energy financing"
      },
      {
        "label": "Boards",
        "value": "Zuri Energy"
      }
    ],
    "timeline": [
      {
        "year": "2005",
        "title": "Joins an audit firm",
        "detail": "Qualified accountant"
      },
      {
        "year": "2013",
        "title": "Finance lead, listed utility",
        "detail": "Capital planning"
      },
      {
        "year": "2020",
        "title": "Joins Zuri Energy",
        "detail": "Chief financial officer"
      },
      {
        "year": "2026",
        "title": "Opens a $1.5M round",
        "detail": "Community investors"
      }
    ],
    "books": [
      {
        "id": "the-goal",
        "title": "The Goal",
        "author": "Eliyahu Goldratt",
        "spine": "#5B3A29"
      }
    ],
    "interviews": [],
    "backers": [],
    "sources": [
      {
        "title": "Zuri Energy company site",
        "kind": "Company",
        "date": "Sep 2026"
      }
    ],
    "snapshot": {
      "title": "Zuri Energy",
      "stage": "Growth, 2026",
      "stats": [
        {
          "label": "Valuation cap",
          "value": "$24M"
        },
        {
          "label": "Raising",
          "value": "$1.5M"
        },
        {
          "label": "Customers",
          "value": "1,900"
        },
        {
          "label": "Founded",
          "value": "2020"
        }
      ],
      "series": [
        1,
        3,
        5,
        8,
        11,
        14
      ],
      "seriesLabel": "Customers, five years"
    }
  },
  "fatou-keita": {
    "id": "fatou-keita",
    "name": "Fatou Keita",
    "initials": "FK",
    "role": "Head of operations, Kora Freight",
    "location": "Accra, Ghana",
    "claimed": true,
    "lede": [
      "Fatou Keita runs operations at Kora Freight, where she built the dispatch playbook for new corridors. She mentors operators across three countries."
    ],
    "facts": [
      {
        "label": "Born",
        "value": "1990, Bamako"
      },
      {
        "label": "Education",
        "value": "Université de Bamako, logistics"
      },
      {
        "label": "Known for",
        "value": "Cross-border dispatch operations"
      },
      {
        "label": "Boards",
        "value": "None"
      }
    ],
    "timeline": [
      {
        "year": "2014",
        "title": "Dispatch coordinator",
        "detail": "Port logistics"
      },
      {
        "year": "2019",
        "title": "Joins Kora Freight",
        "detail": "Operations manager"
      },
      {
        "year": "2024",
        "title": "Head of operations",
        "detail": "212-person team"
      },
      {
        "year": "2026",
        "title": "Opens Abidjan corridor",
        "detail": "140 loads a week"
      }
    ],
    "books": [
      {
        "id": "the-goal",
        "title": "The Goal",
        "author": "Eliyahu Goldratt",
        "spine": "#5B3A29"
      }
    ],
    "interviews": [],
    "backers": [],
    "sources": [
      {
        "title": "Kora Freight company site",
        "kind": "Company",
        "date": "Sep 2026"
      }
    ],
    "snapshot": {
      "title": "Kora Freight",
      "stage": "Series B, 2025",
      "stats": [
        {
          "label": "Valuation",
          "value": "$180M"
        },
        {
          "label": "Total raised",
          "value": "$64M"
        },
        {
          "label": "Team",
          "value": "212"
        },
        {
          "label": "Founded",
          "value": "2019"
        }
      ],
      "series": [
        1,
        2,
        4,
        7,
        11,
        16
      ],
      "seriesLabel": "Revenue index, five years"
    }
  },
  "priya-raman": {
    "id": "priya-raman",
    "name": "Priya Raman",
    "initials": "PR",
    "role": "CEO, Helix Semiconductors",
    "location": "Singapore",
    "claimed": false,
    "lede": [
      "Priya Raman has led Helix Semiconductors since 2019. A chip architect by training, she steered the company toward low-power processors for data centres and phones."
    ],
    "facts": [
      {
        "label": "Born",
        "value": "1979, Chennai"
      },
      {
        "label": "Education",
        "value": "Institute of Technology, electrical engineering"
      },
      {
        "label": "Known for",
        "value": "Power-efficient processor design"
      },
      {
        "label": "Boards",
        "value": "Helix Semiconductors"
      }
    ],
    "timeline": [
      {
        "year": "2004",
        "title": "Joins the design team",
        "detail": "Helix Semiconductors"
      },
      {
        "year": "2012",
        "title": "Leads chip architecture",
        "detail": "Mobile processors"
      },
      {
        "year": "2019",
        "title": "Becomes CEO",
        "detail": "Revenue $5.9B"
      },
      {
        "year": "2025",
        "title": "Unveils low-power line",
        "detail": "Shipping next year"
      }
    ],
    "books": [
      {
        "id": "the-goal",
        "title": "The Goal",
        "author": "Eliyahu Goldratt",
        "spine": "#5B3A29"
      }
    ],
    "interviews": [],
    "backers": [],
    "sources": [
      {
        "title": "Helix annual report, 2025",
        "kind": "Annual report",
        "date": "Mar 2026"
      },
      {
        "title": "Product announcement",
        "kind": "Press release",
        "date": "Sep 2026"
      }
    ],
    "snapshot": {
      "title": "Helix Semiconductors",
      "stage": "Public company",
      "stats": [
        {
          "label": "Market value",
          "value": "$41B"
        },
        {
          "label": "Revenue",
          "value": "$9.2B"
        },
        {
          "label": "Employees",
          "value": "18,400"
        },
        {
          "label": "Founded",
          "value": "2003"
        }
      ],
      "series": [
        7.1,
        7.8,
        8.6,
        9.2
      ],
      "seriesLabel": "Revenue, four years"
    }
  },
  "mateo-alvarez": {
    "id": "mateo-alvarez",
    "name": "Mateo Alvarez",
    "initials": "MA",
    "role": "CEO, Lumen Grid",
    "location": "Santiago, Chile",
    "claimed": false,
    "lede": [
      "Mateo Alvarez is chief executive of Lumen Grid, which builds battery storage for utilities. Before joining, he ran grid operations for a national power company."
    ],
    "facts": [
      {
        "label": "Born",
        "value": "1976, Valparaíso"
      },
      {
        "label": "Education",
        "value": "Universidad de Chile, engineering"
      },
      {
        "label": "Known for",
        "value": "Utility-scale battery storage"
      },
      {
        "label": "Boards",
        "value": "Lumen Grid"
      }
    ],
    "timeline": [
      {
        "year": "2001",
        "title": "Grid engineer",
        "detail": "National power company"
      },
      {
        "year": "2011",
        "title": "Co-founds Lumen Grid",
        "detail": "First storage pilot"
      },
      {
        "year": "2017",
        "title": "Becomes CEO",
        "detail": "Listed on exchange"
      },
      {
        "year": "2026",
        "title": "Announces storage plant",
        "detail": "Lower costs for utilities"
      }
    ],
    "books": [
      {
        "id": "zero-to-one",
        "title": "Zero to One",
        "author": "Peter Thiel",
        "spine": "#1F4E79"
      }
    ],
    "interviews": [],
    "backers": [],
    "sources": [
      {
        "title": "Lumen Grid investor relations",
        "kind": "Company",
        "date": "Sep 2026"
      },
      {
        "title": "Plant announcement",
        "kind": "Press release",
        "date": "Sep 2026"
      }
    ],
    "snapshot": {
      "title": "Lumen Grid",
      "stage": "Public company",
      "stats": [
        {
          "label": "Market value",
          "value": "$12B"
        },
        {
          "label": "Revenue",
          "value": "$2.4B"
        },
        {
          "label": "Employees",
          "value": "6,100"
        },
        {
          "label": "Founded",
          "value": "2011"
        }
      ],
      "series": [
        1.4,
        1.7,
        2.1,
        2.4
      ],
      "seriesLabel": "Revenue, four years"
    }
  },
  "sofia-lindqvist": {
    "id": "sofia-lindqvist",
    "name": "Sofia Lindqvist",
    "initials": "SL",
    "role": "Founder and chair, Aurora Retail Group",
    "location": "Stockholm, Sweden",
    "claimed": false,
    "lede": [
      "Sofia Lindqvist founded Aurora Retail Group in 1996 and built it into one of Europe's larger multi-format retailers. She now focuses on delivery and emerging-market pilots."
    ],
    "facts": [
      {
        "label": "Born",
        "value": "1968, Gothenburg"
      },
      {
        "label": "Education",
        "value": "Stockholm School of Economics"
      },
      {
        "label": "Known for",
        "value": "Low-cost retail and delivery"
      },
      {
        "label": "Boards",
        "value": "Aurora Retail Group"
      }
    ],
    "timeline": [
      {
        "year": "1996",
        "title": "Founds Aurora",
        "detail": "One store"
      },
      {
        "year": "2008",
        "title": "Opens online channel",
        "detail": "Home delivery"
      },
      {
        "year": "2019",
        "title": "Steps up to chair",
        "detail": "New CEO appointed"
      },
      {
        "year": "2026",
        "title": "Expands delivery pilots",
        "detail": "Emerging markets"
      }
    ],
    "books": [
      {
        "id": "zero-to-one",
        "title": "Zero to One",
        "author": "Peter Thiel",
        "spine": "#1F4E79"
      }
    ],
    "interviews": [],
    "backers": [],
    "sources": [
      {
        "title": "Aurora annual report, 2025",
        "kind": "Annual report",
        "date": "Apr 2026"
      },
      {
        "title": "Pilot announcement",
        "kind": "Press release",
        "date": "Sep 2026"
      }
    ],
    "snapshot": {
      "title": "Aurora Retail Group",
      "stage": "Private company",
      "stats": [
        {
          "label": "Valuation",
          "value": "$6.8B"
        },
        {
          "label": "Revenue",
          "value": "$3.1B"
        },
        {
          "label": "Employees",
          "value": "12,000"
        },
        {
          "label": "Founded",
          "value": "1996"
        }
      ],
      "series": [
        2.4,
        2.7,
        2.9,
        3.1
      ],
      "seriesLabel": "Revenue, four years"
    }
  },
  "ama-boateng": {
    "id": "ama-boateng",
    "name": "Ama Boateng",
    "initials": "AB",
    "role": "Founder and CEO, Kora Freight",
    "location": "Accra, Ghana",
    "claimed": true,
    "lede": [
      "Ama Boateng built Kora Freight into West Africa's largest digital freight network, connecting more than 9,000 truck operators with manufacturers across Ghana, Côte d'Ivoire and Nigeria.",
      "She began in logistics at a Tema port operator, then left to fix the problem she saw daily: trucks returning empty. Kora now matches loads in minutes instead of days."
    ],
    "facts": [
      {
        "label": "Born",
        "value": "1988, Kumasi"
      },
      {
        "label": "Education",
        "value": "University of Ghana; MBA, Strathmore Business School"
      },
      {
        "label": "Known for",
        "value": "Digital freight marketplaces"
      },
      {
        "label": "Boards",
        "value": "Kora Freight; Accra Logistics Council"
      },
      {
        "label": "Reading",
        "value": "3 books recommended"
      }
    ],
    "timeline": [
      {
        "year": "2012",
        "title": "Joins Tema port operations",
        "detail": "Analyst, container scheduling"
      },
      {
        "year": "2016",
        "title": "Completes MBA",
        "detail": "Strathmore Business School, Nairobi"
      },
      {
        "year": "2019",
        "title": "Founds Kora Freight",
        "detail": "First route: Tema to Kumasi"
      },
      {
        "year": "2022",
        "title": "Raises $14M Series A",
        "detail": "Expands to Côte d'Ivoire"
      },
      {
        "year": "2025",
        "title": "Raises $50M Series B",
        "detail": "Valuation reaches $180M"
      }
    ],
    "books": [
      {
        "id": "the-goal",
        "title": "The Goal",
        "author": "Eliyahu Goldratt",
        "spine": "#5B3A29",
        "note": "Taught me to find the one bottleneck."
      },
      {
        "id": "zero-to-one",
        "title": "Zero to One",
        "author": "Peter Thiel",
        "spine": "#1F4E79",
        "note": "Read it before writing our first deck."
      },
      {
        "id": "things-fall-apart",
        "title": "Things Fall Apart",
        "author": "Chinua Achebe",
        "spine": "#7A2E3A",
        "note": "Every founder here should read it."
      }
    ],
    "interviews": [
      {
        "id": "empty-trucks",
        "title": "Why empty trucks cost Africa billions",
        "media": "audio",
        "minutes": 48
      },
      {
        "id": "building-kora",
        "title": "Building Kora from a single route",
        "media": "video",
        "minutes": 22
      }
    ],
    "backers": [
      {
        "name": "Continental Growth Fund",
        "role": "Lead, Series B"
      },
      {
        "name": "Sahel Ventures",
        "role": "Series A, B"
      },
      {
        "name": "Accra Angel Network",
        "role": "Seed"
      },
      {
        "name": "42 individual investors",
        "role": "Community round"
      }
    ],
    "sources": [
      {
        "title": "Kora Freight company site",
        "kind": "Company",
        "date": "Sep 2026"
      }
    ],
    "snapshot": {
      "title": "Kora Freight",
      "stage": "Series B, 2025",
      "stats": [
        {
          "label": "Valuation",
          "value": "$180M"
        },
        {
          "label": "Total raised",
          "value": "$64M"
        },
        {
          "label": "Team",
          "value": "212"
        },
        {
          "label": "Founded",
          "value": "2019"
        }
      ],
      "series": [
        100,
        150,
        200,
        260,
        312
      ],
      "seriesLabel": "Revenue, five years"
    }
  },
  "joel-asante": {
    "id": "joel-asante",
    "name": "Joel Asante",
    "initials": "JA",
    "role": "CTO, Kora Freight",
    "location": "Accra, Ghana",
    "claimed": false,
    "lede": [
      "Joel Asante is chief technology officer of Kora Freight. He leads the route-matching engine that pairs loads with trucks in minutes."
    ],
    "facts": [
      {
        "label": "Known for",
        "value": "Freight route-matching systems"
      },
      {
        "label": "Boards",
        "value": "None"
      }
    ],
    "timeline": [
      {
        "year": "2017",
        "title": "Software engineer",
        "detail": "Payments platform"
      },
      {
        "year": "2020",
        "title": "Joins Kora Freight",
        "detail": "Founding engineer"
      },
      {
        "year": "2023",
        "title": "Becomes CTO",
        "detail": "Engineering team of 48"
      }
    ],
    "books": [],
    "interviews": [],
    "backers": [],
    "sources": [
      {
        "title": "Kora Freight company site",
        "kind": "Company",
        "date": "Sep 2026"
      }
    ],
    "snapshot": {
      "title": "Kora Freight",
      "stage": "Series B, 2025",
      "stats": [
        {
          "label": "Valuation",
          "value": "$180M"
        },
        {
          "label": "Total raised",
          "value": "$64M"
        },
        {
          "label": "Team",
          "value": "212"
        },
        {
          "label": "Founded",
          "value": "2019"
        }
      ],
      "series": [
        100,
        150,
        200,
        260,
        312
      ],
      "seriesLabel": "Revenue, five years"
    }
  }
};

export const companiesFixture: Record<string, CompanyProfile> = {
  "aya-health": {
    "id": "aya-health",
    "name": "Aya Health",
    "letter": "A",
    "tagline": "Solar-powered rural clinics",
    "location": "Accra, Ghana",
    "claimed": true,
    "lede": "Aya Health equips rural clinics with solar-powered diagnostics so they stay open through grid failures. It serves 4,200 patient visits a month across 14 sites.",
    "facts": [
      {
        "label": "Founded",
        "value": "2023, Accra"
      },
      {
        "label": "Sector",
        "value": "Health care"
      },
      {
        "label": "Stage",
        "value": "Seed"
      },
      {
        "label": "Markets",
        "value": "Ghana"
      }
    ],
    "stage": "Seed, 2026",
    "stats": [
      {
        "label": "Valuation cap",
        "value": "$12M"
      },
      {
        "label": "Raising",
        "value": "$2M"
      },
      {
        "label": "Clinics",
        "value": "14"
      },
      {
        "label": "Founded",
        "value": "2023"
      }
    ],
    "trend": [
      {
        "label": "2023",
        "value": 1
      },
      {
        "label": "2024",
        "value": 4
      },
      {
        "label": "2025",
        "value": 9
      },
      {
        "label": "2026",
        "value": 14
      }
    ],
    "unit": "Clinics",
    "leaders": [
      {
        "id": "nia-mensah",
        "name": "Nia Mensah",
        "initials": "NM",
        "role": "CEO"
      }
    ],
    "news": [],
    "sources": [
      {
        "title": "Aya Health company site",
        "kind": "Company",
        "date": "Sep 2026"
      },
      {
        "title": "Regional health service report",
        "kind": "Report",
        "date": "Mar 2026"
      }
    ],
    "round": {
      "dealId": "aya-health-seed",
      "backers": 38,
      "raisedMinor": 128000000,
      "targetMinor": 200000000,
      "currency": "USD"
    }
  },
  "zuri-energy": {
    "id": "zuri-energy",
    "name": "Zuri Energy",
    "letter": "Z",
    "tagline": "Solar finance for small businesses",
    "location": "Kumasi, Ghana",
    "claimed": true,
    "lede": "Zuri Energy finances solar systems for small businesses in Kumasi and Tamale, collecting monthly payments over mobile money. Repayment has stayed above 96% for 18 months.",
    "facts": [
      {
        "label": "Founded",
        "value": "2020, Kumasi"
      },
      {
        "label": "Sector",
        "value": "Energy"
      },
      {
        "label": "Stage",
        "value": "Growth"
      },
      {
        "label": "Markets",
        "value": "Ghana"
      }
    ],
    "stage": "Growth, 2026",
    "stats": [
      {
        "label": "Valuation cap",
        "value": "$24M"
      },
      {
        "label": "Raising",
        "value": "$1.5M"
      },
      {
        "label": "Customers",
        "value": "1,900"
      },
      {
        "label": "Founded",
        "value": "2020"
      }
    ],
    "trend": [
      {
        "label": "2023",
        "value": 500
      },
      {
        "label": "2024",
        "value": 900
      },
      {
        "label": "2025",
        "value": 1400
      },
      {
        "label": "2026",
        "value": 1900
      }
    ],
    "unit": "Customers",
    "leaders": [
      {
        "id": "tunde-dlamini",
        "name": "Tunde Dlamini",
        "initials": "TD",
        "role": "CFO"
      }
    ],
    "news": [],
    "sources": [
      {
        "title": "Zuri Energy company site",
        "kind": "Company",
        "date": "Sep 2026"
      }
    ],
    "round": {
      "dealId": "zuri-energy-round",
      "backers": 74,
      "raisedMinor": 31000000,
      "targetMinor": 150000000,
      "currency": "USD"
    }
  },
  "helix-semiconductors": {
    "id": "helix-semiconductors",
    "name": "Helix Semiconductors",
    "letter": "H",
    "tagline": "Low-power processors",
    "location": "Singapore",
    "claimed": false,
    "lede": "Helix Semiconductors designs power-efficient processors for data centres and phones. Its newest product line cuts energy use and begins shipping next year.",
    "facts": [
      {
        "label": "Founded",
        "value": "2003, Singapore"
      },
      {
        "label": "Sector",
        "value": "Semiconductors"
      },
      {
        "label": "Listing",
        "value": "Public"
      },
      {
        "label": "Markets",
        "value": "Global"
      }
    ],
    "stage": "Public company",
    "stats": [
      {
        "label": "Market value",
        "value": "$41B"
      },
      {
        "label": "Revenue",
        "value": "$9.2B"
      },
      {
        "label": "Employees",
        "value": "18,400"
      },
      {
        "label": "Founded",
        "value": "2003"
      }
    ],
    "trend": [
      {
        "label": "2022",
        "value": 7.1
      },
      {
        "label": "2023",
        "value": 7.8
      },
      {
        "label": "2024",
        "value": 8.6
      },
      {
        "label": "2025",
        "value": 9.2
      }
    ],
    "unit": "Revenue, $B",
    "leaders": [
      {
        "id": "priya-raman",
        "name": "Priya Raman",
        "initials": "PR",
        "role": "CEO"
      }
    ],
    "news": [],
    "sources": [
      {
        "title": "Helix annual report, 2025",
        "kind": "Annual report",
        "date": "Mar 2026"
      },
      {
        "title": "Product announcement",
        "kind": "Press release",
        "date": "Sep 2026"
      }
    ]
  },
  "aurora-retail-group": {
    "id": "aurora-retail-group",
    "name": "Aurora Retail Group",
    "letter": "A",
    "tagline": "Multi-format retail and delivery",
    "location": "Stockholm, Sweden",
    "claimed": false,
    "lede": "Aurora Retail Group runs stores and home delivery across Europe. It is piloting cash-on-delivery and locker pickup in emerging-market cities.",
    "facts": [
      {
        "label": "Founded",
        "value": "1996, Stockholm"
      },
      {
        "label": "Sector",
        "value": "Retail"
      },
      {
        "label": "Ownership",
        "value": "Private"
      },
      {
        "label": "Markets",
        "value": "Europe, pilots elsewhere"
      }
    ],
    "stage": "Private company",
    "stats": [
      {
        "label": "Valuation",
        "value": "$6.8B"
      },
      {
        "label": "Revenue",
        "value": "$3.1B"
      },
      {
        "label": "Employees",
        "value": "12,000"
      },
      {
        "label": "Founded",
        "value": "1996"
      }
    ],
    "trend": [
      {
        "label": "2022",
        "value": 2.4
      },
      {
        "label": "2023",
        "value": 2.7
      },
      {
        "label": "2024",
        "value": 2.9
      },
      {
        "label": "2025",
        "value": 3.1
      }
    ],
    "unit": "Revenue, $B",
    "leaders": [
      {
        "id": "sofia-lindqvist",
        "name": "Sofia Lindqvist",
        "initials": "SL",
        "role": "Founder and chair"
      }
    ],
    "news": [],
    "sources": [
      {
        "title": "Aurora annual report, 2025",
        "kind": "Annual report",
        "date": "Apr 2026"
      },
      {
        "title": "Pilot announcement",
        "kind": "Press release",
        "date": "Sep 2026"
      }
    ]
  },
  "lumen-grid": {
    "id": "lumen-grid",
    "name": "Lumen Grid",
    "letter": "L",
    "tagline": "Utility-scale battery storage",
    "location": "Santiago, Chile",
    "claimed": false,
    "lede": "Lumen Grid builds battery storage for utilities and large commercial customers. It has announced a new manufacturing plant aimed at lowering storage costs.",
    "facts": [
      {
        "label": "Founded",
        "value": "2011, Santiago"
      },
      {
        "label": "Sector",
        "value": "Energy storage"
      },
      {
        "label": "Listing",
        "value": "Public"
      },
      {
        "label": "Markets",
        "value": "Americas"
      }
    ],
    "stage": "Public company",
    "stats": [
      {
        "label": "Market value",
        "value": "$12B"
      },
      {
        "label": "Revenue",
        "value": "$2.4B"
      },
      {
        "label": "Employees",
        "value": "6,100"
      },
      {
        "label": "Founded",
        "value": "2011"
      }
    ],
    "trend": [
      {
        "label": "2022",
        "value": 1.4
      },
      {
        "label": "2023",
        "value": 1.7
      },
      {
        "label": "2024",
        "value": 2.1
      },
      {
        "label": "2025",
        "value": 2.4
      }
    ],
    "unit": "Revenue, $B",
    "leaders": [
      {
        "id": "mateo-alvarez",
        "name": "Mateo Alvarez",
        "initials": "MA",
        "role": "CEO"
      }
    ],
    "news": [],
    "sources": [
      {
        "title": "Lumen Grid investor relations",
        "kind": "Company",
        "date": "Sep 2026"
      },
      {
        "title": "Plant announcement",
        "kind": "Press release",
        "date": "Sep 2026"
      }
    ]
  },
  "kora-freight": {
    "id": "kora-freight",
    "name": "Kora Freight",
    "letter": "K",
    "tagline": "Digital freight network",
    "location": "Accra, Ghana",
    "claimed": true,
    "lede": "Kora Freight connects more than 9,000 truck operators with manufacturers across Ghana, Côte d'Ivoire and Nigeria, matching loads in minutes instead of days. It was founded to fix a simple waste: trucks returning empty.",
    "facts": [
      {
        "label": "Founded",
        "value": "2019, Accra"
      },
      {
        "label": "Sector",
        "value": "Logistics and freight technology"
      },
      {
        "label": "Stage",
        "value": "Series B"
      },
      {
        "label": "Markets",
        "value": "Ghana, Côte d'Ivoire, Nigeria"
      }
    ],
    "stage": "Series B, 2025",
    "stats": [
      {
        "label": "Valuation",
        "value": "$180M"
      },
      {
        "label": "Total raised",
        "value": "$64M"
      },
      {
        "label": "Revenue run rate",
        "value": "$22M"
      },
      {
        "label": "Team",
        "value": "212"
      }
    ],
    "trend": [
      {
        "label": "Series A",
        "value": 14
      },
      {
        "label": "Series B",
        "value": 50
      }
    ],
    "unit": "Funding by round, $M",
    "leaders": [
      {
        "id": "ama-boateng",
        "name": "Ama Boateng",
        "initials": "AB",
        "role": "Founder and CEO"
      },
      {
        "id": "joel-asante",
        "name": "Joel Asante",
        "initials": "JA",
        "role": "CTO"
      },
      {
        "id": "fatou-keita",
        "name": "Fatou Keita",
        "initials": "FK",
        "role": "Head of operations"
      }
    ],
    "news": [
      {
        "id": "kora-abidjan-corridor",
        "title": "Kora Freight opens its Abidjan corridor",
        "source": "West Africa Wire"
      }
    ],
    "round": {
      "dealId": "kora-freight-round",
      "backers": 214,
      "raisedMinor": 76000000,
      "targetMinor": 200000000,
      "currency": "USD"
    },
    "sources": [
      {
        "title": "Kora Freight company site",
        "kind": "Company",
        "date": "Sep 2026"
      }
    ]
  },
  "nakala": {
    "id": "nakala",
    "name": "Nakala",
    "letter": "N",
    "tagline": "Freight marketplace",
    "location": "Lagos, Nigeria",
    "claimed": false,
    "lede": "Nakala runs a freight marketplace in Nigeria, matching shippers with truck operators. It is one of the larger networks in the country.",
    "facts": [
      {
        "label": "Founded",
        "value": "2020, Lagos"
      },
      {
        "label": "Sector",
        "value": "Logistics and freight technology"
      },
      {
        "label": "Stage",
        "value": "Series A"
      },
      {
        "label": "Markets",
        "value": "Nigeria"
      }
    ],
    "stage": "Series A, 2024",
    "stats": [
      {
        "label": "Operators",
        "value": "11,200"
      },
      {
        "label": "Countries",
        "value": "1"
      },
      {
        "label": "Total raised",
        "value": "$28M"
      },
      {
        "label": "Founded",
        "value": "2020"
      }
    ],
    "trend": [
      {
        "label": "2022",
        "value": 4200
      },
      {
        "label": "2023",
        "value": 7800
      },
      {
        "label": "2024",
        "value": 11200
      }
    ],
    "unit": "Operators",
    "leaders": [],
    "news": [],
    "sources": [
      {
        "title": "Nakala company site",
        "kind": "Company",
        "date": "Aug 2026"
      }
    ]
  }
};

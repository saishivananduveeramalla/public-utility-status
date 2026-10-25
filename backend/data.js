/**
 * In-memory sample demonstration data for Public Utility Status
 * Essentials of Web Programming (EWP) Lab Project
 * Note: Data is stored in JavaScript arrays and resets when server restarts.
 */

// 1. Essential Public Utilities (6 Categories)
const utilities = [
  {
    id: "U101",
    name: "Electricity Distribution (TSSPDCL)",
    category: "Electricity",
    area: "Hyderabad Central & West (Banjara Hills, Jubilee Hills, Gachibowli)",
    status: "Operational",
    description: "TSSPDCL 33/11kV substations are functioning normally. All primary 11kV feeders are active without unscheduled load shedding.",
    lastUpdated: "2026-10-25 09:30 AM",
    expectedRestoration: "All systems operating normally",
    helpline: "1912",
    department: "Telangana State Southern Power Distribution Co. Ltd."
  },
  {
    id: "U102",
    name: "Municipal Water Supply (HMWSSB)",
    category: "Water Supply",
    area: "Hyderabad North & East (Secunderabad, Malkajgiri, Uppal)",
    status: "Maintenance",
    description: "HMWSSB pipeline valve replacement and pump maintenance on Krishna Drinking Water Supply Phase-III feeder line.",
    lastUpdated: "2026-10-25 08:15 AM",
    expectedRestoration: "Today at 06:00 PM",
    helpline: "155313",
    department: "Hyderabad Metropolitan Water Supply & Sewerage Board"
  },
  {
    id: "U103",
    name: "Public Transportation (Metro & TSRTC)",
    category: "Public Transportation",
    area: "Hyderabad Metropolitan (Metro Corridors & TSRTC City Routes)",
    status: "Operational",
    description: "Hyderabad Metro Rail running at 4-6 minute peak intervals. TSRTC electric city buses operating on full schedule with live GPS tracking.",
    lastUpdated: "2026-10-25 10:00 AM",
    expectedRestoration: "Normal peak schedules active",
    helpline: "040-69440000",
    department: "L&T Metro Rail & TSRTC City Division"
  },
  {
    id: "U104",
    name: "Public Internet & Fiber Infrastructure",
    category: "Internet Services",
    area: "IT Corridor & Financial District (Hitec City, Madhapur, Kondapur)",
    status: "Operational",
    description: "Municipal public Wi-Fi hotspots and major optical fiber backbones operational with 99.8% network uptime.",
    lastUpdated: "2026-10-25 11:00 AM",
    expectedRestoration: "All gateway nodes active",
    helpline: "1800-425-0012",
    department: "T-Fiber & Information Technology Department"
  },
  {
    id: "U105",
    name: "Solid Waste & Garbage Collection",
    category: "Garbage Collection",
    area: "Hyderabad South (Old City, Charminar, Falaknuma, Chandrayangutta)",
    status: "Service Disruption",
    description: "GHMC Swachh auto-tipper collection delayed due to transfer station mechanical maintenance at Ibrahimbagh. Alternate compactors deployed.",
    lastUpdated: "2026-10-25 07:45 AM",
    expectedRestoration: "Today by 04:30 PM",
    helpline: "040-21111111",
    department: "Greater Hyderabad Municipal Corporation (Sanitation)"
  },
  {
    id: "U106",
    name: "Road & Streetlight Maintenance (CRMP)",
    category: "Road Maintenance",
    area: "Cyberabad Outer & Kukatpally (JNTU - Forum Mall Stretch)",
    status: "Maintenance",
    description: "Comprehensive Road Maintenance Program (CRMP) asphalt resurfacing and smart LED streetlight fixture replacement in progress.",
    lastUpdated: "2026-10-25 09:00 AM",
    expectedRestoration: "Tomorrow at 05:00 AM",
    helpline: "040-23225397",
    department: "GHMC Engineering & Highway Wing"
  }
];

// 2. Municipal Announcements & Maintenance Advisories
const announcements = [
  {
    id: "ANN-101",
    title: "Scheduled Power Feeder Upgrade & Tree Trimming",
    area: "Madhapur, Kavuri Hills, Jubilee Hills Road No. 36",
    description: "TSSPDCL will undertake regular monsoon preparation, overhead 11kV conductor maintenance, and transformer oil filtration.",
    date: "2026-10-25",
    category: "Electricity"
  },
  {
    id: "ANN-102",
    title: "Drinking Water Supply Interruption for Valve Repairs",
    area: "Secunderabad, Marredpally, Bowenpally, Trimulgherry",
    description: "Critical interconnection works on the 1200mm diameter main under Krishna Phase-III. Water supply partially suspended for 10 hours.",
    date: "2026-10-25",
    category: "Water Supply"
  },
  {
    id: "ANN-103",
    title: "Hyderabad Metro Extended Night Hours for Tech Summit",
    area: "Red Line (Miyapur - LB Nagar) & Blue Line (Raidurg - Nagole)",
    description: "Last trains from terminal stations will depart at 11:45 PM instead of 11:00 PM to facilitate attendees returning from HITEX.",
    date: "2026-10-24",
    category: "Public Transportation"
  },
  {
    id: "ANN-104",
    title: "CRMP Night Asphalt Resurfacing Work",
    area: "JNTU - KPHB Colony - Cyber Towers Flyover Junction",
    description: "Milling and hot-mix asphalt carpeting will be executed from 11:00 PM to 05:00 AM. Lane diversion enforced by traffic police.",
    date: "2026-10-23",
    category: "Road Maintenance"
  },
  {
    id: "ANN-105",
    title: "Commercial Night Waste Collection Drive",
    area: "Charminar Heritage Zone, Madina Market, Laad Bazaar",
    description: "GHMC deploying secondary compactors and sweeping crews from 10:00 PM onwards to clear festival packaging waste.",
    date: "2026-10-25",
    category: "Garbage Collection"
  }
];

// 3. In-memory Complaint Grievances
const complaints = [
  {
    complaintId: "CMP-HYD-2026-1011",
    citizenName: "K. Rajeshwar Rao",
    mobile: "9848012345",
    email: "rajeshwar.rao@example.com",
    utilityCategory: "Electricity",
    area: "Jubilee Hills Road No. 10",
    description: "Frequent low voltage fluctuations during peak evening hours between 7 PM and 10 PM. Refrigerator and AC tripping.",
    status: "Resolved",
    submittedAt: "2026-10-23 04:30 PM"
  },
  {
    complaintId: "CMP-HYD-2026-1012",
    citizenName: "Sneha Reddy",
    mobile: "9988776655",
    email: "sneha.reddy@example.com",
    utilityCategory: "Water Supply",
    area: "Secunderabad (West Marredpally)",
    description: "High pressure drinking water leaking from joint valve near St. Ann's junction. Clean drinking water wasting onto the road.",
    status: "In Progress",
    submittedAt: "2026-10-24 09:15 AM"
  },
  {
    complaintId: "CMP-HYD-2026-1013",
    citizenName: "Syed Mohammed Imran",
    mobile: "9440112233",
    email: "m.imran@example.com",
    utilityCategory: "Garbage Collection",
    area: "Charminar (Near Gulzar Houz)",
    description: "Community waste bin overflowing for 36 hours. Commercial packaging waste scattering on the pedestrian footpath.",
    status: "Submitted",
    submittedAt: "2026-10-25 08:20 AM"
  }
];

module.exports = {
  utilities,
  announcements,
  complaints
};

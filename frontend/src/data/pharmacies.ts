import type { Pharmacy } from '../types';

export const initialPharmacies: Pharmacy[] = [
  {
    "id": "pharm-pune-01",
    "name": "Apollo Pharmacy - Sinhagad Road",
    "ownerName": "Dr. Rajesh Verma",
    "email": "apollo.sinhagad@apollopharmacy.in",
    "phone": "+91 020 2435 6789",
    "address": "Shop No 3, Anand Nagar, Sinhagad Road, Manik Baug",
    "city": "Pune",
    "latitude": 18.4752,
    "longitude": 73.8324,
    "openingTime": "07:00 AM",
    "closingTime": "11:00 PM",
    "status": "Open",
    "distance": "0.4 km",
    "rating": 4.9,
    "medicines": [
      {
        "medicineId": "med-101",
        "medicineName": "Paracetamol 500mg (Dolo-650 / Panadol)",
        "quantity": 250,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 15.5
      },
      {
        "medicineId": "med-102",
        "medicineName": "Amoxicillin 500mg Capsule",
        "quantity": 95,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 85
      },
      {
        "medicineId": "med-103",
        "medicineName": "Metformin Hydrochloride 500mg SR",
        "quantity": 180,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 42
      },
      {
        "medicineId": "med-104",
        "medicineName": "Atorvastatin 10mg Tablet",
        "quantity": 60,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 110
      },
      {
        "medicineId": "med-105",
        "medicineName": "Omeprazole 20mg Capsule",
        "quantity": 15,
        "status": "LOW STOCK",
        "lastUpdated": "2026-09-28",
        "price": 68
      },
      {
        "medicineId": "med-106",
        "medicineName": "Ibuprofen 400mg Tablet",
        "quantity": 120,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 28
      },
      {
        "medicineId": "med-107",
        "medicineName": "Cetirizine Hydrochloride 10mg",
        "quantity": 300,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 35
      }
    ]
  },
  {
    "id": "pharm-pune-02",
    "name": "Wellness Forever 24x7 - Vadgaon Sinhagad Road",
    "ownerName": "Sanjay Kumar",
    "email": "vadgaon.wf@wellnessforever.com",
    "phone": "+91 020 2435 1122",
    "address": "Near Vadgaon Bridge, Opposite Fun Time Multiplex, Sinhagad Road",
    "city": "Pune",
    "latitude": 18.468,
    "longitude": 73.829,
    "openingTime": "00:00 AM",
    "closingTime": "11:59 PM",
    "status": "Open",
    "distance": "0.8 km",
    "rating": 4.8,
    "medicines": [
      {
        "medicineId": "med-101",
        "medicineName": "Paracetamol 500mg (Dolo-650 / Panadol)",
        "quantity": 400,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 15
      },
      {
        "medicineId": "med-102",
        "medicineName": "Amoxicillin 500mg Capsule",
        "quantity": 120,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 84
      },
      {
        "medicineId": "med-105",
        "medicineName": "Omeprazole 20mg Capsule",
        "quantity": 35,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 65
      },
      {
        "medicineId": "med-108",
        "medicineName": "Azithromycin 500mg Tablet",
        "quantity": 20,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 120
      },
      {
        "medicineId": "med-109",
        "medicineName": "Amlodipine 5mg Tablet",
        "quantity": 150,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 32
      }
    ]
  },
  {
    "id": "pharm-pune-03",
    "name": "MedPlus Pharmacy - Dhayari Phata",
    "ownerName": "Priya Sharma",
    "email": "medplus.dhayari@medplus.in",
    "phone": "+91 020 2439 8899",
    "address": "Shop 5, Near Dhayari Phata Signal, Sinhagad Road, Dhayari",
    "city": "Pune",
    "latitude": 18.459,
    "longitude": 73.821,
    "openingTime": "08:00 AM",
    "closingTime": "10:30 PM",
    "status": "Open",
    "distance": "1.2 km",
    "rating": 4.7,
    "medicines": [
      {
        "medicineId": "med-101",
        "medicineName": "Paracetamol 500mg (Dolo-650 / Panadol)",
        "quantity": 300,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 16
      },
      {
        "medicineId": "med-103",
        "medicineName": "Metformin Hydrochloride 500mg SR",
        "quantity": 110,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 42
      },
      {
        "medicineId": "med-104",
        "medicineName": "Atorvastatin 10mg Tablet",
        "quantity": 85,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 112
      }
    ]
  },
  {
    "id": "pharm-pune-04",
    "name": "Sanjivani Medical & General Stores - Hingne Khurd",
    "ownerName": "Amitabh Patel",
    "email": "sanjivani.hingne@gmail.com",
    "phone": "+91 020 2434 5544",
    "address": "Near Rajaram Bridge, Sinhagad Road, Hingne Khurd",
    "city": "Pune",
    "latitude": 18.487,
    "longitude": 73.839,
    "openingTime": "08:30 AM",
    "closingTime": "11:00 PM",
    "status": "Open",
    "distance": "1.5 km",
    "rating": 4.6,
    "medicines": [
      {
        "medicineId": "med-101",
        "medicineName": "Paracetamol 500mg (Dolo-650 / Panadol)",
        "quantity": 180,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 15.5
      },
      {
        "medicineId": "med-106",
        "medicineName": "Ibuprofen 400mg Tablet",
        "quantity": 90,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 28
      }
    ]
  },
  {
    "id": "pharm-pune-05",
    "name": "LifeCare Chemist & Health Centre - Manik Baug",
    "ownerName": "Dr. Meena Gupta",
    "email": "lifecare.manikbaug@gmail.com",
    "phone": "+91 020 2435 9900",
    "address": "Sun City Road Corner, Opposite Abhiruchi Mall, Sinhagad Road",
    "city": "Pune",
    "latitude": 18.4715,
    "longitude": 73.8305,
    "openingTime": "08:00 AM",
    "closingTime": "10:30 PM",
    "status": "Open",
    "distance": "0.6 km",
    "rating": 4.7,
    "medicines": [
      {
        "medicineId": "med-101",
        "medicineName": "Paracetamol 500mg (Dolo-650 / Panadol)",
        "quantity": 220,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 15
      },
      {
        "medicineId": "med-103",
        "medicineName": "Metformin Hydrochloride 500mg SR",
        "quantity": 140,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 40
      }
    ]
  },
  {
    "id": "pharm-pune-06",
    "name": "Shree Gajanan Medical & Surgical - Anand Nagar",
    "ownerName": "Gajanan Joshi",
    "email": "gajanana.meds@gmail.com",
    "phone": "+91 020 2435 4411",
    "address": "Near Santosh Hall, Sinhagad Road, Anand Nagar",
    "city": "Pune",
    "latitude": 18.478,
    "longitude": 73.8345,
    "openingTime": "08:30 AM",
    "closingTime": "10:00 PM",
    "status": "Open",
    "distance": "0.7 km",
    "rating": 4.5,
    "medicines": [
      {
        "medicineId": "med-101",
        "medicineName": "Paracetamol 500mg (Dolo-650 / Panadol)",
        "quantity": 130,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 15.5
      }
    ]
  },
  {
    "id": "pharm-pune-07",
    "name": "Noble Chemist - Sun City Sinhagad Road",
    "ownerName": "Nitin Deshmukh",
    "email": "noble.suncity@gmail.com",
    "phone": "+91 020 2435 7788",
    "address": "Shop 12, Sun City Plaza, Sun City Road, Off Sinhagad Road",
    "city": "Pune",
    "latitude": 18.4735,
    "longitude": 73.828,
    "openingTime": "08:00 AM",
    "closingTime": "11:00 PM",
    "status": "Open",
    "distance": "0.9 km",
    "rating": 4.8,
    "medicines": [
      {
        "medicineId": "med-101",
        "medicineName": "Paracetamol 500mg (Dolo-650 / Panadol)",
        "quantity": 310,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 15
      }
    ]
  },
  {
    "id": "pharm-pune-08",
    "name": "Shree Krishna Medical - Narhe Village",
    "ownerName": "Vilasrao Kadam",
    "email": "krishna.narhe@gmail.com",
    "phone": "+91 020 2460 3344",
    "address": "Near JSPM College Road, Narhe Gaon",
    "city": "Pune",
    "latitude": 18.4485,
    "longitude": 73.826,
    "openingTime": "08:00 AM",
    "closingTime": "10:00 PM",
    "status": "Open",
    "distance": "2.1 km",
    "rating": 4.6,
    "medicines": [
      {
        "medicineId": "med-101",
        "medicineName": "Paracetamol 500mg (Dolo-650 / Panadol)",
        "quantity": 200,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 15
      }
    ]
  },
  {
    "id": "pharm-pune-09",
    "name": "Katraj 24x7 Medical & Pharmacy",
    "ownerName": "Sachin Patil",
    "email": "katraj.24x7@gmail.com",
    "phone": "+91 020 2437 9911",
    "address": "Near Katraj Snake Park & Bus Depot, Katraj",
    "city": "Pune",
    "latitude": 18.4525,
    "longitude": 73.854,
    "openingTime": "00:00 AM",
    "closingTime": "11:59 PM",
    "status": "Open",
    "distance": "2.8 km",
    "rating": 4.7,
    "medicines": [
      {
        "medicineId": "med-102",
        "medicineName": "Amoxicillin 500mg Capsule",
        "quantity": 150,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 85
      }
    ]
  },
  {
    "id": "pharm-pune-10",
    "name": "Karve Nagar Healthcare Pharmacy",
    "ownerName": "Sunil Jagtap",
    "email": "karvenagar.meds@gmail.com",
    "phone": "+91 020 2543 2211",
    "address": "Pratapsingh Khakar Chowk, Karve Nagar",
    "city": "Pune",
    "latitude": 18.4912,
    "longitude": 73.8185,
    "openingTime": "08:30 AM",
    "closingTime": "10:30 PM",
    "status": "Open",
    "distance": "2.3 km",
    "rating": 4.8,
    "medicines": [
      {
        "medicineId": "med-104",
        "medicineName": "Atorvastatin 10mg Tablet",
        "quantity": 120,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 110
      }
    ]
  },
  {
    "id": "pharm-pune-11",
    "name": "Kothrud Central Medical Store",
    "ownerName": "Mahesh Kulkarni",
    "email": "kothrud.central@gmail.com",
    "phone": "+91 020 2538 4455",
    "address": "Near Ideal Colony Signal, Paud Road, Kothrud",
    "city": "Pune",
    "latitude": 18.5074,
    "longitude": 73.8077,
    "openingTime": "08:00 AM",
    "closingTime": "11:00 PM",
    "status": "Open",
    "distance": "3.4 km",
    "rating": 4.9,
    "medicines": [
      {
        "medicineId": "med-103",
        "medicineName": "Metformin Hydrochloride 500mg SR",
        "quantity": 170,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 42
      }
    ]
  },
  {
    "id": "pharm-pune-12",
    "name": "Warje Malwadi Chemist & Druggist",
    "ownerName": "Dnyaneshwar Shinde",
    "email": "warje.chemist@gmail.com",
    "phone": "+91 020 2523 6677",
    "address": "Near Warje Flyover, Mumbai-Bangalore Highway, Warje",
    "city": "Pune",
    "latitude": 18.4815,
    "longitude": 73.799,
    "openingTime": "08:00 AM",
    "closingTime": "10:00 PM",
    "status": "Closed",
    "distance": "3.1 km",
    "rating": 4.5,
    "medicines": [
      {
        "medicineId": "med-101",
        "medicineName": "Paracetamol 500mg (Dolo-650 / Panadol)",
        "quantity": 80,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 15.5
      }
    ]
  },
  {
    "id": "pharm-pune-13",
    "name": "Deccan Gymkhana Pharmacy",
    "ownerName": "Prashant Apte",
    "email": "deccan.pharmacy@gmail.com",
    "phone": "+91 020 2553 1188",
    "address": "Goodluck Chowk, FC Road, Deccan Gymkhana",
    "city": "Pune",
    "latitude": 18.5167,
    "longitude": 73.842,
    "openingTime": "08:00 AM",
    "closingTime": "11:00 PM",
    "status": "Open",
    "distance": "4.2 km",
    "rating": 4.9,
    "medicines": [
      {
        "medicineId": "med-107",
        "medicineName": "Cetirizine Hydrochloride 10mg",
        "quantity": 240,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 35
      }
    ]
  },
  {
    "id": "pharm-pune-14",
    "name": "Swargate Metro Medical Corner",
    "ownerName": "Ramesh Bhosale",
    "email": "swargate.meds@gmail.com",
    "phone": "+91 020 2444 8822",
    "address": "Opposite Swargate ST Bus Stand, Swargate",
    "city": "Pune",
    "latitude": 18.5018,
    "longitude": 73.8636,
    "openingTime": "07:30 AM",
    "closingTime": "11:30 PM",
    "status": "Open",
    "distance": "4.8 km",
    "rating": 4.7,
    "medicines": [
      {
        "medicineId": "med-106",
        "medicineName": "Ibuprofen 400mg Tablet",
        "quantity": 150,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 28
      }
    ]
  },
  {
    "id": "pharm-pune-15",
    "name": "Shivajinagar Station Chemist",
    "ownerName": "Vijay Naik",
    "email": "shivajinagar.chemist@gmail.com",
    "phone": "+91 020 2551 9900",
    "address": "Near Shivajinagar Railway Station, JM Road",
    "city": "Pune",
    "latitude": 18.5314,
    "longitude": 73.8446,
    "openingTime": "08:00 AM",
    "closingTime": "10:30 PM",
    "status": "Open",
    "distance": "5.9 km",
    "rating": 4.8,
    "medicines": [
      {
        "medicineId": "med-105",
        "medicineName": "Omeprazole 20mg Capsule",
        "quantity": 45,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 68
      }
    ]
  },
  {
    "id": "pharm-pune-16",
    "name": "Baner High Street Wellness Pharmacy",
    "ownerName": "Dr. Siddharth Shah",
    "email": "baner.highstreet@wellness.com",
    "phone": "+91 020 6721 3344",
    "address": "Main Building, Baner High Street, Baner",
    "city": "Pune",
    "latitude": 18.559,
    "longitude": 73.7868,
    "openingTime": "08:00 AM",
    "closingTime": "11:00 PM",
    "status": "Open",
    "distance": "8.5 km",
    "rating": 4.9,
    "medicines": [
      {
        "medicineId": "med-109",
        "medicineName": "Amlodipine 5mg Tablet",
        "quantity": 200,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 32
      }
    ]
  },
  {
    "id": "pharm-pune-17",
    "name": "Erandwane Prabhat Road Medicals",
    "ownerName": "Anil Gadgil",
    "email": "erandwane.prabhat@gmail.com",
    "phone": "+91 020 2544 7711",
    "address": "Prabhat Road Lane 14, Erandwane",
    "city": "Pune",
    "latitude": 18.509,
    "longitude": 73.832,
    "openingTime": "08:30 AM",
    "closingTime": "10:00 PM",
    "status": "Open",
    "distance": "3.8 km",
    "rating": 4.7,
    "medicines": [
      {
        "medicineId": "med-110",
        "medicineName": "Pantoprazole 40mg Tablet",
        "quantity": 60,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 75
      }
    ]
  },
  {
    "id": "pharm-pune-18",
    "name": "Aundh Medilife Chemist & Superstore",
    "ownerName": "Rajendra Pawar",
    "email": "aundh.medilife@gmail.com",
    "phone": "+91 020 2588 5566",
    "address": "DP Road, Opposite Westend Mall, Aundh",
    "city": "Pune",
    "latitude": 18.5602,
    "longitude": 73.8031,
    "openingTime": "08:00 AM",
    "closingTime": "11:00 PM",
    "status": "Open",
    "distance": "9.2 km",
    "rating": 4.8,
    "medicines": [
      {
        "medicineId": "med-101",
        "medicineName": "Paracetamol 500mg (Dolo-650 / Panadol)",
        "quantity": 350,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 15.5
      }
    ]
  },
  {
    "id": "pharm-pune-19",
    "name": "Bavdhan Life Care Pharmacy",
    "ownerName": "Sameer Inamdar",
    "email": "bavdhan.lifecare@gmail.com",
    "phone": "+91 020 2295 1199",
    "address": "LVD Complex, NDA Road, Bavdhan",
    "city": "Pune",
    "latitude": 18.514,
    "longitude": 73.7745,
    "openingTime": "08:00 AM",
    "closingTime": "10:30 PM",
    "status": "Closed",
    "distance": "6.4 km",
    "rating": 4.6,
    "medicines": [
      {
        "medicineId": "med-102",
        "medicineName": "Amoxicillin 500mg Capsule",
        "quantity": 70,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 85
      }
    ]
  },
  {
    "id": "pharm-pune-20",
    "name": "Hadapsar Magarpatta City Pharmacy",
    "ownerName": "Venkatesh Rao",
    "email": "magarpatta.meds@gmail.com",
    "phone": "+91 020 6601 4400",
    "address": "Destination Centre, Magarpatta City, Hadapsar",
    "city": "Pune",
    "latitude": 18.5089,
    "longitude": 73.926,
    "openingTime": "08:00 AM",
    "closingTime": "11:00 PM",
    "status": "Open",
    "distance": "10.5 km",
    "rating": 4.9,
    "medicines": [
      {
        "medicineId": "med-103",
        "medicineName": "Metformin Hydrochloride 500mg SR",
        "quantity": 210,
        "status": "AVAILABLE",
        "lastUpdated": "2026-09-28",
        "price": 42
      }
    ]
  }
];

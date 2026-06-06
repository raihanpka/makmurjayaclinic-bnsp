import Drug from '#models/drug'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Drug.createMany([
      {
        sku: 'ASP-001',
        name: 'Aspirin Cardio 100mg',
        description: 'Obat pengencer darah yang digunakan untuk mencegah pembekuan darah pada pasien dengan risiko serangan jantung atau stroke. Bekerja dengan menghambat agregasi trombosit.',
        composition: 'Acetylsalicylic acid 100 mg',
        dosage: 'Dewasa: 1 tablet per hari setelah makan, atau sesuai petunjuk dokter.',
        sideEffects: 'Gangguan pencernaan, mual, risiko pendarahan ringan.',
        price: '25000',
        requiresPrescription: true,
        minStock: 30,
        categoryId: 1, // Obat Resep
        supplierId: 5, // Bayer
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        sku: 'AMX-001',
        name: 'Amoxicillin Trihydrate 500mg',
        description: 'Antibiotik golongan penisilin spektrum luas yang digunakan untuk mengobati berbagai infeksi bakteri seperti infeksi saluran pernafasan, saluran kemih, dan telinga.',
        composition: 'Amoxicillin trihydrate setara dengan Amoxicillin 500 mg',
        dosage: 'Dewasa: 500 mg setiap 8 jam. Dihabiskan sesuai resep dokter.',
        sideEffects: 'Diare, mual, muntah, ruam kemerahan pada kulit.',
        price: '15000',
        requiresPrescription: true,
        minStock: 50,
        categoryId: 1, // Obat Resep
        supplierId: 2, // Sanbe
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        sku: 'PCT-001',
        name: 'Panadol Extra Paracetamol 500mg',
        description: 'Obat pereda nyeri cepat dan efektif untuk sakit kepala, sakit gigi, dan penurun demam. Diperkuat dengan kafein untuk mempercepat efek analgesik.',
        composition: 'Paracetamol 500 mg, Caffeine 65 mg',
        dosage: 'Dewasa & anak >12 tahun: 1-2 kaplet tiap 4-6 jam. Maksimal 8 kaplet per hari.',
        sideEffects: 'Sangat jarang: reaksi alergi ringan kulit.',
        price: '12000',
        requiresPrescription: false,
        minStock: 100,
        categoryId: 2, // Obat Bebas
        supplierId: 1, // Kalbe
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1550572017-edb799e04917?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        sku: 'VIT-001',
        name: 'Enervon-C Multivitamin',
        description: 'Suplemen makanan dengan kandungan Vitamin C dan Vitamin B Kompleks untuk menjaga daya tahan tubuh dan memulihkan kondisi setelah sakit.',
        composition: 'Vitamin C 500mg, Vitamin B1 50mg, Vitamin B2 25mg, Vitamin B6 10mg, Vitamin B12 5mcg',
        dosage: '1 tablet sehari setelah makan.',
        sideEffects: 'Air seni menjadi berwarna kuning cerah (tidak berbahaya).',
        price: '38000',
        requiresPrescription: false,
        minStock: 20,
        categoryId: 3, // Suplemen
        supplierId: 4, // Dexa
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        sku: 'BTR-001',
        name: 'Betadine Antiseptic Solution 15ml',
        description: 'Cairan antiseptik pembunuh kuman pada luka untuk mencegah infeksi. Cocok untuk luka gores, lecet, dan luka bakar ringan.',
        composition: 'Povidone-Iodine 10%',
        dosage: 'Dioleskan pada area luka menggunakan kapas secukupnya beberapa kali sehari.',
        sideEffects: 'Iritasi kulit ringan pada kulit yang sensitif.',
        price: '18500',
        requiresPrescription: false,
        minStock: 40,
        categoryId: 5, // P3K
        supplierId: 3, // Kimia Farma
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ])
  }
}

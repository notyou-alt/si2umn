import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ------------------------------------------------------------------------
  // 1. ROLES
  // ------------------------------------------------------------------------
  await prisma.role.createMany({
    data: [
      { role_name: 'user' },
      { role_name: 'admin' },
      { role_name: 'superadmin' },
    ],
    skipDuplicates: true,
  })
  console.log(`✅ Roles seeded`)

  // Get role IDs (gunakan findFirst karena role_name bukan unique key)
  const roleUser = await prisma.role.findFirst({ where: { role_name: 'user' } })
  const roleAdmin = await prisma.role.findFirst({ where: { role_name: 'admin' } })
  const roleSuperAdmin = await prisma.role.findFirst({ where: { role_name: 'superadmin' } })

  if (!roleUser || !roleAdmin || !roleSuperAdmin) throw new Error('Roles missing')

  // ------------------------------------------------------------------------
  // 2. USERS (1 superadmin, 2 admins, 5 regular users)
  // ------------------------------------------------------------------------
  const usersData = [
    { name: 'Dr. Budi Santoso', email: 'budi.santoso@umn.ac.id', password: 'hashed_super_123', roleId: roleSuperAdmin.id, emailVerified: new Date() },
    { name: 'Prof. Siti Aminah', email: 'siti.aminah@umn.ac.id', password: 'hashed_admin_123', roleId: roleAdmin.id, emailVerified: new Date() },
    { name: 'Dr. Agus Wijaya', email: 'agus.wijaya@umn.ac.id', password: 'hashed_admin_456', roleId: roleAdmin.id, emailVerified: new Date() },
    { name: 'Dr. Rina Kartika', email: 'rina.kartika@umn.ac.id', password: 'hashed_user_123', roleId: roleUser.id, emailVerified: new Date() },
    { name: 'Dr. Hendra Gunawan', email: 'hendra.gunawan@umn.ac.id', password: 'hashed_user_456', roleId: roleUser.id, emailVerified: null },
    { name: 'Dr. Dewi Lestari', email: 'dewi.lestari@umn.ac.id', password: 'hashed_user_789', roleId: roleUser.id, emailVerified: new Date() },
    { name: 'Dr. Bambang Supriyadi', email: 'bambang.supriyadi@umn.ac.id', password: 'hashed_user_012', roleId: roleUser.id, emailVerified: new Date() },
    { name: 'Dr. Lina Marlina', email: 'lina.marlina@umn.ac.id', password: 'hashed_user_345', roleId: roleUser.id, emailVerified: null },
  ]

  for (const user of usersData) {
    await prisma.user.upsert({
      where: { email: user.email! },
      update: {},
      create: user,
    })
  }
  console.log(`✅ Created ${usersData.length} users`)

  // ------------------------------------------------------------------------
  // 3. LECTURERS (linked to regular users)
  // ------------------------------------------------------------------------
  const regularUsers = await prisma.user.findMany({
    where: { roleId: roleUser.id },
    take: 5,
  })

  const lecturersData = [
    {
      userId: regularUsers[0].id,
      specialization: 'Machine Learning, Computer Vision',
      description: 'Expert in deep learning for medical imaging.',
      profile_photo: 'https://example.com/photos/rina.jpg',
      phone_number: '+628123456789',
    },
    {
      userId: regularUsers[1].id,
      specialization: 'Software Engineering, Agile Methods',
      description: 'Research on microservices and DevOps practices.',
      profile_photo: 'https://example.com/photos/hendra.jpg',
      phone_number: '+628234567890',
    },
    {
      userId: regularUsers[2].id,
      specialization: 'Data Mining, Big Data Analytics',
      description: 'Focused on educational data mining.',
      profile_photo: 'https://example.com/photos/dewi.jpg',
      phone_number: '+628345678901',
    },
    {
      userId: regularUsers[3].id,
      specialization: 'Network Security, Cryptography',
      description: 'Blockchain applications in academic records.',
      profile_photo: 'https://example.com/photos/bambang.jpg',
      phone_number: '+628456789012',
    },
    {
      userId: regularUsers[4].id,
      specialization: 'Human-Computer Interaction, UX Design',
      description: 'Designing inclusive digital experiences.',
      profile_photo: 'https://example.com/photos/lina.jpg',
      phone_number: '+628567890123',
    },
  ]

  for (const lecturer of lecturersData) {
    await prisma.lecturer.upsert({
      where: { userId: lecturer.userId },
      update: {},
      create: lecturer,
    })
  }
  console.log(`✅ Created ${lecturersData.length} lecturers`)

  // ------------------------------------------------------------------------
  // 4. SOURCE TYPES
  // ------------------------------------------------------------------------
  await prisma.sourceType.createMany({
    data: [
      { name: 'OpenAlex' },
      { name: 'Scopus' },
      { name: 'Google Scholar' },
      { name: 'Web of Science' },
      { name: 'PubMed' },
    ],
    skipDuplicates: true,
  })
  console.log(`✅ Source types seeded`)

  const openAlex = await prisma.sourceType.findFirst({ where: { name: 'OpenAlex' } })
  const scopus = await prisma.sourceType.findFirst({ where: { name: 'Scopus' } })
  if (!openAlex || !scopus) throw new Error('Source types missing')

  // ------------------------------------------------------------------------
  // 5. PUBLICATIONS (20 realistic titles)
  // ------------------------------------------------------------------------
  const publicationsData = [
    { title: 'Deep Learning for Medical Image Segmentation: A Review', normalized_title: 'deep-learning-medical-image-segmentation-review', year: 2023, doi_raw: '10.1016/j.patcog.2023.01.001', doi_normalized: '10.1016/j.patcog.2023.01.001', abstract: 'Comprehensive review of recent advances...' },
    { title: 'Agile Software Development in Higher Education: Case Study', normalized_title: 'agile-software-development-higher-education-case-study', year: 2022, doi_raw: '10.1109/TE.2022.3141234', doi_normalized: '10.1109/TE.2022.3141234', abstract: 'Experiences from implementing Scrum in capstone projects.' },
    { title: 'Educational Data Mining for Student Performance Prediction', normalized_title: 'educational-data-mining-student-performance-prediction', year: 2024, doi_raw: '10.1016/j.compedu.2023.104789', doi_normalized: '10.1016/j.compedu.2023.104789', abstract: 'Using ensemble methods to predict at-risk students.' },
    { title: 'Blockchain-Based Credential Verification System', normalized_title: 'blockchain-based-credential-verification-system', year: 2023, doi_raw: '10.3390/app13031234', doi_normalized: '10.3390/app13031234', abstract: 'Design and implementation of a decentralized diploma verification.' },
    { title: 'UX Design for Academic Portals: A Usability Study', normalized_title: 'ux-design-academic-portals-usability-study', year: 2021, doi_raw: '10.1145/3456789.3456780', doi_normalized: '10.1145/3456789.3456780', abstract: 'Evaluating user experience of university websites.' },
    { title: 'Machine Learning Approaches for Early Warning Systems', normalized_title: 'machine-learning-early-warning-systems', year: 2022, doi_raw: null, doi_normalized: null, abstract: 'Predictive models for student dropout prevention.' },
    { title: 'Secure Authentication for E-Learning Platforms', normalized_title: 'secure-authentication-e-learning-platforms', year: 2024, doi_raw: '10.1007/s10207-023-00678-9', doi_normalized: '10.1007/s10207-023-00678-9', abstract: 'Multi-factor authentication using biometrics.' },
    { title: 'Natural Language Processing for Automated Essay Scoring', normalized_title: 'natural-language-processing-automated-essay-scoring', year: 2023, doi_raw: '10.18653/v1/2023.acl-long.123', doi_normalized: '10.18653/v1/2023.acl-long.123', abstract: 'BERT-based model for evaluating student essays.' },
    { title: 'Internet of Things in Smart Campus: A Survey', normalized_title: 'internet-things-smart-campus-survey', year: 2022, doi_raw: '10.1109/JIOT.2021.3123456', doi_normalized: '10.1109/JIOT.2021.3123456', abstract: 'Review of IoT applications for campus management.' },
    { title: 'Cloud Computing for Academic Research Workflows', normalized_title: 'cloud-computing-academic-research-workflows', year: 2021, doi_raw: '10.1007/s10586-020-03123-4', doi_normalized: '10.1007/s10586-020-03123-4', abstract: 'Cost-benefit analysis of cloud services.' },
    { title: 'Cybersecurity Challenges in Higher Education', normalized_title: 'cybersecurity-challenges-higher-education', year: 2023, doi_raw: null, doi_normalized: null, abstract: 'Analysis of recent data breaches and mitigation strategies.' },
    { title: 'Big Data Analytics for University Ranking Systems', normalized_title: 'big-data-analytics-university-ranking-systems', year: 2022, doi_raw: '10.1016/j.eswa.2021.115678', doi_normalized: '10.1016/j.eswa.2021.115678', abstract: 'Using big data to improve ranking transparency.' },
    { title: 'Mobile Learning Applications for STEM Education', normalized_title: 'mobile-learning-applications-stem-education', year: 2024, doi_raw: '10.1007/s11423-023-10234-5', doi_normalized: '10.1007/s11423-023-10234-5', abstract: 'Design and evaluation of mobile apps for physics.' },
    { title: 'Ethical Implications of AI in Academic Assessment', normalized_title: 'ethical-implications-ai-academic-assessment', year: 2023, doi_raw: '10.1007/s00146-022-01456-7', doi_normalized: '10.1007/s00146-022-01456-7', abstract: 'Discussion on fairness and transparency.' },
    { title: 'Digital Twins for Campus Infrastructure Management', normalized_title: 'digital-twins-campus-infrastructure-management', year: 2024, doi_raw: null, doi_normalized: null, abstract: 'Simulation of building energy consumption.' },
    { title: 'Gamification in Online Learning: A Meta-Analysis', normalized_title: 'gamification-online-learning-meta-analysis', year: 2022, doi_raw: '10.1016/j.compedu.2021.104432', doi_normalized: '10.1016/j.compedu.2021.104432', abstract: 'Effect sizes of game elements on engagement.' },
    { title: 'Privacy-Preserving Data Sharing in Research Collaborations', normalized_title: 'privacy-preserving-data-sharing-research-collaborations', year: 2023, doi_raw: '10.1007/s10618-022-00876-5', doi_normalized: '10.1007/s10618-022-00876-5', abstract: 'Differential privacy techniques for academic data.' },
    { title: 'Virtual Labs for Computer Science Education', normalized_title: 'virtual-labs-computer-science-education', year: 2021, doi_raw: '10.1145/3434780.3436789', doi_normalized: '10.1145/3434780.3436789', abstract: 'Cloud-based lab environments for networking courses.' },
    { title: 'Learning Analytics Dashboards for Instructors', normalized_title: 'learning-analytics-dashboards-instructors', year: 2024, doi_raw: null, doi_normalized: null, abstract: 'Visualization of student engagement metrics.' },
    { title: 'Open Educational Resources Adoption in Indonesia', normalized_title: 'open-educational-resources-adoption-indonesia', year: 2023, doi_raw: '10.1080/09523987.2022.2151234', doi_normalized: '10.1080/09523987.2022.2151234', abstract: 'Barriers and enablers for OER usage.' },
  ]

  for (const pub of publicationsData) {
    await prisma.publication.upsert({
      where: { normalized_title: pub.normalized_title },
      update: {},
      create: pub,
    })
  }
  console.log(`✅ Created ${publicationsData.length} publications`)

  // Get created publications and lecturers
  const publications = await prisma.publication.findMany()
  const lecturers = await prisma.lecturer.findMany({ include: { user: true } })

  // ------------------------------------------------------------------------
  // 6. PUBLICATION AUTHORS (each pub has 2-5 authors, at least one lecturer)
  // ------------------------------------------------------------------------
  for (const pub of publications) {
    const numAuthors = Math.floor(Math.random() * 4) + 2 // 2-5 authors
    const usedLecturers = new Set()
    const authors = []

    // Ensure at least one lecturer author
    const lecturerAuthor = lecturers[Math.floor(Math.random() * lecturers.length)]
    authors.push({
      publicationId: pub.id,
      lecturerId: lecturerAuthor.id,
      author_name: lecturerAuthor.user.name!,
      author_order: 1,
    })
    usedLecturers.add(lecturerAuthor.id)

    // Fill remaining authors
    for (let i = 2; i <= numAuthors; i++) {
      let lecturerId = null
      let authorName = ''
      if (Math.random() > 0.6 && lecturers.length > usedLecturers.size) {
        let candidate
        do {
          candidate = lecturers[Math.floor(Math.random() * lecturers.length)]
        } while (usedLecturers.has(candidate.id))
        lecturerId = candidate.id
        authorName = candidate.user.name!
        usedLecturers.add(candidate.id)
      } else {
        const externalNames = [
          'Prof. John Smith', 'Dr. Maria Garcia', 'Dr. Wei Zhang', 'Prof. Sarah Johnson',
          'Dr. Ahmed Hassan', 'Prof. Elena Petrova', 'Dr. Carlos Mendoza', 'Prof. Yuki Tanaka'
        ]
        authorName = externalNames[Math.floor(Math.random() * externalNames.length)]
      }
      authors.push({
        publicationId: pub.id,
        lecturerId,
        author_name: authorName,
        author_order: i,
      })
    }

    for (const author of authors) {
      await prisma.publicationAuthor.upsert({
        where: {
          publicationId_author_order: {
            publicationId: author.publicationId,
            author_order: author.author_order,
          },
        },
        update: {},
        create: author,
      })
    }
  }
  console.log(`✅ Created publication authors`)

  // ------------------------------------------------------------------------
  // 7. LECTURER SOURCES & SYNC LOGS
  // ------------------------------------------------------------------------
  for (const lecturer of lecturers) {
    const sourceIds = [openAlex.id, scopus.id]
    const numSources = Math.floor(Math.random() * 2) + 1
    for (let i = 0; i < numSources; i++) {
      const sourceTypeId = sourceIds[i % sourceIds.length]
      const lecturerSource = await prisma.lecturerSource.create({
        data: {
          sourceTypeId,
          lecturerId: lecturer.id,
          external_id: `ext_${lecturer.id}_${Date.now()}_${i}`,
        },
      })

      const numLogs = Math.floor(Math.random() * 3) + 1
      const statuses: ('success' | 'failed' | 'partial')[] = ['success', 'failed', 'partial']
      for (let j = 0; j < numLogs; j++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const started_at = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        const finished_at = status !== 'failed' ? new Date(started_at.getTime() + Math.random() * 60 * 60 * 1000) : null
        await prisma.syncLog.create({
          data: {
            lecturerSourceId: lecturerSource.id,
            status,
            started_at,
            finished_at,
            record_fetched: status !== 'failed' ? Math.floor(Math.random() * 100) : null,
            record_inserted: status === 'success' ? Math.floor(Math.random() * 90) : null,
            error_message: status === 'failed' ? 'Connection timeout' : null,
          },
        })
      }
    }
  }
  console.log(`✅ Created lecturer sources and sync logs`)

  // ------------------------------------------------------------------------
  // 8. NEWS (10 entries, by admin users)
  // ------------------------------------------------------------------------
  const admins = await prisma.user.findMany({ where: { roleId: roleAdmin.id } })
  const superadmin = await prisma.user.findFirst({ where: { roleId: roleSuperAdmin.id } })
  const authorsNews = [...admins, superadmin!]

  const newsData = [
    { title: 'Program Studi Informatika Raih Akreditasi Unggul', slug: 'informatika-akreditasi-unggul', content: 'BAN-PT memberikan akreditasi Unggul untuk program studi Informatika.', createdBy: authorsNews[0].id },
    { title: 'Mahasiswa Berhasil Mengembangkan Aplikasi Deteksi Dini Kanker', slug: 'aplikasi-deteksi-dini-kanker', content: 'Tim mahasiswa berhasil menciptakan aplikasi berbasis AI untuk deteksi dini kanker payudara.', createdBy: authorsNews[1].id },
    { title: 'Kerjasama Internasional dengan University of Melbourne', slug: 'kerjasama-melbourne', content: 'MoU tentang pertukaran mahasiswa dan penelitian bersama.', createdBy: authorsNews[0].id },
    { title: 'Webinar Series: Metodologi Penelitian Terkini', slug: 'webinar-metodologi-penelitian', content: 'Acara rutin setiap Sabtu pukul 10.00 WIB.', createdBy: authorsNews[2]?.id || authorsNews[0].id },
    { title: 'Penerimaan Mahasiswa Baru TA 2024/2025 Dibuka', slug: 'pmb-2024-dibuka', content: 'Pendaftaran online mulai 1 Januari 2024.', createdBy: authorsNews[1].id },
    { title: 'Dosen Informatika Raih Hibah Penelitian Internasional', slug: 'dosen-hibah-internasional', content: 'Dr. Rina Kartika mendapatkan pendanaan dari IEEE.', createdBy: authorsNews[0].id },
    { title: 'Kuliah Umum: Blockchain untuk Pendidikan', slug: 'kuliah-umum-blockchain', content: 'Narasumber dari Binance Academy.', createdBy: authorsNews[2]?.id || authorsNews[0].id },
    { title: 'Lomba Coding Antar Universitas Nasional', slug: 'lomba-coding-nasional', content: 'Pendaftaran ditutup 31 Maret 2024.', createdBy: authorsNews[1].id },
    { title: 'Peluncuran Laboratorium AI & Big Data', slug: 'lab-ai-big-data', content: 'Fasilitas baru untuk penelitian dan praktikum.', createdBy: authorsNews[0].id },
    { title: 'Wisuda Periode Maret 2024', slug: 'wisuda-maret-2024', content: 'Daftar wisudawan dan jadwal acara.', createdBy: authorsNews[2]?.id || authorsNews[0].id },
  ]

  for (const news of newsData) {
    await prisma.news.upsert({
      where: { slug: news.slug },
      update: {},
      create: news,
    })
  }
  console.log(`✅ Created ${newsData.length} news entries`)

  // ------------------------------------------------------------------------
  // 9. DOCUMENT CATEGORIES & DOCUMENTS
  // ------------------------------------------------------------------------
  const categories = [
    { name: 'Pedoman Akademik', desc: 'Buku panduan dan peraturan akademik.' },
    { name: 'Formulir', desc: 'Formulir pendaftaran, perubahan mata kuliah, dll.' },
    { name: 'Materi Kuliah', desc: 'Slide, catatan, dan referensi.' },
    { name: 'Penelitian', desc: 'Laporan penelitian, jurnal internal.' },
    { name: 'Berita Acara', desc: 'Notulen rapat dan acara resmi.' },
  ]

  // Karena categories_name tidak unique, kita cek manual
  for (const cat of categories) {
    const existing = await prisma.documentCategory.findFirst({
      where: { categories_name: cat.name }
    })
    if (!existing) {
      await prisma.documentCategory.create({
        data: { categories_name: cat.name, categories_desc: cat.desc }
      })
    }
  }
  const dbCategories = await prisma.documentCategory.findMany()
  const fileTypes = ['pdf', 'docx', 'pptx', 'xlsx', 'zip']

  for (let i = 0; i < 15; i++) {
    const category = dbCategories[i % dbCategories.length]
    await prisma.document.create({
      data: {
        documentCategoriesId: category.id,
        title: `Dokumen ${i + 1}: ${category.categories_name} - ${new Date().getFullYear()}`,
        description: `Deskripsi dokumen contoh untuk kategori ${category.categories_name}.`,
        file_path: `https://storage.umn.ac.id/documents/${category.categories_name.toLowerCase()}_${i}.pdf`,
        file_type: fileTypes[i % fileTypes.length],
      },
    })
  }
  console.log(`✅ Created ${dbCategories.length} categories and 15 documents`)

  // ------------------------------------------------------------------------
  // 10. SECTIONS & CONTENTS (CMS)
  // ------------------------------------------------------------------------
  const sectionsData = [
    { name: 'Hero Banner', type: 'single' as const },
    { name: 'Program Studi', type: 'list' as const },
    { name: 'Fasilitas Kampus', type: 'list' as const },
    { name: 'Testimoni Alumni', type: 'content' as const },
    { name: 'Visi Misi', type: 'single' as const },
  ]

  for (const section of sectionsData) {
    await prisma.section.create({ data: section })
  }
  const sections = await prisma.section.findMany()

  const contentsData = [
    { sectionId: sections[0].id, title: 'Selamat Datang di SI UMN', content: 'Program Studi Informatika Universitas Multimedia Nusantara.', order_no: 1 },
    { sectionId: sections[1].id, title: 'Informatika', content: 'Fokus pada pengembangan perangkat lunak dan kecerdasan buatan.', order_no: 1 },
    { sectionId: sections[1].id, title: 'Sistem Informasi', content: 'Integrasi bisnis dan teknologi informasi.', order_no: 2 },
    { sectionId: sections[1].id, title: 'Teknik Komputer', content: 'Perangkat keras dan embedded systems.', order_no: 3 },
    { sectionId: sections[2].id, title: 'Laboratorium Komputer', content: 'Lab dengan spesifikasi tinggi untuk praktikum.', order_no: 1 },
    { sectionId: sections[2].id, title: 'Perpustakaan Digital', content: 'Akses ke jurnal internasional dan e-book.', order_no: 2 },
    { sectionId: sections[2].id, title: 'Ruang Kolaborasi', content: 'Area diskusi dan proyek kelompok.', order_no: 3 },
    { sectionId: sections[3].id, title: 'Andi Wijaya - Backend Engineer Gojek', content: 'Ilmu dari SI UMN sangat aplikatif di dunia kerja.', order_no: 1 },
    { sectionId: sections[3].id, title: 'Sari Dewi - Data Scientist Tokopedia', content: 'Dosen-dosennya sangat inspiratif.', order_no: 2 },
    { sectionId: sections[4].id, title: 'Visi', content: 'Menjadi program studi unggulan di bidang informatika tingkat nasional dan internasional.', order_no: 1 },
    { sectionId: sections[4].id, title: 'Misi', content: '1. Menyelenggarakan pendidikan berkualitas.\n2. Melakukan penelitian inovatif.\n3. Mengabdi kepada masyarakat.', order_no: 2 },
  ]

  for (const content of contentsData) {
    await prisma.content.create({ data: content })
  }
  console.log(`✅ Created ${sections.length} sections and ${contentsData.length} contents`)

  // ------------------------------------------------------------------------
  // 11. CURRICULUM TYPES & COURSES
  // ------------------------------------------------------------------------
  await prisma.curriculumType.createMany({
    data: [
      { course_type_name: 'compulsory' },
      { course_type_name: 'specialization' },
      { course_type_name: 'elective' },
    ],
    skipDuplicates: true,
  })
  const compulsory = await prisma.curriculumType.findFirst({ where: { course_type_name: 'compulsory' } })
  const specialization = await prisma.curriculumType.findFirst({ where: { course_type_name: 'specialization' } })
  const elective = await prisma.curriculumType.findFirst({ where: { course_type_name: 'elective' } })
  if (!compulsory || !specialization || !elective) throw new Error('Curriculum types missing')

  const courses = [
    { course_id: 'IS101', course_name: 'Algoritma dan Pemrograman', courseTypeId: compulsory.id, lecture_credit: 3, lab_credit: 1, ects: 6, notes: 'Prasyarat: tidak ada' },
    { course_id: 'IS102', course_name: 'Struktur Data', courseTypeId: compulsory.id, lecture_credit: 3, lab_credit: 1, ects: 6, notes: 'Prasyarat: Algoritma' },
    { course_id: 'IS103', course_name: 'Basis Data', courseTypeId: compulsory.id, lecture_credit: 2, lab_credit: 2, ects: 6, notes: '' },
    { course_id: 'IS201', course_name: 'Pemrograman Web', courseTypeId: specialization.id, lecture_credit: 2, lab_credit: 1, ects: 5, notes: '' },
    { course_id: 'IS202', course_name: 'Machine Learning', courseTypeId: specialization.id, lecture_credit: 3, lab_credit: 1, ects: 6, notes: 'Prasyarat: Statistika' },
    { course_id: 'IS203', course_name: 'Jaringan Komputer', courseTypeId: compulsory.id, lecture_credit: 2, lab_credit: 1, ects: 5, notes: '' },
    { course_id: 'IS301', course_name: 'Mobile Programming', courseTypeId: specialization.id, lecture_credit: 2, lab_credit: 2, ects: 6, notes: '' },
    { course_id: 'IS302', course_name: 'Keamanan Informasi', courseTypeId: specialization.id, lecture_credit: 3, lab_credit: 0, ects: 5, notes: '' },
    { course_id: 'IS401', course_name: 'Pengolahan Citra Digital', courseTypeId: elective.id, lecture_credit: 2, lab_credit: 1, ects: 5, notes: '' },
    { course_id: 'IS402', course_name: 'Technopreneurship', courseTypeId: elective.id, lecture_credit: 2, lab_credit: 0, ects: 4, notes: '' },
    { course_id: 'IS403', course_name: 'Cloud Computing', courseTypeId: specialization.id, lecture_credit: 2, lab_credit: 1, ects: 5, notes: '' },
    { course_id: 'IS404', course_name: 'DevOps', courseTypeId: elective.id, lecture_credit: 2, lab_credit: 1, ects: 5, notes: '' },
    { course_id: 'IS405', course_name: 'Natural Language Processing', courseTypeId: specialization.id, lecture_credit: 3, lab_credit: 0, ects: 6, notes: '' },
    { course_id: 'IS406', course_name: 'Riset Operasi', courseTypeId: compulsory.id, lecture_credit: 2, lab_credit: 0, ects: 4, notes: '' },
    { course_id: 'IS407', course_name: 'Pemrograman Fungsional', courseTypeId: elective.id, lecture_credit: 2, lab_credit: 1, ects: 5, notes: '' },
    { course_id: 'IS408', course_name: 'Game Development', courseTypeId: specialization.id, lecture_credit: 2, lab_credit: 2, ects: 6, notes: '' },
    { course_id: 'IS409', course_name: 'Sistem Tertanam', courseTypeId: specialization.id, lecture_credit: 2, lab_credit: 1, ects: 5, notes: '' },
    { course_id: 'IS410', course_name: 'Big Data Analytics', courseTypeId: specialization.id, lecture_credit: 3, lab_credit: 1, ects: 6, notes: '' },
  ]

  for (const course of courses) {
    await prisma.curriculum.create({ data: course })
  }
  console.log(`✅ Created ${courses.length} curriculum courses`)

  // ------------------------------------------------------------------------
  // 12. FAQ (10 items, mix of statuses)
  // ------------------------------------------------------------------------
  const faqs = [
    { question: 'Bagaimana cara mendaftar sebagai mahasiswa baru?', answer: 'Kunjungi laman pmb.umn.ac.id dan ikuti prosedur pendaftaran online.', status: 'published' as const },
    { question: 'Apakah program studi Informatika terakreditasi?', answer: 'Ya, terakreditasi Unggul dari BAN-PT.', status: 'published' as const },
    { question: 'Kapan jadwal perkuliahan semester ganjil?', answer: 'Jadwal dapat diakses di SIAKAD setelah registrasi.', status: 'published' as const },
    { question: 'Bagaimana cara mengajukan cuti akademik?', answer: 'Isi formulir cuti di bagian akademik dan serahkan ke dosen wali.', status: 'published' as const },
    { question: 'Apakah ada beasiswa untuk mahasiswa berprestasi?', answer: 'Ada, informasi beasiswa diumumkan setiap awal semester.', status: 'draft' as const },
    { question: 'Bagaimana cara mengakses jurnal internasional?', answer: 'Gunakan VPN kampus untuk mengakses langganan perpustakaan.', status: 'published' as const },
    { question: 'Kapan batas akhir pengisian KRS?', answer: 'Minggu kedua setelah perkuliahan dimulai.', status: 'archived' as const },
    { question: 'Apakah mahasiswa dapat mengambil mata kuliah di prodi lain?', answer: 'Ya, dengan persetujuan dosen wali dan prodi terkait.', status: 'published' as const },
    { question: 'Bagaimana prosedur sidang skripsi?', answer: 'Ajukan judul ke koordinator skripsi, lalu ikuti tahapan bimbingan.', status: 'published' as const },
    { question: 'Apakah ada program pertukaran pelajar?', answer: 'Ya, kerjasama dengan universitas di Asia dan Eropa.', status: 'draft' as const },
  ]

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq })
  }
  console.log(`✅ Created ${faqs.length} FAQs`)

  // ------------------------------------------------------------------------
  // 13. TESTIMONIES (8 items, mix of statuses)
  // ------------------------------------------------------------------------
  const testimonies = [
    { sender_name: 'Rizki Fauzi', sender_position: 'Software Engineer, Gojek', photo: 'https://example.com/testi/rizki.jpg', full_testimony: 'SI UMN memberikan fondasi yang kuat untuk karir saya di tech industry.', date: new Date('2023-06-15'), status: 'published' as const },
    { sender_name: 'Maya Sari', sender_position: 'Data Analyst, Tokopedia', photo: 'https://example.com/testi/maya.jpg', full_testimony: 'Dosen-dosen sangat mendukung dan kurikulum selalu update dengan tren industri.', date: new Date('2023-08-20'), status: 'published' as const },
    { sender_name: 'Budi Hartono', sender_position: 'Product Manager, Traveloka', photo: null, full_testimony: 'Pengalaman magang yang difasilitasi kampus sangat membantu.', date: new Date('2023-10-10'), status: 'published' as const },
    { sender_name: 'Lina Wijaya', sender_position: 'Fresh Graduate', photo: null, full_testimony: 'Fasilitas lab dan perpustakaan sangat lengkap.', date: new Date('2024-01-05'), status: 'draft' as const },
    { sender_name: 'Ahmad Zaki', sender_position: 'CTO, Startup EdTech', photo: 'https://example.com/testi/zaki.jpg', full_testimony: 'Saya merekomendasikan SI UMN untuk calon mahasiswa yang ingin mendalami IT.', date: new Date('2023-12-01'), status: 'published' as const },
    { sender_name: 'Siska Nurhayati', sender_position: 'Researcher, LIPI', photo: null, full_testimony: 'Lingkungan akademik yang kondusif untuk penelitian.', date: new Date('2023-09-17'), status: 'archived' as const },
    { sender_name: 'Deni Suhendar', sender_position: 'IT Consultant, Accenture', photo: 'https://example.com/testi/deni.jpg', full_testimony: 'Soft skill dan hard skill seimbang diajarkan.', date: new Date('2024-02-28'), status: 'published' as const },
    { sender_name: 'Putri Amelia', sender_position: 'System Analyst, Bank Mandiri', photo: null, full_testimony: 'Alumni SI UMN sangat diterima di dunia kerja.', date: new Date('2023-11-11'), status: 'draft' as const },
  ]

  for (const testimony of testimonies) {
    await prisma.testimony.create({ data: testimony })
  }
  console.log(`✅ Created ${testimonies.length} testimonies`)

  // ------------------------------------------------------------------------
  // 14. AUTH LOGS (10 entries)
  // ------------------------------------------------------------------------
  const allUsers = await prisma.user.findMany()
  const authEvents = ['login_success', 'login_failed_wrong_password', 'login_failed_user_not_found', 'register_success', 'logout']
  for (let i = 0; i < 10; i++) {
    const user = allUsers[Math.floor(Math.random() * allUsers.length)]
    const event = authEvents[Math.floor(Math.random() * authEvents.length)]
    await prisma.authLog.create({
      data: {
        userId: user.id,
        email: user.email!,
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        event,
        created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      },
    })
  }
  console.log(`✅ Created 10 auth logs`)

  // ------------------------------------------------------------------------
  // 15. ACTIVITY LOGS (10 entries, admin actions)
  // ------------------------------------------------------------------------
  const adminUsers = await prisma.user.findMany({ where: { roleId: roleAdmin.id } })
  const superAdminUser = await prisma.user.findFirst({ where: { roleId: roleSuperAdmin.id } })
  const actors = [...adminUsers, superAdminUser!]

  const actions = ['create_news', 'update_news', 'delete_news', 'create_user', 'update_user', 'update_lecturer', 'sync_publications']
  for (let i = 0; i < 10; i++) {
    const actor = actors[Math.floor(Math.random() * actors.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    await prisma.activityLog.create({
      data: {
        userId: actor.id,
        action,
        target: JSON.stringify({ description: `Performed ${action} at ${new Date().toISOString()}` }),
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    })
  }
  console.log(`✅ Created 10 activity logs`)

  console.log('🌱 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
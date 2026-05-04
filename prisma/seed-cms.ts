// prisma/seed-cms.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type PrismaTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

async function clearSections(tx: PrismaTransaction = prisma) {
  await tx.content.deleteMany();
  await tx.section.deleteMany();
}

async function seedSections(tx: PrismaTransaction = prisma) {
  const sections = [
    { id: 'sec_hero', name: 'hero', type: 'single' },
    { id: 'sec_program_features', name: 'program_features', type: 'list' },
    { id: 'sec_specialization_overview', name: 'specialization_overview', type: 'single' },
    { id: 'sec_vision_mission', name: 'vision_mission', type: 'content' },
    { id: 'sec_history', name: 'history', type: 'list' },
    { id: 'sec_graduate_profiles', name: 'graduate_profiles', type: 'list' },
    { id: 'sec_elo', name: 'elo', type: 'list' },
    { id: 'sec_career_prospect', name: 'career_prospect', type: 'single' },
    { id: 'sec_partners', name: 'partners', type: 'list' },
    { id: 'sec_admission_requirements', name: 'admission_requirements', type: 'content' },
    { id: 'sec_specialization_list', name: 'specialization_list', type: 'list' },
    { id: 'sec_training_certification', name: 'training_certification', type: 'list' },
    { id: 'sec_facilities', name: 'facilities', type: 'list' },
    { id: 'sec_buttons', name: 'buttons', type: 'list' },
  ] as const;

  for (const sec of sections) {
    await tx.section.create({ data: sec });
  }
}

async function seedContents(tx: PrismaTransaction = prisma) {
  const IMAGE = 'placeholder_image.webp';

  const createContent = async (
    sectionId: string,
    order_no: number,
    title: string | null,
    content: string | null,
    image: string | null = null
  ) => {
    await tx.content.create({
      data: { sectionId, order_no, title, content, image },
    });
  };

  // ===== hero =====
  await createContent(
    'sec_hero', 1,
    'Welcome to the Information System Study Program, Universitas Multimedia Nusantara',
    'The objective of our study program is to produce graduates who are able to analyze, design, implement, and manage big data-based information systems. Furthermore, our curriculum also has been designed to be truly aligned to the demands of the industry.',
    IMAGE
  );

  // ===== program_features =====
  await createContent('sec_program_features', 1, 'Career Prospect',
    'Information System Specialist, Data Scientist, Data Analyst, Business Intelligence Developer, Database Developer, Database Administration, ERP Consultant, ERP System Developer, Researcher, Technopreneur, Academia', IMAGE);
  await createContent('sec_program_features', 2, 'Advanced Study',
    'Graduates of the Information System Study Program can pursue master\'s degrees in a variety fields of Information Technology or Computer Science.', IMAGE);
  await createContent('sec_program_features', 3, 'Superiority',
    'To produce graduates capable of analyzing, designing, implementing, and managing data-based information systems that meet business needs as well as support future decision-making for an organization\'s strategic development plan', IMAGE);
  await createContent('sec_program_features', 4, 'Requirements',
    'High School graduates majoring in Science and Social Sciences , Vocational High School graduates majoring in Computer Engineering, Informatics Engineering, Computer and Network Engineering.', IMAGE);

  // ===== specialization_overview =====
  await createContent('sec_specialization_overview', 1, 'Specialization Track',
    'Information System Study Program offers three specialization tracks from which students can choose in semester 3 and 4 based on their preferences', null);

  // ===== vision_mission =====
  await createContent('sec_vision_mission', 1, 'Mission',
    '1. Organizing a quality learning process supported by professional teaching staff and an up-to-date curriculum to produce graduates who are competent in analysis, design, implementation, and management of big data-based information systems, have an entrepreneurial spirit, noble character, and international insight.\n2. Carrying out international standards research programs in collaboration with various, disciplines and industries related to big data-based information systems.\n3. Carrying out community service activities that provide appropriate contributions in the field of big data-based information systems.', null);
  await createContent('sec_vision_mission', 2, 'Vision',
    'Becoming an excellent Information Systems Undergraduate Study Program that produce graduates who are competent in the field of analysis, design, implementation, and management of big data-based information systems, have an entrepreneurial spirit, noble character, and international insight.', null);

  // ===== history =====
  await createContent('sec_history', 1, '2006',
    'Universitas Multimedia Nusantara which was founded by Kompas Gramedia. On 20 November 2006, the existence of UMN was announced (officially) at Hotel Santika by Dr. Ir Dodi Nandika, Secretary General of the Ministry of National Education. The inaugural lecture for the first batch was held on September 3, 2007, with the theme “Development of Human Resources for the ICT Era.” In order to make the inaugural lecture a success, UMN invited guest lecturers such as Prof. Dr. Ir. Mohamad Nuh (Minister of Communication and Information), Dr(Hc) Jakob Oetama (Founder of Kompas Gramedia), Roy Suryo (Telematics expert), Dra. Puspita Zorawar, M.PsiT (Communication and Psychology Specialist).', IMAGE);
  await createContent('sec_history', 2, '2009',
    'In 2009, the Information Systems Study Program added a new interest under the name Oracle Database System which studies database design, maintenance, performance tuning and database security. In collaboration with Oracle Academy, students are fully equipped to become a reliable database administrator or database developer. The Information Systems Study Program started the first batch of new specializations that have names (IT Governance, IS Audit), students study IT governance standards with the COBIT Standard version 5, which covers two major aspects, namely IT management and governance. This standard is becoming increasingly important with more and more companies owning IT systems, and regulations governing auditing of corporate IT governance are also increasing, both in Indonesia and globally.', IMAGE);
  await createContent('sec_history', 3, '2017',
    'Since the 2020/2021 academic year, the Information Systems study program uses the outcome based education (OBE) curriculum, then by the government regulations, in 2021 the curriculum was revised and updated to become an “Merdeka Belajar Kampus Merdeka” (MBKM) curriculum so that starting in the 2021/2022 academic year, the Information Systems study program implement the MBKM curriculum.', IMAGE);

  // ===== graduate_profiles =====
  await createContent('sec_graduate_profiles', 1, 'GP01 (IS Enabler)', 'Graduates have the ability to analyze, design, create, and evaluate information systems that are aligned with the organizational goals.', null);
  await createContent('sec_graduate_profiles', 2, 'GP02 (IS Solution)', 'Graduates have the ability to understand, implement, and integrate the system models, use various methods and techniques of business process improvement that bring value to the organization.', null);
  await createContent('sec_graduate_profiles', 3, 'GP03 (Data Analytics)', 'Graduates have the ability to extract, investigate and interpret data so that it becomes valuable and easy-to-understand information.', null);
  await createContent('sec_graduate_profiles', 4, 'GP04 (Technopreneurship)', 'Graduates have the ability to collaborate with various disciplines to produce a business idea related to the latest information technology.', null);

  // ===== elo =====
  const eloItems: [string, string][] = [
    ['A - Data Expertise', 'Have the ability to identify, process, present, and interpret data to produce valuable and easy-to-understand information'],
    ['B - Analytical Thinking', 'Able to understand and use various system development methodologies along with system modeling tools and analyze user needs in building information systems to achieve organizational goals'],
    ['C - Decision Making', 'Able to understand, analyze, and assess the basic concepts and role of information systems in managing data and providing decision-making recommendation on organizational system processes'],
    ['D - Design Skill', 'Able to understand, design, and use database management systems, as well as process and analyze data with data processing tools and techniques'],
    ['E - Ethical Skill', 'Able to understand and apply the code of ethics in the use of information and data in the design, implementation and use of a system'],
    ['F - Professional Skill', 'Have the ability to perform independently, be qualified, and be measureable.'],
    ['G - Entrepreneur Skill', 'Able to understand the basic of business and business management, also develop business ideas related to information technology'],
    ['H - Communication Skill', 'Have the ability to communicate well and to cooperate in groups also able to supervise and evaluate the performance of his group'],
    ['I - Teamwork', 'Have the ability to work together in teams to achieve common goals and can evaluate team performances'],
    ['J - Lifelong Learning', 'Have the awareness to update the knowledge throughout life continuously'],
  ];
  for (let i = 0; i < eloItems.length; i++) {
    await createContent('sec_elo', i + 1, eloItems[i][0], eloItems[i][1], null);
  }

  // ===== career_prospect =====
  await createContent('sec_career_prospect', 1, 'Career Prospect',
    'Information System graduates possess a diverse range of soft and hard skills, which opens numerous career prospects in the field of information systems. These potential career opportunities encompass a range of positions, including (but are not limited to) roles such as information system specialist, data scientist, data analyst, business intelligence developer, database developer, database administrator, ERP consultant, ERP system developer, researcher, technopreneur, or academia.', null);

  // ===== partners =====
  await createContent('sec_partners', 1, 'SAP VICTORIA',
    'We collaborate with SAP Victoria University to provide learning material and SAP platform for students in specialization track of ERP specialist.', IMAGE);
  await createContent('sec_partners', 2, 'Oracle Academy',
    'We collaborate with the oracle academy to provide learning material for students in specialization track of database specialist.', IMAGE);
  await createContent('sec_partners', 3, 'Cybertrend Data',
    'We collaborate with Cybertrend Data Academy to provide learning material and international certification program for students especially for data modeling certification and data visualization certification.', IMAGE);

  // ===== admission_requirements =====
  await createContent('sec_admission_requirements', 1, 'Application Channels',
    'Academic channel, where students are filtered based on their high school report card with particular emphasis on specific subjects, according to the programme they apply to.\nScholarship channel. Applicants are filtered based on their high school achievements, ranging from academic to non-academic achievements.\nRegular test channel. Applicants take part in written tests according to the programme they apply to and are awarded admission upon passing.\nRegular and Scholarship test channel. Applicants take part in written tests according to the programme they are applying to and are awarded admission and scholarship based on the test score.', null);
  await createContent('sec_admission_requirements', 2, 'Specific Application Requirements',
    'The specific requirements help us ensure the applicants possess sufficient basic knowledge to follow the curriculum and graduate on time.\nSchool origin: High School (SMA) graduates of natural science (IPA) track and social science (IPS) track\nEmphasised subjects in school report: English, Mathematics, IT\nWritten test subjects (scholarship): English, Logics, Basic Mathematics and Statistics', null);

  // ===== specialization_list =====
  await createContent('sec_specialization_list', 1, 'Database Specialist',
    'This specialization track explores database design, maintenance, performance tuning, and database security. In collaboration with Oracle Academy, students are fully equipped to become reliable database administrators or database developers.\nCareer Prospect: Database Administrator, Database Developer', IMAGE);
  await createContent('sec_specialization_list', 2, 'Big Data Analytics',
    'This specialization track provides students with more in-depth knowledge in the field of big data analytics, preparing them to enter the data science industry.\nCareer Prospect: Data Analyst, Data Scientist, Business Intelligence Developer', IMAGE);
  await createContent('sec_specialization_list', 3, 'Enterprise Resource Planning (ERP) Specialist',
    'In collaboration with the SAP University Alliance this specialization track provides students with more complete business process knowledge using the SAP platform.\nCareer Prospect: ERP Consultant, ERP System Developer', IMAGE);

  // ===== training_certification =====
  await createContent('sec_training_certification', 1, 'Certified International Specialist Data Modelling (CISDM)',
    'By collaborating with Cybertrend Data Academy (https://dataacademy.co.id/) we facilitate students and lecturers, especially the Information Systems Study Program, to take certification in the field of data modelling. Certified International Specialist Data Modelling (CISDM) is a training and certification program that focuses on how data is created and then processed using algorithms to identify patterns in the data. Algorithms are patterns that allow us to understand the data model and develop it to make predictions for the future. This program aims to ensure the quality and competency of novice Data Scientists so that they can contribute value to data modeling through data mining approaches.', IMAGE);
  await createContent('sec_training_certification', 2, 'Certified International Specialist Data Visualization (CISDV)',
    'By collaborating with Cybertrend Data Academy (https://dataacademy.co.id/) we facilitate students and lecturers, especially the Information Systems Study Program, to take certification in the field of data visualization. Certified International Specialist Data Visualization (CISDV) is a training and certification program that aims to ensure the quality and competency of Data Analysts so that they can provide added value by properly analyzing and visualizing their data in accordance with the data visualization concept.in terms of how to analyze and visualize their data effectively in accordance with the data visualization concept.', IMAGE);

  // ===== facilities =====
  await createContent('sec_facilities', 1, 'Big Data Laboratory',
    'The IS Study Programme has a specific laboratory namely Lab Big Data whose utilization is devoted to lecturer research activities, students research, and or lecturer workshops. Lab Big Data has 1 computer server with high level specifications, 3 personal computers windows-based, 1 personal computers mac-based, 1 big monitor, 3 LED monitor. Lab Big Data is provided as a medium to improve and develop practical skills of lecturers and students in research, especially research related to data science.\nFor anyone who wants to use the Big Data Lab, they can make a request for scheduling through the portal gapura.umn.ac.id, or directly contact the Lab Big Data coordinator using this link Form Big Data Lab(C503). Before applying to use Lab Big Data, you can read the Standard Operational Procedure (SOP) first.', IMAGE);
  await createContent('sec_facilities', 2, 'The general computer lab',
    'used for teaching and learning activities that requires hands-on activities. These activities are broadly divided into two parts, namely:\nLearning activities related to practical courses.\nThis activities are regular and scheduled every semester. IS Studi Program has 14 compulsory courses with practicum classes where each practicum class requires software that can be used by students in working on practicum modules. To support lab modules, IS study program uses several licensed software such as SAP for courses related to ERP, Oracle for courses related to Database, and Tableau for courses related to Big Data.\nAdditional activities related to training, workshops, and or community service\nThis activities are unscheduled as they related to additional needs and or individual needs.', IMAGE);
  await createContent('sec_facilities', 3, 'Academic Tutors',
    'Information Systems students frequently hold some tutorials to support student learning, especially for some courses that are considered difficult for students, namely practical courses such as Algorithm and Data Structure, Data Analysis and Database Systems, Probability and Statistic, etc. This additional learning system will be taught by more senior students who have completed courses related to good grades so that they can be taught again to students at lower levels.', IMAGE);
  await createContent('sec_facilities', 4, 'HIMSI (STUDENT ORGANIZATION)',
    'The Alumni Family of Universitas Multimedia Nusantara, known as KAMI UMN (Keluarga Alumni Universitas Multimedia Nusantara), was officially established on February 23, 2013. Initiated by UMN, this organization was formed to unite its graduates both across Indonesia and abroad. KAMI UMN aims to strengthen connections among alumni as well as between alumni and their alma mater. Demonstrating its commitment, KAMI UMN was formally registered as an organization on February 24, 2015, with its founding deed signed by Bonaventura Aditya, the first Chairman of KAMI UMN.\n\nKAMI UMN consistently organizes various activities to empower alumni by enhancing their competencies, expanding professional networks, and encouraging meaningful contributions. Key programs include KAMI Skill Update and KAMI Industrial Insight, which focus on professional development. Networking is fostered through alumni gatherings and reunions, while the dissemination of newsletters and bulletins provides updates on UMN and its alumni activities. Alumni are also encouraged to contribute through activities such as Alumni Sharing, offering scholarships to underprivileged students, and engaging in other impactful initiatives.', IMAGE);
  await createContent('sec_facilities', 5, 'KAMIUMN (ALUMNI ASSOCIATION)',
    'The Alumni Family of Universitas Multimedia Nusantara, known as KAMI UMN (Keluarga Alumni Universitas Multimedia Nusantara), was officially established on February 23, 2013. Initiated by UMN, this organization was formed to unite its graduates both across Indonesia and abroad. KAMI UMN aims to strengthen connections among alumni as well as between alumni and their alma mater. Demonstrating its commitment, KAMI UMN was formally registered as an organization on February 24, 2015, with its founding deed signed by Bonaventura Aditya, the first Chairman of KAMI UMN.\n\nKAMI UMN consistently organizes various activities to empower alumni by enhancing their competencies, expanding professional networks, and encouraging meaningful contributions. Key programs include KAMI Skill Update and KAMI Industrial Insight, which focus on professional development. Networking is fostered through alumni gatherings and reunions, while the dissemination of newsletters and bulletins provides updates on UMN and its alumni activities. Alumni are also encouraged to contribute through activities such as Alumni Sharing, offering scholarships to underprivileged students, and engaging in other impactful initiatives.', IMAGE);

  // ===== 🆕 BUTTONS (list) =====
  const buttonData = [
    { title: 'ERP',              desc: 'tombol ERP',      link: 'https://www.umn.ac.id/sistem-informasi-umn-cocok-buat-kamu-yang-suka-teknologi-dan-bisnis/' },
    { title: 'Database',         desc: 'tombol database',  link: 'https://www.umn.ac.id/sistem-informasi-umn-cocok-buat-kamu-yang-suka-teknologi-dan-bisnis/' },
    { title: 'Big Data',         desc: 'tombol Big Data',  link: 'https://www.umn.ac.id/sistem-informasi-umn-cocok-buat-kamu-yang-suka-teknologi-dan-bisnis/' },
    { title: 'HIMSI',            desc: 'menuju halaman HIMSI',  link: 'https://www.umn.ac.id/sistem-informasi-umn-cocok-buat-kamu-yang-suka-teknologi-dan-bisnis/' },
    { title: 'KAMIUMN',          desc: 'menuju halaman KAMIUMN', link: 'https://www.umn.ac.id/sistem-informasi-umn-cocok-buat-kamu-yang-suka-teknologi-dan-bisnis/' },
  ];

  for (let i = 0; i < buttonData.length; i++) {
    const btn = buttonData[i];
    const jsonContent = JSON.stringify({ desc: btn.desc, link: btn.link });
    await createContent('sec_buttons', i + 1, btn.title, jsonContent, null);
  }
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
export async function seedCMS() {
  console.log('🌱 Seeding CMS data...');

  await prisma.$transaction(async (tx) => {
    console.log('🧹 Clearing existing CMS sections & contents...');
    await clearSections(tx);

    console.log('📦 Inserting sections...');
    await seedSections(tx);

    console.log('📝 Inserting contents...');
    await seedContents(tx);
  });

  console.log('✅ CMS seed completed successfully.');
}

// Jalankan langsung jika sebagai script utama
seedCMS()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
/* ============================================================================
 * SPIST — Single source of truth for site content.
 *
 * Everything the site renders lives here as plain arrays/objects so it can be
 * swapped for CMS/API data later without touching component code.
 *
 * PLACEHOLDER content is marked with `// PLACEHOLDER` — replace with the real
 * institutional copy when it is supplied.
 * ==========================================================================*/

/* ---------------------------------------------------------------------------
 * Institution details
 * ------------------------------------------------------------------------ */
export const institution = {
  name: 'South Punjab Institute of Science & Technology',
  shortName: 'SPIST',
  city: 'Dera Ghazi Khan',
  tagline: 'Wa la ghaliba illallah — There is no victor but Allah',
  established: 2014, // PLACEHOLDER — confirm the founding year
  logo: '/logo/spist_logo.png',
  address: 'South Punjab Institute of Science & Technology, Dera Ghazi Khan, Punjab, Pakistan',
  phones: ['0330-1624002', '064-2406370'],
  email: 'spistdgkhan@gmail.com',
  social: {
    facebook: 'https://facebook.com/', // PLACEHOLDER — official page URL
    whatsapp: 'https://wa.me/923301624002',
  },
  portalUrl: '#', // PLACEHOLDER — student portal / LMS URL
};

/* ---------------------------------------------------------------------------
 * NAVIGATION
 *
 * Edit ORDER and LABELS here — the desktop mega-menu, the mobile accordion
 * drawer and the footer "Quick Links" column all read from this one array.
 *
 * Shape:
 *   { label, href }                          → plain link
 *   { label, href, children: [...] }         → level-2 dropdown panel
 *   { label, children: [...] }  (inside)     → level-3 nested flyout  (»)
 * ------------------------------------------------------------------------ */
export const navigation = [
  { label: 'Home', href: '/' },

  {
    label: 'Discover SPIST',
    href: '/discover/overview',
    children: [
      { label: 'Overview', href: '/discover/overview' },
      { label: "Chairperson's Message", href: '/discover/chairpersons-message' },
      { label: 'Mission Statement', href: '/discover/mission' },
      { label: 'Vision Statement', href: '/discover/vision' },
      {
        label: 'Offices',
        children: [
          { label: "Dean's Office", href: '/discover/offices/deans-office' },
          { label: 'Directorate of Student Affairs (DSA)', href: '/dsa' },
          { label: 'Treasurer Office', href: '/treasurer' },
          { label: 'Examination Department', href: '/examination' },
          { label: 'Library', href: '/library' },
        ],
      },
    ],
  },

  {
    label: 'Admissions',
    href: '/admissions/online',
    children: [
      { label: 'Online Admission', href: '/admissions/online' },
      { label: 'Fee Structure', href: '/admissions/fee-structure' },
      { label: 'Six-Month Diploma Programs', href: '/admissions/diploma-programs' },
      { label: 'Three-Month Certificate Courses', href: '/admissions/certificate-courses' },
      { label: 'Rules & Regulations', href: '/admissions/rules-and-regulations' },
    ],
  },

  {
    label: 'Academic',
    href: '/academic',
    children: [
      {
        label: 'Faculty of Pure and Applied Sciences',
        children: [
          { label: 'Department of Chemistry', href: '/academic/chemistry' },
          { label: 'Department of Computer Science', href: '/academic/computer-science' },
        ],
      },
      { label: 'Faculty of Arts and Social Sciences', href: '/academic/arts-and-social-sciences' },
      {
        label: 'Faculty of Languages',
        children: [{ label: 'Department of English', href: '/academic/english' }],
      },
      { label: 'Diploma & Certificate Programs', href: '/academic/short-courses' },
    ],
  },

  { label: 'ORIC', href: '/oric', title: 'Office of Research, Innovation & Commercialization' },
  { label: 'QEC', href: '/qec', title: 'Quality Enhancement Cell' },
  { label: 'Examination', href: '/examination' },
  { label: 'DSA', href: '/dsa', title: 'Directorate of Student Affairs' },
  { label: 'Treasurer', href: '/treasurer' },
  { label: 'Library', href: '/library' },
  { label: 'Students', href: '/students' },
  { label: 'Contact Us', href: '/contact' },
];

/* ---------------------------------------------------------------------------
 * HERO SLIDER
 * `image` is intentionally null — the slide falls back to a branded gradient.
 * Drop a file in /public/images and set image: '/images/your-photo.jpg'.
 * ------------------------------------------------------------------------ */
export const heroSlides = [
  {
    id: 'excellence',
    eyebrow: 'Welcome to SPIST, D.G. Khan',
    title: 'Excellence in Education',
    text: 'High teaching standards and innovative, learner-centred methods that prepare students for a competitive world.',
    cta: { label: 'Online Admission Form', href: '/admissions/online' },
    image: null,
    theme: 'green',
  },
  {
    id: 'fees',
    eyebrow: 'Accessible Higher Education',
    title: 'Affordable Fee Structure',
    text: 'Quality degree, diploma and certificate programs at a fee designed to keep higher education within reach.',
    cta: { label: 'Contact Us', href: '/contact' },
    image: null,
    theme: 'deep',
  },
  {
    id: 'faculty',
    eyebrow: 'Our People',
    title: 'Highly Trained Faculty',
    text: 'Qualified, experienced teachers from leading universities mentoring every student through their degree.',
    cta: { label: 'View Faculty', href: '/academic' },
    image: null,
    theme: 'maroon',
  },
  {
    id: 'beyond',
    eyebrow: 'Student Life',
    title: 'Beyond the Classroom',
    text: 'Sports, societies, seminars and co-curricular activities that build confidence, character and leadership.',
    cta: { label: 'Gallery', href: '/students' },
    image: null,
    theme: 'accent',
  },
];

/* ---------------------------------------------------------------------------
 * QUICK STATS  (animated count-up)
 * ------------------------------------------------------------------------ */
export const stats = [
  { id: 'years', value: 12, suffix: '+', label: 'Years of Service' }, // PLACEHOLDER
  { id: 'faculties', value: 3, suffix: '', label: 'Faculties' },
  { id: 'departments', value: 3, suffix: '', label: 'Departments' },
  { id: 'students', value: 1200, suffix: '+', label: 'Enrolled Students' }, // PLACEHOLDER
  { id: 'teachers', value: 45, suffix: '+', label: 'Faculty Members' }, // PLACEHOLDER
];

/* ---------------------------------------------------------------------------
 * CHAIRPERSON'S MESSAGE
 * ------------------------------------------------------------------------ */
export const chairperson = {
  name: 'Dr. Mina Ehsan Leghari',
  role: 'Chairperson',
  institution: 'South Punjab Institute of Science & Technology, D.G. Khan',
  photo: null, // PLACEHOLDER — '/images/chairperson.jpg'
  paragraphs: [
    'It gives me immense pleasure to welcome you to the South Punjab Institute of Science & Technology. SPIST was founded on a simple conviction: that the young people of Dera Ghazi Khan and the wider South Punjab region deserve access to higher education of the same standard available anywhere in the country.',
    'Our faculties of Pure and Applied Sciences, Arts and Social Sciences, and Languages combine rigorous academic instruction with practical, laboratory-based and skills-oriented learning. Alongside our degree programs, our six-month diplomas and three-month certificate courses equip students with employable skills in a short span of time.',
    'At SPIST we believe education is not confined to the lecture hall. Through research, co-curricular activities and community engagement, we aim to produce graduates who are not only professionally competent but also responsible, ethical citizens of Pakistan.',
  ],
  readMoreHref: '/discover/chairpersons-message',
};

/* ---------------------------------------------------------------------------
 * VISION & MISSION
 * ------------------------------------------------------------------------ */
export const visionMission = {
  vision: {
    title: 'Our Vision',
    text: 'To be a leading institute of higher learning in South Punjab — recognised for academic excellence, scientific research and the character of its graduates — and to make quality education accessible to every deserving student of the region.',
    points: [
      'A centre of academic and research excellence in South Punjab',
      'Graduates equipped to compete nationally and internationally',
      'Education accessible regardless of economic background',
    ],
  },
  mission: {
    title: 'Our Mission',
    text: 'To provide affordable, high-quality education through highly trained faculty, modern teaching methodology and well-equipped laboratories, while nurturing research, innovation, ethical values and lifelong learning in every student.',
    points: [
      'Deliver rigorous, industry-relevant academic programs',
      'Promote research, innovation and commercialisation through ORIC',
      'Maintain and continuously improve quality standards through QEC',
    ],
  },
};

/* ---------------------------------------------------------------------------
 * ACADEMIC PROGRAMS  (tabbed by faculty on the homepage)
 * ------------------------------------------------------------------------ */
export const faculties = [
  {
    id: 'pure-applied-sciences',
    name: 'Faculty of Pure and Applied Sciences',
    short: 'Pure & Applied Sciences',
    blurb:
      'Laboratory-driven programs in the natural and computing sciences, built on strong fundamentals and hands-on practical work.',
    programs: [
      {
        name: 'BS Chemistry',
        department: 'Department of Chemistry',
        duration: '4 Years',
        degreeType: 'Bachelor Degree',
        credits: '133 Credit Hours', // PLACEHOLDER
        href: '/academic/chemistry',
      },
      {
        name: 'Associate Degree in Computer Science',
        department: 'Department of Computer Science',
        duration: '2 Years',
        degreeType: 'Associate Degree',
        credits: '68 Credit Hours', // PLACEHOLDER
        href: '/academic/computer-science',
      },
    ],
  },
  {
    id: 'arts-social-sciences',
    name: 'Faculty of Arts and Social Sciences',
    short: 'Arts & Social Sciences',
    blurb:
      'Programs exploring society, human behaviour and culture — developing the critical and analytical skills that underpin public life.',
    programs: [
      {
        // PLACEHOLDER — replace with the confirmed program list for this faculty
        name: 'Programs Announced Shortly',
        department: 'Faculty of Arts and Social Sciences',
        duration: '—',
        degreeType: 'Details to be announced',
        credits: '—',
        href: '/academic/arts-and-social-sciences',
      },
    ],
  },
  {
    id: 'languages',
    name: 'Faculty of Languages',
    short: 'Languages',
    blurb:
      'Language and literature programs that build advanced communication, research and teaching competence.',
    programs: [
      {
        name: 'BS English',
        department: 'Department of English',
        duration: '4 Years',
        degreeType: 'Bachelor Degree',
        credits: '133 Credit Hours', // PLACEHOLDER
        href: '/academic/english',
      },
    ],
  },
];

/* ---------------------------------------------------------------------------
 * SHORT COURSES
 * Diploma / certificate list as supplied for the Academic > Diploma &
 * Certificate Programs page (also used in the homepage short-courses strip
 * and the matching Admissions sub-pages).
 * ------------------------------------------------------------------------ */
export const diplomaPrograms = {
  title: 'Six-Month Diploma Programs',
  duration: '6 Months',
  href: '/academic/short-courses',
  items: [
    'Diploma in Artificial Intelligence',
    'Diploma in Information Technology',
    'Diploma in Computer Applications',
    'Diploma in Web Development',
    'Diploma in Graphic Design',
    'Diploma in Digital Marketing',
    'Diploma in English Language and Communication Skills',
    'Diploma in Office Management',
    'Diploma in Entrepreneurship and Business Development',
    'Diploma in Data Analytics',
  ],
};

export const certificateCourses = {
  title: 'Three-Month Professional Certificate Courses',
  duration: '3 Months',
  href: '/academic/short-courses',
  items: [
    'Certificate in Information Technology (IT)',
    'Certificate in Computer Applications',
    'Certificate in Office Management',
    'Certificate in English Language Proficiency',
    'Certificate in Spoken English and Communication Skills',
    'Certificate in Digital Marketing',
    'Certificate in Graphic Designing',
    'Certificate in Web Development',
    'Certificate in Artificial Intelligence Fundamentals',
    'Certificate in Entrepreneurship and Small Business Management',
    'Certificate in E-Commerce',
    'Certificate in Freelancing Skills',
    'Certificate in Data Analytics',
    'Certificate in Social Media Marketing',
    'Certificate in Business Communication',
    'Certificate in Educational Leadership and Management',
  ],
};

/* ---------------------------------------------------------------------------
 * FACULTY MEMBERS
 * Grouped by department so more departments can simply be appended.
 * Chemistry roster below is the real supplied staff list. Other departments
 * remain PLACEHOLDER pending the official list.
 * ------------------------------------------------------------------------ */
export const facultyMembers = [
  {
    department: 'Department of Chemistry',
    facultyId: 'pure-applied-sciences',
    members: [
      {
        name: 'Dr. Muhammad Ijaz Hussain',
        designation: 'Associate Professor',
        qualification: 'Ph.D',
        institution: 'School of Chemistry, ChongQing, China',
        appointment: 'Permanent',
        photo: null,
      },
      {
        name: 'Dr. Muhammad Sher Jhahan Khan',
        designation: 'Associate Professor',
        qualification: 'Ph.D',
        institution: 'Lanzhou University, China',
        appointment: 'Permanent',
        photo: null,
      },
      {
        name: 'Dr. Muhammad Amjad Farooq',
        designation: 'Assistant Professor',
        qualification: 'Ph.D',
        institution: 'Shanghai Jiao Tong University, China',
        appointment: 'Permanent',
        photo: null,
      },
      {
        name: 'Ms. Tasnim Fatima',
        designation: 'Lecturer',
        qualification: 'M.Phil',
        institution: 'BZU, Multan',
        appointment: 'Permanent',
        photo: null,
      },
      {
        name: 'Ms. Afifa Shaheen',
        designation: 'Lecturer',
        qualification: 'MS',
        institution: 'University of Education, Lahore',
        appointment: 'Permanent',
        photo: null,
      },
      {
        name: 'Ms. Zil-e-Huma',
        designation: 'Lecturer',
        qualification: 'M.Phil',
        institution: 'Ghazi University, Dera Ghazi Khan',
        appointment: 'Permanent',
        photo: null,
      },
    ],
  },
];

/* ---------------------------------------------------------------------------
 * DEPARTMENT FACULTY LOOKUP
 * Keyed by the department's route slug (the last path segment under
 * /academic/...). Used by each department page to show that department's
 * teaching staff. Chemistry and English hold the real supplied rosters.
 * Departments with no roster yet use an empty array — DepartmentPage renders
 * a clear "to be announced" state for those rather than showing fabricated
 * names.
 * ------------------------------------------------------------------------ */
export const departmentFaculty = {
  chemistry: facultyMembers.find((d) => d.department === 'Department of Chemistry').members,
  'computer-science': [], // PLACEHOLDER — official roster not yet supplied
  english: [
    {
      name: 'Dr. Sajid Waqar',
      designation: 'Associate Professor',
      qualification: 'PhD',
      institution: 'Islamia University Bahawalpur',
      appointment: 'Permanent',
      photo: null,
    },
    {
      name: 'Dr. Muhammad Farukh Arslan',
      designation: 'Assistant Professor',
      qualification: 'PhD',
      institution: 'GCU, Faisalabad',
      appointment: 'Permanent',
      photo: null,
    },
    {
      name: 'Ms. Fatima Khan',
      designation: 'Assistant Professor',
      qualification: 'MPhil (PhD Scholar)',
      institution: 'Islamia University Bahawalpur',
      appointment: 'Permanent',
      photo: null,
    },
    {
      name: 'Mr. Ali Ahmad',
      designation: 'Lecturer',
      qualification: 'MPhil',
      institution: 'Islamia University Bahawalpur',
      appointment: 'Permanent',
      photo: null,
    },
    {
      name: 'Mr. Danyal Raza',
      designation: 'Lecturer',
      qualification: 'M.Phil',
      institution: 'University of Management and Technology, Lahore',
      appointment: 'Permanent',
      photo: null,
    },
    {
      name: 'Mr. Usman Hayat',
      designation: 'Lecturer',
      qualification: 'M.Phil',
      institution: 'Ghazi University, DG. Khan',
      appointment: 'Permanent',
      photo: null,
    },
  ],
};

/* ---------------------------------------------------------------------------
 * NEWS / NOTICE BOARD
 * PLACEHOLDER — CMS-ready shape.
 * ------------------------------------------------------------------------ */
export const news = [
  {
    id: 'admissions-open',
    category: 'Admissions',
    date: '2026-07-15',
    title: 'Admissions Open for Fall 2026 Session',
    excerpt:
      'Applications are now being accepted for BS Chemistry, BS English and the Associate Degree in Computer Science, along with all diploma and certificate courses.',
    href: '/admissions/online',
  },
  {
    id: 'science-exhibition',
    category: 'Events',
    date: '2026-06-28',
    title: 'Annual Science & Technology Exhibition Held at SPIST',
    excerpt:
      'Students from the Faculty of Pure and Applied Sciences presented research posters and working models across chemistry and computing.',
    href: '/students',
  },
  {
    id: 'exam-schedule',
    category: 'Examination',
    date: '2026-06-10',
    title: 'Mid-Term Examination Schedule Announced',
    excerpt:
      'The Examination Department has issued the date sheet for mid-term assessments. Students are advised to collect their roll number slips.',
    href: '/examination',
  },
];

/* ---------------------------------------------------------------------------
 * GALLERY
 * PLACEHOLDER — `src: null` renders a branded tile; add real image paths later.
 * ------------------------------------------------------------------------ */
export const galleryCategories = ['All', 'Labs', 'Events', 'Campus'];

export const galleryItems = [
  { id: 1, category: 'Labs', caption: 'Chemistry Research Laboratory', src: null },
  { id: 2, category: 'Campus', caption: 'Main Academic Block', src: null },
  { id: 3, category: 'Events', caption: 'Annual Science Exhibition', src: null },
  { id: 4, category: 'Labs', caption: 'Computer Science Lab', src: null },
  { id: 5, category: 'Campus', caption: 'Central Library', src: null },
  { id: 6, category: 'Events', caption: 'Convocation Ceremony', src: null },
  { id: 7, category: 'Campus', caption: 'Student Lounge & Cafeteria', src: null },
  { id: 8, category: 'Labs', caption: 'Analytical Instrumentation Suite', src: null },
];

/* ---------------------------------------------------------------------------
 * FOOTER
 * ------------------------------------------------------------------------ */
export const footerDepartments = [
  { label: 'Department of Chemistry', href: '/academic/chemistry' },
  { label: 'Department of Computer Science', href: '/academic/computer-science' },
  { label: 'Department of English', href: '/academic/english' },
  { label: 'Faculty of Arts and Social Sciences', href: '/academic/arts-and-social-sciences' },
  { label: 'Six-Month Diploma Programs', href: '/admissions/diploma-programs' },
  { label: 'Three-Month Certificate Courses', href: '/admissions/certificate-courses' },
];

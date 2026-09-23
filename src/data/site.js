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
  address:
    'South Punjab Institute of Science & Technology, Jampur Road, Dera Ghazi Khan, Punjab, Pakistan',
  location: {
    lat: 30.0289892,
    lng: 70.641058,
    mapEmbedUrl: 'https://www.google.com/maps?q=30.0289892,70.641058&z=17&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=30.0289892,70.641058',
  },
  phones: ['0330-1624002', '064-2406370'],
  email: 'spistdgkhan@gmail.com',
  social: {
    facebook: 'https://facebook.com/', // PLACEHOLDER — official page URL
    whatsapp: 'https://wa.me/923301624002',
  },
  portalUrl: '#', // PLACEHOLDER — student portal / LMS URL
};

/* ---------------------------------------------------------------------------
 * Admission fee
 *
 * Printed on the fee voucher an applicant takes to the bank. The amount is
 * also set on the server (ADMISSION_FEE_AMOUNT) because that is what actually
 * gets recorded against an application; this copy is what the voucher shows.
 * Keep the two in step.
 * ------------------------------------------------------------------------ */
export const admissionFee = {
  amount: 1500,
  currency: 'PKR',
  bank: {
    name: 'United Bank Limited (UBL)',
    branch: 'Sangam Chowk Branch, Dera Ghazi Khan',
    title: 'SOUTH PUNJAB INSTITUTE OF SCIENCE & TECHNOLOGY',
    iban: 'PK68 UNIL 0109 0003 0986 0633',
    accountNumber: '0109 0003 0986 0633',
  },
};


/* ---------------------------------------------------------------------------
 * PORTAL LOGINS
 *
 * The header "Login" menu, the mobile drawer and the footer all read this one
 * array, so a URL only ever has to be corrected here.
 *
 * The portal (the spist-project SchoolPortal app) gives each role a door of its
 * own at /login/<role>: the role picker is not rendered there at all, and the
 * page titles itself "Student Portal". Somebody who picked their role in this
 * menu has already answered that question once.
 *
 * The path form is what does that. Its /login?role=<role> still works, but only
 * preselects the picker rather than replacing it — so linking that way would
 * put the whole list of roles back in front of the visitor.
 *
 * The portal's normalizeRole() accepts these friendly spellings — `admin`
 * resolves to its internal school_admin — and ignores anything it can't place,
 * so a wrong value degrades to the plain picker rather than an error.
 *
 * Base URL is an env var because the portal runs on localhost:5174 in
 * development and will move to a real host once it is deployed; hardcoding it
 * here would ship a dead link.
 *
 * Order matters: it is the order the menu renders, students first because they
 * are the overwhelming majority of the traffic.
 * ------------------------------------------------------------------------ */
const PORTAL_BASE_URL = import.meta.env.VITE_PORTAL_BASE_URL || 'http://localhost:5174';

const portalRoles = [
  { role: 'student', label: 'Login as Student' },
  { role: 'teacher', label: 'Login as Teacher' },
  { role: 'parent', label: 'Login as Parent' },
  { role: 'admin', label: 'Login as Admin' },
  { role: 'registrar', label: 'Login as Registrar' },
];

export const portals = portalRoles.map(({ role, label }) => ({
  role,
  label,
  url: `${PORTAL_BASE_URL}/login/${role}`,
}));

/** The student portal, for the places that link to just that one (footer). */
export const studentPortal = portals.find((portal) => portal.role === 'student');

/* ---------------------------------------------------------------------------
 * NAVIGATION
 *
 * Edit ORDER and LABELS here — the desktop mega-menu, the mobile accordion
 * drawer and the footer "Quick Links" column all read from this one array.
 *
 * Shape:
 *   { label, href }                          → plain link
 *   { label, href, children: [...] }         → level-2 dropdown panel
 *   { label, children: [...] }  (inside)     → nested flyout (»), any depth
 * ------------------------------------------------------------------------ */
export const navigation = [
  { label: 'Home', href: '/' },

  {
    label: 'Discover SPIST',
    href: '/discover/overview',
    children: [
      { label: 'Overview', href: '/discover/overview' },
      { label: "Chairperson's Message", href: '/discover/chairpersons-message' },
      { label: 'Vision & Mission', href: '/discover/vision-mission' },
      {
        label: 'Office',
        children: [
          { label: 'Rector', href: '/discover/offices/rector-office' },
          { label: 'Administration Office', href: '/discover/offices/administration-offices' },
          { label: 'Finance Office', href: '/discover/offices/finance-office' },
          { label: 'Examination Department', href: '/discover/offices/examination-department' },
          { label: 'DSA', href: '/discover/offices/dsa' },
          { label: 'ORIC Office', href: '/oric' },
          { label: 'QEC', href: '/discover/offices/qec' },
          { label: 'Central Library', href: '/discover/offices/central-library' },
          { label: 'Security Office', href: '/discover/offices/security-office' },
          // Standalone offices with no sub-items — unaffected by the landing-page pattern above.
          { label: 'Health Care Centre', href: '/discover/offices/health-care-centre' },
          { label: 'Web Development', href: '/discover/offices/web-development' },
          { label: 'Software Cell', href: '/discover/offices/software-cell' },
        ],
      },
    ],
  },

  {
    label: 'Admissions',
    href: '/admissions/online',
    children: [
      { label: 'Online Admission', href: '/admissions/online' },
      { label: 'Application Status', href: '/admissions/status' },
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
      {
        label: 'Faculty of Languages',
        children: [{ label: 'Department of English', href: '/academic/english' }],
      },
      { label: 'Diploma & Certificate Programs', href: '/academic/short-courses' },
      { label: 'Our Faculty', href: '/academic/faculty' },
    ],
  },

  { label: 'Latest News', href: '/latest-news' },

  {
    label: 'ORIC',
    href: '/oric',
    title: 'Office of Research, Innovation & Commercialization',
    children: [
      {
        label: 'Interdisciplinary Research',
        href: '/oric/interdisciplinary-research',
        children: [
          { label: 'Measurement', href: '/oric/interdisciplinary-research/measurement' },
          { label: 'Physical Facilities', href: '/oric/interdisciplinary-research/physical-facilities' },
          {
            label: 'Administrative Support',
            href: '/oric/interdisciplinary-research/administrative-support',
          },
        ],
      },
      { label: 'Research Journal', href: '/oric/research-journal' },
      { label: 'ORIC Introduction', href: '/oric/oric-introduction' },
    ],
  },
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
  { id: 'faculties', value: 2, suffix: '', label: 'Faculties' },
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
  
  photo: null, // PLACEHOLDER — '/images/chairperson.jpg'
  paragraphs: [
    'Welcome to the South Punjab Institute of Science and Technology (SPIST), Dera Ghazi Khan.',
    'At SPIST, we envision an institution where knowledge inspires innovation, education transforms lives, and research drives sustainable development. Our mission is to provide quality higher education that empowers students with academic excellence, professional competence, ethical values, and the leadership skills needed to shape the future.',
    'As a Higher Education Commission (HEC) recognized institution, we are committed to fostering a culture of learning, creativity, and discovery while expanding educational opportunities for the youth of South Punjab, particularly those from underserved and remote communities.',
    'We invite you to join SPIST in our pursuit of excellence as we prepare the next generation of leaders, innovators, and responsible citizens who will contribute to the progress of Pakistan and the global community.',
  ],
  readMoreHref: '/discover/chairpersons-message',
};

/**
 * Full chairperson's message, rendered on the dedicated Chairperson's
 * Message page below the portrait/quote block from `chairperson` above.
 * `blocks` is an ordered content stream so the page component can stay a
 * simple renderer instead of hardcoding the message copy.
 */
export const chairpersonFullMessage = {
  blocks: [
    { type: 'paragraph', text: 'Assalam-o-Alaikum Wa Rehmatullah Wa Barakatuhu,' },
    {
      type: 'paragraph',
      text: 'It gives me immense pleasure to address you on behalf of South Punjab Institute of Science and Technology, Dera Ghazi Khan - an institute established with a clear purpose: to bring the light of quality education, research, and professional training to the heart of South Punjab.',
    },
    {
      type: 'paragraph',
      text: 'As the Chairperson of SPIST, and as someone who deeply believes in the power of education to transform societies, I welcome all students, parents, faculty members, and well-wishers to our growing academic family.',
    },
    { type: 'heading', text: 'Our Vision' },
    {
      type: 'paragraph',
      text: 'SPIST was envisioned to bridge the educational gap in South Punjab by providing access to modern, HEC-recognized programs that are aligned with national and global standards. We are duly recognized by HEC and the Government of Punjab, and this recognition is a testament to our commitment to academic integrity and excellence.',
    },
    { type: 'heading', text: 'Our Mission' },
    { type: 'paragraph', text: 'The mission of SPIST is threefold:' },
    {
      type: 'orderedList',
      items: [
        'Academic Excellence: To deliver updated curricula in the fields of Science, Health, and Technology through qualified faculty and practical learning.',
        'Skill Development: To produce graduates who are not only degree holders but also job-ready professionals with technical skills, critical thinking, and ethical values.',
        'Community Service: To serve the people of Dera Ghazi Khan and surrounding districts by producing healthcare workers, scientists, and technologists who will contribute to the development of the region.',
      ],
    },
    { type: 'heading', text: 'Why SPIST?' },
    {
      type: 'paragraph',
      text: 'At SPIST, we believe that students deserve more than just classrooms. We are building:',
    },
    {
      type: 'unorderedList',
      items: [
        'Modern Labs and Digital Classrooms for hands-on learning',
        'Industry and Hospital Linkages for internships and practical exposure',
        'Student Support Services including career counseling and scholarships',
        'A Safe and Disciplined Learning Environment that respects our cultural and Islamic values',
      ],
    },
    {
      type: 'paragraph',
      text: 'We are especially focused on empowering young women of South Punjab to become leaders in health, education, and technology sectors.',
    },
    { type: 'heading', text: 'My Message to Students' },
    {
      type: 'paragraph',
      lead: 'Dear Students,',
      text: 'You are the future of Pakistan. The journey of learning at SPIST will challenge you, shape you, and prepare you to serve your family, community, and country. Work hard, stay disciplined, and never stop asking questions.',
    },
    {
      type: 'paragraph',
      lead: 'To parents:',
      text: 'I assure you that your children are in safe hands. We at SPIST treat every student as our own and are committed to their academic success and personal grooming.',
    },
    { type: 'heading', text: 'Looking Ahead' },
    {
      type: 'paragraph',
      text: 'With the support of HEC, Government of Punjab, our faculty, and the community of D.G. Khan, I am confident that SPIST will soon become a center of excellence recognized across Pakistan.',
    },
    { type: 'paragraph', text: 'May Allah Almighty guide us and bless our efforts. Ameen.' },
  ],
  signOff: {
    valediction: 'With best wishes,',
    name: 'Dr. Mina Ehsan Leghari Sahiba',
    role: 'Chairperson',
    recognition: 'Recognized by HEC & Government of Punjab',
  },
};

/* ---------------------------------------------------------------------------
 * VISION & MISSION
 * ------------------------------------------------------------------------ */
export const vision = {
  title: 'Our Vision',
  text: 'To be a leading university of excellence in teaching, research, innovation, and community engagement, transforming lives through accessible, quality higher education, particularly for the people of South Punjab, including underserved, rural, and remote areas, and producing graduates who contribute to sustainable national and global development.',
  points: [
    'A centre of academic and research excellence in South Punjab',
    'Graduates equipped to compete nationally and internationally',
    'Education accessible regardless of economic background',
  ],
};

export const mission = {
  title: 'Our Mission',
  text: 'The South Punjab Institute of Science & Technology (SPIST) is committed to providing accessible, affordable, and quality higher education through academic excellence, research, innovation, and professional development. The Institute strives to empower students—especially those from rural, remote, and underserved communities of South Punjab—by fostering critical thinking, ethical values, entrepreneurship, lifelong learning, and industry-academia collaboration. SPIST is dedicated to promoting inclusive education, advancing knowledge, and producing competent graduates who contribute to the socio-economic development and prosperity of Pakistan.',
  points: [
    'Deliver rigorous, industry-relevant academic programs',
    'Promote research, innovation and commercialisation through ORIC',
    'Maintain and continuously improve quality standards through QEC',
  ],
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
        credits: '139 Credit Hours',
        href: '/academic/chemistry',
      },
      {
        name: 'Associate Degree in Computer Science',
        department: 'Department of Computer Science',
        duration: '2 Years',
        degreeType: 'Associate Degree',
        credits: '72 Credit Hours',
        href: '/academic/computer-science',
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
 *
 * Both `diplomaPrograms.items` and `certificateCourses.items` carry a
 * `description` per entry so the Diploma & Certificate Programs page can
 * render each one as an expandable accordion (collapsed by default, revealed
 * on click).
 * ------------------------------------------------------------------------ */
export const diplomaPrograms = {
  title: 'Six-Month Diploma Programs',
  duration: '6 Months',
  href: '/academic/short-courses',
  tagline: 'Professional Diploma Programs for Future Careers',
  intro:
    'Our Six-Month Diploma Programs provide comprehensive training designed to develop both technical knowledge and practical experience. Each diploma equips students with the skills required to excel in today’s competitive job market.',
  items: [
    {
      name: 'Diploma in Artificial Intelligence',
      description:
        'Explore the exciting world of Artificial Intelligence by learning intelligent systems, machine learning fundamentals, automation, data-driven decision making, and modern AI technologies. This diploma prepares students for emerging careers in one of the fastest-growing technology sectors.',
    },
    {
      name: 'Diploma in Information Technology',
      description:
        'Build a strong foundation in information technology by learning computer systems, networking, operating systems, hardware, software applications, cybersecurity basics, and digital productivity tools essential for modern workplaces.',
    },
    {
      name: 'Diploma in Computer Applications',
      description:
        'Develop practical computer skills required in educational institutions, government organizations, and private businesses, including document management, spreadsheets, presentations, databases, and office automation.',
    },
    {
      name: 'Diploma in Web Development',
      description:
        'Learn to design and develop responsive, secure, and modern websites using HTML, CSS, JavaScript, databases, and contemporary web development technologies while gaining practical project experience.',
    },
    {
      name: 'Diploma in Graphic Design',
      description:
        'Develop creative design skills using professional graphic design software to produce branding materials, social media graphics, marketing campaigns, brochures, digital artwork, and visual communication solutions.',
    },
    {
      name: 'Diploma in Digital Marketing',
      description:
        'Master modern digital marketing strategies including Search Engine Optimization (SEO), Social Media Marketing (SMM), Google Ads, Meta Advertising, Content Marketing, Email Marketing, Analytics, and Online Branding.',
    },
    {
      name: 'Diploma in English Language & Communication Skills',
      description:
        'Improve professional communication through advanced English speaking, writing, grammar, presentation skills, business communication, and workplace interaction to enhance academic and career opportunities.',
    },
    {
      name: 'Diploma in Office Management',
      description:
        'Gain expertise in office administration, business correspondence, customer service, record management, office software, organizational communication, and professional workplace management.',
    },
    {
      name: 'Diploma in Entrepreneurship & Business Development',
      description:
        'Develop entrepreneurial skills by learning business planning, startup development, financial management, innovation, leadership, marketing strategies, and sustainable business growth.',
    },
    {
      name: 'Diploma in Data Analytics',
      description:
        'Learn how to collect, organize, analyze, visualize, and interpret data using modern analytical tools to support business intelligence and informed decision-making across various industries.',
    },
  ],
};

export const certificateCourses = {
  title: 'Three-Month Professional Certificate Courses',
  duration: '3 Months',
  href: '/academic/short-courses',
  tagline: 'Short-Term Professional Skill Development Programs',
  intro:
    'SPIST’s Professional Certificate Courses are designed for learners seeking rapid skill development through practical, industry-focused training. These short-term programs provide valuable knowledge that can immediately improve employability and career prospects.',
  footnote:
    'Each course combines theoretical understanding with practical learning to help students develop job-ready skills within a short period.',
  items: [
    {
      name: 'Certificate in Information Technology (IT)',
      description:
        'Build essential IT skills by learning computer fundamentals, operating systems, internet usage, hardware basics, and productivity tools. This certificate prepares learners for entry-level IT support and digital workplace roles.',
    },
    {
      name: 'Certificate in Computer Applications',
      description:
        'Develop practical computer skills by learning word processing, spreadsheets, presentations, databases, and office automation. This certificate enhances digital productivity for academic and professional environments.',
    },
    {
      name: 'Certificate in Office Management',
      description:
        'Learn modern office administration, document handling, communication, scheduling, and record management. This certificate prepares learners for efficient administrative and office support roles.',
    },
    {
      name: 'Certificate in English Language Proficiency',
      description:
        'Improve your English speaking, listening, reading, and writing skills for academic, professional, and everyday communication. This certificate builds confidence in using English effectively.',
    },
    {
      // NOTE: name kept as supplied — doesn't follow the "Certificate in ..." pattern of the rest of this list; flagged for review, not renamed.
      name: 'Department of English Language and Literature',
      description:
        'Explore the fundamentals of English language and literature through grammar, reading, writing, and literary analysis. This certificate strengthens communication and critical thinking skills.',
    },
    {
      name: 'Certificate in Digital Marketing',
      description:
        'Learn the basics of digital marketing, including social media, SEO, content creation, email marketing, and online advertising. This certificate prepares learners for the digital business landscape.',
    },
    {
      name: 'Certificate in Graphic Designing',
      description:
        'Develop creative design skills by learning typography, branding, image editing, and visual communication using industry-standard design tools. This certificate prepares learners for entry-level design projects.',
    },
    {
      name: 'Certificate in Web Development',
      description:
        'Learn the fundamentals of website development by exploring HTML, CSS, responsive design, and basic JavaScript. This certificate provides a strong foundation for building modern websites.',
    },
    {
      name: 'Certificate in Artificial Intelligence Fundamentals',
      description:
        'Discover the basics of Artificial Intelligence, machine learning concepts, automation, and AI-powered technologies. This certificate introduces learners to the rapidly growing field of AI.',
    },
    {
      name: 'Certificate in Entrepreneurship & Small Business Management',
      description:
        'Learn the essentials of entrepreneurship, business planning, financial management, and customer engagement. This certificate equips learners with the knowledge to start and manage small businesses.',
    },
    {
      name: 'Certificate in E-Commerce',
      description:
        'Understand the fundamentals of online business by learning e-commerce platforms, digital payments, product management, and customer experience. This certificate prepares learners for the digital marketplace.',
    },
    {
      name: 'Certificate in Freelancing Skills',
      description:
        'Build the skills needed to succeed as a freelancer by learning client communication, project management, online platforms, and personal branding. This certificate helps learners start and grow a freelance career.',
    },
    {
      name: 'Certificate in Data Analytics',
      description:
        'Learn the fundamentals of data analysis, data visualization, spreadsheets, and reporting techniques. This certificate prepares learners to make informed, data-driven decisions.',
    },
    {
      name: 'Certificate in Social Media Marketing',
      description:
        'Master the basics of social media marketing by learning content planning, audience engagement, campaign management, and performance tracking. This certificate helps learners build effective online marketing skills.',
    },
    {
      name: 'Certificate in Business Communication',
      description:
        'Enhance professional communication skills through effective writing, presentations, business correspondence, and workplace interactions. This certificate improves confidence in corporate communication.',
    },
    {
      name: 'Certificate in Educational Leadership & Management',
      description:
        'Develop foundational leadership and management skills for educational institutions through planning, administration, team coordination, and decision-making. This certificate prepares learners for educational management roles.',
    },
  ],
};

/**
 * Supporting page copy for the Diploma & Certificate Programs page
 * (`ShortCoursesPage.jsx`) — kept here, rather than hardcoded in JSX, so the
 * page stays a plain renderer of `site.js` content.
 */
export const shortCoursesPage = {
  intro: {
    heading: 'Advance Your Career with Industry-Focused Diploma & Certificate Programs',
    paragraphs: [
      'The South Punjab Institute of Science & Technology (SPIST), Dera Ghazi Khan, offers professionally designed Diploma and Certificate Programs that prepare students with practical knowledge, technical expertise, and career-ready skills. Our programs are developed to meet the growing demands of today’s industries, helping students, graduates, professionals, and entrepreneurs build successful careers in Pakistan and beyond.',
      'Whether your goal is to secure a better job, launch a freelance career, start your own business, or continue your higher education, SPIST provides quality education through experienced faculty, modern learning resources, and hands-on training.',
      'Our curriculum combines academic excellence with practical experience, ensuring graduates are confident, skilled, and ready for real-world challenges.',
    ],
  },
  whyChoose: {
    heading: 'Why Choose SPIST?',
    text: 'SPIST is committed to delivering affordable, high-quality education that empowers learners with practical skills and professional confidence.',
    advantagesHeading: 'Our Advantages',
    advantages: [
      'Industry-relevant and regularly updated curriculum',
      'Practical, project-based learning approach',
      'Experienced and qualified instructors',
      'Modern computer laboratories and learning facilities',
      'Affordable tuition with excellent value',
      'Career-oriented training and professional development',
      'Supportive learning environment',
      'Opportunities to develop freelancing and entrepreneurial skills',
      'Focus on innovation, creativity, and lifelong learning',
      'Strong commitment to academic excellence and student success',
    ],
  },
  practicalLearning: {
    heading: 'Practical Learning That Creates Opportunities',
    paragraphs: [
      'Education at SPIST goes beyond textbooks. Students participate in practical assignments, live projects, presentations, workshops, and collaborative activities that strengthen technical expertise, communication abilities, and problem-solving skills.',
      'Our learning environment encourages creativity, innovation, teamwork, and continuous personal development while preparing graduates for the evolving needs of local and international industries.',
    ],
  },
  careerOpportunities: {
    heading: 'Career Opportunities',
    text: 'Graduates of SPIST Diploma and Certificate Programs are prepared for careers in a wide range of industries, including:',
    fields: [
      'Information Technology',
      'Artificial Intelligence',
      'Software & Web Development',
      'Graphic Design & Creative Media',
      'Digital Marketing & E-Commerce',
      'Data Analytics & Business Intelligence',
      'Office Administration',
      'Business Management',
      'Entrepreneurship',
      'Education & Training',
      'Government Organizations',
      'Private Sector Companies',
      'Freelancing & Remote Work',
    ],
    footnote:
      'These programs also provide an excellent foundation for higher education and professional certifications.',
  },
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
 * teaching staff. Chemistry, Computer Science and English hold the real
 * supplied rosters. Departments with no roster yet use an empty array —
 * DepartmentPage renders a clear "to be announced" state for those rather
 * than showing fabricated names.
 * ------------------------------------------------------------------------ */
export const departmentFaculty = {
  chemistry: facultyMembers.find((d) => d.department === 'Department of Chemistry').members,
  'computer-science': [
    {
      name: 'Mr. Danial Ahmad',
      designation: 'Teacher-in-Charge',
      qualification: 'M.Phil',
      institution: null, // PLACEHOLDER — awarding institution not yet supplied
      appointment: 'Permanent',
      photo: null,
    },
    {
      name: 'Mr. M. Waseem Tariq',
      designation: 'Lecturer',
      qualification: 'MS',
      institution: null, // PLACEHOLDER — awarding institution not yet supplied
      appointment: 'Permanent',
      photo: null,
    },
    {
      name: 'Mr. Abdul Basit',
      designation: 'Lecturer',
      qualification: 'MS',
      institution: null, // PLACEHOLDER — awarding institution not yet supplied
      appointment: 'Permanent',
      photo: null,
    },
    {
      name: 'Ms. Saman Saba',
      designation: 'Lecturer',
      qualification: 'MS',
      institution: null, // PLACEHOLDER — awarding institution not yet supplied
      appointment: 'Permanent',
      photo: null,
    },
  ],
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
  {
    id: 1,
    category: 'Labs',
    caption: 'Chemistry Research Laboratory',
    src: '/campus gallary/lab/chem lab.jpg',
  },
  {
    id: 2,
    category: 'Campus',
    caption: 'Main Academic Block',
    // Paths here are URLs, not file paths: everything in public/ is served from
    // the root, so the leading `public/` has to go or the image 404s in a built
    // site. Vite warns about it in dev but still serves the file, which is why
    // it can look fine locally and be a blank tile in production.
    src: '/campus gallary/campus/campus-front.jpg',
  },
  {
    id: 3,
    category: 'Events',
    caption: 'Annual Science Exhibition',
    src: '/campus gallary/events/Annual Science Exhibition.jpeg',
  },
  {
    id: 4,
    category: 'Labs',
    caption: 'Computer Science Lab',
    src: '/campus gallary/lab/Computer Science Lab.jpeg',
  },
  {
    id: 5,
    category: 'Campus',
    caption: 'Central Library',
    src: '/campus gallary/campus/Central Library.jpeg',
  },
  {
    id: 6,
    category: 'Events',
    caption: 'Convocation Ceremony',
    src: '/campus gallary/events/Convocation Ceremony.jpeg',
  },
  {
    id: 7,
    category: 'Campus',
    caption: 'Student Lounge & Cafeteria',
    src: '/campus gallary/campus/cafeteria.jpg',
  },
  {
    id: 8,
    category: 'Labs',
    caption: 'Analytical Instrumentation Suite',
    src: '/campus gallary/lab/labs.jpg',
  },
];

/* ---------------------------------------------------------------------------
 * FOOTER
 * ------------------------------------------------------------------------ */
export const footerDepartments = [
  { label: 'Department of Chemistry', href: '/academic/chemistry' },
  { label: 'Department of Computer Science', href: '/academic/computer-science' },
  { label: 'Department of English', href: '/academic/english' },
  { label: 'Six-Month Diploma Programs', href: '/admissions/diploma-programs' },
  { label: 'Three-Month Certificate Courses', href: '/admissions/certificate-courses' },
  { label: 'Our Faculty', href: '/academic/faculty' },
];

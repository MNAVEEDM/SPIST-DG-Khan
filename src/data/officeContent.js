/* ============================================================================
 * SPIST — Office & ORIC sub-page content.
 *
 * Structured body copy for every Discover SPIST > Office and top-level ORIC
 * sub-page, keyed by route path. `InnerPage` renders this in place of its
 * placeholder body whenever a matching entry exists (see `src/pages/InnerPage.jsx`).
 *
 * Each entry: { lead: string[], responsibilitiesHeading?, responsibilities: string[],
 * audience: string, closing: string }.
 *
 * Content is deliberately descriptive/functional — it avoids inventing names,
 * dates, statistics or policies that would need to be factually verified.
 * ==========================================================================*/

export const officeContent = {
  /* -------------------------------------------------------------------- */
  /* Discover SPIST > Office                                              */
  /* -------------------------------------------------------------------- */

  '/discover/offices/rector-office/rector-office': {
    lead: [
      "The Rector is the chief executive and academic head of South Punjab Institute of Science & Technology (SPIST), providing overall institutional leadership, strategic direction, and governance in line with the institute's charter and the regulatory framework of the Higher Education Commission (HEC) and the Government of Punjab.",
      "The Rector's Office is the administrative unit that supports this leadership role, translating institutional policy into day-to-day action and serving as the central point of coordination between the Rector and the institute's faculties, directorates, and administrative offices.",
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      "Providing strategic and academic leadership for the institute's teaching, research, and administrative functions",
      'Chairing statutory bodies and senior decision-making forums and overseeing implementation of their decisions',
      'Approving institutional policies, academic calendars, and major administrative matters',
      'Representing SPIST in dealings with HEC, the Government of Punjab, affiliated bodies, and partner organisations',
      'Coordinating the work of the Registrar, Treasurer, Controller of Examinations, and other senior office holders',
      'Overseeing institutional planning, resource allocation, and long-term development priorities',
      'Maintaining institutional discipline, integrity, and adherence to regulatory and ethical standards',
      'Receiving and directing correspondence, appeals, and matters requiring senior-level attention',
    ],
    audience:
      "The Rector's Office is the point of contact for faculty and staff on matters requiring senior administrative decision or approval, for students on appeals and matters beyond the scope of individual departments, and for external bodies, government departments, and visitors engaging with the institute at an institutional level. Most routine matters are directed through the relevant office first, with escalation to the Rector's Office where a senior decision is required.",
    closing:
      "As the office from which institutional direction is set and coordinated, the Rector's Office underpins every academic and administrative function at SPIST, ensuring that the institute's teaching, research, and student welfare activities operate within a coherent, accountable, and well-governed framework.",
  },

  '/discover/offices/rector-office/ps-to-rector': {
    lead: [
      "The Private Secretary (PS) to the Rector provides dedicated correspondence, scheduling, and liaison support to the Rector's Office, ensuring that communication in and out of the office is handled promptly, accurately, and in the appropriate order of priority.",
      "This office acts as the first point of contact for anyone seeking an appointment, submitting correspondence, or requiring the Rector's attention on institutional matters.",
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      "Managing the Rector's diary, appointments, and meeting schedules",
      'Receiving, registering, and routing correspondence addressed to the Rector',
      "Coordinating logistics for meetings, official visits, and institutional events involving the Rector",
      "Liaising between the Rector's Office and other departments, offices, and external organisations",
      'Maintaining records of official communication, directives, and follow-up actions',
      "Assisting in the preparation of briefing material, agendas, and minutes for meetings chaired by the Rector",
      "Facilitating timely responses to queries and requests directed to the Rector's Office",
    ],
    audience:
      'Faculty, staff, students, and external visitors who need to correspond with or request an appointment with the Rector typically begin with this office. It is most efficiently reached by written correspondence or email, with in-person visits recommended only after an appointment has been confirmed.',
    closing:
      "By keeping the Rector's schedule organised and communication channels clear, the PS to Rector office allows institutional leadership to function smoothly, ensuring that matters requiring the Rector's personal attention are identified, prioritised, and addressed without unnecessary delay.",
  },

  '/discover/offices/administration-offices/registrar': {
    lead: [
      "The Registrar's Office is the custodian of SPIST's official student records and the administrative authority responsible for enrollment, registration, and the integrity of the institute's academic record-keeping.",
      "It serves as the institutional link between students' academic journeys and the formal documentation that verifies them, from first enrollment through to graduation.",
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Maintaining the official academic records of every enrolled and graduated student',
      'Overseeing student enrollment, registration, and programme/section allocation each semester',
      'Issuing transcripts, enrollment certificates, migration certificates, and other official academic documents',
      'Verifying eligibility for course registration, semester progression, and degree completion',
      'Coordinating with academic departments on curriculum records, credit hours, and degree requirements',
      'Ensuring academic records comply with HEC and institutional record-keeping standards',
      'Processing requests for record correction, name changes, and document verification',
      'Supporting convocation processes by confirming degree completion records',
    ],
    audience:
      "Students interact with the Registrar's Office throughout their academic career — at admission, during semester registration, and when requesting transcripts or certificates — usually in person during office hours or by written application. Academic departments and administrative offices also rely on the Registrar's Office as the authoritative source of enrollment and record data.",
    closing:
      "Accurate, well-maintained student records are the foundation on which admissions, examinations, and degree conferral all depend, making the Registrar's Office a central pillar of the institute's academic administration.",
  },

  '/discover/offices/administration-offices/admin-office': {
    lead: [
      'The Admin Office coordinates the general administrative operations of SPIST, providing the day-to-day support that keeps departments, offices, and campus facilities functioning smoothly.',
      'It acts as a central hub for internal administrative processes that do not fall under a specialised office, from correspondence handling to facilities coordination.',
    ],
    responsibilitiesHeading: 'What We Do',
    responsibilities: [
      'Managing general correspondence, filing, and record-keeping for institute-wide administrative matters',
      'Coordinating office supplies, equipment, and facilities requests across departments',
      'Supporting the scheduling and logistics of institutional meetings and events',
      'Liaising between academic departments and other administrative offices to resolve routine matters',
      'Maintaining institute-wide administrative policies, circulars, and notices',
      'Assisting with the onboarding of new staff and coordination of administrative paperwork',
      'Providing general information and directing enquiries to the appropriate specialised office',
    ],
    audience:
      'The Admin Office serves students, faculty, and staff alike as a first point of contact for general administrative queries that do not belong to a single specialised office. Most matters are handled in person during office hours or via written request, with more specific matters redirected to the Registrar, Treasurer, Examination Department, or other relevant office.',
    closing:
      "By handling the institute's routine administrative workload, the Admin Office allows academic departments and specialised offices to focus on their core functions, contributing to the overall efficiency of SPIST's day-to-day operations.",
  },

  '/discover/offices/administration-offices/registration-branch': {
    lead: [
      'The Registration Branch, operating under the Administration Offices, manages the practical processes of student registration — the paperwork and record entry that formally enrol a student into a programme, semester, or course.',
      "It works closely with the Registrar's Office to ensure that registration data is captured accurately and on schedule each semester.",
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Processing new admissions into formal registration records at the start of each session',
      'Handling semester-wise course and section registration for continuing students',
      'Recording changes to registration such as course add/drop requests within permitted deadlines',
      'Verifying supporting documents submitted at the time of registration',
      'Issuing registration slips, roll numbers, and related confirmation documents',
      "Maintaining an up-to-date registration database in coordination with the Registrar's Office",
      'Assisting students with queries related to registration status and deadlines',
    ],
    audience:
      'Students interact with the Registration Branch primarily at the start of each academic session and during designated registration or course-adjustment windows, typically in person with the required documentation. Academic departments and the Examination Department also rely on the branch’s records to confirm which students are validly registered for a given semester.',
    closing:
      "Timely, accurate registration is the first administrative step in every student's semester, and the Registration Branch's work directly supports the institute's ability to plan classes, examinations, and academic records with confidence.",
  },

  '/discover/offices/finance-office/treasurer-office': {
    lead: [
      'The Treasurer Office is responsible for the financial management of SPIST, overseeing budgeting, fee collection, and the sound stewardship of institutional funds.',
      'As the senior finance authority within the institute, it ensures that financial operations are conducted transparently and in line with institutional and regulatory requirements.',
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      "Preparing and monitoring the institute's annual budget and expenditure plans",
      'Overseeing tuition fee structures, collection schedules, and fee-related policies',
      'Supervising financial record-keeping, audits, and reporting',
      'Managing payroll processing in coordination with the Staff Office',
      'Approving institutional expenditure in line with budgetary allocations',
      'Ensuring compliance with financial regulations set by HEC and the Government of Punjab',
      'Coordinating with the Account Office on day-to-day financial transactions',
      'Advising institute leadership on financial planning and resource allocation',
    ],
    audience:
      'Students and their families interact with matters overseen by the Treasurer Office primarily around fee payment and fee-related queries, while faculty and staff engage with it on payroll and expenditure matters. Most interactions are conducted through the Account Office for routine transactions, with the Treasurer Office handling policy-level and higher-value financial matters, reachable by appointment or written correspondence.',
    closing:
      "Sound financial management underpins every aspect of institutional operation, from faculty salaries to laboratory equipment, and the Treasurer Office's oversight ensures that SPIST's resources are used responsibly in support of its academic mission.",
  },

  '/discover/offices/finance-office/account-office': {
    lead: [
      "The Account Office handles the practical, transaction-level financial work of SPIST, including fee receipts, payments, and the day-to-day bookkeeping that supports the Treasurer Office's broader financial oversight.",
      'It is the office students and staff most commonly deal with for routine financial transactions.',
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Receiving and recording student fee payments each semester',
      'Issuing fee receipts, challans, and payment confirmations',
      'Processing vendor payments, reimbursements, and petty cash transactions',
      'Maintaining day-to-day ledgers and financial records',
      'Assisting students with fee-related queries, instalment plans, and dues clearance',
      'Preparing periodic financial statements for review by the Treasurer Office',
      'Supporting internal and external audit processes with accurate documentation',
    ],
    audience:
      'Students and parents interact with the Account Office mainly at fee payment deadlines, typically in person at the start of each semester or via bank-based payment channels where available. Faculty and staff also engage with the office for reimbursements and other routine financial matters.',
    closing:
      "As the office where financial transactions are actually processed and recorded, the Account Office plays a practical, everyday role in keeping the institute's finances accurate, transparent, and up to date.",
  },

  '/discover/offices/finance-office/staff-office': {
    lead: [
      'The Staff Office manages the administrative side of human resources at SPIST, handling matters related to payroll, service records, and general staff administration for faculty and non-teaching employees.',
      'It operates under the Finance Office and works closely with the Treasurer Office and Admin Office on matters that touch both personnel records and payroll.',
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Maintaining service records for faculty and administrative staff',
      'Processing payroll inputs such as attendance, leave, and salary adjustments',
      'Managing staff appointment, promotion, and service-related documentation',
      'Coordinating leave applications and maintaining leave records',
      'Assisting with staff benefits, provident fund, and related entitlements where applicable',
      'Maintaining confidentiality and accuracy of personnel files',
      'Supporting HR-related correspondence between staff and institute leadership',
    ],
    audience:
      'Faculty and administrative staff are the primary users of the Staff Office, engaging with it for matters such as payroll queries, leave requests, and updates to personal or service records — typically in person or by submitting the relevant forms during office hours.',
    closing:
      "By keeping staff records accurate and payroll processes running smoothly, the Staff Office supports the institute's ability to retain a stable, well-supported workforce dedicated to its academic mission.",
  },

  '/discover/offices/examination-department/controller-examination': {
    lead: [
      'The Office of the Controller of Examinations is responsible for the overall conduct, integrity, and administration of examinations at SPIST, ensuring that assessment processes are fair, secure, and conducted in accordance with institutional and regulatory standards.',
      'As the senior authority overseeing the Examination Department, the Controller coordinates all stages of the examination cycle, from scheduling through to result compilation.',
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Planning and approving the examination calendar for all programmes',
      'Overseeing the secure preparation, printing, and handling of examination papers',
      'Ensuring examination venues, invigilation, and conduct procedures meet institutional standards',
      'Supervising the Form Section, Conduct Branch, and Results Section of the Examination Department',
      'Addressing cases of examination misconduct in line with institutional disciplinary procedures',
      'Approving and issuing official examination results and related certifications',
      'Ensuring examination processes comply with HEC and affiliating body regulations',
      'Handling appeals and re-checking requests related to examination results',
    ],
    audience:
      "Students interact with the Controller of Examinations' office primarily around examination scheduling, roll number issuance, result announcements, and formal appeals, usually through written application or during designated office hours. Academic departments coordinate with this office on assessment scheduling and grade submission.",
    closing:
      "The credibility of every degree, diploma, and certificate awarded by SPIST rests on the integrity of its examination system, making the Controller of Examinations' office central to safeguarding the institute's academic standards.",
  },

  '/discover/offices/examination-department/asst-controller-of-examination': {
    lead: [
      'The Assistant Controller of Examinations supports the Controller of Examinations in the day-to-day administration of the examination system, sharing responsibility for the smooth operational running of assessment processes across the institute.',
      'This office bridges the Controller’s overall authority and the specialised sections — Form, Conduct, and Results — that carry out the practical work of each examination cycle.',
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Assisting in the planning and scheduling of examinations across all programmes',
      'Coordinating with department heads on examination logistics and invigilation staffing',
      'Supervising the preparation and secure handling of examination-related documentation',
      'Monitoring the work of the Form Section, Conduct Branch, and Results Section',
      'Assisting in the review of examination misconduct cases and disciplinary reports',
      'Supporting the compilation and verification of results prior to announcement',
      'Responding to routine student and faculty queries related to examinations',
    ],
    audience:
      'Students and faculty typically approach this office for matters that need attention between examination cycles or when the Controller of Examinations is unavailable, and for day-to-day operational queries about scheduling, forms, or results — generally handled during office hours or via written request.',
    closing:
      "By sharing the operational load of examination administration, the Assistant Controller's office helps ensure that assessments proceed on schedule and that the institute's examination standards are consistently maintained.",
  },

  '/discover/offices/examination-department/form-section': {
    lead: [
      'The Form Section of the Examination Department manages the submission, processing, and verification of examination forms — the formal step by which eligible students are registered to sit a given examination.',
      'It is one of the first points of contact for students as each examination cycle begins.',
    ],
    responsibilitiesHeading: 'What We Do',
    responsibilities: [
      'Distributing and collecting examination admission forms ahead of each examination cycle',
      'Verifying student eligibility, fee clearance, and attendance requirements before form processing',
      'Recording and reconciling submitted forms against enrollment and registration data',
      'Issuing roll numbers and admit cards to eligible candidates',
      'Coordinating with the Account Office to confirm examination fee payment',
      'Maintaining records of form submission deadlines, late submissions, and exemptions',
      'Resolving discrepancies in student information prior to examination day',
    ],
    audience:
      'Students interact directly with the Form Section at the start of each examination cycle to submit forms and later to collect admit cards, typically in person within announced deadlines. Academic departments coordinate with the section to confirm student eligibility lists.',
    closing:
      "Accurate, timely form processing ensures that only eligible students appear for examinations and that the institute's assessment records remain consistent from registration through to results, supporting the overall integrity of the examination system.",
  },

  '/discover/offices/examination-department/conduct-branch': {
    lead: [
      'The Conduct Branch is responsible for the practical administration of examinations on the day they are held — arranging venues, invigilation, and the procedures that ensure examinations are conducted fairly and securely.',
      'It works under the direction of the Controller of Examinations to uphold discipline and integrity throughout the assessment process.',
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Arranging examination venues, seating plans, and invigilation staffing',
      'Ensuring examination material is handled securely before, during, and after each paper',
      'Enforcing examination rules and conduct standards among candidates',
      'Recording attendance and managing candidate check-in on examination days',
      'Investigating and reporting incidents of misconduct or irregularity during examinations',
      'Coordinating with the Controller of Examinations on disciplinary follow-up where required',
      'Maintaining logs and documentation for each examination session',
    ],
    audience:
      'Students experience the Conduct Branch’s work directly on examination days, through venue arrangements and invigilation, while faculty members assisting as invigilators coordinate with the branch on procedures and schedules. Formal queries or concerns about the conduct of a particular examination are generally raised in writing with the Examination Department.',
    closing:
      'By upholding order and fairness at the point where assessment actually happens, the Conduct Branch protects the credibility of every examination conducted at SPIST and, by extension, the value of the qualifications the institute awards.',
  },

  '/discover/offices/examination-department/results-section': {
    lead: [
      'The Results Section compiles, verifies, and prepares for announcement the outcomes of examinations conducted at SPIST, translating raw assessment data into the official transcripts and result notifications students rely on.',
      'Working under the Examination Department, it is the final stage of each examination cycle.',
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Collecting and compiling marks and grades submitted by academic departments',
      'Verifying result data for accuracy and consistency before compilation',
      'Preparing official result sheets, gazettes, and transcripts',
      'Coordinating with the Controller of Examinations on result approval and release',
      'Processing applications for re-checking or re-evaluation of results',
      'Maintaining a permanent archive of examination results for future reference',
      'Issuing duplicate or corrected result documents on request',
    ],
    audience:
      'Students engage with the Results Section primarily after each examination cycle, to view or collect results and to submit re-checking applications where permitted, typically through the Examination Department during announced windows. The Registrar’s Office and academic departments rely on the section’s compiled data for record-keeping and progression decisions.',
    closing:
      'Accurate and timely results are the outcome every student and department is waiting for at the end of an examination cycle, and the care taken by the Results Section directly affects student progression, transcripts, and the institute’s academic record.',
  },

  '/discover/offices/dsa/director-student-office': {
    lead: [
      'The Directorate of Student Affairs (DSA) is responsible for student welfare, discipline, and the overall quality of student life outside the classroom at SPIST.',
      'The Director Student Office leads this directorate, coordinating the range of services and activities that support students through their time at the institute.',
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Overseeing student welfare services, including guidance and support for personal or academic difficulties',
      "Maintaining student discipline and administering the institute's code of conduct",
      'Coordinating student societies, clubs, and co-curricular activities',
      'Organising sports, cultural events, seminars, and other student engagement programmes',
      'Facilitating scholarship and financial assistance processes where applicable',
      'Handling student grievances and disciplinary matters in coordination with academic departments',
      'Supporting orientation programmes for newly admitted students',
      'Liaising between students and institute administration on matters affecting student life',
    ],
    audience:
      'Students are the primary constituency of the DSA, engaging with it for society registration, event participation, welfare concerns, and disciplinary matters, typically in person during office hours or through written applications. Faculty and parents also engage with the office on matters concerning student conduct or welfare.',
    closing:
      'By attending to student welfare and campus life alongside academics, the DSA helps SPIST develop well-rounded graduates and supports the institute’s broader mission of producing confident, disciplined, and socially engaged citizens.',
  },

  '/oric': {
    lead: [
      "The Office of Research, Innovation & Commercialization (ORIC) leads SPIST's efforts to build a culture of research, encourage innovation among faculty and students, and connect academic work with real-world application and industry.",
      "ORIC acts as the institute's central coordinating body for research activity, working across faculties and departments to support projects from initial idea through to publication or commercialisation.",
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Promoting and facilitating faculty and student research across all departments',
      "Coordinating interdisciplinary research initiatives that draw on more than one department's expertise",
      'Supporting applications for research grants and funding from HEC and other bodies',
      "Assisting with the publication and dissemination of research, including the institute's research journal",
      'Building linkages with industry, government, and other institutions for collaborative research and commercialisation',
      'Providing guidance on research ethics, intellectual property, and commercialisation pathways',
      'Maintaining physical facilities and administrative support for research activity',
      'Organising seminars, workshops, and training to build research capacity among faculty and students',
    ],
    audience:
      'Faculty members and student researchers are the primary users of ORIC, engaging with it to seek research support, funding guidance, or collaboration opportunities, typically by appointment or written proposal. External partners from industry and other institutions also engage with ORIC to explore research and commercialisation partnerships.',
    closing:
      "By nurturing research and innovation alongside teaching, ORIC helps SPIST contribute new knowledge and practical solutions to the challenges facing South Punjab and the wider region, strengthening the institute's role as a centre of academic excellence.",
  },

  '/discover/offices/qec/director-office': {
    lead: [
      "The Director's Office of the Quality Enhancement Cell (QEC) leads SPIST's institutional commitment to maintaining and improving academic and administrative quality across all programmes.",
      "It provides overall direction for the quality assurance processes that align the institute's practices with HEC standards and good academic governance.",
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Setting the strategic direction for quality assurance activities across the institute',
      'Overseeing the design and implementation of self-assessment reports for academic programmes',
      'Ensuring institutional compliance with HEC quality assurance frameworks and standards',
      'Coordinating internal reviews of teaching, curriculum, and administrative processes',
      "Liaising with HEC's Quality Assurance Agency and other external accreditation bodies",
      'Reporting quality assurance findings and recommendations to institute leadership',
      'Promoting a culture of continuous improvement among faculty and departments',
    ],
    audience:
      "Academic departments and faculty are the primary partners of the Director's Office in quality assurance activities, engaging through self-assessment exercises, curriculum reviews, and feedback processes. Institute leadership relies on the office for periodic reporting on quality standards and compliance.",
    closing:
      "Consistent quality assurance underpins the institute's academic credibility and its recognition by HEC, and the Director's Office of QEC plays a central role in ensuring that SPIST's programmes continue to meet and exceed the standards expected of a higher education institution.",
  },

  '/discover/offices/qec/deputy-director': {
    lead: [
      "The Deputy Director of the Quality Enhancement Cell supports the Director's Office in carrying out the day-to-day work of quality assurance, translating institutional quality policy into practical processes across departments.",
      "This office plays a hands-on role in coordinating the reviews, surveys, and compliance checks that keep SPIST's quality assurance framework functioning.",
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Coordinating the preparation and review of programme self-assessment reports',
      'Assisting in the design and administration of student and faculty feedback surveys',
      'Monitoring compliance with quality assurance procedures at the department level',
      'Supporting curriculum review processes in coordination with academic departments',
      'Compiling data and documentation for institutional accreditation exercises',
      'Assisting with training sessions on quality assurance practices for faculty',
      'Maintaining QEC records, reports, and documentation',
    ],
    audience:
      "Academic departments and faculty engage with the Deputy Director's office directly during self-assessment cycles, surveys, and curriculum reviews, typically through scheduled meetings and documentation submissions coordinated with the QEC office.",
    closing:
      "By managing the operational side of quality assurance, the Deputy Director's office ensures that quality enhancement is not just a policy on paper but an active, ongoing process embedded in the institute's academic departments.",
  },

  '/discover/offices/qec/our-staff-office': {
    lead: [
      "The Staff Office of the Quality Enhancement Cell handles the administrative operations that support QEC's quality assurance activities, from document management to coordination of reviews and reporting.",
      "It provides the administrative backbone that allows the Director's and Deputy Director's offices to focus on quality assurance policy and oversight.",
    ],
    responsibilitiesHeading: 'What We Do',
    responsibilities: [
      'Maintaining records, reports, and documentation related to quality assurance activities',
      'Assisting in scheduling and organising meetings, reviews, and survey administration',
      'Supporting communication between QEC and academic departments',
      'Preparing correspondence and notices related to quality assurance processes',
      'Organising and archiving self-assessment reports and accreditation documentation',
      'Providing general administrative support to QEC leadership',
    ],
    audience:
      'Faculty and department coordinators interact with this office mainly for administrative matters related to quality assurance documentation and scheduling, generally by email or in person during office hours.',
    closing:
      "Reliable administrative support allows QEC's quality assurance work to proceed smoothly and its findings to be properly documented, contributing to the institute's ability to demonstrate and sustain academic quality over time.",
  },

  '/discover/offices/central-library/librarian': {
    lead: [
      'The Librarian leads the Central Library at SPIST, overseeing the institute’s print and digital collections and the services that make these resources accessible to students and faculty.',
      'The library serves as a core academic support facility, underpinning coursework, research, and independent study across all faculties.',
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Managing the acquisition, cataloguing, and organisation of books, journals, and reference materials',
      'Overseeing circulation services, including borrowing, returns, and reservation of materials',
      'Maintaining and expanding access to digital resources and online academic databases where available',
      'Assisting students and faculty with research and reference queries',
      'Ensuring the library environment supports quiet study, group work, and academic research',
      'Coordinating with academic departments on subject-specific resource needs',
      'Maintaining library policies on borrowing periods, fines, and resource preservation',
    ],
    audience:
      'Students and faculty are the primary users of the library, visiting in person to borrow materials, study, or seek research assistance, generally during published library hours. Academic departments coordinate with the Librarian on resource acquisitions aligned with their curricula.',
    closing:
      "As a shared academic resource open to the whole institute, the Central Library and its Librarian support the reading, research, and independent learning that complement classroom teaching, reinforcing SPIST's broader commitment to academic excellence.",
  },

  '/discover/offices/security-office/chief-security-office': {
    lead: [
      "The Chief Security Office is responsible for the safety and security of SPIST's campus, overseeing the personnel and procedures that protect students, faculty, staff, and institutional property.",
      'It works to maintain a secure, orderly environment in which teaching, research, and campus life can proceed without disruption.',
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Supervising campus security personnel and their daily deployment',
      'Monitoring access to campus buildings, gates, and restricted areas',
      'Coordinating security arrangements for examinations, events, and official visits',
      'Responding to and documenting security incidents on campus',
      'Liaising with local law enforcement where required',
      'Overseeing safety protocols, including fire safety and emergency response procedures',
      'Maintaining visitor management and vehicle access procedures',
    ],
    audience:
      'All members of the campus community — students, faculty, and staff — benefit from and interact with the Chief Security Office, most commonly through campus access procedures, event security arrangements, or when reporting a security concern, generally addressed in person or by contacting campus security directly.',
    closing:
      "A safe and well-managed campus is a precondition for effective teaching and learning, and the Chief Security Office's work supports every other function of the institute by maintaining the secure environment in which they take place.",
  },

  /* -------------------------------------------------------------------- */
  /* Top-level ORIC section                                               */
  /* -------------------------------------------------------------------- */

  '/oric/interdisciplinary-research': {
    lead: [
      'Interdisciplinary Research at SPIST brings together faculty and students from different departments and faculties to work on research questions that benefit from combined expertise — spanning the sciences, technology, and language studies represented across the institute.',
      "Coordinated through ORIC, this initiative encourages collaboration beyond single-department boundaries, reflecting the reality that many of today's most pressing problems require more than one discipline to address.",
    ],
    responsibilitiesHeading: 'What We Do',
    responsibilities: [
      'Identifying and encouraging research opportunities that span multiple departments or faculties',
      'Facilitating collaboration between faculty members from different academic backgrounds',
      'Coordinating shared use of measurement tools, facilities, and administrative resources across research teams',
      'Supporting joint research proposals and funding applications',
      'Organising seminars and forums where interdisciplinary research findings can be shared',
      'Connecting student researchers with faculty mentors across departments',
      'Maintaining links with the Research Journal and other ORIC functions for dissemination of findings',
    ],
    audience:
      'Faculty members and student researchers interested in collaborative, cross-department projects are the primary participants in interdisciplinary research initiatives, typically coordinating through ORIC to identify partners, resources, and support for their work.',
    closing:
      "By breaking down departmental silos, interdisciplinary research strengthens the depth and relevance of the work produced at SPIST, supporting the institute's broader mission of contributing meaningful research and innovation to the region.",
  },

  '/oric/interdisciplinary-research/measurement': {
    lead: [
      'The Measurement function under Interdisciplinary Research addresses the standards, tools, and methodologies used to collect and analyse data across research projects at SPIST, ensuring consistency and reliability regardless of which department a project originates from.',
      'Reliable measurement practice is foundational to credible research, and this function supports researchers in applying appropriate methods to their work.',
    ],
    responsibilitiesHeading: 'What We Do',
    responsibilities: [
      'Providing guidance on measurement standards and methodologies appropriate to different research areas',
      'Supporting access to calibrated instruments and measurement equipment used in research',
      'Assisting researchers in selecting appropriate data collection and analysis methods',
      'Promoting consistency in measurement practice across interdisciplinary projects',
      'Coordinating with laboratory and facilities staff on equipment maintenance and calibration',
      'Supporting training on measurement techniques for student researchers',
    ],
    audience:
      'Faculty and student researchers engaged in data-driven or laboratory-based research are the main users of this function, typically consulting it during the planning stages of a project to determine appropriate measurement approaches and instrumentation.',
    closing:
      'Sound measurement practice gives research findings their credibility, and by supporting consistent, well-founded methodologies, this function helps ensure that research conducted at SPIST meets recognised academic standards.',
  },

  '/oric/interdisciplinary-research/physical-facilities': {
    lead: [
      "The Physical Facilities function under Interdisciplinary Research covers the laboratories, equipment, and infrastructure that support research activity across SPIST's departments.",
      'It ensures that faculty and students undertaking research have access to appropriately equipped spaces in which to carry out their work.',
    ],
    responsibilitiesHeading: 'What We Do',
    responsibilities: [
      'Coordinating access to laboratories and research spaces for interdisciplinary projects',
      'Maintaining an inventory of research equipment and instrumentation',
      'Scheduling shared use of facilities among research teams from different departments',
      'Supporting the upkeep and maintenance of laboratory infrastructure',
      'Advising on facility and equipment requirements for proposed research projects',
      'Coordinating with departments to identify and address infrastructure gaps',
    ],
    audience:
      'Faculty and students undertaking laboratory-based or equipment-dependent research rely on this function to access and schedule the physical spaces and instruments their work requires, generally coordinated through ORIC and the relevant academic department.',
    closing:
      "Well-maintained facilities are essential to producing credible, hands-on research, and this function's work in coordinating physical infrastructure directly supports the quality and feasibility of research undertaken across the institute.",
  },

  '/oric/interdisciplinary-research/administrative-support': {
    lead: [
      'The Administrative Support function under Interdisciplinary Research handles the paperwork, coordination, and logistics that keep collaborative research projects moving — from proposal submission through to reporting.',
      'It relieves faculty researchers of much of the administrative burden associated with multi-department projects, allowing them to focus on the research itself.',
    ],
    responsibilitiesHeading: 'What We Do',
    responsibilities: [
      'Assisting with the preparation and submission of interdisciplinary research proposals',
      'Coordinating documentation and approvals required for collaborative projects',
      'Maintaining records of ongoing and completed interdisciplinary research initiatives',
      'Supporting budget tracking and resource allocation for funded research projects',
      'Facilitating communication and scheduling among researchers from different departments',
      'Assisting with compliance and reporting requirements tied to research funding',
    ],
    audience:
      "Faculty leading or participating in interdisciplinary research projects are the main users of this support function, engaging with it throughout a project's lifecycle for documentation, coordination, and reporting needs, typically through ORIC.",
    closing:
      'By handling the administrative side of collaborative research, this function allows interdisciplinary projects at SPIST to proceed efficiently, supporting the institute’s goal of producing meaningful cross-disciplinary work.',
  },

  '/oric/research-journal': {
    lead: [
      "The Research Journal is SPIST's platform for publishing scholarly work produced by its faculty and students, providing a formal outlet for research findings across the institute's areas of study.",
      "Coordinated through ORIC, the journal supports the institute's broader goal of contributing to the wider body of academic knowledge in the sciences, technology, and related fields.",
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Inviting and reviewing submissions of original research from faculty and students',
      'Coordinating the peer-review process to maintain academic quality and rigour',
      'Managing the editorial process from submission through to publication',
      'Ensuring published work meets recognised academic and ethical publishing standards',
      'Maintaining an archive of published issues for reference and citation',
      'Promoting the journal to encourage wider readership and submissions',
      'Supporting authors with guidance on manuscript preparation and academic writing',
    ],
    audience:
      "Faculty members and student researchers seeking to publish their work are the primary contributors to the Research Journal, submitting manuscripts through ORIC in line with the journal's submission guidelines. Readers within and beyond the institute engage with the journal to access published research.",
    closing:
      "A functioning research journal strengthens an institute's academic standing and gives its researchers a recognised platform for their work, supporting SPIST's ambition to be a genuine contributor to research and knowledge, not just a consumer of it.",
  },

  '/oric/oric-introduction': {
    lead: [
      "This section introduces the Office of Research, Innovation & Commercialization (ORIC) at SPIST — its purpose, structure, and the role it plays in advancing the institute's research agenda.",
      'ORIC was established in line with the practice at HEC-recognised institutions of maintaining a dedicated office to coordinate research, encourage innovation, and connect academic work with practical and commercial application.',
    ],
    responsibilitiesHeading: 'What ORIC Covers',
    responsibilities: [
      'Coordinating research activity across all faculties and departments at SPIST',
      'Supporting interdisciplinary research initiatives, including shared measurement, facilities, and administrative resources',
      "Publishing faculty and student research through the institute's Research Journal",
      'Assisting faculty and students with research funding and grant applications',
      'Building linkages with industry, government bodies, and other academic institutions',
      'Promoting innovation and the commercialisation of viable research outcomes',
      'Organising research-related training, seminars, and capacity-building activities',
    ],
    audience:
      "This introduction is intended for faculty, students, and external partners who want to understand how ORIC is organised and how to engage with its various functions — whether for research support, publication, or collaboration — with further detail available through ORIC's specific sub-sections.",
    closing:
      'By setting out ORIC’s purpose and scope, this introduction helps the wider SPIST community and its external partners understand how research and innovation are coordinated at the institute, and how to become involved in that work.',
  },

  /* -------------------------------------------------------------------- */
  /* Top-level navigation landing pages                                   */
  /* -------------------------------------------------------------------- */

  '/discover/overview': {
    lead: [
      'South Punjab Institute of Science & Technology (SPIST) is a public sector higher education institute located in Dera Ghazi Khan, established to expand access to quality science, technology, and professional education for students across South Punjab. Operating under the regulatory oversight of the Higher Education Commission (HEC) and administered within the framework of the Government of Punjab, SPIST is committed to delivering higher education that meets recognised national standards.',
      'The institute brings together academic departments, administrative offices, and student support services on a single campus, offering undergraduate degree programs alongside diploma and certificate courses designed to prepare graduates for further study or direct entry into the workforce. This Discover SPIST section is the starting point for understanding how the institute is organised and what it offers.',
    ],
    responsibilitiesHeading: 'What SPIST Offers',
    responsibilities: [
      'Undergraduate degree programs across science, technology, and language departments, taught by qualified faculty',
      'Diploma and certificate courses aimed at building practical, career-focused skills',
      'Campus facilities including teaching laboratories, a central library, and computer labs',
      'Dedicated administrative offices covering admissions, examinations, student affairs, and finance',
      'A Quality Enhancement Cell (QEC) responsible for maintaining academic and administrative standards',
      'An Office of Research, Innovation & Commercialization (ORIC) supporting faculty and student research',
      'Recognition and regulatory oversight from HEC and the Government of Punjab',
    ],
    audience:
      "Discover SPIST is written for prospective students and their families weighing their higher education options, as well as for current students, faculty candidates, and visiting partners who want a clear picture of how the institute is structured. From here, visitors can explore the institute's vision and mission, its academic departments, and the administrative offices — including the Rector's Office, Registrar, Examination Department, DSA, Finance Office, QEC, and Central Library — that support day-to-day operations.",
    closing:
      "Together, these sections are intended to give a complete, honest picture of what studying or working at SPIST involves, reflecting the institute's ongoing role in expanding access to higher education and skilled employment opportunities across the Dera Ghazi Khan region and South Punjab more broadly.",
  },

  '/qec': {
    lead: [
      'The Quality Enhancement Cell (QEC) is the institutional body at South Punjab Institute of Science & Technology (SPIST) responsible for monitoring, safeguarding, and continuously improving academic and administrative quality across every faculty and department, in line with the quality assurance framework set out by the Higher Education Commission (HEC).',
      "QEC operates as an institute-wide function rather than a single office, working with academic departments, the administration, and institute leadership to build a consistent culture of self-assessment, review, and improvement. Its leadership and day-to-day operations are carried out through the Director Office, Deputy Director, and Staff Office detailed further under Discover SPIST > Office.",
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Developing and implementing institute-wide quality assurance policies and procedures',
      'Coordinating self-assessment reports (SARs) for academic programs on a periodic basis',
      'Facilitating internal reviews and supporting external accreditation and audit exercises',
      'Administering student and faculty feedback surveys on teaching, courses, and facilities',
      'Supporting academic departments in curriculum review and alignment with HEC standards',
      'Monitoring the implementation of quality improvement recommendations across departments',
      "Liaising with HEC's Quality Assurance Agency and other relevant regulatory bodies",
      'Promoting awareness of quality assurance practices among faculty, staff, and students',
    ],
    audience:
      "Academic departments and faculty are QEC's closest partners, engaging with it through self-assessment cycles, curriculum reviews, and survey participation, while students contribute primarily through feedback on teaching and courses. Institute leadership relies on QEC for periodic reporting on academic and administrative quality.",
    closing:
      "By embedding regular review and improvement into how SPIST operates, QEC protects the credibility of the institute's degrees and diplomas and supports its continued recognition as a quality-assured higher education institute under the HEC framework.",
  },

  '/examination': {
    lead: [
      'The Examination Department at South Punjab Institute of Science & Technology (SPIST) is responsible for the planning, conduct, and administration of examinations across all degree, diploma, and certificate programs offered by the institute, ensuring that assessment is carried out fairly, securely, and in line with institutional and HEC-aligned standards.',
      "The department's overall responsibilities are carried out through several specialised sections — including the Controller of Examinations, Assistant Controller of Examinations, Form Section, Conduct Branch, and Results Section — each covering a distinct stage of the examination cycle, from registration through to result announcement.",
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      'Preparing and publishing the examination calendar and date sheets for all programs',
      'Issuing examination rules, regulations, and eligibility requirements to students and departments',
      'Coordinating the secure preparation, printing, and handling of examination papers',
      'Overseeing the conduct of examinations, including venue arrangements and invigilation',
      'Managing the compilation, verification, and announcement of results',
      'Processing applications for re-checking, re-evaluation, and duplicate result documents',
      'Maintaining the security, confidentiality, and long-term integrity of examination records',
      'Handling examination-related grievances and appeals in coordination with academic departments',
    ],
    audience:
      'Students interact with the Examination Department at multiple points every semester — submitting examination forms, sitting papers, collecting results, and occasionally filing appeals — usually in person during announced windows or through written application. Academic departments coordinate with the department on assessment scheduling and grade submission.',
    closing:
      "The integrity of every degree, diploma, and certificate SPIST awards depends on the department's careful, consistent administration of examinations, making it one of the institute's most closely regulated and trusted functions.",
  },

  '/dsa': {
    lead: [
      'The Directorate of Student Affairs (DSA) is the institute-wide function at South Punjab Institute of Science & Technology (SPIST) responsible for student welfare, discipline, and the overall quality of campus life outside the classroom.',
      'DSA is led by the Director Student Office, detailed further under Discover SPIST > Office, and coordinates a range of services, activities, and support structures — from societies and sports to welfare and discipline — that shape a student’s experience at SPIST beyond academic coursework.',
    ],
    responsibilitiesHeading: 'What DSA Covers',
    responsibilities: [
      'Student welfare and guidance support for personal or academic difficulties',
      "Discipline and enforcement of the institute's code of conduct",
      'Registration and oversight of student societies, clubs, and interest groups',
      'Planning of sports competitions, cultural events, and seminars',
      'Orientation programs to help newly admitted students settle in',
      'Coordination of scholarship and financial assistance processes where applicable',
      'Resolution of student grievances in coordination with academic departments',
      'Ongoing liaison between the student body and institute leadership',
    ],
    audience:
      'Students are the primary users of DSA’s services, approaching it to register societies, take part in events, raise welfare concerns, or address disciplinary matters — typically in person or via written application during office hours. Parents and faculty also engage with DSA when matters of student conduct or wellbeing arise.',
    closing:
      'By giving equal attention to student life and student learning, DSA helps SPIST produce graduates who are not only academically capable but also disciplined, socially engaged, and prepared for life beyond the institute.',
  },

  '/treasurer': {
    lead: [
      "The Treasurer's Office is the senior financial authority at South Punjab Institute of Science & Technology (SPIST), responsible for institute-wide management of budgets, fee policy, and financial oversight in line with regulations set by the Higher Education Commission (HEC) and the Government of Punjab.",
      "The Treasurer's Office sets financial policy and direction for the institute, with day-to-day transaction processing, payroll, and account-keeping carried out by the Finance Office's Account Office and Staff Office, detailed further under Discover SPIST > Office.",
    ],
    responsibilitiesHeading: 'Key Responsibilities',
    responsibilities: [
      "Preparing and monitoring the institute's annual budget and expenditure plans",
      'Setting tuition fee structures and fee collection policy',
      'Overseeing financial record-keeping, internal controls, and audit processes',
      'Approving institutional expenditure within approved budgetary allocations',
      'Ensuring compliance with financial regulations set by HEC and the Government of Punjab',
      'Advising institute leadership on financial planning and resource allocation',
      'Coordinating payroll policy in conjunction with the Staff Office',
      "Overseeing the accuracy and transparency of the institute's financial reporting",
    ],
    audience:
      "Students and families interact with matters overseen by the Treasurer's Office mainly around fee structures and payment policy, generally handled in practice through the Account Office, while faculty and staff engage with it indirectly through payroll and expenditure matters. Policy-level or higher-value financial questions are addressed directly to the Treasurer's Office, typically by appointment or written correspondence.",
    closing:
      "Sound, transparent financial management underpins every part of institutional life, from faculty salaries to laboratory equipment and campus upkeep, and the Treasurer's Office's oversight ensures that SPIST's resources are used responsibly in support of its academic mission.",
  },

  '/library': {
    lead: [
      "The Central Library at South Punjab Institute of Science & Technology (SPIST) is the institute's principal academic resource centre, providing print and digital collections, reading spaces, and research support to students and faculty across all departments.",
      'Led by the Librarian, detailed further under Discover SPIST > Office, the library underpins coursework, independent study, and research activity throughout a student’s academic career at SPIST.',
    ],
    responsibilitiesHeading: 'Our Services',
    responsibilities: [
      "Maintaining a collection of textbooks, reference works, and journals across the institute's academic disciplines",
      'Operating circulation services for borrowing, returning, and reserving materials',
      'Providing access to digital resources and online academic databases where available',
      'Offering quiet study areas and space for group work and research',
      'Assisting students and faculty with reference and research queries',
      'Coordinating with academic departments on subject-specific resource needs',
      'Maintaining clear policies on borrowing periods, renewals, and resource care',
    ],
    audience:
      "Students and faculty are the library's primary users, visiting to borrow materials, study, or seek research assistance, typically during published library hours. Academic departments coordinate with the library on acquisitions aligned with their curricula and research needs.",
    closing:
      "As a shared resource open to the whole institute, the Central Library supports the reading, research, and independent learning that complement classroom teaching, reinforcing SPIST's broader commitment to academic excellence.",
  },
};

/* ---------------------------------------------------------------------------
 * Confirmed office contact emails — only these pages show a page-specific
 * address; every other page falls back to the general institute contact
 * shown by default in `PageSidebar`.
 * ------------------------------------------------------------------------ */
export const officeContactEmails = {
  '/discover/offices/rector-office/rector-office': 'Rector@spist.edu.pk',
  '/discover/offices/administration-offices/admin-office': 'Admin@spist.edu.pk',
  '/discover/offices/examination-department/conduct-branch': 'conduct@spist.edu.pk',
  '/discover/offices/examination-department/form-section': 'form@spist.edu.pk',
  '/discover/offices/finance-office/treasurer-office': 'treasur@spist.edu.pk',
  '/oric': 'oric@spist.edu.pk',
  '/discover/offices/dsa/director-student-office': 'DSA@spist.edu.pk',
  '/discover/offices/rector-office/ps-to-rector': 'PsRector@spist.edu.pk',
  '/discover/offices/administration-offices/registrar': 'registrar@spist.edu.pk',
  '/discover/offices/administration-offices/registration-branch': 'adregistration@spist.edu.pk',
  '/discover/offices/examination-department/controller-examination': 'controller@spist.edu.pk',
  '/discover/offices/examination-department/asst-controller-of-examination': 'adresult@spist.edu.pk',
  '/discover/offices/qec/director-office': 'qec@spist.edu.pk',
};

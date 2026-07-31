/* ============================================================================
 * SPIST — Students page content.
 *
 * Structured copy for the top-level "Students" page (`src/pages/StudentsPage.jsx`):
 * a campus-life intro, the Student Support Services card grid, and a closing
 * note on campus environment and safety.
 *
 * Content is deliberately descriptive/functional and avoids inventing
 * statistics (book counts, student counts, etc.) that would need verification.
 * ==========================================================================*/

export const studentLife = {
  intro: {
    heading: 'Campus Life at SPIST',
    paragraphs: [
      'Student life at SPIST is shaped as much by what happens outside the classroom as by what happens inside it. Alongside coursework and lab work, students take part in co-curricular activities, make use of shared campus facilities, and draw on a range of support services designed to help them succeed academically and personally throughout their time at the institute.',
      'From joining a club or society to visiting the library between classes, students are encouraged to make full use of campus life as part of a well-rounded educational experience.',
    ],
  },

  supportServices: {
    heading: 'Student Support Services',
    intro:
      'A range of support services help students settle in, stay on track academically, and make the most of their time at SPIST.',
    items: [
      {
        id: 'library',
        title: 'Central Library',
        description:
          'The Central Library gives students access to books, academic journals, and digital resources that support coursework and research across all departments. Reading spaces are available for individual study as well as group work, with staff on hand to help students find the material they need.',
      },
      {
        id: 'sports',
        title: 'Sports & Co-Curricular Activities',
        description:
          'SPIST encourages students to stay active and engaged beyond their academic schedule through sports facilities and a range of student clubs and societies. These activities build teamwork, discipline, and confidence alongside the personal development that comes from pursuing shared interests outside the classroom.',
      },
      {
        id: 'career',
        title: 'Career Counselling',
        description:
          'The Career Counselling service helps students think through their career direction, identify the skills they will need, and understand the professional opportunities open to them after graduation. Guidance is offered individually so students can make informed decisions about their academic and career path.',
      },
      {
        id: 'scholarships',
        title: 'Scholarships & Financial Aid',
        description:
          'SPIST recognises that the cost of higher education can be a barrier for many families and works to support eligible students through scholarships and financial aid. Students who need assistance can approach the relevant office to learn about the options available to them.',
      },
      {
        id: 'it-labs',
        title: 'IT Labs & Digital Resources',
        description:
          'Computer labs give students reliable access to the software and digital resources needed for coursework, assignments, and research across departments. Lab staff and faculty are available to help students make the most of these facilities as part of their studies.',
      },
      {
        id: 'health',
        title: 'Health & Wellness Support',
        description:
          "Basic on-campus health support is available to students for common health concerns that arise during the academic day, along with guidance on where to seek further care when needed, so that minor health issues don't stand in the way of a student's studies.",
      },
      {
        id: 'counselling',
        title: 'Student Counselling Services',
        description:
          'Confidential counselling is available to students navigating academic pressure, personal challenges, or the everyday adjustments of student life, giving them a private space to work through concerns and find a way forward.',
      },
      {
        id: 'clubs',
        title: 'Clubs & Societies',
        description:
          'Student-led clubs and societies give students the chance to take on leadership roles, organise activities, and connect with peers who share their interests — playing an important part in building a sense of community on campus.',
      },
    ],
  },

  closing: {
    heading: 'A Safe, Supportive Campus',
    paragraphs: [
      'SPIST is committed to maintaining a campus environment where students can focus on their studies with confidence. Security arrangements, clear conduct guidelines, and attentive administrative staff work together to help keep the campus safe and orderly for everyone who studies and works here.',
      'Beyond physical safety, the institute aims to foster a respectful and welcoming atmosphere in which students from different backgrounds feel supported in their academic journey. Faculty and staff are encouraged to remain approachable, so that any concern a student raises is heard and addressed promptly.',
    ],
  },
};

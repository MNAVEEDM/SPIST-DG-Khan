import DepartmentPage from '../../components/DepartmentPage';
import { departmentFaculty, faculties } from '../../data/site';

const programs = faculties
  .flatMap((faculty) => faculty.programs)
  .filter((program) => program.department === 'Department of English');

export default function EnglishDepartment() {
  return (
    <DepartmentPage
      departmentName="Department of English"
      intro="Part of the Faculty of Languages — advanced study of English language, literature and communication."
      programs={programs}
      facultyList={departmentFaculty.english}
      deanEmail="Dean@spist.edu.pk"
    />
  );
}

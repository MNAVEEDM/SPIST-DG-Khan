import DepartmentPage from '../../components/DepartmentPage';
import { departmentFaculty, faculties } from '../../data/site';

const programs = faculties
  .flatMap((faculty) => faculty.programs)
  .filter((program) => program.department === 'Department of Computer Science');

export default function ComputerScienceDepartment() {
  return (
    <DepartmentPage
      departmentName="Department of Computer Science"
      intro="Part of the Faculty of Pure and Applied Sciences — practical, lab-based instruction in programming, systems and computing fundamentals."
      programs={programs}
      facultyList={departmentFaculty['computer-science']}
    />
  );
}

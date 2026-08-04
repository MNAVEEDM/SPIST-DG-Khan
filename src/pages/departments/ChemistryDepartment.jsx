import DepartmentPage from '../../components/DepartmentPage';
import { departmentFaculty, faculties } from '../../data/site';

const programs = faculties
  .flatMap((faculty) => faculty.programs)
  .filter((program) => program.department === 'Department of Chemistry');

export default function ChemistryDepartment() {
  return (
    <DepartmentPage
      departmentName="Department of Chemistry"
      intro="Part of the Faculty of Pure and Applied Sciences — laboratory-driven instruction in organic, inorganic, physical and analytical chemistry."
      programs={programs}
      facultyList={departmentFaculty.chemistry}
    />
  );
}

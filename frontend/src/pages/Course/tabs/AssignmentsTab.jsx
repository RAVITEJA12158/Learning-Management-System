import React from 'react';
import CourseAssignmentsManager from '../../../components/CourseAssignmentsManager';

export function AssignmentsTab({ courseId, isCreatorOrStaff, isEnrolled }) {
  return (
    <div className="p-6">
      <CourseAssignmentsManager
        courseId={courseId}
        canManage={isCreatorOrStaff}
        isEnrolled={isEnrolled}
      />
    </div>
  );
}

export default AssignmentsTab;

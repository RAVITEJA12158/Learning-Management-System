import React from 'react';

exports.USER_ROLES = exports.SUBMISSION_STATUS = exports.SORT_OPTIONS = exports.SEMESTERS = exports.QUESTION_TYPES = exports.ENROLLMENT_STATUS = exports.DEFAULT_GRADE_COMPONENTS = exports.COURSE_CATEGORIES = exports.CONTENT_TYPES = exports.ATTENDANCE_STATUS = void 0;
/**
 * Application Constants & Database Schema Enums (PERN LMS Specification)
 */

const USER_ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin'
};
const COURSE_CATEGORIES = ['All Categories', 'Computer Science', 'Artificial Intelligence', 'Data Science', 'Mathematics', 'Software Engineering', 'Cybersecurity'];
const SEMESTERS = ['All Semesters', 'Fall 2026', 'Spring 2026', 'Fall 2025', 'Fall 2024', 'Spring 2024'];
const SORT_OPTIONS = [{
  value: 'Popularity',
  label: 'Popularity'
}, {
  value: 'Title',
  label: 'Title (A-Z)'
}, {
  value: 'Course Code',
  label: 'Course Code'
}];
const CONTENT_TYPES = {
  PDF: 'PDF',
  VIDEO: 'VIDEO',
  LINK: 'LINK',
  FILE: 'FILE',
  TEXT: 'TEXT'
};
const QUESTION_TYPES = {
  MCQ: 'MCQ',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  TRUE_FALSE: 'TRUE_FALSE',
  SHORT_ANSWER: 'SHORT_ANSWER',
  NUMERICAL: 'NUMERICAL'
};
const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE'
};
const SUBMISSION_STATUS = {
  SUBMITTED: 'SUBMITTED',
  LATE: 'LATE'
};
const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  DROPPED: 'dropped'
};
const DEFAULT_GRADE_COMPONENTS = [{
  id: 'gc-1',
  name: 'Assignments',
  type: 'ASSIGNMENTS',
  weight: 20
}, {
  id: 'gc-2',
  name: 'Quizzes',
  type: 'QUIZZES',
  weight: 20
}, {
  id: 'gc-3',
  name: 'Mid Exam',
  type: 'MID_EXAM',
  weight: 25
}, {
  id: 'gc-4',
  name: 'Final Exam',
  type: 'FINAL_EXAM',
  weight: 30
}, {
  id: 'gc-5',
  name: 'Participation & Attendance',
  type: 'PARTICIPATION',
  weight: 5
}];

export { USER_ROLES, COURSE_CATEGORIES, SEMESTERS, SORT_OPTIONS, CONTENT_TYPES, QUESTION_TYPES, ATTENDANCE_STATUS, SUBMISSION_STATUS, ENROLLMENT_STATUS, DEFAULT_GRADE_COMPONENTS };

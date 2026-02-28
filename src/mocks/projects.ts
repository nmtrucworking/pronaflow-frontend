// @ts-nocheck
import type { Project } from "../types/project";
import type { Member } from '../types/member';
import type { Note } from '../types/note';
import type { ProjectFile } from '../types/project';

// MOCK MEMBERS
export const MOCK_MEMBERS: Member[] = [
  {
    id: 'u1',
    name: 'Nguyễn Văn A',
    avatar_url: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff',
    role: 'Project Manager',
    email: 'nguyenvana@company.com'
  },
  {
    id: 'u2',
    name: 'Trần Thị B',
    avatar_url: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=E11D48&color=fff',
    role: 'Developer',
    email: 'tranthib@company.com'
  },
  {
    id: 'u3',
    name: 'Lê C',
    avatar_url: 'https://ui-avatars.com/api/?name=Le+C&background=059669&color=fff',
    role: 'Tester',
    email: 'lec@company.com'
  },
  {
    id: 'u4',
    name: 'Phạm D',
    avatar_url: 'https://ui-avatars.com/api/?name=Pham+D&background=7C3AED&color=fff',
    role: 'Stakeholder',
    email: 'phamd@company.com'
  },
];

// MOCK DATA (Giả lập phản hồi từ API /projects)
export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Website Redesign 2024",
    key: "WEB-24",
    description: "Nâng cấp giao diện người dùng và cải thiện trải nghiệm UX cho trang chủ.",
    priority: "URGENT",
    status: "NOT_STARTED",
    progress: 65,
    start_date: "2024-01-10",
    end_date: "2024-03-15",
    manager: MOCK_MEMBERS[0],
    members: [
      MOCK_MEMBERS[1],
      MOCK_MEMBERS[2]
    ],
    tags: ["Design", "Frontend"],
    thumbnail_url: "/previews/dashboard-page.png",
    type: "WATERFALL"
  },
  {
    id: "2",
    name: "Mobile App Development",
    key: "MOB-01",
    description: "Phát triển ứng dụng iOS và Android sử dụng React Native.",
    priority: "HIGH",
    status: "ON_HOLD",
    progress: 10,
    start_date: "2024-02-01",
    end_date: "2024-06-30",
    manager: MOCK_MEMBERS[1],
    members: [
      MOCK_MEMBERS[0]
    ],
    tags: ["Mobile", "React Native"],
    type: "AGILE"
  },
  {
    id: "3",
    name: "Backend API Migration",
    key: "API-03",
    description: "Chuyển đổi hệ thống Legacy sang Microservices.",
    priority: "MEDIUM",
    status: "ON_HOLD",
    progress: 45,
    start_date: "2023-11-01",
    end_date: "2024-04-01",
    manager: MOCK_MEMBERS[2],
    members: [],
    tags: ["Backend", "DevOps"],
    type: "WATERFALL"
  },
  {
    id: "4",
    name: "Internal Audit Q1",
    key: "AUD-Q1",
    description: "Kiểm toán quy trình nội bộ quý 1.",
    priority: "LOW",
    status: "IN_PROGRESS",
    progress: 100,
    start_date: "2024-01-01",
    end_date: "2024-01-31",
    manager: MOCK_MEMBERS[0],
    members: [],
    tags: ["Compliance"],
    type: "AGILE"
  }
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Đặc tả yêu cầu kỹ thuật v1.0',
    excerpt: 'Tài liệu chi tiết về kiến trúc hệ thống và các API endpoints cần thiết...',
    author: MOCK_MEMBERS[0],
    updatedAt: '2024-03-10',
    tags: ['Specs', 'Architecture']
  },
  {
    id: 'n2',
    title: 'Biên bản họp Kick-off',
    excerpt: 'Ghi nhận các thống nhất về phạm vi dự án, timeline và các mốc bàn giao...',
    author: MOCK_MEMBERS[1],
    updatedAt: '2024-03-01',
    tags: ['Meeting', 'Planning']
  },
];

export const MOCK_FILES: ProjectFile[] = [
  {
    id: 'f1',
    name: 'SRS_Document_v2.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploader: MOCK_MEMBERS[0],
    uploadedAt: '2024-03-12'
  },
  {
    id: 'f3',
    name: 'Budget_Q2_2024.xlsx',
    type: 'XLS',
    size: '45 KB',
    uploader: MOCK_MEMBERS[3],
    uploadedAt: '2024-03-20'
  },
];
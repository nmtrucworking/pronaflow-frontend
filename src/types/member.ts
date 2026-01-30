/**
 * Member Entity (simplified User info)
 * Sử dụng cho các context cần info tóm tắt của user
 */

export interface Member {
  id: string;
  username: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

/**
 * For project/workspace specific member info, use ProjectMember or WorkspaceMember types
 */

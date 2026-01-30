export type EntityType = 'PROJECT' | 'TASK' | 'FILE' | 'NOTE';

export interface TrashItemEntity {
  trash_id: string;
  entity_type: EntityType;
  entity_id: string;
  name: string;
  original_location: string;
  deleted_by: {
    id: string;
    name: string;
    avatar: string;
  };
  deleted_at: string;
  purge_after: string;
  size?: string;
}

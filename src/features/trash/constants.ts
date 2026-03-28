import type { TrashItemEntity } from './types';
import { MOCK_DOMAIN_DATASET, MOCK_USERS_BY_ID } from '@/mocks';

export const MOCK_TRASH_ITEMS: TrashItemEntity[] = MOCK_DOMAIN_DATASET.archive.trash_items.map((item) => {
  const user = MOCK_USERS_BY_ID[item.deleted_by];
  const entityType = item.resource_type === 'project'
    ? 'PROJECT'
    : item.resource_type === 'task'
      ? 'TASK'
      : item.resource_type === 'file'
        ? 'FILE'
        : 'NOTE';

  return {
    trash_id: item.trash_id,
    entity_type: entityType,
    entity_id: item.resource_id,
    name: item.resource_name,
    original_location: `Resource: ${item.resource_type}`,
    deleted_by: {
      id: user?.id ?? item.deleted_by,
      name: user?.name ?? item.deleted_by,
      avatar: user?.avatar_url ?? 'https://ui-avatars.com/api/?name=User&background=334155&color=fff',
    },
    deleted_at: item.deleted_at,
    purge_after: item.auto_delete_at,
  };
});
